import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Env } from '../config/env.js';
import { isGmailSmtpUser } from '../lib/isGmailSmtpUser.js';

const GOOGLE_OAUTH_REDIRECT_URI = 'https://developers.google.com/oauthplayground';

export async function createMailTransporter(env: Env): Promise<Transporter> {
  if (isGmailSmtpUser(env.SMTP_USER)) {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = env;
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      throw new Error('Google OAuth credentials are required for Gmail SMTP_USER');
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_OAUTH_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN,
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

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: env.SMTP_USER,
        accessToken,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
      },
    });
  }

  const { SMTP_HOST, SMTP_PASS } = env;
  if (!SMTP_HOST || !SMTP_PASS) {
    throw new Error('SMTP_HOST and SMTP_PASS are required for non-Gmail SMTP');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
    auth: {
      user: env.SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}
