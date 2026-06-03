import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ApiErrorCode } from '@developer-landing/shared';
import { createApp } from '../../app.js';
import type { Env } from '../../config/env.js';
import * as mail from '../../services/mail.js';

vi.mock('../../services/mail.js', () => ({
  sendContactEmails: vi.fn(),
}));

const env = {
  PORT: 3001,
  CLIENT_URL: 'http://localhost:5173',
  SMTP_HOST: 'smtp.test',
  SMTP_PORT: 587,
  SMTP_USER: 'user',
  SMTP_PASS: 'pass',
  FROM_EMAIL: 'from@test.com',
  OWNER_EMAIL: 'owner@test.com',
  OPENROUTER_API_KEY: 'key',
  OPENROUTER_MODEL: 'model',
} as Env;

const validBody = {
  name: 'Артем',
  phone: '+79991234567',
  email: 'a@b.co',
  comment: 'Достаточно длинный комментарий',
  website: '',
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.mocked(mail.sendContactEmails).mockReset();
    vi.mocked(mail.sendContactEmails).mockResolvedValue(undefined);
  });

  it('accepts valid submission', async () => {
    const app = createApp(env);
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(mail.sendContactEmails).toHaveBeenCalledOnce();
  });

  it('returns honeypot success without sending mail', async () => {
    const app = createApp(env);
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBody, website: 'bot' }),
    });

    expect(res.status).toBe(200);
    expect(mail.sendContactEmails).not.toHaveBeenCalled();
  });

  it('returns validation_failed with field details', async () => {
    const app = createApp(env);
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBody, email: 'not-an-email' }),
    });

    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBe(ApiErrorCode.ValidationFailed);
    expect(body.details?.some((d: { field: string }) => d.field === 'email')).toBe(true);
  });
});
