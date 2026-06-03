import { ApiErrorCode, type ValidationDetail } from '@developer-landing/shared';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  code: ApiErrorCode;
  details?: ValidationDetail[];

  constructor(code: ApiErrorCode, message: string, details?: ValidationDetail[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as {
      error?: string;
      message?: string;
      details?: ValidationDetail[];
    };
    const code = (err.error ?? ApiErrorCode.Unknown) as ApiErrorCode;
    throw new ApiError(code, err.message ?? 'Произошла ошибка', err.details);
  }
  return data as T;
}

export async function submitContact(payload: {
  name: string;
  phone: string;
  email: string;
  comment: string;
  website?: string;
}) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse<{ success: boolean }>(res);
}

export async function improveComment(draft: string) {
  const res = await fetch(`${API_BASE}/api/ai/improve-comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft }),
  });
  return parseResponse<{ improved: string }>(res);
}
