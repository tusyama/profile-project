import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { toAppError } from './errors/index.js';
import { logAppError } from './middleware/errorHandler.js';

const env = loadEnv();
const app = createApp(env);

process.on('unhandledRejection', (reason) => {
  const error = toAppError(reason);
  logAppError(error);
  if (!error.isOperational) {
    console.error('[unhandledRejection] non-operational — investigate before restart');
  }
});

process.on('uncaughtException', (err) => {
  const error = toAppError(err);
  logAppError(error);
  if (!error.isOperational) {
    console.error('[uncaughtException] non-operational — shutting down');
    process.exit(1);
  }
});

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
