import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Env } from '../config/env.js';

const GOOGLE_OAUTH_REDIRECT_URI = 'https://developers.google.com/oauthplayground';

export async function createMailTransporter(env: Env): Promise<Transporter> {
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

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: env.SMTP_USER,
      accessToken,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      refreshToken: env.GOOGLE_REFRESH_TOKEN,
    },
  });
}
