/**
 * dataLayer helper (GTM). GA4 / Facebook Pixel are configured inside GTM.
 * Safe to call anywhere: no-op on the server.
 *
 *   track('cta_click', { game: 'kiem-the', kind: 'preregister' })
 *   track('lang_switch', { from: 'vi', to: 'en' })
 */
export type TrackEventName =
  | 'cta_click'
  | 'banner_click'
  | 'lang_switch'
  | 'search'
  | 'contact_submit'
  | 'share'
  | 'outbound_click'
  | 'filter_change'
  // allow custom names without losing autocomplete
  | (string & {});

export type TrackParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEventName, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch {
    /* never break UI because of analytics */
  }
}
