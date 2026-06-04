# Deployment guide

Static React client + Node/Hono API (SMTP, OpenRouter). Vercel hosts the **frontend only**; the API needs a long-running Node host (Render, Railway, Fly.io, etc.).

## Architecture

```text
Browser → Vercel (client/dist)     VITE_API_URL → https://api.your-domain.com
                ↓ POST /api/contact, /api/ai/improve-comment
         Render/Railway (server)   SMTP + OpenRouter
```

## Pre-deploy checklist

| Check                   | Command / note                                          |
| ----------------------- | ------------------------------------------------------- |
| Tests & build           | `npm run typecheck && npm run test && npm run build`    |
| Secrets not in git      | `server/.env`, `client/.env` are gitignored             |
| Production `CLIENT_URL` | Exact Vercel URL, `https://…`, no trailing slash        |
| CORS                    | API `CLIENT_URL` must match the site users open         |
| `VITE_API_URL`          | Public API origin, baked in at **build** time on Vercel |

## 1. Deploy API (Railway or Render)

### Railway

1. Create a **Web Service** from this repo (**Root Directory** = repository root, leave blank — not `server/`).
2. `railway.toml` at the repo root sets build/start and health check. Remove conflicting overrides in **Settings → Deploy** (custom start command, health path) so the file is used.
3. Set environment variables (see table below). **Do not set `PORT`** — Railway injects it; the app listens on `process.env.PORT`.
4. Note the public URL, e.g. `https://developer-landing-api.up.railway.app`.

**If deploy logs show `Server running` then `Stopping Container`:** the new deployment failed its health check and Railway rolled back to the previous version. Check:

1. **Root Directory** = repository root (blank), **not** `server/`
2. **Start command** = `node server/dist/index.js` (from `railway.toml`) — remove `npm run start` override in Settings → Deploy
3. **Health check path** = `/api/health` (or `/health`) — remove wrong paths like `/` or `/healthz`
4. **Do not set `PORT`** in Railway Variables — Railway injects it (usually `8080`)
5. After deploy, logs should show `[startup]`, `[startup-health] { status: 200, ok: true }`, `[mail-config]`. If you see `[shutdown] received SIGTERM` right after startup, the health check failed.

**If deploy logs show `Server running` then `SIGTERM`:** health check failed or npm was PID 1. This repo uses `node server/dist/index.js` (see `railway.toml`) and `/api/health`. After redeploy, verify:

```bash
curl -s https://YOUR_RAILWAY_URL/api/health
```

### Render (manual commands)

1. Create a **Web Service** from this repo (root directory = repository root).
2. **Build command:**  
   `npm ci && npm run build -w server`
3. **Start command:**  
   `npm run start -w server`
4. **Health check path:** `/api/health`
5. Set environment variables (see [server/.env.example](../server/.env.example)):

| Variable                                 | Example                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `PORT`                                   | omit on Railway/Render (platform sets it); `3001` locally                  |
| `OWNER_EMAIL`                            | your inbox                                                                 |
| `SMTP_USER`, `FROM_EMAIL`, `GOOGLE_*`    | Gmail OAuth2 (`@gmail.com` sender)                                         |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | OpenRouter                                                                 |
| `CLIENT_URL`                             | `https://your-app.vercel.app` (after step 2)                               |
| `SITE_URL`                               | same as `CLIENT_URL` or custom domain                                      |
| `ALLOW_VERCEL_PREVIEWS`                  | `true` if you test PR preview URLs against this API                        |
| `MAIL_TRANSPORT`                         | **`gmail-api` on Railway** (required). `auto` or omit locally (uses SMTP). |

**Railway email:** Outbound SMTP (ports 465/587) is blocked on Hobby/Trial/Free plans — set **`MAIL_TRANSPORT=gmail-api`** in Railway Variables. After deploy, logs must show `[mail-config] { resolved: 'gmail-api', ... }`. If you still see `transport: 'gmail-oauth2'` or `ETIMEDOUT`/`CONN`, the old build is still running — wait for deploy to finish and retry.

One-time setup in [Google Cloud Console](https://console.cloud.google.com/): enable **Gmail API** for your OAuth project and ensure the refresh token includes scope `https://www.googleapis.com/auth/gmail.send` (OAuth Playground: Gmail API v1 → `gmail.send`).

6. Note the public URL, e.g. `https://developer-landing-api.onrender.com`.

**Docker (optional):** `docker compose build server` requires `npm ci --ignore-scripts` in the production stage (see `server/Dockerfile`). Root `prepare` runs Husky and fails in minimal images without devDependencies.

## 2. Deploy frontend (Vercel)

1. Import the Git repository on [vercel.com](https://vercel.com).
2. **Root Directory:** `client`
3. `client/vercel.json` already sets:
   - `installCommand`: `cd .. && npm ci` (workspace install at repo root)
   - `buildCommand`: `npm run build`
   - SPA rewrite to `index.html`
4. **Environment variables** (Production):

| Name           | Value                                                            |
| -------------- | ---------------------------------------------------------------- |
| `VITE_API_URL` | `https://developer-landing-api.onrender.com` (no trailing slash) |

5. Deploy. Redeploy after changing `VITE_API_URL` (Vite inlines env at build time).

### Custom domain

1. Add domain in Vercel → assign to production.
2. Update API `CLIENT_URL` and `SITE_URL` to the custom domain.
3. Redeploy Vercel if `VITE_API_URL` changes.

## 3. Smoke test after deploy

```bash
curl -s https://YOUR_API/api/health
curl -s -X POST https://YOUR_API/api/ai/improve-comment \
  -H "Content-Type: application/json" \
  -d '{"draft":"Привет, хочу обсудить вакансию fullstack"}'
```

Open the Vercel URL → Contacts → submit form (test email) → **Улучшить комментарий с AI**.

## Known limitations

| Topic               | Detail                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Rate limit          | In-memory `Map` in `server/src/middleware/rateLimit.ts` — per instance only; resets on cold start. Use Redis/KV if you need global limits. |
| Vercel for API      | Not recommended: Nodemailer + stateful rate limit fit a persistent Node process better than serverless.                                    |
| Preview deployments | Set `ALLOW_VERCEL_PREVIEWS=true` on API and keep `VITE_API_URL` pointing at the same API, or previews will fail CORS.                      |

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `typecheck`, `test`, `build` on push/PR — same gate before production deploy.
