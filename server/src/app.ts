import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import type { Env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createAiRoutes } from './routes/ai.js';
import { createContactRoutes } from './routes/contact.js';

export function createApp(env: Env) {
  const app = new Hono();

  app.onError(errorHandler);

  app.use('*', secureHeaders());
  app.use(
    '*',
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173'],
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    }),
  );

  app.get('/api/health', (c) => c.json({ status: 'ok' }));
  app.route('/api/contact', createContactRoutes(env));
  app.route('/api/ai', createAiRoutes(env));

  return app;
}
