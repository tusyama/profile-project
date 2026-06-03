import { ApiErrorCode } from '@/types/api';
import type { UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/api/client';
import type { ContactFormData } from '@/schemas/contact';
import { applyValidationDetails } from './applyValidationDetails';

const MESSAGES: Partial<Record<ApiErrorCode, string>> = {
  [ApiErrorCode.ContentPolicyViolation]: 'Текст не прошёл проверку безопасности',
  [ApiErrorCode.DeliveryFailed]: 'Не удалось отправить сообщение. Попробуйте позже.',
  [ApiErrorCode.RateLimitExceeded]: 'Слишком много попыток. Подождите минуту.',
};

export function resolveContactSubmitError(
  error: unknown,
  setError: UseFormSetError<ContactFormData>,
): string {
  if (!(error instanceof ApiError)) {
    return 'Ошибка сети. Проверьте подключение.';
  }

  const preset = MESSAGES[error.code];
  if (preset) return preset;

  if (error.details?.length) {
    const mapped = applyValidationDetails(error.details, setError);
    if (!mapped) {
      return error.details.map((d) => d.message).join('. ');
    }
    return '';
  }

  return error.message;
}
