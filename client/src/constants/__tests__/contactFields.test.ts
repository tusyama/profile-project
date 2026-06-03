import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/schemas/contact';
import { CONTACT_FORM_FIELDS, isContactFormField } from '@/constants/contactFields';

const HONEYPOT_FIELD = 'website';

describe('CONTACT_FORM_FIELDS', () => {
  it('matches every schema field except the honeypot', () => {
    const schemaKeys = Object.keys(contactSchema.shape);
    const editableKeys = schemaKeys.filter((key) => key !== HONEYPOT_FIELD);

    expect(CONTACT_FORM_FIELDS).toHaveLength(editableKeys.length);
    expect([...CONTACT_FORM_FIELDS].sort()).toEqual([...editableKeys].sort());
  });
});

describe('isContactFormField', () => {
  it.each(CONTACT_FORM_FIELDS)('accepts %s', (field) => {
    expect(isContactFormField(field)).toBe(true);
  });

  it.each([
    ['honeypot', HONEYPOT_FIELD],
    ['non-form server field', 'body'],
    ['empty string', ''],
    ['case mismatch', 'Name'],
    ['whitespace suffix', 'name '],
    ['whitespace prefix', ' email'],
    ['unknown key', 'subject'],
  ])('rejects %s (%s)', (_label, field) => {
    expect(isContactFormField(field)).toBe(false);
  });
});
