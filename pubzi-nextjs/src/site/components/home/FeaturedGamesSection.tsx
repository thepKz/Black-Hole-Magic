import { ArrowRightIcon } from '@phosphor-icons/react/ssr';

import { Button } from '@site/components/ui/Button';
import { Container } from '@site/components/ui/Container';
import { GameCard } from '@site/components/ui/GameCard';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { getFeaturedGames } from '@site/data/games';
import { getDictionary, href, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/** "Game nổi bật": up to 4 featured games (2 cols mobile, 4 cols >= 1024) + link to /{l}/games. */
export function FeaturedGamesSection({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  const games = getFeaturedGames(4);
  if (!games.length) return null;

  const viewAll = (
    <Button variant="secondary" href={href(locale, '/games')} className="group/va">
      {/* "Xem tất cả game" / "View all games" */}
      {`${t.viewAll} ${t.games.toLowerCase()}`}
      <ArrowRightIcon
        className="size-4 transition-transform duration-200 ease-out-soft group-hover/va:translate-x-0.5"
        weight="bold"
        aria-hidden="true"
      />
    </Button>
  );

  return (
    <section aria-labelledby="home-games-title" className={cn('section-b', className)}>
      <Container>
        <SectionHeading
          id="home-games-title"
          kicker={t.featuredKicker}
          title={t.featuredGames}
          description={t.gamesSubtitle}
          action={<div className="hidden sm:flex">{viewAll}</div>}
        />
        <ul role="list" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {games.map((game) => (
            <li key={game.slug} className="flex min-w-0">
              <GameCard
                game={game}
                locale={locale}
                className="w-full"
                sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, 48vw"
              />
            </li>
          ))}
        </ul>
        {/* Mobile: full-width "view all" under the grid (thumb-reachable). */}
        <div className="mt-6 flex justify-center sm:hidden">{viewAll}</div>
      </Container>
    </section>
  );
}
