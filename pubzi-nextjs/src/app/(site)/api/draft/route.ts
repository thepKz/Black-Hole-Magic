import config from '@payload-config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';

import { parsePreviewPath } from '@/cms/lib/preview';

/**
 * GET /api/draft?path=/{vi|en}/news/{slug}
 *
 * Entry point of Payload live preview + the "Preview" button (see
 * src/cms/lib/preview.ts). No shared secret: the request must carry a valid
 * Payload admin session cookie (same origin as /admin), so only logged-in CMS
 * users can turn on Draft Mode. Then redirects to the article with `?preview=1`.
 * The target is validated against /{vi|en}/news/{slug} (no open redirect).
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = parsePreviewPath(searchParams.get('path'));
  if (!target) {
    return new Response('Invalid preview path', { status: 400 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response('Unauthorized: log in to /admin first', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/${target.locale}/news/${target.slug}?preview=1`);
}
