import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, PencilSimpleIcon } from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import Link from 'next/link';

import { reveal } from '@site/components/motion';
import { formatDate } from '@site/components/ui/format';
import { NewsCard } from '@site/components/ui/NewsCard';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { Tag } from '@site/components/ui/Tag';
import { format, getDictionary, href, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { NewsDetail, NewsListItem } from '@site/lib/types';

import type { AdjacentPosts } from './adjacent';
import { FadeImage } from './FadeImage';
import { newsStrings } from './strings';

const DAY = 24 * 60 * 60 * 1000;

/** Category tag + date + reading time, H1 (40px), lead (18px), author + "updated" line. */
export function ArticleHeader({ post, locale, titleId }: { post: NewsDetail; locale: Locale; titleId?: string }) {
  const t = getDictionary(locale);
  const updated =
    new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > DAY ? post.updatedAt : null;
  const initials = post.author?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] text-subtle">
        {post.category ? (
          <Link
            href={href(locale, `/news?cat=${encodeURIComponent(post.category.slug)}`)}
            className="no-underline transition-opacity hover:opacity-80"
          >
            <Tag tone="accent">{post.category.name}</Tag>
          </Link>
        ) : null}
        <time dateTime={post.publishedAt} className="text-accent-600">
          {formatDate(post.publishedAt, locale, 'long')}
        </time>
        <span aria-hidden="true" className="text-neutral-300">
          •
        </span>
        <span className="inline-flex items-center gap-1">
          <ClockIcon className="size-3.5" aria-hidden="true" weight="bold" />
          {format(t.readTime, { min: post.readingTime })}
        </span>
      </div>

      <h1 id={titleId} className="m-0 text-[28px] leading-[1.22] tracking-[-0.02em] text-ink text-pretty md:text-[34px] lg:text-[40px] lg:leading-[1.18]">
        {post.title}
      </h1>

      {post.excerpt ? <p className="m-0 text-[17px] leading-relaxed text-muted text-pretty md:text-lg">{post.excerpt}</p> : null}

      {post.author || updated ? (
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-divider pt-4 text-[13px] text-subtle">
          {post.author ? (
            <span className="inline-flex items-center gap-2.5">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar.sizes.thumb?.src ?? post.author.avatar.src}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-full bg-accent-100 text-xs font-medium text-accent-800"
                >
                  {initials || 'BH'}
                </span>
              )}
              <span className="font-medium text-ink/85">{format(t.byAuthor, { name: post.author.name })}</span>
            </span>
          ) : null}
          {updated ? (
            <span className="inline-flex items-center gap-1.5">
              <PencilSimpleIcon className="size-3.5" aria-hidden="true" weight="bold" />
              <time dateTime={updated}>{format(t.updatedOn, { date: formatDate(updated, locale, 'long') })}</time>
            </span>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

/** 16:9 cover (preloaded LCP image) with optional caption. Fades in when it was not ready at hydration (client navigation). */
export function ArticleCover({ post }: { post: NewsDetail }) {
  const cover = post.cover;
  if (!cover) return null;
  const img = cover.sizes.news ?? { src: cover.src, width: cover.width, height: cover.height };
  return (
    <figure className="m-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
        <FadeImage
          src={img.src}
          alt={cover.alt || post.title}
          fill
          preload
          sizes="(min-width: 800px) 760px, calc(100vw - 32px)"
          className="object-cover"
          style={{ objectPosition: `${cover.focal.x}% ${cover.focal.y}%` }}
        />
      </div>
      {cover.caption ? (
        <figcaption className="mt-2.5 text-center text-[13px] leading-normal text-subtle">{cover.caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Older / newer article links under the body. */
export function PrevNextNav({ adjacent, locale }: { adjacent: AdjacentPosts; locale: Locale }) {
  const s = newsStrings(locale);
  if (!adjacent.prev && !adjacent.next) return null;
  const item = (dir: 'prev' | 'next') => {
    const post = adjacent[dir];
    if (!post) return <div className="hidden sm:block" aria-hidden="true" />;
    const next = dir === 'next';
    return (
      <Link
        href={href(locale, `/news/${post.slug}`)}
        rel={dir}
        className={cn(
          'card-lift-soft group flex min-w-0 flex-col gap-1.5 rounded-xl border border-divider bg-surface px-4 py-3.5 no-underline',
          next && 'sm:items-end sm:text-right',
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-subtle">
          {!next ? <ArrowLeftIcon className="size-3.5" aria-hidden="true" weight="bold" /> : null}
          {next ? s.nextPost : s.prevPost}
          {next ? <ArrowRightIcon className="size-3.5" aria-hidden="true" weight="bold" /> : null}
        </span>
        <span className="line-clamp-2 text-[15px] leading-snug font-medium text-ink group-hover:text-accent-700">
          {post.title}
        </span>
      </Link>
    );
  };
  return (
    <nav aria-label={`${s.prevPost} / ${s.nextPost}`} className="grid gap-3 sm:grid-cols-2">
      {item('prev')}
      {item('next')}
    </nav>
  );
}

/** "Tin liên quan" - 3 cards. */
export function RelatedNews({ items, locale }: { items: NewsListItem[]; locale: Locale }) {
  const t = getDictionary(locale);
  if (!items.length) return null;
  return (
    <section aria-labelledby="related-heading" className="section-t">
      <SectionHeading as="h2" id="related-heading" kicker={t.newsKicker} title={t.related} />
      <ul role="list" className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id} className="min-w-0" {...reveal(i)}>
            <NewsCard
              item={item}
              locale={locale}
              headingLevel="h3"
              sizes="(min-width: 1280px) 376px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Draft Mode banner with the exit form (POST, never a prefetching link). */
export function DraftBanner({ locale, path }: { locale: Locale; path: string }) {
  const t = getDictionary(locale);
  return (
    <div role="region" aria-label={t.draftPreview} className="sticky top-0 z-[60] bg-ink text-white">
      <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-[13px]">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-cyan motion-safe:animate-pulse" />
          {t.draftPreview}
        </span>
        <form method="post" action={`/api/draft/exit?path=${encodeURIComponent(path)}`}>
          <button
            type="submit"
            className="fx cursor-pointer rounded-md border border-white/30 bg-transparent px-3 py-1.5 text-[13px] font-medium text-white [--fx-bg:rgb(255_255_255/0.1)] [--fx-press:rgb(255_255_255/0.16)]"
          >
            {t.exitPreview}
          </button>
        </form>
      </div>
    </div>
  );
}
