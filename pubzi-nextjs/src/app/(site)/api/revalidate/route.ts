import { revalidatePath, revalidateTag } from 'next/cache';

import { eventToTargets, isContentEventName, type ContentEvent } from '@/shared/cache';
import { bearer, revalidateSecret, safeEqual, verifyHmacSignature } from '@/shared/revalidate-secret';

/**
 * POST /api/revalidate - cache purge webhook (CMS-neutral).
 *
 * Auth (one of):
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   X-Webhook-Signature: sha256=<hex HMAC-SHA256(raw body, REVALIDATE_SECRET)>
 *     (also accepted as X-Signature / X-Hub-Signature-256)
 * REVALIDATE_SECRET falls back to a hash of PAYLOAD_SECRET, which an external
 * CMS does not know: set it explicitly in production.
 *
 * Body - either form, or an array of events:
 *   1. Low level (used by the Payload hooks, src/cms/hooks/revalidate.ts):
 *      { tags?: string[], paths?: string[] }
 *   2. Content events (for any CMS - no knowledge of internal tags/paths needed):
 *      { event: 'news.published' | 'news.unpublished' | 'news.updated' | 'news.deleted'
 *               | 'category.changed' | 'media.changed' | 'all',
 *        slug?: string, previousSlug?: string, slugs?: string[] }
 *      Mapping lives in src/shared/cache.ts (eventToTargets).
 *
 * Response: { ok: true, tags: <count>, paths: <count> }. Tags use Next 16
 * `revalidateTag(tag, 'max')` (stale-while-revalidate).
 */
export const dynamic = 'force-dynamic';

const MAX_ITEMS = 100;
const MAX_BODY = 64 * 1024;
const TAG_RE = /^[a-z0-9:_-]{1,128}$/i;
const PATH_RE = /^\/[a-z0-9/._-]{0,300}$/i;

function strings(value: unknown, re: RegExp): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && re.test(v));
}

function authorized(request: Request, rawBody: string, secret: string): boolean {
  if (safeEqual(bearer(request.headers.get('authorization')), secret)) return true;
  const signature =
    request.headers.get('x-webhook-signature') ??
    request.headers.get('x-signature') ??
    request.headers.get('x-hub-signature-256');
  return verifyHmacSignature(rawBody, signature, secret);
}

export async function POST(request: Request) {
  const expected = revalidateSecret();
  // Raw text first: the HMAC is computed over the exact bytes received.
  const raw = await request.text().catch(() => '');
  if (!expected || !authorized(request, raw, expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }
  if (raw.length > MAX_BODY) return Response.json({ ok: false, error: 'too_large' }, { status: 413 });

  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const items = (Array.isArray(body) ? body : [body]).slice(0, MAX_ITEMS) as Record<string, unknown>[];
  const tags = new Set<string>();
  const paths = new Set<string>();
  let layout = false;
  let unknownEvent = false;

  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    if ('event' in item) {
      if (!isContentEventName(item.event)) {
        unknownEvent = true;
        continue;
      }
      const target = eventToTargets({
        event: item.event,
        slug: typeof item.slug === 'string' ? item.slug : null,
        previousSlug: typeof item.previousSlug === 'string' ? item.previousSlug : null,
        slugs: strings(item.slugs, /^.{1,128}$/),
      } satisfies ContentEvent);
      target.tags.forEach((t) => tags.add(t));
      target.paths.forEach((p) => paths.add(p));
      if (target.layout) layout = true;
      continue;
    }
    strings(item.tags, TAG_RE).forEach((t) => tags.add(t));
    strings(item.paths, PATH_RE)
      .filter((p) => !p.includes('..'))
      .forEach((p) => paths.add(p));
  }

  if (unknownEvent && !tags.size && !paths.size && !layout) {
    return Response.json({ ok: false, error: 'unknown_event' }, { status: 400 });
  }

  const tagList = [...tags].slice(0, MAX_ITEMS);
  const pathList = [...paths].slice(0, MAX_ITEMS);
  for (const tag of tagList) revalidateTag(tag, 'max');
  for (const path of pathList) revalidatePath(path);
  if (layout) revalidatePath('/', 'layout');

  return Response.json(
    { ok: true, tags: tagList.length, paths: pathList.length, ...(layout ? { layout: true } : {}) },
    { headers: { 'cache-control': 'no-store' } },
  );
}
