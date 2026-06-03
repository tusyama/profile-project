import './loadDotenv.js';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  OWNER_EMAIL: z.string().email(),
  SMTP_USER: z
    .string()
    .min(1)
    .refine((v) => v.endsWith('@gmail.com'), 'SMTP_USER must be a @gmail.com address'),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
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
