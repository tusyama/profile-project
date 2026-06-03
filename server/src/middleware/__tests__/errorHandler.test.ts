import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';
import { ApiErrorCode } from '../../types/api.js';
import { EmailDeliveryError, RateLimitError, ValidationFailedError } from '../../errors.js';
import { errorHandler } from '../errorHandler.js';

describe('errorHandler', () => {
  it('returns rate limit error payload', async () => {
    const app = new Hono();
    app.onError(errorHandler);
    app.get('/rate', () => {
      throw new RateLimitError();
    });

    const res = await app.request('/rate');
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body).toMatchObject({ error: ApiErrorCode.RateLimitExceeded });
  });

  it('returns validation details', async () => {
    const app = new Hono();
    app.onError(errorHandler);
    app.get('/validate', () => {
      throw new ValidationFailedError([{ field: 'email', message: 'bad' }]);
    });

    const res = await app.request('/validate');
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.details).toEqual([{ field: 'email', message: 'bad' }]);
  });

  it('returns 500 for unexpected errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const app = new Hono();
    app.onError(errorHandler);
    app.get('/boom', () => {
      throw new TypeError('Cannot read property of undefined');
    });

    const res = await app.request('/boom');
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe(ApiErrorCode.Unknown);
    consoleSpy.mockRestore();
  });

  it('logs partial flag for email delivery errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const app = new Hono();
    app.onError(errorHandler);
    app.get('/mail', () => {
      throw new EmailDeliveryError(true);
    });

    await app.request('/mail');

    expect(consoleSpy).toHaveBeenCalledWith(
      '[server-error]',
      expect.objectContaining({ partial: true, code: ApiErrorCode.DeliveryFailed }),
      expect.any(String),
    );
    consoleSpy.mockRestore();
  });
});
