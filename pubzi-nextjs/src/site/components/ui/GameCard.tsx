import Image from 'next/image';
import type { ReactNode } from 'react';

import { getGameTags } from '@site/data/games';
import { fanpageUrl } from '@site/data/site';
import { getDictionary, pick, type Dictionary, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { Game } from '@site/lib/types';
import { StatusTag, statusLabel } from './StatusTag';
import { Tag } from './Tag';

export interface GameCardProps {
  game: Game;
  locale: Locale;
  /** Preload the image (first card above the fold). */
  preload?: boolean;
  headingLevel?: 'h2' | 'h3';
  /** next/image `sizes`; default fits the auto-fill minmax(260px,1fr) grid. */
  sizes?: string;
  className?: string;
  /**
   * 'default'   - grid card (4:3 cover, compact buttons).
   * 'spotlight' - one wide horizontal card (16:9 key art left, copy right) for
   *               when only one game is published; stacks under 768px.
   */
  variant?: 'default' | 'spotlight';
}

/** Design v2 house glyph (256 grid). */
function HouseIcon() {
  return (
    <svg className="size-[15px] shrink-0" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128 28 24 116h28v104h56v-64h40v64h56V116h28z" />
    </svg>
  );
}

/** Design v2 Facebook glyph (256 grid). */
function FacebookIcon() {
  return (
    <svg className="size-[15px] shrink-0" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128 24a104 104 0 0 0-16 206.8V158H86v-30h26v-23c0-26 15.4-40 39-40 11.3 0 23 2 23 2v25h-13c-12.8 0-16.8 8-16.8 16.2V128h28.6l-4.6 30H144v72.8A104 104 0 0 0 128 24z" />
    </svg>
  );
}

// `.fx` = hover wash (::before opacity) + press nudge; colours swap instantly.
const actionBase =
  'fx inline-flex h-9 w-full min-w-0 items-center justify-center gap-1.5 rounded-md border px-2 text-xs leading-none font-medium whitespace-nowrap no-underline select-none';

const actionTone = {
  primary: 'border-accent bg-accent text-white [--fx-inset:-1px]',
  neutral: 'border-transparent bg-neutral-100 text-ink/72 [--fx-inset:-1px]',
} as const;

const actionHover = {
  primary: 'hover:text-white active:text-white [--fx-bg:var(--color-accent-600)] [--fx-press:var(--color-accent-700)]',
  neutral: 'hover:text-ink [--fx-bg:var(--color-neutral-200)] [--fx-press:var(--color-neutral-300)]',
} as const;

interface CardActionProps {
  href: string;
  label: string;
  icon: ReactNode;
  tone: keyof typeof actionTone;
  gameSlug: string;
  kind: 'homepage' | 'fanpage';
  t: Pick<Dictionary, 'newTab'>;
  large?: boolean;
}

/** One card button: external anchor (new tab). Missing links are never rendered (no dead / greyed buttons). */
function CardAction({ href, label, icon, tone, gameSlug, kind, t, large = false }: CardActionProps) {
  // `!` wins over actionBase's h-9 / w-full / px-2 / text-xs.
  const size = large ? 'h-11! w-auto! px-5! text-sm!' : '';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="game_link"
      data-game={gameSlug}
      data-kind={kind}
      className={cn(actionBase, size, actionTone[tone], actionHover[tone])}
    >
      {icon}
      <span className="truncate">{label}</span>
      <span className="sr-only"> {t.newTab}</span>
    </a>
  );
}

/**
 * Resolved card links: the game's own homepage (hidden when unknown) and its
 * fanpage, falling back to the company fanpage so every card has a live action.
 * When only the fanpage remains it becomes the (accent) primary button.
 */
function CardActions({ game, t, large = false }: { game: Game; t: Dictionary; large?: boolean }) {
  const homepage = game.links.homepage;
  const fanpage = game.links.fanpage ?? fanpageUrl;
  return (
    <>
      {homepage ? (
        <CardAction
          href={homepage}
          label={t.gameSite}
          icon={<HouseIcon />}
          tone="primary"
          gameSlug={game.slug}
          kind="homepage"
          t={t}
          large={large}
        />
      ) : null}
      <CardAction
        href={fanpage}
        label={t.fanpage}
        icon={<FacebookIcon />}
        tone={homepage ? 'neutral' : 'primary'}
        gameSlug={game.slug}
        kind="fanpage"
        t={t}
        large={large}
      />
    </>
  );
}

