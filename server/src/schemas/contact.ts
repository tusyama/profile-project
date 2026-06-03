import { z } from 'zod';
import { assertSafeText, type SafeTextMode } from '../lib/safeText.js';
import { assertValidEmail, assertValidName, assertValidPhone } from '../lib/contactFields.js';

function safeRefine(mode: SafeTextMode, max: number) {
  return (v: string, ctx: z.RefinementCtx) => {
    const r = assertSafeText(v, mode, max);
    if (r.ok === false) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.reason });
    }
  };
}

function fieldRefine(validate: (value: string) => { ok: true } | { ok: false; reason: string }) {
  return (value: string, ctx: z.RefinementCtx) => {
    const result = validate(value);
    if (result.ok === false) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: result.reason });
    }
  };
}

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Минимум 2 символа')
    .max(80)
    .superRefine(fieldRefine(assertValidName))
    .superRefine(safeRefine('light', 80)),
  phone: z
    .string()
    .trim()
    .max(20)
    .superRefine(fieldRefine(assertValidPhone))
    .superRefine(safeRefine('formatOnly', 20)),
  email: z
    .string()
    .trim()
    .max(120)
    .superRefine(fieldRefine(assertValidEmail))
    .superRefine(safeRefine('formatOnly', 120)),
  comment: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(2000)
    .superRefine(safeRefine('strict', 2000)),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
