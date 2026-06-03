import type { Env } from '../config/env.js';

const LOCAL_DEV_ORIGIN = 'http://localhost:5173';
const VERCEL_PREVIEW_ORIGIN = /^https:\/\/[\w-]+[\w.-]*\.vercel\.app$/;

export function isAllowedCorsOrigin(origin: string, env: Env): boolean {
  if (origin === env.CLIENT_URL || origin === LOCAL_DEV_ORIGIN) {
    return true;
  }
  if (env.ALLOW_VERCEL_PREVIEWS && VERCEL_PREVIEW_ORIGIN.test(origin)) {
    return true;
  }
  return false;
}

export function resolveCorsOrigin(origin: string | undefined, env: Env): string | null {
  if (!origin) {
    return env.CLIENT_URL;
  }
  return isAllowedCorsOrigin(origin, env) ? origin : null;
}
