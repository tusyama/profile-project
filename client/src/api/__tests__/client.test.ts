import { describe, expect, it } from 'vitest';
import { ApiErrorCode } from '@/types/api';
import { ApiError, parseApiResponse } from '@/api/client';

describe('parseApiResponse', () => {
  it('throws ApiError on failed response', async () => {
    const res = new Response(
      JSON.stringify({
        error: ApiErrorCode.ValidationFailed,
        message: 'bad',
        details: [{ field: 'email', message: 'x' }],
      }),
      { status: 400 },
    );

    await expect(parseApiResponse(res)).rejects.toMatchObject({
      code: ApiErrorCode.ValidationFailed,
    });
  });

  it('returns parsed body on success', async () => {
    const res = new Response(JSON.stringify({ success: true }), { status: 200 });
    await expect(parseApiResponse<{ success: boolean }>(res)).resolves.toEqual({ success: true });
  });
});

describe('ApiError', () => {
  it('stores code and details', () => {
    const err = new ApiError(ApiErrorCode.RateLimitExceeded, 'limit');
    expect(err.code).toBe(ApiErrorCode.RateLimitExceeded);
    expect(err.message).toBe('limit');
  });
});
