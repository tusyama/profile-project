import { Hono } from 'hono';
import { ApiErrorCode } from '@developer-landing/shared';
import type { Env } from '../config/env.js';
import { getClientIp, rateLimit } from '../middleware/rateLimit.js';
import { contactSchema } from '../schemas/contact.js';
import { EmailDeliveryError, sendContactEmails } from '../services/mail.js';

export function createContactRoutes(env: Env) {
  const app = new Hono();

  app.post('/', async (c) => {
    const ip = getClientIp(c.req.raw);
    const limit = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return c.json({ error: ApiErrorCode.RateLimitExceeded }, 429);
    }

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json(
        { error: ApiErrorCode.ValidationFailed, details: [{ field: 'body', message: 'Invalid JSON' }] },
        400,
      );
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => ({
        field: e.path.join('.') || 'form',
        message: e.message,
      }));
      const isPolicy = details.some((d) => d.message.includes('Недопустимое') || d.message.includes('ссылок'));
      if (isPolicy) {
        return c.json(
          { error: ApiErrorCode.ContentPolicyViolation, message: 'Недопустимое содержимое' },
          400,
        );
      }
      return c.json({ error: ApiErrorCode.ValidationFailed, details }, 400);
    }

    const { website, ...data } = parsed.data;
    if (website?.trim()) {
      return c.json({ success: true });
    }

    try {
      await sendContactEmails(env, data);
      return c.json({ success: true });
    } catch (err) {
      if (err instanceof EmailDeliveryError) {
        console.error('Email delivery failed', err.message, { partial: err.partial });
      } else {
        console.error('Email delivery failed', err instanceof Error ? err.message : 'unknown');
      }
      return c.json(
        { error: ApiErrorCode.DeliveryFailed, message: 'Не удалось отправить письмо' },
        502,
      );
    }
  });

  return app;
}
