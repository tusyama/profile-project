import { Hono } from 'hono';
import type { Env } from '../config/env.js';
import { RateLimitError } from '../errors/operational.js';
import { readJsonBody, parseBody } from '../lib/parseRequest.js';
import { getClientIp, rateLimit } from '../middleware/rateLimit.js';
import { contactSchema } from '../schemas/contact.js';
import { sendContactEmails } from '../services/mail.js';

export function createContactRoutes(env: Env) {
  const app = new Hono();

  app.post('/', async (c) => {
    const ip = getClientIp(c.req.raw);
    const limit = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      throw new RateLimitError();
    }

    const body = await readJsonBody(c);
    const parsed = parseBody(body, contactSchema, 'form');
    const { website, ...data } = parsed;

    if (website?.trim()) {
      return c.json({ success: true });
    }

    await sendContactEmails(env, data);
    return c.json({ success: true });
  });

  return app;
}
