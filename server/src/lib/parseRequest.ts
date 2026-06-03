import type { Context } from 'hono';
import type { ZodSchema, ZodError } from 'zod';
import { ValidationFailedError, ContentPolicyViolationError } from '../errors.js';

export async function readJsonBody(c: Context): Promise<unknown> {
  try {
    return await c.req.json();
  } catch {
    throw new ValidationFailedError([{ field: 'body', message: 'Invalid JSON' }]);
  }
}

function zodToDetails(error: ZodError, defaultField: string) {
  return error.errors.map((e) => ({
    field: e.path.join('.') || defaultField,
    message: e.message,
  }));
}

function isPolicyViolation(details: { message: string }[]): boolean {
  return details.some((d) => d.message.includes('Недопустимое') || d.message.includes('ссылок'));
}

export function parseBody<T>(body: unknown, schema: ZodSchema<T>, defaultField: string): T {
  const parsed = schema.safeParse(body);
  if (parsed.success) return parsed.data;

  const details = zodToDetails(parsed.error, defaultField);
  if (isPolicyViolation(details)) {
    throw new ContentPolicyViolationError();
  }
  throw new ValidationFailedError(details);
}
