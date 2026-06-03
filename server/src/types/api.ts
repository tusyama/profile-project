export const ApiErrorCode = {
  ValidationFailed: 'validation_failed',
  ContentPolicyViolation: 'content_policy_violation',
  RateLimitExceeded: 'rate_limit_exceeded',
  DeliveryFailed: 'delivery_failed',
  AiUnavailable: 'ai_unavailable',
  AiOutputRejected: 'ai_output_rejected',
  Unknown: 'unknown_error',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export type ValidationDetail = {
  field: string;
  message: string;
};
