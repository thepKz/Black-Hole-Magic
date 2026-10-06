/**
 * Home banner slider (MOCK - typed). The slider shows banners 9:4 on desktop
 * and 16:9 on mobile with object-fit: cover and
 * `object-position: ${focal.x}% ${focal.y}%`.
 * Only the Kiếm Thế banner is shown (user decision) — don't add the game key
 * art or the Genshin art back. The artwork already has its copy painted in, so
 * NO HTML title/subtitle/CTA overlay is set; the slider renders the overlay only
 * when `title` is present.
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
      // 16:9 source shown 9:4 on desktop: keep the top so both faces stay in frame.
      focal: { x: 60, y: 18 },
    },
    href: '/games',
  },
];
