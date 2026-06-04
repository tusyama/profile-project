import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { toAppError } from './errors.js';
import { logAppError } from './middleware/errorHandler.js';
import { getMailTransportDiagnostics } from './services/sendMailMessage.js';

const env = loadEnv();
const app = createApp(env);

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.error(`[shutdown] received ${signal} (pid ${process.pid})`);
    process.exit(0);
  });
}

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

async function logStartupHealth(port: number): Promise<void> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    console.log('[startup-health]', { status: res.status, ok: res.ok });
  } catch (error) {
    console.error('[startup-health] self-check failed:', error);
  }
}

serve({ fetch: app.fetch, port: env.PORT, hostname: '0.0.0.0' }, (info) => {
  console.log('[startup]', {
    port: info.port,
    pid: process.pid,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV ?? null,
    railway: Boolean(process.env.RAILWAY_ENVIRONMENT),
  });
  console.log(`Server running on http://0.0.0.0:${info.port}`);
  console.log('[mail-config]', getMailTransportDiagnostics());
  void logStartupHealth(info.port);
});
