import { z } from 'zod';
import { assertSafeText } from '../lib/safeText.js';

export const aiDraftSchema = z.object({
  draft: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(2000)
    .superRefine((v, ctx) => {
      const r = assertSafeText(v, 'strict', 2000);
      if (r.ok === false) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.reason });
      }
    }),
});

export type AiDraftInput = z.infer<typeof aiDraftSchema>;
