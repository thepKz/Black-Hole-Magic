import 'server-only';

import { createHmac } from 'node:crypto';

import { cookies, draftMode, headers } from 'next/headers';

import { revalidateSecret, safeEqual } from '@/shared/revalidate-secret';

import { getNewsSource } from './index';
import type { ContentSourceId } from './source';

/**
 * PREVIEW CONTRACT (source-neutral) - see docs/CONNECT-CMS.md.
 *
 *   GET /api/draft?path=/{vi|en}/news/{slug}[&token=...|&exp=...&sig=...]
 *
 * 1. The ACTIVE source's verifyPreview() decides access (Payload: admin
 *    session cookie; http: CMS_PREVIEW_SECRET token or HMAC signature).
 * 2. On success: Next Draft Mode is enabled AND an httpOnly cookie
 *    `bh_preview` = signed { exp, src } is set (default 1 hour,
 *    PREVIEW_MAX_AGE_SECONDS). Every draft render checks this cookie, so a
 *    forgotten Draft Mode cookie stops showing drafts after it expires, and
 *    no CMS call is needed per render (Payload additionally re-checks its
 *    session so /admin logout ends the preview at once).
 * 3. POST /api/draft/exit clears both.
 *
 * Signing key: PREVIEW_COOKIE_SECRET, else REVALIDATE_SECRET (or its
 * PAYLOAD_SECRET-derived default), else CMS_PREVIEW_SECRET. No key = no preview.
 */

export const PREVIEW_COOKIE = 'bh_preview';

export function previewMaxAgeSeconds(): number {
  const n = Number.parseInt(process.env.PREVIEW_MAX_AGE_SECONDS ?? '', 10);
  return Number.isFinite(n) && n >= 60 ? Math.min(n, 24 * 3600) : 3600;
}

function signingKey(): string | null {
  return process.env.PREVIEW_COOKIE_SECRET?.trim() || revalidateSecret() || process.env.CMS_PREVIEW_SECRET?.trim() || null;
}

const sign = (payload: string, key: string) => createHmac('sha256', key).update(`preview:${payload}`).digest('base64url');

/** Cookie value `<base64url json>.<sig>`, or null when no signing key is configured. */
export function createPreviewCookieValue(source: ContentSourceId, now = Date.now()): string | null {
  const key = signingKey();
  if (!key) return null;
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(now / 1000) + previewMaxAgeSeconds(), src: source })).toString('base64url');
  return `${payload}.${sign(payload, key)}`;
}

/** True when `value` is a valid, unexpired preview cookie for `source`. */
export function verifyPreviewCookieValue(value: string | null | undefined, source: ContentSourceId, now = Date.now()): boolean {
  const key = signingKey();
  if (!key || !value) return false;
  const [payload, sig] = value.split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload, key))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: unknown; src?: unknown };
    return typeof data.exp === 'number' && data.exp * 1000 > now && data.src === source;
  } catch {
    return false;
  }
}

/** Cookie attributes: cross-site capable (CMS preview iframes) in production. */
export function previewCookieOptions() {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: previewMaxAgeSeconds(),
  };
}

/**
 * May this render show drafts? Draft Mode alone is not trusted (its cookie
 * outlives the CMS session): it also needs a valid `bh_preview` cookie for the
 * ACTIVE source and, when the source supports it, a live CMS session
 * (Payload: still logged in to /admin). Never throws.
 * Cookies can't be cleared during render; a stale bypass cookie is simply
 * ignored (it is cleared by /api/draft/exit, the banner's exit form).
 */
export async function isDraftViewer(): Promise<boolean> {
  try {
    if (!(await draftMode()).isEnabled) return false;
    const source = await getNewsSource();
    if (!verifyPreviewCookieValue((await cookies()).get(PREVIEW_COOKIE)?.value, source.id)) return false;
    return source.verifyPreviewSession ? await source.verifyPreviewSession(await headers()) : true;
  } catch {
    return false;
  }
}
