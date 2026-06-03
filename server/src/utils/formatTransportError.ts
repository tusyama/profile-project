const MAX_RESPONSE_LENGTH = 200;

type SmtpLikeError = Error & {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
  errno?: number;
  syscall?: string;
  address?: string;
  port?: number;
};

/** Safe fields for server logs — no credentials or full SMTP transcripts. */
export function formatTransportError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { raw: String(error) };
  }

  const smtp = error as SmtpLikeError;
  const out: Record<string, unknown> = {
    name: smtp.name,
    message: smtp.message,
  };

  if (smtp.code !== undefined) out.code = smtp.code;
  if (smtp.command !== undefined) out.command = smtp.command;
  if (smtp.responseCode !== undefined) out.responseCode = smtp.responseCode;
  if (smtp.errno !== undefined) out.errno = smtp.errno;
  if (smtp.syscall !== undefined) out.syscall = smtp.syscall;
  if (smtp.address !== undefined) out.address = smtp.address;
  if (smtp.port !== undefined) out.port = smtp.port;

  if (smtp.response !== undefined) {
    const response = String(smtp.response);
    out.response =
      response.length > MAX_RESPONSE_LENGTH
        ? `${response.slice(0, MAX_RESPONSE_LENGTH)}…`
        : response;
  }

  return out;
}
