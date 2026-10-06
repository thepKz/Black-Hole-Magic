import { cookies, draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

import { PREVIEW_COOKIE } from '@site/lib/content/preview';

/**
 * POST (or GET from a <form method="get">) /api/draft/exit?path=/vi/news/slug
 * Disables Draft Mode (+ the signed `bh_preview` cookie) and returns to `path`
 * (same-site, locale-prefixed only).
 * Use a <form>, never a prefetching <Link>, to trigger it.
 */
export const dynamic = 'force-dynamic';

function safeReturnPath(raw: string | null): string {
  if (raw && /^\/(vi|en)(\/[A-Za-z0-9/_-]*)?$/.test(raw)) return raw;
  return '/vi/news';
}

async function exit(request: Request) {
  const { searchParams } = new URL(request.url);
  const draft = await draftMode();
  draft.disable();
  (await cookies()).delete(PREVIEW_COOKIE);
  // 303 so a POST is followed by a GET of the page.
  return NextResponse.redirect(new URL(safeReturnPath(searchParams.get('path')), request.url), 303);
}

export const GET = exit;
export const POST = exit;
