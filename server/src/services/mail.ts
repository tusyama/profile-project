import type { Env } from '../config/env.js';
import { EmailDeliveryError } from '../errors.js';
import type { ContactInput } from '../schemas/contact.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { formatTransportError } from '../utils/formatTransportError.js';
import { createMailTransporter } from './createTransporter.js';

export async function sendContactEmails(env: Env, data: ContactInput): Promise<void> {
  const transporter = await createMailTransporter(env);

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
    await transporter.sendMail({
      from: env.FROM_EMAIL,
      to: env.OWNER_EMAIL,
      subject: 'Новая заявка с сайта',
      html: ownerHtml,
      text: `Имя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}\n\n${data.comment}`,
    });
    ownerSent = true;

    await transporter.sendMail({
      from: env.FROM_EMAIL,
      to: data.email,
      subject: 'Ваше сообщение получено',
      html: userHtml,
      text: `Спасибо! Мы получили ваше сообщение.\n\nВаш комментарий:\n${data.comment}`,
    });
  } catch (error) {
    console.error('[contact-email]', {
      stage: ownerSent ? 'user_confirmation' : 'owner_notification',
      ownerSent,
      smtp: { transport: 'gmail-oauth2', user: env.SMTP_USER },
      from: env.FROM_EMAIL,
      ownerTo: env.OWNER_EMAIL,
      ...(ownerSent ? { userTo: data.email } : {}),
      transportError: formatTransportError(error),
    });
    throw new EmailDeliveryError(ownerSent);
  }
}
