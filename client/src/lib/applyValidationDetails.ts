import type { ValidationDetail } from '@developer-landing/shared';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import { isContactFormField, type ContactFormField } from '@/constants/contactFields';

export function applyValidationDetails<T extends FieldValues>(
  details: ValidationDetail[],
  setError: UseFormSetError<T>,
): boolean {
  let mapped = false;
  for (const detail of details) {
    if (isContactFormField(detail.field)) {
      setError(detail.field as Path<T>, { type: 'server', message: detail.message });
      mapped = true;
    }
  }
  return mapped;
}

export type { ContactFormField };
