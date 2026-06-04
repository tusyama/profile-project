import { google } from 'googleapis';
import type { gmail_v1 } from 'googleapis';
import type { Env } from '../config/env.js';

const GOOGLE_OAUTH_REDIRECT_URI = 'https://developers.google.com/oauthplayground';

export async function createGmailClient(env: Env): Promise<gmail_v1.Gmail> {
  const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise<string | null | undefined>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });

  if (!accessToken) {
    throw new Error('Failed to obtain Google OAuth2 access token');
  }

  // #region agent log
  fetch('http://127.0.0.1:7657/ingest/81aa1bfe-47e5-4739-b00a-ab299f5ddc8d', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ef2fd5' },
    body: JSON.stringify({
      sessionId: 'ef2fd5',
      location: 'gmailClient.ts:oauth',
      message: 'OAuth access token obtained for Gmail API',
      data: {
        hasToken: Boolean(accessToken),
        tokenLength: accessToken?.length ?? 0,
        smtpUser: env.SMTP_USER,
        transport: 'gmail-api',
      },
      timestamp: Date.now(),
      hypothesisId: 'B',
      runId: 'post-fix',
    }),
  }).catch(() => {});
  // #endregion

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
}

function toUrlSafeBase64(raw: string): string {
  return Buffer.from(raw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function buildGmailRawMessage(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}): string {
  const boundary = `boundary_${Date.now().toString(36)}`;
  const message = [
    `From: ${options.from}`,
    `To: ${options.to}`,
    `Subject: ${encodeSubject(options.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    options.text,
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    options.html,
    `--${boundary}--`,
  ].join('\r\n');

  return toUrlSafeBase64(message);
}

export async function sendGmailMessage(
  gmail: gmail_v1.Gmail,
  options: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
  },
): Promise<void> {
  const raw = buildGmailRawMessage(options);

  // #region agent log
  fetch('http://127.0.0.1:7657/ingest/81aa1bfe-47e5-4739-b00a-ab299f5ddc8d', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ef2fd5' },
    body: JSON.stringify({
      sessionId: 'ef2fd5',
      location: 'gmailClient.ts:send',
      message: 'Calling Gmail API users.messages.send',
      data: { from: options.from, to: options.to, transport: 'gmail-api-https' },
      timestamp: Date.now(),
      hypothesisId: 'A',
      runId: 'post-fix',
    }),
  }).catch(() => {});
  // #endregion

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
}
