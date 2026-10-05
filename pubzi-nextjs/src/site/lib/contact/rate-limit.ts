import 'server-only';

/**
 * Best-effort in-memory rate limit (per server instance) for the contact form:
 * at most LIMIT submissions per IP per WINDOW. Resets on restart and is not
 * shared between instances - move it to Redis / the CMS if the site scales out.
 */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

/** Records a hit and returns false when the key is over the limit. */
export function rateLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
      if (hits.size <= MAX_KEYS / 2) break;
    }
  }
  return true;
}
