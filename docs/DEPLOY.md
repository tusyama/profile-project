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

1. Create a **Web Service** from this repo (root directory = repository root).
2. `railway.toml` at the repo root sets build/start and health check — no extra dashboard config needed.
3. Set environment variables (see table below).
4. Note the public URL, e.g. `https://developer-landing-api.up.railway.app`.

### Render (manual commands)

1. Create a **Web Service** from this repo (root directory = repository root).
2. **Build command:**  
   `npm ci && npm run build -w server`
3. **Start command:**  
   `npm run start -w server`
4. **Health check path:** `/api/health`
5. Set environment variables (see [server/.env.example](../server/.env.example)):

| Variable                                 | Example                                             |
| ---------------------------------------- | --------------------------------------------------- |
| `PORT`                                   | `3001` (or platform default)                        |
| `OWNER_EMAIL`                            | your inbox                                          |
| `SMTP_USER`, `FROM_EMAIL`, `GOOGLE_*`    | Gmail OAuth2 (`@gmail.com` sender)                  |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | OpenRouter                                          |
| `CLIENT_URL`                             | `https://your-app.vercel.app` (after step 2)        |
| `SITE_URL`                               | same as `CLIENT_URL` or custom domain               |
| `ALLOW_VERCEL_PREVIEWS`                  | `true` if you test PR preview URLs against this API |

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
