'use client';

import { ArrowSquareOutIcon, MapPinIcon } from '@phosphor-icons/react/ssr';
import { useRef, useState } from 'react';

import { track } from '@site/components/analytics/track';
import { cn } from '@site/lib/cn';

export interface MapEmbedProps {
  /** Address searched in Google Maps. */
  query: string;
  /** iframe title (a11y), e.g. "Trụ sở - Hưng Yên". */
  title: string;
  loadLabel: string;
  openLabel: string;
  newTabLabel?: string;
  className?: string;
}

export const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/**
 * 16:9 Google Map facade: nothing third-party loads until the user clicks
 * (no cookies, no layout shift, better LCP/INP).
 * Click -> the iframe mounts invisibly ON TOP of the facade while the facade
 * shows a spinner; when the map's load event fires it fades in (opacity only)
 * and the facade underneath is removed after the fade. The 16:9 box never changes size.
 */
export function MapEmbed({ query, title, loadLabel, openLabel, newTabLabel, className }: MapEmbedProps) {
  // idle -> loading (iframe mounted, invisible) -> ready (fading in) -> done (facade removed)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'done'>('idle');
  const loaded = phase !== 'idle';
  const buttonRef = useRef<HTMLButtonElement>(null);
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
        {phase !== 'done' ? (
          <button
            ref={buttonRef}
            type="button"
            // aria-disabled (not disabled) keeps keyboard focus on the button while the map loads.
            aria-disabled={loaded || undefined}
            aria-busy={phase === 'loading' || undefined}
            onClick={() => {
              if (loaded) return;
              setPhase('loading');
              track('map_load', { location: 'contact' });
            }}
            className="group absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-3 border-0 bg-transparent p-4 text-ink aria-disabled:cursor-progress"
          >
            {/* Stylised map backdrop (pure CSS, no request). */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-accent-50),var(--color-cyan-50))]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-divider)_1px,transparent_1px),linear-gradient(90deg,var(--color-divider)_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <span aria-hidden="true" className="absolute top-[38%] left-0 h-2.5 w-full -rotate-6 bg-white/80 shadow-sm" />
            <span aria-hidden="true" className="absolute top-0 left-[58%] h-full w-2 rotate-12 bg-white/70 shadow-sm" />
            <span className="relative grid size-14 place-items-center rounded-full bg-accent text-white shadow-glow transition-transform duration-(--dur-2) ease-standard group-hover:-translate-y-1">
              {phase === 'loading' ? (
                <svg className="size-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <MapPinIcon size={28} weight="fill" aria-hidden="true" />
              )}
            </span>
            <span className="relative rounded-md bg-surface px-3 py-1.5 text-sm font-medium shadow-sm group-hover:text-accent-700">
              {loadLabel}
            </span>
          </button>
        ) : null}
        {loaded ? (
          <iframe
            title={title}
            src={embedUrl}
            onLoad={() => setPhase((p) => (p === 'loading' ? 'ready' : p))}
            onTransitionEnd={(e) => {
              if (e.propertyName !== 'opacity') return;
              // The facade is about to unmount: hand keyboard focus to the map.
              if (document.activeElement === buttonRef.current) e.currentTarget.focus();
              setPhase('done');
            }}
            data-ready={phase === 'ready' || phase === 'done' ? '' : undefined}
            className="pointer-events-none absolute inset-0 block size-full border-0 opacity-0 transition-opacity duration-(--dur-4) ease-standard data-ready:pointer-events-auto data-ready:opacity-100"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : null}
      </div>
      <a
        href={mapsSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('outbound_click', { url: 'google_maps', location: 'contact' })}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-link no-underline hover:underline"
      >
        {openLabel}
        <ArrowSquareOutIcon size={14} aria-hidden="true" />
        {newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
      </a>
    </div>
  );
}
