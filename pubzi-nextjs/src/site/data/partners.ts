/**
 * Partners - home page logo grid (MOCK). 10 placeholder SVG logos in
 * public/site/partners/partner-XX.svg (200x48, monochrome purple-grey).
 * Render SVGs with next/image `unoptimized` (SVG is not optimised) or a plain <img>.
 * TODO(company): replace with the 10 real partner logos + URLs.
 */
import type { Partner } from '../lib/types';

const NAMES = [
  'Nova Studio',
  'Kirin Games',
  'Lotus Pay',
  'Orbit Cloud',
  'Pixel Forge',
  'Zenith Media',
  'Aurora Labs',
  'Titan Play',
  'Mekong Net',
  'Sakura Ent.',
] as const;

export const partners: Partner[] = NAMES.map((name, i) => {
  const id = `partner-${String(i + 1).padStart(2, '0')}`;
  return {
    id,
    name,
    logo: { src: `/site/partners/${id}.svg`, width: 200, height: 48, alt: name },
    url: null,
  };
});
