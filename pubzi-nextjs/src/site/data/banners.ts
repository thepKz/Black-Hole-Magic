/**
 * Home banner slider (MOCK - typed). Sources are 16:9 (1672x941); the slider
 * shows them 8:3 on desktop and 16:9 on mobile with object-fit: cover and
 * `object-position: ${focal.x}% ${focal.y}%`.
 * All 4 artworks already have the game logo / copy painted in, so NO HTML
 * title/subtitle/CTA overlay is set (it would duplicate and cover the logo).
 * Only set `title` (+ subtitle / ctaLabel) on art without text; the slider
 * renders the overlay only when `title` is present.
 * TODO(company): export final banners at 1920x720 with a safe area.
 */
import type { Banner } from '../lib/types';

const SRC_W = 1672;
const SRC_H = 941;

export const banners: Banner[] = [
  {
    id: 'banner-01',
    image: {
      src: '/site/banners/banner-01.webp',
      width: SRC_W,
      height: SRC_H,
      alt: {
        vi: 'Black Hole Game - thế giới kiếm hiệp',
        en: 'Black Hole Game - the martial-arts world',
      },
      focal: { x: 50, y: 58 },
    },
    href: '/games',
  },
  {
    // Already 8:3 (1999x728), so it fits the desktop slot almost uncropped.
    id: 'banner-genshin',
    image: {
      src: '/site/banners/banner-02-genshin.webp',
      width: 1999,
      height: 728,
      alt: { vi: 'Genshin Impact', en: 'Genshin Impact' },
      // 30% keeps both the logo and the main character in the 16:9 mobile crop.
      focal: { x: 30, y: 50 },
    },
    href: '/games',
  },
  {
    id: 'banner-02',
    gameSlug: 'vo-lam-truyen-ky-2',
    image: {
      src: '/site/banners/banner-02.webp',
      width: SRC_W,
      height: SRC_H,
      alt: { vi: 'Võ Lâm Truyền Kỳ 2', en: 'Võ Lâm Truyền Kỳ 2' },
      focal: { x: 50, y: 40 },
    },
    href: '/games',
  },
  {
    id: 'banner-03',
    gameSlug: 'thien-long-bat-bo',
    image: {
      src: '/site/banners/banner-03.webp',
      width: SRC_W,
      height: SRC_H,
      alt: { vi: 'Thiên Long Bát Bộ', en: 'Thiên Long Bát Bộ' },
      focal: { x: 50, y: 40 },
    },
    href: '/games',
  },
  {
    id: 'banner-04',
    gameSlug: 'kiem-the',
    image: {
      src: '/site/banners/banner-04.webp',
      width: SRC_W,
      height: SRC_H,
      alt: { vi: 'Kiếm Thế', en: 'Kiếm Thế' },
      focal: { x: 50, y: 40 },
    },
    href: '/games',
  },
];
