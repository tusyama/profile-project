import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';
import { ApiErrorCode } from '@developer-landing/shared';
import { AppError } from '../../errors/AppError.js';
import {
  EmailDeliveryError,
  RateLimitError,
  ValidationFailedError,
} from '../../errors/operational.js';
import { errorHandler } from '../errorHandler.js';

describe('errorHandler', () => {
  it('returns operational error payload with correct status', async () => {
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

  it('returns validation details for operational validation errors', async () => {
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

  it('marks programmer errors as non-operational and returns 500', async () => {
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
    expect(consoleSpy).toHaveBeenCalled();
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
      '[operational-error]',
      expect.objectContaining({ partial: true, code: ApiErrorCode.DeliveryFailed }),
    );
    consoleSpy.mockRestore();
  });

  it('preserves AppError isOperational flag', () => {
    const err = new AppError({
      message: 'test',
      statusCode: 418,
      code: ApiErrorCode.Unknown,
      isOperational: false,
    });
    expect(err.isOperational).toBe(false);
  });
});
