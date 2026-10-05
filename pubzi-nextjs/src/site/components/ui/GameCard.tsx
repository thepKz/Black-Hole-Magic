import Image from 'next/image';

import { genres as allGenres, resolveGameCta } from '@site/data/games';
import { getDictionary, pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { CtaKind, Game } from '@site/lib/types';
import { GameCardActions } from './GameCardActions';
import { StatusTag, statusLabel } from './StatusTag';
import { Tag } from './Tag';

export interface GameCardProps {
  game: Game;
  locale: Locale;
  /** Preload the image (first row above the fold). */
  preload?: boolean;
  headingLevel?: 'h2' | 'h3';
  /** next/image `sizes`; default fits the auto-fill 260px grid (2 cols mobile). */
  sizes?: string;
  className?: string;
}

/**
 * Game card (design v2): 4:3 cover with focal crop, status tag, name, genre tags,
 * primary CTA (Chơi ngay / Tải xuống / Đăng ký trước, store popover when several
 * stores) + icon buttons Trang chủ game / Fanpage with tooltips. Hover: lift + glow.
 */
export function GameCard({ game, locale, preload = false, headingLevel = 'h3', sizes, className }: GameCardProps) {
  const t = getDictionary(locale);
  const cta = resolveGameCta(game);
  const Heading = headingLevel;
  const ctaLabel: Record<CtaKind, string> = { play: t.playNow, download: t.download, preregister: t.preReg };
  const storeLabel = { ios: t.appStore, android: t.googlePlay, pc: t.platformPc } as const;
  const genreNames = game.genres
    .map((slug) => allGenres.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => pick(g.name, locale));
  const focal = game.cover.focal;

  return (
    <article
      className={cn('card-lift group relative flex h-full flex-col gap-2 rounded-xl bg-surface p-2 shadow-sm', className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={game.cover.src}
          alt={pick(game.cover.alt, locale) || game.name}
          fill
          preload={preload}
          sizes={sizes ?? '(min-width: 1280px) 290px, (min-width: 768px) 33vw, 50vw'}
          quality={75}
          className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
          style={focal ? { objectPosition: `${focal.x}% ${focal.y}%` } : undefined}
        />
        <StatusTag status={game.status} label={statusLabel(game.status, t)} className="absolute top-2 left-2" />
      </div>

      <div className="flex flex-col gap-1.5 px-1 pt-0.5">
        <Heading className="m-0 line-clamp-2 text-base leading-snug md:line-clamp-1 font-medium tracking-normal text-ink" title={game.name}>
          {game.name}
        </Heading>
        {genreNames.length ? (
          <ul className="flex flex-wrap gap-1" role="list" aria-label={t.genreFilter}>
            {genreNames.map((name) => (
              <li key={name}>
                <Tag className="text-[10px]">{name}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <GameCardActions
        className="mt-auto pt-1"
        gameSlug={game.slug}
        cta={{
          kind: cta.kind,
          label: ctaLabel[cta.kind],
          href: cta.href,
          external: cta.external,
          stores: cta.stores.map((s) => ({ ...s, label: storeLabel[s.platform] })),
        }}
        homepage={{ href: game.links.homepage, label: t.gameSite }}
        fanpage={{ href: game.links.fanpage, label: t.fanpage }}
        chooseStoreLabel={t.chooseStore}
        newTabLabel={t.newTab}
      />
    </article>
  );
}
