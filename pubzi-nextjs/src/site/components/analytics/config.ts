/**
 * Tracking IDs from env (inlined at build). An ID that does not match its expected
 * format is ignored, so a typo can never inject markup into the inline scripts.
 *
 * Precedence (see Analytics.tsx):
 *   NEXT_PUBLIC_GTM_ID set      -> GTM only (configure GA4 + Meta Pixel inside the container)
 *   else NEXT_PUBLIC_GA_ID      -> GA4 (gtag.js)
 *   and/or NEXT_PUBLIC_FB_PIXEL_ID -> Meta Pixel
 *   nothing set                 -> no tracking code at all
 */
const clean = (v: string | undefined, re: RegExp): string | null => {
  const s = v?.trim();
  return s && re.test(s) ? s : null;
};

export const analyticsIds = {
  gtmId: clean(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]+$/i),
  gaId: clean(process.env.NEXT_PUBLIC_GA_ID, /^G-[A-Z0-9]+$/i),
  pixelId: clean(process.env.NEXT_PUBLIC_FB_PIXEL_ID, /^\d{6,20}$/),
} as const;

export type AnalyticsMode = 'gtm' | 'direct' | 'none';

export function analyticsMode(ids = analyticsIds): AnalyticsMode {
  if (ids.gtmId) return 'gtm';
  if (ids.gaId || ids.pixelId) return 'direct';
  return 'none';
}
