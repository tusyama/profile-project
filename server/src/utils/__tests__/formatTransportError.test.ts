import { describe, expect, it } from 'vitest';
import { formatTransportError } from '../formatTransportError.js';

describe('formatTransportError', () => {
  it('extracts Resend-style fields without credentials', () => {
    const err = Object.assign(new Error('The domain is not verified'), {
      name: 'validation_error',
      statusCode: 403,
    });

    expect(formatTransportError(err)).toMatchObject({
      name: 'validation_error',
      message: 'The domain is not verified',
      statusCode: 403,
    });
  });

  it('still supports legacy SMTP-shaped errors', () => {
    const err = Object.assign(new Error('Invalid login'), {
      code: 'EAUTH',
      command: 'AUTH',
      response: '535-5.7.8 Username and Password not accepted',
      responseCode: 535,
    });

    expect(formatTransportError(err)).toMatchObject({
      message: 'Invalid login',
      code: 'EAUTH',
      responseCode: 535,
    });
  });

  it('truncates long provider responses', () => {
    const err = Object.assign(new Error('fail'), { response: 'x'.repeat(300) });
    const formatted = formatTransportError(err);
    expect(String(formatted.response)).toHaveLength(201);
    expect(String(formatted.response).endsWith('…')).toBe(true);
  });

  it('handles non-Error values', () => {
    expect(formatTransportError('timeout')).toEqual({ raw: 'timeout' });
  });
});
