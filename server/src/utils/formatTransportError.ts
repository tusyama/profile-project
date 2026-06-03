const MAX_DETAIL_LENGTH = 200;

type MailLikeError = Error & {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
  statusCode?: number;
  errno?: number;
  syscall?: string;
  address?: string;
  port?: number;
};

/** Safe fields for server logs — no credentials or full provider transcripts. */
export function formatTransportError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { raw: String(error) };
  }

  const mail = error as MailLikeError;
  const out: Record<string, unknown> = {
    name: mail.name,
    message: mail.message,
  };

  if (mail.statusCode !== undefined) out.statusCode = mail.statusCode;
  if (mail.code !== undefined) out.code = mail.code;
  if (mail.command !== undefined) out.command = mail.command;
  if (mail.responseCode !== undefined) out.responseCode = mail.responseCode;
  if (mail.errno !== undefined) out.errno = mail.errno;
  if (mail.syscall !== undefined) out.syscall = mail.syscall;
  if (mail.address !== undefined) out.address = mail.address;
  if (mail.port !== undefined) out.port = mail.port;

  if (mail.response !== undefined) {
    const response = String(mail.response);
    out.response =
      response.length > MAX_DETAIL_LENGTH ? `${response.slice(0, MAX_DETAIL_LENGTH)}…` : response;
  }

  return out;
}
