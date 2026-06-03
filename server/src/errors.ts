import {
  ApiErrorCode,
  type ApiErrorCode as ApiErrorCodeType,
  type ValidationDetail,
} from './types/api.js';

export type AppErrorOptions = {
  message: string;
  statusCode: number;
  code: ApiErrorCodeType;
  details?: ValidationDetail[];
  cause?: unknown;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCodeType;
  readonly details?: ValidationDetail[];

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = new.target.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
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
      cause: error,
    });
  }

  return new AppError({
    message: 'Внутренняя ошибка сервера',
    statusCode: 500,
    code: ApiErrorCode.Unknown,
    cause: error,
  });
}

export class RateLimitError extends AppError {
  constructor() {
    super({
      message: 'Too many requests',
      statusCode: 429,
      code: ApiErrorCode.RateLimitExceeded,
    });
  }
}

export class ValidationFailedError extends AppError {
  constructor(details: ValidationDetail[]) {
    super({
      message: 'Validation failed',
      statusCode: 400,
      code: ApiErrorCode.ValidationFailed,
      details,
    });
  }
}

export class ContentPolicyViolationError extends AppError {
  constructor(message = 'Недопустимое содержимое') {
    super({
      message,
      statusCode: 400,
      code: ApiErrorCode.ContentPolicyViolation,
    });
  }
}

export class EmailDeliveryError extends AppError {
  readonly partial: boolean;

  constructor(partial = false) {
    super({
      message: 'Не удалось отправить письмо',
      statusCode: 502,
      code: ApiErrorCode.DeliveryFailed,
    });
    this.partial = partial;
  }
}

export class AiOutputRejectedError extends AppError {
  constructor(message: string) {
    super({
      message,
      statusCode: 502,
      code: ApiErrorCode.AiOutputRejected,
    });
  }
}

export class OpenRouterError extends AppError {
  constructor(message: string) {
    super({
      message,
      statusCode: 502,
      code: ApiErrorCode.AiUnavailable,
    });
  }
}
