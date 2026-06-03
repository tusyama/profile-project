import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { isAppError, toAppError, EmailDeliveryError } from '../errors.js';

export function logAppError(error: ReturnType<typeof toAppError>): void {
  const payload: Record<string, unknown> = {
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
    details: error.details,
  };

  if (error instanceof EmailDeliveryError) {
    payload.partial = error.partial;
  }

  if (error.statusCode >= 500) {
    console.error('[server-error]', payload, error.stack);
  } else {
    console.error('[api-error]', payload);
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  const appError = toAppError(err);
  logAppError(appError);

  return c.json(
    {
      error: appError.code,
      message: appError.message,
      ...(appError.details?.length ? { details: appError.details } : {}),
    },
    appError.statusCode as ContentfulStatusCode,
  );
};
