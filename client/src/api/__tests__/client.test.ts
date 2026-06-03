import { describe, expect, it } from 'vitest';
import { ApiErrorCode } from '@developer-landing/shared';
import { ApiError, parseApiResponse } from '@/api/client';

describe('parseApiResponse', () => {
  it('returns JSON body on success', async () => {
    const res = new Response(JSON.stringify({ success: true }), { status: 200 });
    await expect(parseApiResponse<{ success: boolean }>(res)).resolves.toEqual({ success: true });
  });

  it('throws ApiError with code and details on failure', async () => {
    const res = new Response(
      JSON.stringify({
        error: ApiErrorCode.ValidationFailed,
        details: [{ field: 'email', message: 'bad' }],
      }),
      { status: 400 },
    );

    await expect(parseApiResponse(res)).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.code).toBe(ApiErrorCode.ValidationFailed);
      expect(apiErr.details).toHaveLength(1);
      return true;
    });
  });

  it('falls back to unknown error code', async () => {
    const res = new Response('not json', { status: 500 });
    await expect(parseApiResponse(res)).rejects.toMatchObject({
      code: ApiErrorCode.Unknown,
    });
  });
});