/**
 * Game card (design v2): 4:3 cover, status badge (MỚI / Sắp ra mắt / HOT), name,
 * genre + platform chips, 2 buttons "Trang chủ game" (accent) + "Fanpage" (neutral).
 * Hover: `.card-lift` (translateY -6px + glow ring on ::after, opacity only) + cover zoom.
 */
export function GameCard(props: GameCardProps) {
  if (props.variant === 'spotlight') return <GameSpotlight {...props} />;
  const { game, locale, preload = false, headingLevel = 'h3', sizes, className } = props;
  const t = getDictionary(locale);
  const Heading = headingLevel;
  const tags = getGameTags(game, locale);
  const focal = game.cover.focal;

  return (
    <article
      className={cn(
        // Lift -6px + accent glow ring on ::after (opacity only) - shared `.card-lift`.
        'card-lift group flex h-full flex-col gap-2 rounded-xl bg-surface p-2 shadow-sm [--lift:-6px]',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-100">
        <Image
          src={game.cover.src}
          alt={pick(game.cover.alt, locale) || game.name}
          fill
          preload={preload}
          sizes={sizes ?? '(min-width: 1248px) 285px, (min-width: 640px) 46vw, 92vw'}
          quality={75}
          className="media-zoom object-cover"
          style={focal ? { objectPosition: `${focal.x}% ${focal.y}%` } : undefined}
        />
        <StatusTag
          status={game.status}
          label={statusLabel(game.status, t)}
          className="pointer-events-none absolute top-2 left-2"
        />
      </div>

      <div className="flex flex-col gap-1.5 px-1 pt-0.5">
        <Heading className="m-0 truncate text-base leading-snug font-medium tracking-normal text-ink" title={game.name}>
          {game.name}
        </Heading>
        {tags.length ? (
          <ul className="m-0 flex list-none flex-wrap gap-1 p-0" role="list">
            {tags.map((name) => (
              <li key={name}>
                <Tag className="px-[7px]! py-0.5! text-[10px]!">{name}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div
        className={cn(
          'relative z-10 mt-auto grid gap-1.5 pt-1',
          game.links.homepage ? 'grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]' : 'grid-cols-1',
        )}
      >
        <CardActions game={game} t={t} />
      </div>
    </article>
  );
}

/**
 * Wide single-game card: 16:9 key art (left, ~58%) + status, name, tags,
 * tagline, description and full-size buttons (right). Same lift/zoom hover
 * as the grid card. Stacks image-over-copy under 768px.
 */
function GameSpotlight({ game, locale, preload = false, headingLevel = 'h3', sizes, className }: GameCardProps) {
  const t = getDictionary(locale);
  const Heading = headingLevel;
  const tags = getGameTags(game, locale);
  const art = game.keyArt ?? game.cover;
  const focal = art.focal;

  return (
    <article
      className={cn(
        'card-lift group grid h-full grid-cols-1 gap-5 rounded-xl bg-surface p-2 shadow-sm [--lift:-4px] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-8 md:p-3',
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={art.src}
          alt={pick(art.alt, locale) || game.name}
          fill
          preload={preload}
          sizes={sizes ?? '(min-width: 1248px) 680px, (min-width: 768px) 56vw, 92vw'}
          quality={80}
          className="media-zoom object-cover"
          style={focal ? { objectPosition: `${focal.x}% ${focal.y}%` } : undefined}
        />
        <StatusTag
          status={game.status}
          label={statusLabel(game.status, t)}
          className="pointer-events-none absolute top-3 left-3"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-3 px-2 pb-3 md:px-0 md:py-4 md:pr-6">
        {tags.length ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" role="list">
            {tags.map((name) => (
              <li key={name}>
                <Tag>{name}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
        <Heading className="m-0 text-2xl leading-tight font-medium tracking-[-0.02em] text-ink md:text-[32px]">
          {game.name}
        </Heading>
        <p className="m-0 text-base leading-relaxed font-medium text-ink/80 text-pretty">
          {pick(game.tagline, locale)}
        </p>
        <p className="m-0 text-sm leading-relaxed text-ink/64 text-pretty">{pick(game.description, locale)}</p>
        <div className="relative z-10 mt-2 flex flex-wrap gap-2">
          <CardActions game={game} t={t} large />
        </div>
      </div>
    </article>
  );
}
