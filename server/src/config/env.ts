import './loadDotenv.js';
import { z } from 'zod';
import { isGmailSmtpUser } from '../lib/isGmailSmtpUser.js';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(3001),
    OWNER_EMAIL: z.string().email(),
    SMTP_HOST: z.string().min(1).optional(),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    GOOGLE_REFRESH_TOKEN: z.string().min(1).optional(),
    FROM_EMAIL: z.string().email(),
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().default('openai/gpt-4o-mini'),
    CLIENT_URL: z.string().url(),
    SITE_URL: z.string().url().optional(),
    /** Allow *.vercel.app origins (preview deployments). Production: set CLIENT_URL to the live site. */
    ALLOW_VERCEL_PREVIEWS: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
  })
  .superRefine((data, ctx) => {
    if (isGmailSmtpUser(data.SMTP_USER)) {
      const googleFields = [
        ['GOOGLE_CLIENT_ID', data.GOOGLE_CLIENT_ID],
        ['GOOGLE_CLIENT_SECRET', data.GOOGLE_CLIENT_SECRET],
        ['GOOGLE_REFRESH_TOKEN', data.GOOGLE_REFRESH_TOKEN],
      ] as const;

      for (const [field, value] of googleFields) {
        if (!value) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Required when SMTP_USER is a Gmail address (${field})`,
          });
        }
      }
      return;
    }

    if (!data.SMTP_HOST) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['SMTP_HOST'],
        message: 'Required for non-Gmail SMTP',
      });
    }
    if (!data.SMTP_PASS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['SMTP_PASS'],
        message: 'Required for non-Gmail SMTP',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env & { SITE_URL: string } {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed');
  }
  return {
    ...parsed.data,
    SITE_URL: parsed.data.SITE_URL ?? parsed.data.CLIENT_URL,
  };
}
