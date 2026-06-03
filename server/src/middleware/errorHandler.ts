import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { isAppError, toAppError } from '../errors/index.js';

export function logAppError(error: ReturnType<typeof toAppError>): void {
  const payload = {
    code: error.code,
    statusCode: error.statusCode,
    isOperational: error.isOperational,
    message: error.message,
    details: error.details,
  };

  if (error.isOperational) {
    console.error('[operational-error]', payload);
  } else {
    console.error('[programmer-error]', payload, error.stack);
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
