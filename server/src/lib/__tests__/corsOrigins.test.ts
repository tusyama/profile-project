import { describe, expect, it } from 'vitest';
import { isAllowedCorsOrigin, resolveCorsOrigin } from '../corsOrigins.js';
import type { Env } from '../../config/env.js';

const baseEnv = {
  PORT: 3001,
  OWNER_EMAIL: 'o@example.com',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: 587,
  SMTP_USER: 'u',
  SMTP_PASS: 'p',
  FROM_EMAIL: 'f@example.com',
  OPENROUTER_API_KEY: 'key',
  OPENROUTER_MODEL: 'openai/gpt-4o-mini',
  CLIENT_URL: 'https://portfolio.example.com',
  SITE_URL: 'https://portfolio.example.com',
  ALLOW_VERCEL_PREVIEWS: false,
} satisfies Env & { SITE_URL: string };

describe('corsOrigins', () => {
  it('allows production client and local dev', () => {
    expect(isAllowedCorsOrigin('https://portfolio.example.com', baseEnv)).toBe(true);
    expect(isAllowedCorsOrigin('http://localhost:5173', baseEnv)).toBe(true);
  });

  it('blocks unknown origins by default', () => {
    expect(isAllowedCorsOrigin('https://evil.example.com', baseEnv)).toBe(false);
  });

  it('allows vercel preview when enabled', () => {
    const env = { ...baseEnv, ALLOW_VERCEL_PREVIEWS: true };
    expect(isAllowedCorsOrigin('https://developer-landing-git-main-user.vercel.app', env)).toBe(
      true,
    );
  });

  it('resolveCorsOrigin falls back to CLIENT_URL without Origin header', () => {
    expect(resolveCorsOrigin(undefined, baseEnv)).toBe('https://portfolio.example.com');
  });
});
