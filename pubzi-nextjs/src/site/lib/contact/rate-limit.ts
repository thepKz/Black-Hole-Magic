import 'server-only';

import { createHash } from 'node:crypto';

import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Contact form rate limit: at most LIMIT requests per hashed IP per WINDOW.
 *
 * Source of truth = the `contact-requests` collection itself (count of recent
 * docs with the same `ipHash`), so it survives restarts and is shared by every
 * server instance. A small in-memory counter in front of it absorbs bursts of
 * parallel submissions that the DB count cannot see yet.
 */
export const RATE_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT = 5;
const MAX_KEYS = 5000;

/**
 * Salted SHA-256 of the client IP (raw IPs are never stored). No usable IP ->
 * one shared 'unknown' bucket (never "no limit").
 */
export function hashIp(ip: string | null): string {
  const salt = process.env.CONTACT_IP_SALT?.trim() || process.env.PAYLOAD_SECRET || 'blackhole-contact';
  return createHash('sha256').update(`${salt}:${ip ?? 'unknown'}`).digest('hex').slice(0, 40);
}

const hits = new Map<string, number[]>();

function memoryHit(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
      if (hits.size <= MAX_KEYS / 2) break;
    }
  }
  return true;
}

/**
 * Records an attempt and returns false when `ipHash` is over the limit.
 * Throws when the database is unreachable (the action then reports errServer).
 */
export async function allowContactSubmission(ipHash: string, now = Date.now()): Promise<boolean> {
  if (!memoryHit(ipHash, now)) return false;
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.count({
    collection: 'contact-requests',
    overrideAccess: true,
    where: {
      and: [
        { ipHash: { equals: ipHash } },
        { createdAt: { greater_than: new Date(now - RATE_WINDOW_MS).toISOString() } },
      ],
    },
  });
  return totalDocs < RATE_LIMIT;
}
