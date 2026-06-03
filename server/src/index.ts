import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { toAppError } from './errors.js';
import { logAppError } from './middleware/errorHandler.js';

const env = loadEnv();
const app = createApp(env);

process.on('unhandledRejection', (reason) => {
  logAppError(toAppError(reason));
});

process.on('uncaughtException', (err) => {
  const code = (err as NodeJS.ErrnoException)?.code;
  if (code === 'EADDRINUSE') {
    console.error(
      `[fatal] Port ${env.PORT} is already in use. Stop the other process or change PORT in server/.env`,
    );
    process.exit(1);
    return;
  }

  const error = toAppError(err);
  logAppError(error);
  if (error.statusCode >= 500) {
    console.error('[uncaughtException] shutting down');
    process.exit(1);
  }
});

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
