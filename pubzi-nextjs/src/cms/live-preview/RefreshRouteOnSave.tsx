'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Server-side Live Preview bridge (no extra dependency).
 *
 * Render it on the article page ONLY when `(await draftMode()).isEnabled`.
 * Inside Payload's live-preview iframe (or popup) it:
 *  1. tells the admin it is ready (`{ type: 'payload-live-preview', ready: true }`),
 *  2. calls `router.refresh()` whenever the admin reports a document event
 *     (save / autosave / publish -> `{ type: 'payload-document-event' }`), so the
 *     Server Component re-reads the latest draft via getNewsBySlug(..., { draft: true }).
 *
 * `serverURL` = origin of the admin (same origin by default).
 */
export function RefreshRouteOnSave({ serverURL }: { serverURL?: string }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const origin = serverURL ? new URL(serverURL).origin : window.location.origin;
    const target = window.opener ?? (window.parent !== window ? window.parent : null);
    target?.postMessage({ type: 'payload-live-preview', ready: true }, origin);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const data = event.data as { type?: string } | null;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'payload-document-event') {
        // Debounce bursts of autosave events.
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => router.refresh(), 150);
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [router, serverURL]);

  return null;
}
