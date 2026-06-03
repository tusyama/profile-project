import { describe, expect, it } from 'vitest';
import { assertValidEmail, assertValidName, assertValidPhone } from '../contactFields.js';

describe('assertValidPhone', () => {
  it.each([
    '+79991234567',
    '+7 999 123 45 67',
    '89991234567',
    '(999) 123-45-67',
    '+7 (999) 123-45-67',
  ])('accepts %s', (phone) => {
    expect(assertValidPhone(phone)).toEqual({ ok: true });
  });

  it.each([
    ['9147786301+', 'trailing plus'],
    ['abc-not-a-phone', 'letters'],
    ['+123', 'too few digits'],
    ['7+9991234567', 'plus not at start'],
    ['++79991234567', 'double plus'],
    ['999123', 'six digits'],
    ['', 'empty'],
    ['(999) 123-45-67-', 'trailing hyphen'],
  ])('rejects %s (%s)', (phone) => {
    expect(assertValidPhone(phone).ok).toBe(false);
  });
});

describe('assertValidName', () => {
  it.each(['Артем', 'Артем Репин', 'Mary-Jane', "O'Brien"])('accepts %s', (name) => {
    expect(assertValidName(name)).toEqual({ ok: true });
  });

  it.each([
    ['9147786301', 'digits only'],
    ['A', 'single letter'],
    ['@test', 'special chars'],
    ['User1', 'contains digit'],
    ['  ', 'whitespace only'],
  ])('rejects %s (%s)', (name) => {
    expect(assertValidName(name).ok).toBe(false);
  });
});

describe('assertValidEmail', () => {
  it.each(['a@b.co', 'test@example.com', 'user.name+tag@domain.org'])('accepts %s', (email) => {
    expect(assertValidEmail(email)).toEqual({ ok: true });
  });

  it.each([
    ['not-an-email', 'missing @'],
    ['test@', 'missing domain'],
    ['@example.com', 'missing local part'],
    ['test@.com', 'empty domain label'],
    ['test..name@example.com', 'double dot in local part'],
    ['test@example..com', 'double dot in domain'],
    ['test@example.c', 'short tld'],
  ])('rejects %s (%s)', (email) => {
    expect(assertValidEmail(email).ok).toBe(false);
  });
});
