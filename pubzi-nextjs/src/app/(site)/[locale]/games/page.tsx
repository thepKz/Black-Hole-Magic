import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GamesBrowser, type GamesBrowserItem } from '@site/components/games/GamesBrowser';
import { Container } from '@site/components/ui/Container';
import { GameCard } from '@site/components/ui/GameCard';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { genres as allGenres, getGames, getGenresWithCount } from '@site/data/games';
import { absoluteUrl, getDictionary, href, isLocale, pick, type Locale } from '@site/i18n';
import { breadcrumbList, buildMetadata, JsonLd, ORGANIZATION_ID, toAbsolute, type JsonLdObject } from '@site/lib/seo';

interface GamesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GamesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: '/games', title: t.metaGamesTitle, description: t.metaGamesDesc });
}

const platformNames = { pc: 'PC', ios: 'iOS', android: 'Android', h5: 'Web (H5)' } as const;

function gamesItemList(locale: Locale, title: string): JsonLdObject {
  const games = getGames();
  const pageUrl = absoluteUrl(href(locale, '/games'));
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    url: pageUrl,
    numberOfItems: games.length,
    itemListElement: games.map((game, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'VideoGame',
        '@id': `${pageUrl}#${game.slug}`,
        name: game.name,
        description: pick(game.description, locale),
        image: toAbsolute(game.cover.src),
        genre: game.genres
          .map((slug) => allGenres.find((g) => g.slug === slug))
          .filter((g): g is NonNullable<typeof g> => Boolean(g))
          .map((g) => pick(g.name, locale)),
        gamePlatform: game.platforms.map((p) => platformNames[p]),
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: locale === 'vi' ? 'vi-VN' : 'en',
        ...(game.links.homepage && /^https?:/i.test(game.links.homepage) ? { url: game.links.homepage } : {}),
      },
    })),
  };
}

export default async function GamesPage({ params }: GamesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const games = getGames();
  const items: GamesBrowserItem[] = games.map((game, i) => ({
    slug: game.slug,
    name: game.name,
    keywords: game.code,
    genres: game.genres,
    // First row (up to 4 on desktop) is above the fold.
    card: <GameCard game={game} locale={locale} preload={i === 0} headingLevel="h2" />,
  }));

  return (
    <main id="main" tabIndex={-1} className="section-b pt-8 outline-none md:pt-12">
      <Container>
        <SectionHeading as="h1" kicker={t.gamesKicker} title={t.allGames} description={t.gamesSubtitle} />
        <GamesBrowser
          items={items}
          genres={getGenresWithCount(locale)}
          labels={{
            all: t.all,
            genreFilter: t.genreFilter,
            searchGame: t.searchGame,
            clearSearch: t.clearSearch,
            gamesCount: t.gamesCount,
            resultsFor: t.resultsFor,
            loadMore: t.loadMore,
            emptyTitle: t.emptyTitle,
            emptyDesc: t.emptyDesc,
            clearFilters: t.clearFilters,
          }}
        />
      </Container>
      <JsonLd
        data={[
          breadcrumbList(locale, [{ name: t.home, path: '/' }, { name: t.allGames }]),
          gamesItemList(locale, t.allGames),
        ]}
      />
    </main>
  );
}
