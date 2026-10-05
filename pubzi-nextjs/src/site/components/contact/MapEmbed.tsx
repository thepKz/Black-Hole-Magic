'use client';

import { ArrowSquareOutIcon, MapPinIcon } from '@phosphor-icons/react/ssr';
import { useState } from 'react';

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
 * (no cookies, no layout shift, better LCP/INP). Then swaps in the iframe.
 */
export function MapEmbed({ query, title, loadLabel, openLabel, newTabLabel, className }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
        {loaded ? (
          <iframe
            title={title}
            src={embedUrl}
            className="absolute inset-0 block size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setLoaded(true);
              track('map_load', { location: 'contact' });
            }}
            className="group absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-3 border-0 bg-transparent p-4 text-ink"
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
            <span
              aria-hidden="true"
              className="absolute top-[38%] left-0 h-2.5 w-full -rotate-6 bg-white/80 shadow-sm"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 left-[58%] h-full w-2 rotate-12 bg-white/70 shadow-sm"
            />
            <span className="relative grid size-14 place-items-center rounded-full bg-accent text-white shadow-glow transition-transform duration-200 ease-out-soft group-hover:-translate-y-1 motion-reduce:transition-none">
              <MapPinIcon size={28} weight="fill" aria-hidden="true" />
            </span>
            <span className="relative rounded-md bg-surface/90 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm group-hover:text-accent-700">
              {loadLabel}
            </span>
          </button>
        )}
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
