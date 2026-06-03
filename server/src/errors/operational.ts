import { ApiErrorCode, type ValidationDetail } from '@developer-landing/shared';
import { AppError } from './AppError.js';

export class RateLimitError extends AppError {
  constructor() {
    super({
      message: 'Too many requests',
      statusCode: 429,
      code: ApiErrorCode.RateLimitExceeded,
      isOperational: true,
    });
  }
}

export class ValidationFailedError extends AppError {
  constructor(details: ValidationDetail[]) {
    super({
      message: 'Validation failed',
      statusCode: 400,
      code: ApiErrorCode.ValidationFailed,
      isOperational: true,
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
      isOperational: true,
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
      isOperational: true,
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
      isOperational: true,
    });
  }
}

export class OpenRouterError extends AppError {
  readonly httpStatus?: number;

  constructor(message: string, httpStatus?: number) {
    super({
      message,
      statusCode: 502,
      code: ApiErrorCode.AiUnavailable,
      isOperational: true,
    });
    this.httpStatus = httpStatus;
  }
}
