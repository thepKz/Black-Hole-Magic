/**
 * Home banner slider (MOCK - typed). The slider shows banners 8:3 on desktop
 * and 16:9 on mobile with object-fit: cover and
 * `object-position: ${focal.x}% ${focal.y}%`.
 * Only these two banners are shown (user decision) — don't add the game key
 * art back. Both artworks already have their copy painted in, so NO HTML
 * title/subtitle/CTA overlay is set; the slider renders the overlay only when
 * `title` is present.
 * TODO(company): export final banners at 1920x720 with a safe area.
 */
import type { Banner } from '../lib/types';

export const banners: Banner[] = [
  {
    id: 'banner-01',
    gameSlug: 'kiem-the',
    image: {
      src: '/site/banners/banner-kiem-the.webp',
      width: 1672,
      height: 941,
      alt: { vi: 'Kiếm Thế', en: 'Kiếm Thế' },
      // 16:9 source shown 8:3 on desktop: keep the top so both faces stay in frame.
      focal: { x: 60, y: 18 },
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
];
