# Лендинг-презентация разработчика

Тестовое задание ([бриф](https://docs.google.com/document/d/13mj_6yMjqQ0S9tUEu3t0rOKScSdtWkUl4hHh0liL9KA)): одностраничный сайт с секциями о разработчике, формой обратной связи (два письма) и AI-помощником для комментария.

## Чеклист по брифу

| Требование                            | Где в проекте                                            |
| ------------------------------------- | -------------------------------------------------------- |
| О себе (стек, опыт, направления)      | `client/src/sections/About`, `Hero`                      |
| Как работаю + AI в работе             | `client/src/sections/WorkApproach`                       |
| Кейсы                                 | `client/src/sections/Cases`                              |
| Контакты + форма                      | `client/src/sections/Contacts`, `components/ContactForm` |
| Поля формы + loading/success/error    | `ContactForm.tsx`                                        |
| API + письма владельцу и пользователю | `server/src/routes/contact.ts`, `services/mail.ts`       |
| AI-интеграция (бонус)                 | `AiCommentHelper`, `POST /api/ai/improve-comment`        |
| SCSS/CSS, адаптив                     | `client/src/styles/`, `*.module.scss`                    |

## Запуск

```bash
npm install
cp server/.env.example server/.env && cp client/.env.example client/.env
# SMTP_*, OPENROUTER_API_KEY, OWNER_EMAIL в server/.env
npm run dev
```

- Сайт: http://localhost:5173
- API: http://localhost:3001

Docker (опционально): `docker compose up --build`

## Стек

| Слой     | Технологии                                   |
| -------- | -------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, **SCSS modules** |
| Forms    | react-hook-form, zod                         |
| Backend  | Hono, Node.js, TypeScript                    |
| Email    | Nodemailer + Gmail OAuth2 (or generic SMTP)  |
| AI       | OpenRouter API                               |

## Как работает форма

1. Клиент: zod-валидация, honeypot `website`
2. `POST /api/contact` → валидация на сервере → Nodemailer
3. Два письма: владельцу и копия отправителю
4. UI: loading / success / error

## AI-инструменты

- **В продукте:** кнопка «Улучшить комментарий» → OpenRouter, предпросмотр, принять/отклонить
- **При разработке:** Cursor — scaffold, черновики, рефакторинг под бриф
- **Вручную:** вёрстка на SCSS, схемы валидации, SMTP, UX формы

## Тесты

```bash
npm run typecheck
npm run test
npm run build
```

Smoke: `POST /api/contact`, состояния `ContactForm`, API client.

## Структура

```text
client/src/   — страница, секции, форма, SCSS
server/src/   — routes, schemas, mail, AI
```

Импорты: `@/` → `client/src/`.

## Деплой

[docs/DEPLOY.md](docs/DEPLOY.md) — Vercel (client) + Render/Railway (server).

## Ветка `extra`

Расширенная версия репозитория (базовая отправка до упрощения под бриф). Переключение: `git checkout extra`.

Отличия от `main`:

- **styled-components** и самописный **UI-kit** (Stack, Button, Input, FormField и др.) вместо SCSS modules
- **`packages/shared`** — общие zod-схемы, типы API, `safeText` / output guard для client и server
- **Ошибки на сервере** — иерархия `AppError`, разделение operational / programmer errors, централизованный `errorHandler`
- **AI-безопасность** — Input Guard (blocklist, unicode, эвристики), hardened prompt, Output Guard в ответе модели
- **Тесты** — шире smoke: `AiCommentHelper`, `contactFormErrors`, `applyValidationDetails`, `FormField` a11y, shared `contactSchema` / `safeText`
- **README** — подробнее про env, Docker-прокси, деплой и разграничение работы с AI vs ручные правки

На `main` — урезанная «right-sized» вариация: SCSS, локальные схемы, плоский `server/src/errors.ts`, меньше файлов и тестов; функционал брифа (форма, письма, AI) сохранён.

## Ссылки

- GitHub: https://github.com/tusyama
- Deploy: https://profile-project-client.vercel.app/
