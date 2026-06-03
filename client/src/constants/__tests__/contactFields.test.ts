import { describe, expect, it } from 'vitest';
import { isContactFormField } from '@/constants/contactFields';

describe('isContactFormField', () => {
  it('accepts contact form field names', () => {
    expect(isContactFormField('name')).toBe(true);
    expect(isContactFormField('comment')).toBe(true);
  });

  it('rejects honeypot and unknown fields', () => {
    expect(isContactFormField('website')).toBe(false);
    expect(isContactFormField('body')).toBe(false);
  });
});
