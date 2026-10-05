/**
 * Games (MOCK - typed). The 5 real titles from the legacy /v2 game page.
 * Art: public/site/games/{slug}.webp (4:3 1200x900), {slug}-wide.webp (16:9
 * 1400x788), {slug}-poster.webp (600x750).
 *
 * Cards only link out to the game's own homepage and fanpage (no download /
 * play / pre-register flows on the publisher site).
 * TODO(company): real homepage / fanpage URL per game. null homepage = button
 * hidden; null fanpage = falls back to the company fanpage (site.fanpageUrl).
 */
import type { Game, Genre, Locale, Platform } from '../lib/types';

/** Gameplay genres (filter chips + card tags). */
export const genres: Genre[] = [
  { slug: 'mmo', name: { vi: 'MMO', en: 'MMO' } },
  { slug: 'kiem-hiep', name: { vi: 'Kiếm hiệp', en: 'Wuxia' } },
  { slug: 'nhap-vai', name: { vi: 'Nhập vai', en: 'RPG' } },
  { slug: 'chien-thuat', name: { vi: 'Chiến thuật', en: 'Strategy' } },
];

/** Platform tags derived from `game.platforms` (iOS/Android/H5 collapse into "Mobile"/"Web"). */
export const platformTags: Genre[] = [
  { slug: 'pc', name: { vi: 'PC', en: 'PC' } },
  { slug: 'mobile', name: { vi: 'Mobile', en: 'Mobile' } },
  { slug: 'web', name: { vi: 'Web', en: 'Web' } },
];

const platformTagOf: Record<Platform, string> = { pc: 'pc', ios: 'mobile', android: 'mobile', h5: 'web' };

const img = (slug: string, name: string) => ({
  cover: {
    src: `/site/games/${slug}.webp`,
    width: 1200,
    height: 900,
    alt: { vi: `${name} - ảnh game`, en: `${name} - game art` },
  },
  keyArt: {
    src: `/site/games/${slug}-wide.webp`,
    width: 1400,
    height: 788,
    alt: { vi: `${name} - ảnh bìa`, en: `${name} - key art` },
  },
  poster: {
    src: `/site/games/${slug}-poster.webp`,
    width: 600,
    height: 750,
    alt: { vi: `${name} - poster`, en: `${name} - poster` },
  },
});

const noLinks = { homepage: null, fanpage: null };

// Only Kiếm Thế is published for now (user decision). The other titles
// (VLTK2, TLBB, Tiếu Ngạo Giang Hồ, Con Đường Tơ Lụa) are in git history
// (commit b8a3090) and can be restored when they launch.
export const games: Game[] = [
  {
    slug: 'kiem-the',
    name: 'Kiếm Thế',
    code: 'KT',
    genres: ['nhap-vai', 'kiem-hiep'],
    status: 'new',
    release: { vi: 'Mới ra mắt', en: 'Just launched' },
    platforms: ['pc'],
    tagline: {
      vi: 'Tống Kim 9 giờ tối, cả server lao vào nhau. Bạn đứng phe nào?',
      en: 'Song vs Jin at 9 PM, the whole server clashes. Which side are you on?',
    },
    description: {
      vi: 'Nhập vai võ hiệp cho dân máu chiến, thích PvP nhanh và mỗi tối một trận lớn: Tống Kim, gia tộc, PvP phe phái.',
      en: 'A martial-arts RPG for fighters who love fast PvP and a big battle every night: Song-Jin war, clans and faction PvP.',
    },
    ...img('kiem-the', 'Kiếm Thế'),
    accent: '#8FD7FF',
    links: { ...noLinks },
    featured: true,
    order: 1,
  },
];

/** Games sorted by `order`. */
export function getGames(): Game[] {
  return [...games].sort((a, b) => a.order - b.order);
}

/** Featured games for the home page (max `limit`). */
export function getFeaturedGames(limit = 4): Game[] {
  return getGames().filter((g) => g.featured).slice(0, limit);
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

/** Genre slugs followed by platform tag slugs of a game ("mmo", "kiem-hiep", "pc", "mobile"). */
export function getGameTagSlugs(game: Game): string[] {
  const platforms = [...new Set(game.platforms.map((p) => platformTagOf[p]))];
  return [...game.genres, ...platformTags.map((t) => t.slug).filter((slug) => platforms.includes(slug))];
}

/** Localized tag names of a game for the card ("MMO", "Kiếm hiệp", "PC", "Mobile"). */
export function getGameTags(game: Game, locale: Locale): string[] {
  const all = [...genres, ...platformTags];
  return getGameTagSlugs(game)
    .map((slug) => all.find((t) => t.slug === slug)?.name[locale])
    .filter((name): name is string => Boolean(name));
}

/**
 * Filter chips with counts ("MMO 3"): genres first, then platform tags. Empty tags
 * and tags matching every game (e.g. "PC" when all titles are on PC) are dropped,
 * since they would filter nothing.
 */
export function getGenresWithCount(locale: Locale): { slug: string; name: string; count: number }[] {
  const total = games.length;
  const withCount = (list: Genre[]) =>
    list.map((t) => ({
      slug: t.slug,
      name: t.name[locale],
      count: games.filter((game) => getGameTagSlugs(game).includes(t.slug)).length,
    }));
  return [
    ...withCount(genres).filter((t) => t.count > 0),
    ...withCount(platformTags).filter((t) => t.count > 0 && t.count < total),
  ];
}
