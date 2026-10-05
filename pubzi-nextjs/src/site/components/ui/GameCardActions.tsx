'use client';

import {
  AppleLogoIcon,
  CalendarCheckIcon,
  CaretDownIcon,
  DesktopIcon,
  DownloadSimpleIcon,
  FacebookLogoIcon,
  GooglePlayLogoIcon,
  HouseIcon,
  PlayIcon,
} from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { track } from '@site/components/analytics/track';
import { cn } from '@site/lib/cn';
import type { CtaKind } from '@site/lib/types';
import { Button } from './Button';

export interface GameCardStore {
  platform: 'ios' | 'android' | 'pc';
  href: string;
  label: string;
}

export interface GameCardActionsProps {
  gameSlug: string;
  cta: {
    kind: CtaKind;
    label: string;
    /** null -> disabled button. */
    href: string | null;
    external: boolean;
    /** > 1 entries -> the CTA opens a store popover. */
    stores: GameCardStore[];
  };
  homepage: { href: string | null; label: string };
  fanpage: { href: string | null; label: string };
  chooseStoreLabel: string;
  newTabLabel: string;
  className?: string;
}

const ctaIcon: Record<CtaKind, typeof PlayIcon> = {
  play: PlayIcon,
  download: DownloadSimpleIcon,
  preregister: CalendarCheckIcon,
};
const storeIcon = { ios: AppleLogoIcon, android: GooglePlayLogoIcon, pc: DesktopIcon } as const;

function IconLink({ href, label, newTabLabel, onClick, children }: { href: string | null; label: string; newTabLabel: string; onClick?: () => void; children: ReactNode }) {
  return (
    <span className="tip flex flex-1 @[15rem]:flex-none">
      {href ? (
        <Button href={href} variant="soft" size="md" iconOnly external aria-label={`${label} ${newTabLabel}`} className="w-full @[15rem]:w-10" onClick={onClick}>
          {children}
        </Button>
      ) : (
        <Button variant="soft" size="md" iconOnly disabled aria-label={label} className="w-full @[15rem]:w-10">
          {children}
        </Button>
      )}
      <span className="tip-label" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}

/** Interactive footer of <GameCard>: primary CTA (+ store popover) and homepage / fanpage icon buttons. */
export function GameCardActions({ gameSlug, cta, homepage, fanpage, chooseStoreLabel, newTabLabel, className }: GameCardActionsProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const Icon = ctaIcon[cta.kind];
  const hasPopover = cta.stores.length > 1;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    // focus first item
    wrapRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const ctaClass = 'w-full min-w-0 @[15rem]:w-auto @[15rem]:flex-1';

  return (
    <div className={cn('@container', className)}>
      <div className="flex flex-wrap gap-1.5 @[15rem]:flex-nowrap">
        {hasPopover ? (
          <div ref={wrapRef} className="relative w-full min-w-0 @[15rem]:w-auto @[15rem]:flex-1" onKeyDown={open ? onMenuKey : undefined}>
            <Button
              ref={triggerRef}
              variant="primary"
              size="md"
              block
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={open ? menuId : undefined}
              onClick={() => setOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' && !open) {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
              className="px-3 text-[13px]"
            >
              <Icon size={16} weight="bold" aria-hidden="true" />
              <span className="truncate">{cta.label}</span>
              <CaretDownIcon size={12} weight="bold" aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')} />
            </Button>
            {open ? (
              <div
                id={menuId}
                role="menu"
                aria-label={chooseStoreLabel}
                className="absolute bottom-[calc(100%+6px)] left-0 z-30 min-w-full rounded-lg border border-divider bg-surface p-1 shadow-lg"
              >
                {cta.stores.map((s) => {
                  const StoreIcon = storeIcon[s.platform];
                  return (
                    <a
                      key={s.platform}
                      role="menuitem"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm whitespace-nowrap text-ink no-underline hover:bg-accent-50 hover:text-accent-800 focus:bg-accent-50"
                      onClick={() => {
                        track('cta_click', { game: gameSlug, kind: cta.kind, store: s.platform });
                        setOpen(false);
                      }}
                    >
                      <StoreIcon size={18} weight="fill" aria-hidden="true" />
                      {s.label}
                      <span className="sr-only"> {newTabLabel}</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : cta.href ? (
          <Button
            href={cta.href}
            external={cta.external}
            newTabLabel={newTabLabel}
            variant="primary"
            size="md"
            className={cn(ctaClass, 'px-3 text-[13px]')}
            onClick={() => track('cta_click', { game: gameSlug, kind: cta.kind })}
          >
            <Icon size={16} weight="bold" aria-hidden="true" />
            <span className="truncate">{cta.label}</span>
          </Button>
        ) : (
          <Button variant="primary" size="md" disabled className={cn(ctaClass, 'px-3 text-[13px]')}>
            <Icon size={16} weight="bold" aria-hidden="true" />
            <span className="truncate">{cta.label}</span>
          </Button>
        )}

        <IconLink
          href={homepage.href}
          label={homepage.label}
          newTabLabel={newTabLabel}
          onClick={() => track('outbound_click', { game: gameSlug, target: 'homepage' })}
        >
          <HouseIcon size={18} weight="fill" aria-hidden="true" />
        </IconLink>
        <IconLink
          href={fanpage.href}
          label={fanpage.label}
          newTabLabel={newTabLabel}
          onClick={() => track('outbound_click', { game: gameSlug, target: 'fanpage' })}
        >
          <FacebookLogoIcon size={18} weight="fill" aria-hidden="true" />
        </IconLink>
      </div>
    </div>
  );
}
