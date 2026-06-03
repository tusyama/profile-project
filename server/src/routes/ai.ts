import { Hono } from 'hono';
import type { Env } from '../config/env.js';
import { RateLimitError } from '../errors.js';
import { readJsonBody, parseBody } from '../lib/parseRequest.js';
import { getClientIp, rateLimit } from '../middleware/rateLimit.js';
import { aiDraftSchema } from '../schemas/ai.js';
import { improveComment } from '../services/openrouter.js';

export function createAiRoutes(env: Env) {
  const app = new Hono();

  app.post('/improve-comment', async (c) => {
    const ip = getClientIp(c.req.raw);
    const limit = rateLimit(`ai:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      throw new RateLimitError();
    }

    const body = await readJsonBody(c);
    const { draft } = parseBody(body, aiDraftSchema, 'draft');
    const improved = await improveComment(env, draft);
    return c.json({ improved });
  });

  return app;
}
