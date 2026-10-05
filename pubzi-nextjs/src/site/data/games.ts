/**
 * Games (MOCK - typed). The 5 real titles from the legacy /v2 game page.
 * Art: public/site/games/{slug}.webp (4:3 1200x900), {slug}-wide.webp (16:9
 * 1400x788), {slug}-poster.webp (600x750).
 * TODO(company): real homepage / fanpage / store / H5 links per game.
 */
import type { Game, Genre, Locale, ResolvedCta } from '../lib/types';

export const genres: Genre[] = [
  { slug: 'mmorpg', name: { vi: 'MMORPG', en: 'MMORPG' } },
  { slug: 'kiem-hiep', name: { vi: 'Kiếm hiệp', en: 'Wuxia' } },
  { slug: 'nhap-vai', name: { vi: 'Nhập vai', en: 'RPG' } },
  { slug: 'hanh-dong', name: { vi: 'Hành động', en: 'Action' } },
];

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

const noLinks = {
  homepage: null,
  fanpage: null,
  play: null,
  preregister: null,
  appStore: null,
  googlePlay: null,
  pcDownload: null,
};

export const games: Game[] = [
  {
    slug: 'vo-lam-truyen-ky-2',
    name: 'Võ Lâm Truyền Kỳ 2',
    code: 'VLTK2',
    genres: ['mmorpg', 'kiem-hiep'],
    status: 'hot',
    release: { vi: 'Đang vận hành', en: 'Live' },
    platforms: ['pc'],
    tagline: {
      vi: 'Giang hồ vẫn đông như ngày đó. Bang hội, công thành, săn boss mỗi tối.',
      en: 'The martial world is as crowded as ever. Guilds, sieges and boss hunts every night.',
    },
    description: {
      vi: 'Kiếm hiệp MMORPG dành cho ai mê chiến trường đông và muốn có anh em chinh chiến cùng: bang hội, công thành, boss thế giới.',
      en: 'A wuxia MMORPG for players who love crowded battlefields and fighting alongside friends: guilds, sieges and world bosses.',
    },
    ...img('vo-lam-truyen-ky-2', 'Võ Lâm Truyền Kỳ 2'),
    accent: '#B79CFF',
    links: { ...noLinks },
    ctaType: 'auto',
    featured: true,
    order: 1,
  },
  {
    slug: 'thien-long-bat-bo',
    name: 'Thiên Long Bát Bộ',
    code: 'TLBB',
    genres: ['mmorpg', 'kiem-hiep'],
    status: 'new',
    release: { vi: '2026', en: '2026' },
    platforms: ['pc', 'android', 'ios'],
    tagline: {
      vi: 'Thiên Long trở lại. Vẫn môn phái đó, giờ chơi được cả trên điện thoại.',
      en: 'Thiên Long is back. The same sects, now playable on your phone too.',
    },
    description: {
      vi: 'MMORPG võ hiệp cho ai muốn chơi lại huyền thoại mà không phải ngồi mãi bên máy: môn phái, PvP lớn, đồng bộ PC & Mobile.',
      en: 'A martial-arts MMORPG for players who want the legend back without being tied to a desk: sects, large-scale PvP, PC & mobile cross-play.',
    },
    ...img('thien-long-bat-bo', 'Thiên Long Bát Bộ'),
    accent: '#F2D18A',
    links: { ...noLinks },
    ctaType: 'auto',
    featured: true,
    order: 2,
  },
  {
    slug: 'kiem-the',
    name: 'Kiếm Thế',
    code: 'KT',
    genres: ['nhap-vai', 'kiem-hiep'],
    status: 'soon',
    release: { vi: 'Sắp mở', en: 'Coming soon' },
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
    ctaType: 'auto',
    featured: true,
    order: 3,
  },
  {
    slug: 'tieu-ngao-giang-ho',
    name: 'Tiếu Ngạo Giang Hồ',
    code: 'TNGH',
    genres: ['hanh-dong', 'nhap-vai'],
    status: 'soon',
    release: { vi: 'Sắp mở', en: 'Coming soon' },
    platforms: ['pc'],
    tagline: {
      vi: 'Combo tay nhanh, phe phái rõ ràng. Giang hồ đúng chất phim kiếm hiệp.',
      en: 'Fast combos, clear factions. A martial world straight out of a wuxia film.',
    },
    description: {
      vi: 'Hành động nhập vai cho game thủ thích đánh đấm có kỹ năng, không chỉ bấm auto: combo võ học, thế lực, chiến trường.',
      en: 'An action RPG for players who want skill-based combat, not auto-play: martial combos, factions and battlefields.',
    },
    ...img('tieu-ngao-giang-ho', 'Tiếu Ngạo Giang Hồ'),
    accent: '#9DE6C7',
    links: { ...noLinks },
    ctaType: 'auto',
    featured: true,
    order: 4,
  },
  {
    slug: 'con-duong-to-lua',
    name: 'Con Đường Tơ Lụa',
    code: 'SRO',
    genres: ['mmorpg'],
    status: 'soon',
    release: { vi: 'Sắp mở', en: 'Coming soon' },
    platforms: ['pc'],
    tagline: {
      vi: 'Buôn lụa hay cướp lụa? Mỗi chuyến hàng là một canh bạc.',
      en: 'Trade silk or steal it? Every caravan is a gamble.',
    },
    description: {
      vi: 'MMORPG thương lộ cho dân thích vai trò xã hội, buôn bán và phục kích nhau trên đường: buôn bán, cướp đường, bảo tiêu.',
      en: 'A trade-route MMORPG for players who love social roles, trading and ambushes: merchants, thieves and escorts.',
    },
    ...img('con-duong-to-lua', 'Con Đường Tơ Lụa'),
    accent: '#FFB86B',
    links: { ...noLinks },
    ctaType: 'auto',
    featured: false,
    order: 5,
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

/** Genres with the number of games in each (chips "MMO 3"), only non-empty ones. */
export function getGenresWithCount(locale: Locale): { slug: string; name: string; count: number }[] {
  return genres
    .map((g) => ({
      slug: g.slug,
      name: g.name[locale],
      count: games.filter((game) => game.genres.includes(g.slug)).length,
    }))
    .filter((g) => g.count > 0);
}

/**
 * Primary CTA of a game card:
 * - ctaType override wins, else
 * - status 'soon'        -> preregister (preregister link, else homepage)
 * - platform includes h5 -> play (H5 link, else homepage)
 * - otherwise            -> download (store links; popover when > 1, else homepage)
 * `href` null means the button renders disabled ("coming soon").
 */
export function resolveGameCta(game: Game): ResolvedCta {
  const { links } = game;
  const kind =
    game.ctaType !== 'auto'
      ? game.ctaType
      : game.status === 'soon'
        ? 'preregister'
        : game.platforms.includes('h5')
          ? 'play'
          : 'download';

  const stores: ResolvedCta['stores'] = [];
  if (kind === 'download') {
    if (links.appStore) stores.push({ platform: 'ios', href: links.appStore });
    if (links.googlePlay) stores.push({ platform: 'android', href: links.googlePlay });
    if (links.pcDownload) stores.push({ platform: 'pc', href: links.pcDownload });
  }

  const href =
    kind === 'preregister'
      ? (links.preregister ?? links.homepage)
      : kind === 'play'
        ? (links.play ?? links.homepage)
        : (stores.length === 1 ? stores[0].href : null) ?? links.homepage;

  return { kind, href: href ?? null, stores: stores.length > 1 ? stores : [], external: Boolean(href && /^https?:/i.test(href)) };
}
