import { INJECTION_PATTERNS } from './patterns.js';

export type SafeTextMode = 'strict' | 'light' | 'formatOnly';

export type SafeTextResult =
  | { ok: true; normalized: string }
  | { ok: false; reason: string };

const ZERO_WIDTH = /[\u200B-\u200D\uFEFF\u202A-\u202E]/g;
const URL_REGEX = /https?:\/\/[^\s]+/gi;

function normalizeText(input: string): string {
  return input.normalize('NFKC').replace(ZERO_WIDTH, '').replace(/\s+/g, ' ').trim();
}

function hasInjectionPattern(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}

function specialCharRatio(text: string): number {
  if (text.length === 0) return 0;
  const special = (text.match(/[|{}[\]<>\\/`~]/g) ?? []).length;
  return special / text.length;
}

function capsRatio(text: string): number {
  const letters = text.replace(/[^a-zA-ZА-Яа-яЁё]/g, '');
  if (letters.length < 20) return 0;
  const caps = (letters.match(/[A-ZА-ЯЁ]/g) ?? []).length;
  return caps / letters.length;
}

function hasLongRepeat(text: string): boolean {
  return /(.)\1{14,}/.test(text);
}

export function assertSafeText(
  input: string,
  mode: SafeTextMode,
  maxLength = 2000,
): SafeTextResult {
  const normalized = normalizeText(input);

  if (normalized.length === 0) {
    return { ok: false, reason: 'Поле не может быть пустым' };
  }

  if (normalized.length > maxLength) {
    return { ok: false, reason: `Максимум ${maxLength} символов` };
  }

  if (mode === 'formatOnly') {
    return { ok: true, normalized };
  }

  if (hasInjectionPattern(normalized)) {
    return { ok: false, reason: 'Недопустимое содержимое' };
  }

  if (hasLongRepeat(normalized)) {
    return { ok: false, reason: 'Недопустимое содержимое' };
  }

  if (mode === 'light') {
    return { ok: true, normalized };
  }

  const urls = normalized.match(URL_REGEX) ?? [];
  if (urls.length > 3) {
    return { ok: false, reason: 'Слишком много ссылок' };
  }

  if (capsRatio(normalized) > 0.5) {
    return { ok: false, reason: 'Недопустимое содержимое' };
  }

  if (specialCharRatio(normalized) > 0.3) {
    return { ok: false, reason: 'Недопустимое содержимое' };
  }

  const letterDigit = (normalized.match(/[\p{L}\p{N}]/gu) ?? []).length;
  if (normalized.length > 10 && letterDigit / normalized.length < 0.3) {
    return { ok: false, reason: 'Недопустимое содержимое' };
  }

  return { ok: true, normalized };
}
