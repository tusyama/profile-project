import { z } from 'zod';

const PHONE_ALLOWED_CHARS = /^[\d\s+\-()]+$/;
const NAME_CHARS = /^[\p{L}\s'\-·]+$/u;

type FieldValidationResult = { ok: true } | { ok: false; reason: string };

export function assertValidPhone(value: string): FieldValidationResult {
  const phone = value.trim();

  if (!PHONE_ALLOWED_CHARS.test(phone)) {
    return { ok: false, reason: 'Некорректный телефон' };
  }

  if (!/^[+\d(]/.test(phone)) {
    return { ok: false, reason: 'Некорректный телефон' };
  }

  if (!/\d$/.test(phone)) {
    return { ok: false, reason: 'Некорректный телефон' };
  }

  if (phone.includes('+') && !phone.startsWith('+')) {
    return { ok: false, reason: 'Некорректный телефон' };
  }

  if ((phone.match(/\+/g) ?? []).length > 1) {
    return { ok: false, reason: 'Некорректный телефон' };
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return { ok: false, reason: 'Некорректный телефон' };
  }

  return { ok: true };
}

export function assertValidName(value: string): FieldValidationResult {
  const name = value.trim();

  if (!NAME_CHARS.test(name)) {
    return { ok: false, reason: 'Некорректное имя' };
  }

  const letters = name.match(/\p{L}/gu);
  if ((letters?.length ?? 0) < 2) {
    return { ok: false, reason: 'Минимум 2 символа' };
  }

  return { ok: true };
}

export function assertValidEmail(value: string): FieldValidationResult {
  const email = value.trim();

  if (!z.string().email().safeParse(email).success) {
    return { ok: false, reason: 'Некорректный email' };
  }

  const at = email.lastIndexOf('@');
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (
    !local ||
    !domain ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    local.includes('..') ||
    domain.includes('..')
  ) {
    return { ok: false, reason: 'Некорректный email' };
  }

  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2 || !/^[\p{L}][\p{L}\-]*$/u.test(tld)) {
    return { ok: false, reason: 'Некорректный email' };
  }

  return { ok: true };
}
