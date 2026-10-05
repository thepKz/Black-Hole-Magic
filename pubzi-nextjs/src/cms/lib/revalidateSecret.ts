import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Shared secret for POST /api/revalidate (src/app/(site)/api/revalidate/route.ts).
 * REVALIDATE_SECRET when set, otherwise derived from PAYLOAD_SECRET so the
 * in-process fallback works with no extra configuration. Never logged.
 */
export function revalidateSecret(): string | null {
  const explicit = process.env.REVALIDATE_SECRET?.trim();
  if (explicit) return explicit;
  const payloadSecret = process.env.PAYLOAD_SECRET;
  if (!payloadSecret) return null;
  return createHash('sha256').update(`blackhole:revalidate:${payloadSecret}`).digest('hex');
}

/** Constant-time comparison of a provided secret against `expected`. */
export function safeEqual(provided: string | null | undefined, expected: string | null | undefined): boolean {
  if (!provided || !expected) return false;
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Bearer token from an Authorization header value. */
export function bearer(header: string | null | undefined): string | null {
  const m = header?.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}
