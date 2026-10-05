import { pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { isRealUrl } from '@site/data/site';
import type { Partner } from '@site/lib/types';

export interface PartnerTileProps {
  partner: Partner;
  locale: Locale;
  /** sr-only suffix for the new-tab link, e.g. t.newTab. */
  newTabLabel?: string;
  className?: string;
}

/**
 * Partner logo tile (96px high). Grayscale -> colour on hover/focus.
 * Links open in a new tab; '#' / null urls render a plain tile.
 * Uses a plain <img> (logos are small SVGs; no optimisation needed).
 */
export function PartnerTile({ partner, locale, newTabLabel, className }: PartnerTileProps) {
  const alt = pick(partner.logo.alt, locale) || partner.name;
  const tile = cn(
    'card-lift-soft group flex h-24 items-center justify-center rounded-lg bg-surface px-5 py-4 shadow-sm',
    className,
  );
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={partner.logo.src}
      width={partner.logo.width}
      height={partner.logo.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="max-h-12 w-auto max-w-full object-contain opacity-70 grayscale transition-[filter,opacity] duration-(--dur-3) ease-standard group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
    />
  );

  if (isRealUrl(partner.url)) {
    return (
      <a href={partner.url} target="_blank" rel="noopener noreferrer" className={tile} title={partner.name}>
        {img}
        {newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
      </a>
    );
  }
  return <div className={tile}>{img}</div>;
}
