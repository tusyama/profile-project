type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

const IP_HEADERS = ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for'] as const;

export function getClientIp(req: Request): string {
  for (const header of IP_HEADERS) {
    const value = req.headers.get(header);
    if (!value) continue;
    if (header === 'x-forwarded-for') {
      const first = value.split(',')[0]?.trim();
      if (first) return first;
    } else {
      return value.trim();
    }
  }
  return 'local';
}
