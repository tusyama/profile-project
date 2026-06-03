import { describe, expect, it, vi } from 'vitest';
import { applyValidationDetails } from '@/lib/applyValidationDetails';

describe('applyValidationDetails', () => {
  it('maps known contact fields and returns true', () => {
    const setError = vi.fn();
    const mapped = applyValidationDetails(
      [
        { field: 'email', message: 'Некорректный email' },
        { field: 'comment', message: 'Слишком короткий' },
      ],
      setError,
    );

    expect(mapped).toBe(true);
    expect(setError).toHaveBeenCalledTimes(2);
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Некорректный email',
    });
  });

  it('returns false when no fields match the contact form', () => {
    const setError = vi.fn();
    const mapped = applyValidationDetails([{ field: 'body', message: 'Invalid JSON' }], setError);

    expect(mapped).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
