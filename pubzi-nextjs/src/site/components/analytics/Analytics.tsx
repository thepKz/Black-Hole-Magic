import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import { analyticsIds, analyticsMode } from './config';
import { DataLayerBridge } from './DataLayerBridge';
import { MetaPixel } from './MetaPixel';

/**
 * Tracking for the new site only — rendered by src/app/(site)/[locale]/layout.tsx.
 * The legacy site (/v2) and Payload (/admin) have their own root layouts and get none.
 *
 * - GTM when NEXT_PUBLIC_GTM_ID is set (GA4 / Pixel live inside the container;
 *   `track()` events reach it through window.dataLayer).
 * - Otherwise GA4 (NEXT_PUBLIC_GA_ID) and/or Meta Pixel (NEXT_PUBLIC_FB_PIXEL_ID),
 *   plus a bridge forwarding `track()` events to them.
 * - Nothing when no ID is set.
 *
 * GA4 page views on client navigation come from GA4 enhanced measurement
 * ("page changes based on browser history events", on by default).
 */
export function Analytics() {
  const mode = analyticsMode();
  if (mode === 'none') return null;

  const { gtmId, gaId, pixelId } = analyticsIds;
  if (mode === 'gtm' && gtmId) return <GoogleTagManager gtmId={gtmId} />;

  return (
    <>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {pixelId ? <MetaPixel pixelId={pixelId} /> : null}
      <DataLayerBridge ga={!!gaId} pixel={!!pixelId} />
    </>
  );
}
