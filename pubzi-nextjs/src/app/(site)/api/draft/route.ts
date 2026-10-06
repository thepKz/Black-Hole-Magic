import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { parsePreviewPath } from '@/shared/preview-path';
import { getNewsSource } from '@site/lib/content';
import { createPreviewCookieValue, PREVIEW_COOKIE, previewCookieOptions } from '@site/lib/content/preview';

/**
 * GET /api/draft?path=/{vi|en}/news/{slug}[&token=...]
 *
 * Entry point of the CMS preview (Payload live preview + "Preview" button, or
 * an external CMS's preview link). The ACTIVE content source decides access
 * (src/site/lib/content/preview.ts):
 * - payload: a valid Payload admin session cookie (same origin as /admin),
 * - http   : `token` = CMS_PREVIEW_SECRET, or `exp` + `sig` (HMAC).
 * Then Draft Mode + the signed `bh_preview` cookie are set and the browser is
 * redirected to the article with `?preview=1`.
 * The target is validated against /{vi|en}/news/{slug} (no open redirect).
 * A CMS outage answers 503 instead of crashing.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = parsePreviewPath(searchParams.get('path'));
  if (!target) {
    return new Response('Invalid preview path', { status: 400 });
  }

  let allowed = false;
  let sourceId: Awaited<ReturnType<typeof getNewsSource>>['id'];
  try {
    const source = await getNewsSource();
    sourceId = source.id;
    allowed = source.verifyPreview ? await source.verifyPreview({ headers: request.headers, searchParams }) : false;
  } catch (err) {
    console.error('[draft] preview check failed:', err instanceof Error ? err.message.split('\n')[0].slice(0, 200) : 'error');
    return new Response('Preview temporarily unavailable', { status: 503, headers: { 'cache-control': 'no-store' } });
  }
  if (!allowed) {
    return new Response(sourceId === 'payload' ? 'Unauthorized: log in to /admin first' : 'Unauthorized', {
      status: 401,
      headers: { 'cache-control': 'no-store' },
    });
  }

  const value = createPreviewCookieValue(sourceId);
  if (!value) {
    return new Response('Preview is not configured (no signing secret)', { status: 503 });
  }

  (await draftMode()).enable();
  (await cookies()).set(PREVIEW_COOKIE, value, previewCookieOptions());

  redirect(`/${target.locale}/news/${target.slug}?preview=1`);
}
