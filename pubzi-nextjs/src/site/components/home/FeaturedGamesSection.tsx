import { ArrowRightIcon } from '@phosphor-icons/react/ssr';

import { reveal } from '@site/components/motion';
import { Button } from '@site/components/ui/Button';
import { Container } from '@site/components/ui/Container';
import { GameCard } from '@site/components/ui/GameCard';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { getFeaturedGames } from '@site/data/games';
import { getDictionary, href, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/**
 * "Game nổi bật": title + accent bar + "Xem tất cả game →" (design v2 section
 * header), up to 4 featured games with the same GameCard as /games.
 * < 640px: CSS-only snap rail (cards 78% wide, next one peeks);
 * >= 640px: 2 columns; >= 1024px: 4 columns. Cards rise in with a stagger.
 */
export function FeaturedGamesSection({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  const games = getFeaturedGames(4);
  if (!games.length) return null;

  const viewAll = (
    <Button variant="secondary" href={href(locale, '/games')} className="group/va">
      {/* "Xem tất cả game" / "View all games" */}
      {`${t.viewAll} ${t.games.toLowerCase()}`}
      <ArrowRightIcon
        className="size-4 transition-transform duration-(--dur-2) ease-standard group-hover/va:translate-x-0.5"
        weight="bold"
        aria-hidden="true"
      />
    </Button>
  );

  return (
    <section aria-labelledby="home-games-title" className={cn('section-b', className)}>
      <Container>
        <div {...reveal(0, 'fade')}>
          <SectionHeading
            id="home-games-title"
            title={t.featuredGames}
            action={<div className="hidden sm:flex">{viewAll}</div>}
          />
        </div>
        {/*
          Vertical padding leaves room for the hover lift / glow. Each card
          reveals with a stagger. Inside the phone rail (a horizontal
          scroller) the CSS view timeline is inactive, so the cards there are
          simply shown - nothing hides inside a sideways scroller.
        */}
        {games.length === 1 ? (
          // One published game: a wide spotlight card instead of a lonely grid cell.
          <div className="py-2" {...reveal(1)}>
            <GameCard game={games[0]} locale={locale} variant="spotlight" />
          </div>
        ) : (
          <ul
            role="list"
            className={cn(
              'scrollbar-none m-0 -mx-[var(--gutter)] grid list-none auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain px-[var(--gutter)] py-2',
              'snap-x snap-mandatory scroll-px-[var(--gutter)]',
              'sm:mx-0 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4',
            )}
          >
            {games.map((game, i) => (
              <li key={game.slug} className="flex min-w-0 snap-start" {...reveal(i + 1)}>
                <GameCard
                  game={game}
                  locale={locale}
                  className="w-full"
                  sizes="(min-width: 1248px) 285px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 78vw"
                />
              </li>
            ))}
          </ul>
        )}
        {/* Mobile: full-width "view all" under the rail (thumb-reachable). */}
        <div className="mt-6 flex justify-center sm:hidden">{viewAll}</div>
      </Container>
    </section>
  );
}
