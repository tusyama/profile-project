import { INJECTION_PATTERNS, OUTPUT_SECRET_PATTERNS } from './patterns.js';

export type OutputGuardResult =
  | { ok: true; text: string }
  | { ok: false; reason: string };

export function assertSafeOutput(
  output: string,
  draftLength: number,
): OutputGuardResult {
  const trimmed = output.trim();

  if (!trimmed || trimmed === '[REJECTED]') {
    return { ok: false, reason: 'AI output rejected' };
  }

  if (trimmed.length > draftLength * 1.5 + 200) {
    return { ok: false, reason: 'AI output too long' };
  }

  for (const pattern of [...OUTPUT_SECRET_PATTERNS, ...INJECTION_PATTERNS]) {
    if (pattern.test(trimmed)) {
      return { ok: false, reason: 'AI output contains forbidden content' };
    }
  }

  if (/^SYSTEM:/im.test(trimmed) || /системн(ый|ого)\s+промпт/i.test(trimmed)) {
    return { ok: false, reason: 'AI output reveals system info' };
  }

  return { ok: true, text: trimmed };
}
