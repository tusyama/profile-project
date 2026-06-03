import { z } from 'zod';
import { assertSafeText, type SafeTextMode } from '../security/safeText.js';

function safeRefine(mode: SafeTextMode, max: number) {
  return (v: string, ctx: z.RefinementCtx) => {
    const r = assertSafeText(v, mode, max);
    if (r.ok === false) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.reason });
    }
  };
}

export const contactSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(80).superRefine(safeRefine('light', 80)),
  phone: z
    .string()
    .min(7, 'Некорректный телефон')
    .max(20)
    .regex(/^[\d\s+\-()]+$/, 'Некорректный телефон')
    .superRefine(safeRefine('formatOnly', 20)),
  email: z.string().email('Некорректный email').max(120).superRefine(safeRefine('formatOnly', 120)),
  comment: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(2000)
    .superRefine(safeRefine('strict', 2000)),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
