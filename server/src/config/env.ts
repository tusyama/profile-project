import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  OWNER_EMAIL: z.string().email(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  FROM_EMAIL: z.string().email(),
  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_MODEL: z.string().default('openai/gpt-4o-mini'),
  CLIENT_URL: z.string().url(),
  SITE_URL: z.string().url().optional(),
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
