import { ApiErrorCode, type ApiErrorCode as ApiErrorCodeType, type ValidationDetail } from '@developer-landing/shared';

export type AppErrorOptions = {
  message: string;
  statusCode: number;
  code: ApiErrorCodeType;
  isOperational: boolean;
  details?: ValidationDetail[];
  cause?: unknown;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCodeType;
  readonly isOperational: boolean;
  readonly details?: ValidationDetail[];

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = new.target.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.isOperational = options.isOperational;
    this.details = options.details;
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;

  if (error instanceof Error) {
    return new AppError({
      message: 'Внутренняя ошибка сервера',
      statusCode: 500,
      code: ApiErrorCode.Unknown,
      isOperational: false,
      cause: error,
    });
  }

  return new AppError({
    message: 'Внутренняя ошибка сервера',
    statusCode: 500,
    code: ApiErrorCode.Unknown,
    isOperational: false,
    cause: error,
  });
}
