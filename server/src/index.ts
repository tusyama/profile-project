import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { loadEnv } from './config/env.js';
import { createAiRoutes } from './routes/ai.js';
import { createContactRoutes } from './routes/contact.js';

const env = loadEnv();
const app = new Hono();

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

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
