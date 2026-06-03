export function isGmailSmtpUser(smtpUser: string): boolean {
  return smtpUser.endsWith('@gmail.com');
}
