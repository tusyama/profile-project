import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorCode } from '@developer-landing/shared';
import { ApiError } from '@/api/client';
import { resolveContactSubmitError } from '@/lib/contactFormErrors';

describe('resolveContactSubmitError', () => {
  const setError = vi.fn();

  beforeEach(() => {
    setError.mockClear();
  });

  it('returns network message for non-ApiError', () => {
    expect(resolveContactSubmitError(new TypeError('fetch failed'), setError)).toBe(
      'Ошибка сети. Проверьте подключение.',
    );
  });

  it('returns preset message for rate limit', () => {
    const msg = resolveContactSubmitError(
      new ApiError(ApiErrorCode.RateLimitExceeded, 'rate'),
      setError,
    );
    expect(msg).toBe('Слишком много попыток. Подождите минуту.');
    expect(setError).not.toHaveBeenCalled();
  });

  it('returns preset message for content policy without touching fields', () => {
    const msg = resolveContactSubmitError(
      new ApiError(ApiErrorCode.ContentPolicyViolation, 'policy'),
      setError,
    );
    expect(msg).toBe('Текст не прошёл проверку безопасности');
    expect(setError).not.toHaveBeenCalled();
  });

  it('returns empty string when server details are mapped to fields', () => {
    const msg = resolveContactSubmitError(
      new ApiError(ApiErrorCode.ValidationFailed, 'bad', [
        { field: 'name', message: 'Минимум 2 символа' },
      ]),
      setError,
    );
    expect(msg).toBe('');
    expect(setError).toHaveBeenCalledWith('name', expect.objectContaining({ type: 'server' }));
  });

  it('joins unmapped validation messages', () => {
    const msg = resolveContactSubmitError(
      new ApiError(ApiErrorCode.ValidationFailed, 'bad', [
        { field: 'body', message: 'Invalid JSON' },
      ]),
      setError,
    );
    expect(msg).toBe('Invalid JSON');
  });
});
