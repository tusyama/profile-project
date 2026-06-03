import { Hono } from 'hono';
import { ApiErrorCode } from '@developer-landing/shared';
import type { Env } from '../config/env.js';
import { AiOutputRejectedError, OpenRouterError } from '../errors.js';
import { getClientIp, rateLimit } from '../middleware/rateLimit.js';
import { aiDraftSchema } from '../schemas/ai.js';
import { improveComment } from '../services/openrouter.js';

export function createAiRoutes(env: Env) {
  const app = new Hono();

  app.post('/improve-comment', async (c) => {
    const ip = getClientIp(c.req.raw);
    const limit = rateLimit(`ai:${ip}`, 10, 60_000);
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

    const parsed = aiDraftSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => ({
        field: e.path.join('.') || 'draft',
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

    try {
      const improved = await improveComment(env, parsed.data.draft);
      return c.json({ improved });
    } catch (err) {
      if (err instanceof AiOutputRejectedError) {
        return c.json({ error: ApiErrorCode.AiOutputRejected }, 502);
      }
      if (err instanceof OpenRouterError) {
        console.error('AI unavailable', err.message);
        return c.json({ error: ApiErrorCode.AiUnavailable }, 502);
      }
      console.error('AI unavailable', err instanceof Error ? err.message : 'unknown');
      return c.json({ error: ApiErrorCode.AiUnavailable }, 502);
    }
  });

  return app;
}
