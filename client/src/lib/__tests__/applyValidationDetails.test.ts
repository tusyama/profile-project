import { describe, expect, it, vi } from 'vitest';
import { CONTACT_FORM_FIELDS } from '@/constants/contactFields';
import { applyValidationDetails } from '@/lib/applyValidationDetails';

describe('applyValidationDetails', () => {
  it('maps every contact form field from server details', () => {
    const setError = vi.fn();
    const details = CONTACT_FORM_FIELDS.map((field) => ({
      field,
      message: `${field} error`,
    }));

    expect(applyValidationDetails(details, setError)).toBe(true);
    expect(setError).toHaveBeenCalledTimes(CONTACT_FORM_FIELDS.length);
    for (const field of CONTACT_FORM_FIELDS) {
      expect(setError).toHaveBeenCalledWith(field, {
        type: 'server',
        message: `${field} error`,
      });
    }
  });

  it('maps only known fields when details mix contact and non-contact keys', () => {
    const setError = vi.fn();
    const mapped = applyValidationDetails(
      [
        { field: 'email', message: 'Некорректный email' },
        { field: 'website', message: 'Honeypot triggered' },
        { field: 'body', message: 'Invalid JSON' },
      ],
      setError,
    );

    expect(mapped).toBe(true);
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Некорректный email',
    });
  });

  it('returns false when no fields match the contact form', () => {
    const setError = vi.fn();
    const mapped = applyValidationDetails(
      [
        { field: 'website', message: 'Honeypot triggered' },
        { field: 'body', message: 'Invalid JSON' },
      ],
      setError,
    );

    expect(mapped).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
