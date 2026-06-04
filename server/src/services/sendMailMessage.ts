import type { Env } from '../config/env.js';
import { createGmailClient, sendGmailMessage } from './gmailClient.js';
import { createMailTransporter } from './createTransporter.js';

export type MailTransport = 'smtp' | 'gmail-api';

export function resolveMailTransport(): MailTransport {
  const configured = process.env.MAIL_TRANSPORT?.trim().toLowerCase();
  if (configured === 'smtp' || configured === 'gmail-api') {
    return configured;
  }
  // Railway blocks outbound SMTP on Hobby/Trial/Free — use Gmail HTTPS API instead.
  return process.env.RAILWAY_ENVIRONMENT ? 'gmail-api' : 'smtp';
}

type SendOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMailMessage(env: Env, options: SendOptions): Promise<MailTransport> {
  const transport = resolveMailTransport();

  if (transport === 'gmail-api') {
    const gmail = await createGmailClient(env);
    await sendGmailMessage(gmail, options);
    return transport;
  }

  const transporter = await createMailTransporter(env);
  await transporter.sendMail(options);
  return transport;
}
