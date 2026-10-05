import { revalidatePath, revalidateTag } from 'next/cache';

import { bearer, revalidateSecret, safeEqual } from '@/cms/lib/revalidateSecret';

/**
 * POST /api/revalidate  (Authorization: Bearer <REVALIDATE_SECRET>)
 * Body: { tags?: string[], paths?: string[] }
 *
 * Used by Payload hooks that run outside a Next request (scheduled
 * publish/unpublish jobs, see src/cms/hooks/revalidate.ts); also usable by an
 * external system. Tags use Next 16 `revalidateTag(tag, 'max')`.
 */
export const dynamic = 'force-dynamic';

const MAX_ITEMS = 100;
const TAG_RE = /^[a-z0-9:_-]{1,128}$/i;
const PATH_RE = /^\/[a-z0-9/._-]{0,300}$/i;

function strings(value: unknown, re: RegExp): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((v): v is string => typeof v === 'string' && re.test(v)))].slice(0, MAX_ITEMS);
}

export async function POST(request: Request) {
  const expected = revalidateSecret();
  if (!expected || !safeEqual(bearer(request.headers.get('authorization')), expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const data = (body ?? {}) as { tags?: unknown; paths?: unknown };
  const tags = strings(data.tags, TAG_RE);
  const paths = strings(data.paths, PATH_RE).filter((p) => !p.includes('..'));
  for (const tag of tags) revalidateTag(tag, 'max');
  for (const path of paths) revalidatePath(path);
  return Response.json(
    { ok: true, tags: tags.length, paths: paths.length },
    { headers: { 'cache-control': 'no-store' } },
  );
}
