import { describe, expect, it } from 'vitest';
import { formatTransportError } from '../formatTransportError.js';

describe('formatTransportError', () => {
  it('extracts nodemailer-style fields without credentials', () => {
    const err = Object.assign(new Error('Invalid login'), {
      code: 'EAUTH',
      command: 'AUTH',
      response: '535-5.7.8 Username and Password not accepted',
      responseCode: 535,
    });

    expect(formatTransportError(err)).toMatchObject({
      name: 'Error',
      message: 'Invalid login',
      code: 'EAUTH',
      command: 'AUTH',
      responseCode: 535,
      response: '535-5.7.8 Username and Password not accepted',
    });
  });

  it('truncates long SMTP responses', () => {
    const err = Object.assign(new Error('fail'), { response: 'x'.repeat(300) });
    const formatted = formatTransportError(err);
    expect(String(formatted.response)).toHaveLength(201);
    expect(String(formatted.response).endsWith('…')).toBe(true);
  });

  it('handles non-Error values', () => {
    expect(formatTransportError('timeout')).toEqual({ raw: 'timeout' });
  });
});
