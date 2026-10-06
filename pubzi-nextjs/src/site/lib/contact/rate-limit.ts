import 'server-only';

import { createHash } from 'node:crypto';

import { getContactSink } from './submit';

/**
 * Contact form rate limit: at most LIMIT requests per hashed IP per WINDOW.
 * CMS-independent:
 * - A small in-memory counter absorbs bursts (always on).
 * - When the active ContactSink stores requests (payload), its countRecent()
 *   is the durable source of truth shared by every server instance.
 * - Sinks that can't count (http webhook, log) rely on the memory counter only,
 *   which is PER INSTANCE on serverless.
 *   TODO: shared counter (Upstash Redis / Vercel KV) when CONTACT_SINK=http in production.
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
 * Throws when the sink's store is unreachable (the action then reports errServer).
 */
export async function allowContactSubmission(ipHash: string, now = Date.now()): Promise<boolean> {
  if (!memoryHit(ipHash, now)) return false;
  const sink = await getContactSink();
  if (!sink?.countRecent) return true;
  const recent = await sink.countRecent(ipHash, new Date(now - RATE_WINDOW_MS).toISOString());
  return recent < RATE_LIMIT;
}
