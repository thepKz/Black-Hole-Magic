/**
 * Live-preview / preview URLs for news.
 *
 * Payload's live preview iframe (and the "Preview" button) open
 *   {SITE_URL}/api/draft?path=/{locale}/news/{slug}
 * The route (src/app/(site)/api/draft/route.ts) checks the Payload session
 * cookie, enables Next draft mode and redirects to /{locale}/news/{slug}?preview=1.
 *
 * Must be absolute: Payload posts live-preview messages to this origin, so it is
 * built from the request origin of the admin (see `requestOrigin`).
 */
export const PREVIEW_LOCALES = ['vi', 'en'] as const;
export type PreviewLocale = (typeof PREVIEW_LOCALES)[number];

export const siteOrigin = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const toPreviewLocale = (code: string | null | undefined): PreviewLocale =>
  code === 'en' ? 'en' : 'vi';

/** Locale-prefixed article path, e.g. /vi/news/my-slug. */
export const newsArticlePath = (locale: string | null | undefined, slug: string) =>
  `/${toPreviewLocale(locale)}/news/${encodeURIComponent(slug)}`;

type OriginSource = {
  origin?: string | null;
  headers?: { get(name: string): string | null } | null;
};

/**
 * Origin the admin is actually served from (so the live-preview iframe and
 * Payload's postMessage handshake use the same origin as /admin, e.g. :3100 in
 * QA). Honours x-forwarded-host/proto from a reverse proxy; falls back to
 * NEXT_PUBLIC_SITE_URL.
 */
export function requestOrigin(req?: OriginSource | null): string {
  try {
    const fwdHost = req?.headers?.get('x-forwarded-host')?.split(',')[0]?.trim();
    const host = fwdHost || req?.headers?.get('host')?.trim();
    if (host && /^[a-z0-9.-]+(:\d+)?$/i.test(host)) {
      const fwdProto = req?.headers?.get('x-forwarded-proto')?.split(',')[0]?.trim();
      const proto =
        fwdProto === 'https' || fwdProto === 'http'
          ? fwdProto
          : req?.origin?.startsWith('https:')
            ? 'https'
            : 'http';
      return `${proto}://${host}`;
    }
    if (req?.origin && /^https?:\/\//.test(req.origin)) return req.origin.replace(/\/+$/, '');
  } catch {
    // fall through
  }
  return siteOrigin();
}

/** `null` hides the live-preview tab until the article has a slug. */
export function buildPreviewUrl(
  slug: string | null | undefined,
  locale: string | null | undefined,
  req?: OriginSource | null,
): string | null {
  if (!slug) return null;
  const params = new URLSearchParams({ path: newsArticlePath(locale, slug) });
  return `${requestOrigin(req)}/api/draft?${params.toString()}`;
}

/** Validates a preview target path: only /{vi|en}/news/{slug} is allowed (no open redirect). */
export function parsePreviewPath(path: string | null): { locale: PreviewLocale; slug: string } | null {
  if (!path) return null;
  const m = path.match(/^\/(vi|en)\/news\/([a-z0-9][a-z0-9-]{0,127})$/);
  if (!m) return null;
  return { locale: m[1] as PreviewLocale, slug: m[2] };
}
