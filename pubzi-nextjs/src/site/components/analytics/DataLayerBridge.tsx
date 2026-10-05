'use client';

import { useEffect } from 'react';

type Fn = (...args: unknown[]) => unknown;
type BridgedArray = unknown[] & { __bhBridge?: boolean };

/**
 * Direct mode only (GA4 and/or Meta Pixel without GTM).
 *
 * `track()` (./track.ts) pushes GTM-style `{ event, ...params }` objects to
 * window.dataLayer. Without a GTM container nothing consumes them, so this bridge
 * forwards each one to `gtag('event', …)` and `fbq('trackCustom', …)`.
 *
 * gtag.js replaces `dataLayer.push` when it loads, so `push` is wrapped with an
 * accessor: whatever gets assigned later is kept as the inner implementation and
 * still runs. gtag's own `arguments` pushes and `gtm.*` events are ignored (no loops).
 */
export function DataLayerBridge({ ga, pixel }: { ga: boolean; pixel: boolean }) {
  useEffect(() => {
    const w = window as unknown as { dataLayer?: BridgedArray; gtag?: Fn; fbq?: Fn };
    const dl: BridgedArray = (w.dataLayer = w.dataLayer || []);
    if (dl.__bhBridge) return;

    let inner = dl.push as Fn;

    const forward = (item: unknown) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return;
      if (Object.prototype.toString.call(item) === '[object Arguments]') return;
      const { event, ...params } = item as Record<string, unknown>;
      if (typeof event !== 'string' || !event || event.startsWith('gtm.')) return;
      try {
        if (ga && typeof w.gtag === 'function') w.gtag('event', event, params);
        if (pixel && typeof w.fbq === 'function') w.fbq('trackCustom', event, params);
      } catch {
        /* never break UI because of analytics */
      }
    };

    const wrapped = (...items: unknown[]) => {
      const result = inner.apply(dl, items);
      items.forEach(forward);
      return result;
    };

    try {
      Object.defineProperty(dl, 'push', {
        configurable: true,
        get: () => wrapped,
        set: (fn: Fn) => {
          if (typeof fn === 'function' && fn !== wrapped) inner = fn;
        },
      });
      dl.__bhBridge = true;
    } catch {
      /* frozen / exotic dataLayer: skip bridging */
    }
  }, [ga, pixel]);

  return null;
}
