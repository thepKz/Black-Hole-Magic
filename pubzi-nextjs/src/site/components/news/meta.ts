import { href, type Locale } from '@site/i18n';
import type { NewsDetail, NewsImage } from '@site/lib/types';

/** Locale-less article path. */
export const articlePath = (slug: string) => `/news/${slug}`;

/** Auto-generated OG image route (src/app/(site)/[locale]/news/[slug]/og.png/route.tsx). */
export const generatedOgPath = (locale: Locale, slug: string) => href(locale, `/news/${slug}/og.png`);

function bestOg(img: NewsImage | null | undefined) {
  if (!img) return null;
  const s = img.sizes.og ?? img.sizes.news ?? { src: img.src, width: img.width, height: img.height };
  return { src: s.src, width: s.width, height: s.height, alt: img.alt };
}

/**
 * Social image for an article: SEO tab image -> cover (og 1200x630 crop) ->
 * auto-generated next/og card (title + category on the brand gradient).
 */
export function articleOgImage(post: NewsDetail, locale: Locale) {
  return (
    bestOg(post.seo?.image) ??
    bestOg(post.cover) ?? { src: generatedOgPath(locale, post.slug), width: 1200, height: 630, alt: post.title }
  );
}

/** Image list for NewsArticle JSON-LD (16:9 first, then the OG crop). */
export function articleJsonLdImages(post: NewsDetail, locale: Locale): string[] {
  const out = new Set<string>();
  const cover = post.cover;
  if (cover) {
    out.add((cover.sizes.news ?? cover).src);
    if (cover.sizes.og) out.add(cover.sizes.og.src);
  }
  if (post.seo?.image) out.add((post.seo.image.sizes.og ?? post.seo.image).src);
  if (!out.size) out.add(generatedOgPath(locale, post.slug));
  return [...out];
}
