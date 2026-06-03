import type { ContactFormData } from '@/schemas/contact';

export const CONTACT_FORM_FIELDS = ['name', 'phone', 'email', 'comment'] as const satisfies readonly (keyof ContactFormData)[];

export type ContactFormField = (typeof CONTACT_FORM_FIELDS)[number];

export function isContactFormField(field: string): field is ContactFormField {
  return (CONTACT_FORM_FIELDS as readonly string[]).includes(field);
}
