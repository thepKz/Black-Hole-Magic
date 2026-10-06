/**
 * Preview target paths of the public site. CMS-neutral: used by /api/draft
 * (any content source) and by the Payload live-preview URL builder.
 */
export type PreviewPathLocale = 'vi' | 'en';

/** Validates a preview target path: only /{vi|en}/news/{slug} is allowed (no open redirect). */
export function parsePreviewPath(path: string | null | undefined): { locale: PreviewPathLocale; slug: string } | null {
  if (!path) return null;
  const m = path.match(/^\/(vi|en)\/news\/([a-z0-9][a-z0-9-]{0,127})$/);
  if (!m) return null;
  return { locale: m[1] as PreviewPathLocale, slug: m[2] };
}
