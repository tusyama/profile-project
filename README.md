# Лендинг-презентация разработчика

Тестовое задание: одностраничный портфолио-сайт с формой обратной связи, email-уведомлениями и AI-помощником для улучшения комментария.

## Стек

| Слой     | Технологии                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, styled-components, самописный UI-kit |
| Forms    | react-hook-form, zod                                             |
| Backend  | Hono, Node.js, TypeScript                                        |
| Email    | Nodemailer + Gmail SMTP (App Password)                           |
| AI       | OpenRouter API (OpenAI-compatible)                               |
| Security | Input Guard (prompt injection), Output Guard                     |
| DevOps   | Docker Compose, GitHub Actions                                   |

CSS реализован через **styled-components** (CSS-in-JS) и design tokens — осознанный выбор вместо SCSS для component-driven styling и UI-kit.

## Быстрый старт

```bash
# Установка
npm install

# Скопировать env (отдельно для бэкенда и фронтенда)
cp server/.env.example server/.env
cp client/.env.example client/.env
# Заполнить server/.env: SMTP_*, OPENROUTER_API_KEY, OWNER_EMAIL

# Dev (client :5173 + server :3001)
npm run dev
```

Или Docker:

```bash
cp server/.env.example server/.env   # реальные значения, не коммитить
cp client/.env.example client/.env
docker compose up --build
```

В Docker клиент ходит на same-origin `/api`, а Vite проксирует на `http://server:3001` (`API_PROXY_TARGET` в `docker-compose.yml`). С хоста по-прежнему: http://localhost:5173 и http://localhost:3001.

## Переменные окружения

| Файл                                       | Назначение                                                    |
| ------------------------------------------ | ------------------------------------------------------------- |
| [server/.env.example](server/.env.example) | API, SMTP, OpenRouter, CORS (`CLIENT_URL`)                    |
| [client/.env.example](client/.env.example) | `VITE_API_URL` — пусто в dev; в production URL публичного API |

Файлы `server/.env` и `client/.env` в `.gitignore`.

## Тесты

```bash
npm run test        # shared + client + server (Vitest)
npm run typecheck
npm run build
```

Покрытие: `safeText` / `contactSchema`, API client, `ContactForm` и `AiCommentHelper` (стейты и ошибки), `FormField` a11y, server `errorHandler` и `POST /api/contact`.

## Обработка ошибок (server)

По модели [operational vs programmer errors](https://sematext.com/blog/node-js-error-handling/):

- **`AppError.isOperational: true`** — ожидаемые сбои (валидация, rate limit, SMTP, OpenRouter, policy)
- **`isOperational: false`** — баги и неожиданные исключения → 500, расширенный лог, `uncaughtException` завершает процесс

Централизованный `app.onError(errorHandler)` в Hono; роуты бросают типизированные ошибки из `server/src/errors/`.

## Импорты (client)

Алиас `@/` → `client/src/` (см. `tsconfig.app.json`, `vite.config.ts`). Пример: `@/ui-kit`, `@/api/client`.

## Как работает форма

1. Клиент: zod + safeText validation, honeypot `website`
2. `POST /api/contact` → server validation → Nodemailer
3. Два письма (atomic): владельцу + копия пользователю
4. Состояния UI: loading / success / error

## AI-интеграция

- `POST /api/ai/improve-comment` — улучшение текста комментария
- **Input Guard:** blocklist RU/EN, нормализация unicode, эвристики
- **Hardened prompt:** user text в delimiters, запрет на секреты
- **Output Guard:** фильтр `sk-`, env, system prompt в ответе
- UI: preview → принять / отклонить; при ошибке форма работает

## Что делалось с AI (Cursor)

- Scaffold monorepo, UI-kit, секции
- Черновики README и security patterns
- Boilerplate Hono routes

## Что правил вручную

- Паттерны prompt injection и output guard
- CORS, rate limit, atomic email
- UX формы и AI preview
- Адаптив, a11y (focus, aria, lang="ru")

## Деплой

1. **Railway/Render:** deploy `server/`, получить URL API
2. **Vercel:** root `client/`, `VITE_API_URL=<api-url>`, redeploy
3. `CLIENT_URL` на сервере = URL Vercel

## Ссылки

- GitHub: https://github.com/tusyama
- Deploy: _(добавить после деплоя)_

## Тесты

```bash
npm run test   # Input Guard unit tests (server)
```
