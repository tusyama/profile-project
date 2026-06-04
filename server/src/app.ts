import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import type { Env } from './config/env.js';
import { resolveCorsOrigin } from './lib/corsOrigins.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createAiRoutes } from './routes/ai.js';
import { createContactRoutes } from './routes/contact.js';

export function createApp(env: Env) {
  const app = new Hono();

  app.onError(errorHandler);

  // Health checks before middleware — Railway must always get 200 quickly.
  app.get('/api/health', (c) => c.json({ status: 'ok' }));
  app.get('/health', (c) => c.json({ status: 'ok' }));

  app.use('*', secureHeaders());
  app.use(
    '*',
    cors({
      origin: (origin) => resolveCorsOrigin(origin, env),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    }),
  );

  app.route('/api/contact', createContactRoutes(env));
  app.route('/api/ai', createAiRoutes(env));

  return app;
}
