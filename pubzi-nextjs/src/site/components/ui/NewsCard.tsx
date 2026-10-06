import Image from 'next/image';
import Link from 'next/link';

import { format, getDictionary, href, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { NewsImage, NewsListItem } from '@site/lib/types';
import { formatDate } from './format';
import { Tag } from './Tag';

export interface NewsCardProps {
  item: NewsListItem;
  locale: Locale;
  /**
   * 'default'    - vertical card, 16:9 image, title 2 lines, excerpt 3 lines.
   * 'large'      - featured post (bigger title, 1200w image); span 2 cols in the grid yourself.
   * 'horizontal' - thumbnail left (related posts / sidebars); stacks under 640px.
   */
  variant?: 'default' | 'large' | 'horizontal';
  preload?: boolean;
  headingLevel?: 'h2' | 'h3';
  sizes?: string;
  className?: string;
}

function pickImage(cover: NewsImage, variant: NewsCardProps['variant']) {
  const s = variant === 'large' ? (cover.sizes.news ?? cover.sizes.card) : (cover.sizes.card ?? cover.sizes.news);
  return s ?? { src: cover.src, width: cover.width, height: cover.height };
}

/** Gradient placeholder when a post has no cover. */
function CoverFallback({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(60%_80%_at_85%_10%,rgb(24_214_242/.25),transparent_60%),radial-gradient(70%_90%_at_10%_100%,rgb(141_77_255/.55),transparent_65%),linear-gradient(125deg,#2a0f5c,#1a1446_45%,#0b1a3a)]"
    >
      <span className="px-4 text-center text-sm font-medium tracking-[0.12em] text-white/80 uppercase">{label ?? 'Black Hole Game'}</span>
    </div>
  );
}

/** News card (design v2). The title link is stretched over the whole card. */
export function NewsCard({ item, locale, variant = 'default', preload = false, headingLevel = 'h3', sizes, className }: NewsCardProps) {
  const t = getDictionary(locale);
  const Heading = headingLevel;
  const url = href(locale, `/news/${item.slug}`);
  const img = item.cover ? pickImage(item.cover, variant) : null;
  const horizontal = variant === 'horizontal';
  const large = variant === 'large';
  const defaultSizes = large
    ? '(min-width: 1280px) 800px, (min-width: 768px) 66vw, 100vw'
    : horizontal
      ? '(min-width: 640px) 240px, 100vw'
      : '(min-width: 1280px) 390px, (min-width: 768px) 50vw, 100vw';

  return (
    <article
      className={cn(
        'card-lift group flex rounded-xl bg-surface p-2.5 shadow-sm',
        horizontal ? 'flex-col gap-3 sm:flex-row sm:items-start sm:gap-4' : 'h-full flex-col gap-2 pb-[18px]',
        className,
      )}
    >
      <div
        className={cn(
          'relative aspect-video shrink-0 overflow-hidden rounded-md bg-neutral-100',
          horizontal ? 'w-full sm:w-[42%] sm:max-w-60' : 'mb-1.5 w-full',
          // Large card stretched by a taller sibling column (news featured block):
          // the image grows to fill the height instead of leaving a gap above "Chi tiết".
          large && 'lg:aspect-auto lg:min-h-80 lg:flex-1',
        )}
      >
        {item.cover && img ? (
          <Image
            src={img.src}
            alt={item.cover.alt || ''}
            fill
            preload={preload}
            sizes={sizes ?? defaultSizes}
            unoptimized={item.cover.unoptimized}
            className="media-zoom object-cover"
            style={{ objectPosition: `${item.cover.focal.x}% ${item.cover.focal.y}%` }}
          />
        ) : (
          <CoverFallback label={item.category?.name} />
        )}
        {item.category && !horizontal ? (
          <Tag tone="onImage" className="pointer-events-none absolute top-2.5 left-2.5">
            {item.category.name}
          </Tag>
        ) : null}
      </div>

      <div className={cn('flex min-w-0 flex-col gap-2', horizontal ? 'flex-1 sm:py-1' : large ? 'flex-1 px-1.5 lg:flex-none' : 'flex-1 px-1.5')}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
          {horizontal && item.category ? <span className="font-medium text-accent-600">{item.category.name}</span> : null}
          {horizontal && item.category ? <span aria-hidden="true" className="text-neutral-300">•</span> : null}
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt, locale)}</time>
          {item.readingTime > 0 ? (
            <>
              <span aria-hidden="true" className="text-neutral-300">•</span>
              <span>{format(t.readTime, { min: item.readingTime })}</span>
            </>
          ) : null}
        </div>

        <Heading
          className={cn(
            'm-0 line-clamp-2 font-medium tracking-[-0.01em] text-ink',
            large ? 'text-xl leading-snug md:text-2xl' : horizontal ? 'text-base leading-snug' : 'text-[17px] leading-[1.4]',
          )}
        >
          <Link
            href={url}
            className="text-inherit no-underline after:absolute after:inset-0 after:rounded-xl after:content-[''] group-hover:text-accent-700 hover:text-accent-700 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {item.title}
          </Link>
        </Heading>

        {item.excerpt && !horizontal ? (
          <p className={cn('m-0 text-sm leading-relaxed text-muted', large ? 'line-clamp-3 md:text-[15px]' : 'line-clamp-3')}>
            {item.excerpt}
          </p>
        ) : null}

        {!horizontal ? (
          <span
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-1 self-start border-b border-accent pt-1 text-[13px] font-medium text-link group-hover:text-accent-700"
          >
            {t.detail}
          </span>
        ) : null}
      </div>
    </article>
  );
}
