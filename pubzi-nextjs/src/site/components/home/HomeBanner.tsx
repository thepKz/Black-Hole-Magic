import { banners } from '@site/data/banners';
import { format, getDictionary, href, pick, type Locale } from '@site/i18n';
import type { SiteImage } from '@site/lib/types';
import { BannerSlider, type BannerSlide, type BannerSlideImage } from './BannerSlider';

const isAbsolute = (url: string) => /^(https?:)?\/\//i.test(url);

const toSlideImage = (img: SiteImage): BannerSlideImage => ({
  src: img.src,
  width: img.width,
  height: img.height,
  focal: img.focal,
});

/**
 * Server wrapper: localizes the typed mock banners (src/site/data/banners.ts)
 * and labels, then hands plain props to the client <BannerSlider>.
 * Dictionaries never reach the client bundle.
 */
export function HomeBanner({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const total = banners.length;

  const slides: BannerSlide[] = banners.map((b) => ({
    id: b.id,
    href: b.href ? href(locale, b.href) : null,
    external: b.href ? isAbsolute(b.href) : false,
    alt: pick(b.image.alt, locale) || (b.title ? pick(b.title, locale) : ''),
    title: b.title ? pick(b.title, locale) : undefined,
    subtitle: b.subtitle ? pick(b.subtitle, locale) : undefined,
    ctaLabel: b.ctaLabel ? pick(b.ctaLabel, locale) : undefined,
    gameSlug: b.gameSlug,
    image: toSlideImage(b.image),
    mobileImage: b.mobileImage ? toSlideImage(b.mobileImage) : undefined,
  }));

  // Boxed inside the 1200 container (not full-bleed): 9:4 on >= 768
  // (1200x533 at full container width), 16:9 on mobile - see BannerSlider.
  // A full-bleed banner was ~720px tall on 1920 screens and swallowed the page.
  return (
    <div className="container-site pt-4 md:pt-6">
      <BannerSlider
        className="rounded-[10px] shadow-[0_0_0_1px_rgba(28,22,51,.06),0_14px_32px_-12px_rgba(28,22,51,.28)] md:rounded-[14px]"
        slides={slides}
        labels={{
          region: t.bannerRegion,
          prev: t.bannerPrev,
          next: t.bannerNext,
          pause: t.bannerPause,
          play: t.bannerPlay,
          newTab: t.newTab,
          goTo: banners.map((_, i) => format(t.bannerGoTo, { n: i + 1 })),
          slideOf: banners.map((_, i) => format(t.bannerSlideOf, { n: i + 1, total })),
        }}
      />
    </div>
  );
}
