import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload';

import { siteOrigin } from '../lib/preview';
import { revalidateSecret } from '../lib/revalidateSecret';

/**
 * Cache purging from Payload hooks.
 *
 * Next 16 `revalidateTag(tag, 'max')` / `revalidatePath(path)` only work inside
 * a Next request (they need the workAsyncStorage store + incremental cache).
 * - Admin REST / GraphQL requests run inside Payload's Next route handler ->
 *   called directly.
 * - Local API calls (scheduled publish/unpublish run by the in-process jobs
 *   cron, scripts) run OUTSIDE a request: a direct call would throw
 *   "Invariant: static generation store missing" (or silently attach to a
 *   finished request's store). Those go through the secret-protected
 *   POST /api/revalidate route handler of this same server instead.
 * - A failed direct call also falls back to the route handler.
 * Failures are logged (rate-limited one-liner), never thrown: cached reads also
 * carry a time-based `revalidate` safety net.
 *
 * Skip with `req.context.disableRevalidate = true` or env PAYLOAD_DISABLE_REVALIDATE=true
 * (the seed scripts set it).
 */
export type RevalidateReq = Pick<PayloadRequest, 'context'> & Partial<Pick<PayloadRequest, 'payloadAPI'>>;

export interface PurgeTargets {
  tags?: readonly string[];
  paths?: readonly string[];
}

const disabled = (req?: RevalidateReq) =>
  Boolean(req?.context?.disableRevalidate) || process.env.PAYLOAD_DISABLE_REVALIDATE === 'true';

let lastWarn = 0;
function warn(message: string, err?: unknown) {
  // At most one line per 30 s (the jobs cron runs every minute).
  const now = Date.now();
  if (now - lastWarn < 30_000) return;
  lastWarn = now;
  const detail = err instanceof Error ? err.message.split(/\r?\n/)[0].slice(0, 200) : err ? String(err) : '';
  console.warn(`[revalidate] ${message}${detail ? `: ${detail}` : ''}`);
}

/** Origin of THIS server, for the in-process HTTP fallback. */
function selfOrigin(): string {
  const explicit = process.env.REVALIDATE_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  // Set by `next start` / `next dev` (next/dist/server/lib/start-server.js) to http://localhost:{port}.
  const nextOrigin = process.env.__NEXT_PRIVATE_ORIGIN?.trim();
  if (nextOrigin) return nextOrigin.replace(/\/+$/, '');
  if (process.env.PORT) return `http://127.0.0.1:${process.env.PORT}`;
  return siteOrigin();
}

/** POST /api/revalidate on this server (used outside a Next request). */
async function purgeViaRoute(targets: PurgeTargets): Promise<void> {
  const secret = revalidateSecret();
  if (!secret) {
    warn('no REVALIDATE_SECRET / PAYLOAD_SECRET, cannot call /api/revalidate');
    return;
  }
  try {
    const res = await fetch(`${selfOrigin()}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
      body: JSON.stringify({ tags: targets.tags ?? [], paths: targets.paths ?? [] }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) warn(`/api/revalidate responded ${res.status}`);
  } catch (err) {
    // Expected for CLI scripts with no running server.
    warn('/api/revalidate unreachable', err);
  }
}

/** Direct call inside a Next request. Returns false when it could not run. */
async function purgeDirect(targets: PurgeTargets): Promise<boolean> {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache');
    for (const tag of new Set(targets.tags ?? [])) revalidateTag(tag, 'max');
    for (const path of new Set(targets.paths ?? [])) revalidatePath(path);
    return true;
  } catch {
    return false;
  }
}

/** Purge tags + literal paths (see the module comment for how). */
export async function purge(targets: PurgeTargets, req?: RevalidateReq): Promise<void> {
  if (disabled(req)) return;
  if (!targets.tags?.length && !targets.paths?.length) return;
  const inRequest = req?.payloadAPI === 'REST' || req?.payloadAPI === 'GraphQL';
  if (inRequest && (await purgeDirect(targets))) return;
  await purgeViaRoute(targets);
}

/** Next 16 `revalidateTag(tag, 'max')` (stale-while-revalidate) for each tag. */
export const revalidateTags = (tags: readonly string[], req?: RevalidateReq) => purge({ tags }, req);

/** Next 16 `revalidatePath(path)` for literal paths. */
export const revalidatePaths = (paths: readonly string[], req?: RevalidateReq) => purge({ paths }, req);

/** Static tags revalidated on every change/delete of a collection document. */
export const revalidateCollection = (
  ...tags: string[]
): { afterChange: CollectionAfterChangeHook[]; afterDelete: CollectionAfterDeleteHook[] } => ({
  afterChange: [
    async ({ doc, req }) => {
      await revalidateTags(tags, req);
      return doc;
    },
  ],
  afterDelete: [
    async ({ doc, req }) => {
      await revalidateTags(tags, req);
      return doc;
    },
  ],
});
