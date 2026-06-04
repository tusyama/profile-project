import type { Env } from '../config/env.js';
import { EmailDeliveryError } from '../errors.js';
import type { ContactInput } from '../schemas/contact.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { formatTransportError } from '../utils/formatTransportError.js';
import { resolveMailTransport, sendMailMessage } from './sendMailMessage.js';

export async function sendContactEmails(env: Env, data: ContactInput): Promise<void> {
  const transport = resolveMailTransport();

  const safe = {
    name: escapeHtml(data.name),
    phone: escapeHtml(data.phone),
    email: escapeHtml(data.email),
    comment: escapeHtml(data.comment),
  };

  const ownerHtml = `
    <h2>Новая заявка с сайта</h2>
    <table cellpadding="8" style="border-collapse:collapse">
      <tr><td><b>Имя</b></td><td>${safe.name}</td></tr>
      <tr><td><b>Телефон</b></td><td>${safe.phone}</td></tr>
      <tr><td><b>Email</b></td><td>${safe.email}</td></tr>
      <tr><td><b>Комментарий</b></td><td><pre style="white-space:pre-wrap;font-family:sans-serif">${safe.comment}</pre></td></tr>
    </table>
  `;

  const userHtml = `
    <h2>Спасибо за обращение!</h2>
    <p>Мы получили ваше сообщение и свяжемся с вами в ближайшее время.</p>
    <p><b>Ваш комментарий:</b></p>
    <pre style="white-space:pre-wrap;font-family:sans-serif">${safe.comment}</pre>
  `;

  let ownerSent = false;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7657/ingest/81aa1bfe-47e5-4739-b00a-ab299f5ddc8d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ef2fd5' },
      body: JSON.stringify({
        sessionId: 'ef2fd5',
        location: 'mail.ts:before-owner-send',
        message: 'Starting owner notification',
        data: {
          from: env.FROM_EMAIL,
          ownerTo: env.OWNER_EMAIL,
          transport,
          railwayEnv: Boolean(process.env.RAILWAY_ENVIRONMENT),
        },
        timestamp: Date.now(),
        hypothesisId: 'E',
        runId: 'post-fix',
      }),
    }).catch(() => {});
    const sendStart = Date.now();
    // #endregion

    await sendMailMessage(env, {
      from: env.FROM_EMAIL,
      to: env.OWNER_EMAIL,
      subject: 'Новая заявка с сайта',
      html: ownerHtml,
      text: `Имя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}\n\n${data.comment}`,
    });
    ownerSent = true;

    // #region agent log
    fetch('http://127.0.0.1:7657/ingest/81aa1bfe-47e5-4739-b00a-ab299f5ddc8d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ef2fd5' },
      body: JSON.stringify({
        sessionId: 'ef2fd5',
        location: 'mail.ts:owner-sent',
        message: 'Owner notification sent',
        data: { elapsedMs: Date.now() - sendStart, transport },
        timestamp: Date.now(),
        hypothesisId: 'E',
        runId: 'post-fix',
      }),
    }).catch(() => {});
    // #endregion

    await sendMailMessage(env, {
      from: env.FROM_EMAIL,
      to: data.email,
      subject: 'Ваше сообщение получено',
      html: userHtml,
      text: `Спасибо! Мы получили ваше сообщение.\n\nВаш комментарий:\n${data.comment}`,
    });
  } catch (error) {
    // #region agent log
    const te = error as Error & {
      code?: string;
      command?: string;
      address?: string;
      port?: number;
      status?: number;
    };
    fetch('http://127.0.0.1:7657/ingest/81aa1bfe-47e5-4739-b00a-ab299f5ddc8d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ef2fd5' },
      body: JSON.stringify({
        sessionId: 'ef2fd5',
        location: 'mail.ts:send-failed',
        message: 'sendMail failed',
        data: {
          stage: ownerSent ? 'user_confirmation' : 'owner_notification',
          transport,
          code: te.code,
          command: te.command,
          address: te.address,
          port: te.port,
          status: te.status,
          errMessage: te.message,
        },
        timestamp: Date.now(),
        hypothesisId: 'A',
        runId: 'post-fix',
      }),
    }).catch(() => {});
    // #endregion
    console.error('[contact-email]', {
      stage: ownerSent ? 'user_confirmation' : 'owner_notification',
      ownerSent,
      smtp: { transport, user: env.SMTP_USER },
      from: env.FROM_EMAIL,
      ownerTo: env.OWNER_EMAIL,
      ...(ownerSent ? { userTo: data.email } : {}),
      transportError: formatTransportError(error),
    });
    throw new EmailDeliveryError(ownerSent);
  }
}
