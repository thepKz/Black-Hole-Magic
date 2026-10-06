import { ArrowRightIcon, ArrowSquareOutIcon, InfoIcon, QuotesIcon, SealWarningIcon, WarningIcon } from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { href, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

import { posterUrl, safeHref } from './media';
import s from './rich-blocks.module.css';
import type { RichBlockStrings } from './strings';
import type { NewsDocLike } from './types';

const isInternal = (url: string) => url.startsWith('/') && !url.startsWith('//');

/* ------------------------------------------------------------------ */
/* Callout                                                             */
/* ------------------------------------------------------------------ */

const CALLOUT = {
  note: { Icon: InfoIcon, cls: s.calloutNote, key: 'calloutNote' },
  important: { Icon: SealWarningIcon, cls: undefined, key: 'calloutImportant' },
  warning: { Icon: WarningIcon, cls: s.calloutWarning, key: 'calloutWarning' },
} as const;

export function Callout({
  variant,
  title,
  children,
  t,
}: {
  variant?: string | null;
  title?: string | null;
  children: ReactNode;
  t: RichBlockStrings;
}) {
  const v = CALLOUT[(variant ?? 'note') as keyof typeof CALLOUT] ?? CALLOUT.note;
  const label = t[v.key];
  return (
    <aside className={cn(s.callout, v.cls)} role="note" aria-label={title?.trim() || label}>
      <v.Icon weight="fill" className={cn(s.calloutIcon, 'size-5')} aria-hidden="true" />
      {title?.trim() ? <p className={s.calloutTitle}>{title}</p> : <span className="sr-only">{label}</span>}
      <div className={s.calloutBody}>{children}</div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Pull quote                                                          */
/* ------------------------------------------------------------------ */

export function PullQuote({
  text,
  author,
  role,
  sourceUrl,
  t,
}: {
  text?: string | null;
  author?: string | null;
  role?: string | null;
  sourceUrl?: string | null;
  t: RichBlockStrings;
}) {
  const body = text?.trim();
  if (!body) return null;
  const source = safeHref(sourceUrl);
  const paragraphs = body.split(/\n{2,}/);
  return (
    <figure className={s.quote}>
      <QuotesIcon weight="fill" className={cn(s.quoteMark, 'size-9 md:size-10')} aria-hidden="true" />
      <blockquote cite={source && !isInternal(source) ? source : undefined}>
        {paragraphs.map((p, i) => (
          // the quote mark icon is the visual quotation mark
          <p key={i}>{p}</p>
        ))}
      </blockquote>
      {author?.trim() || role?.trim() || source ? (
        <figcaption className={s.quoteBy}>
          {author?.trim() ? <span className={s.quoteAuthor}>{author}</span> : null}
          {role?.trim() ? <span>{role}</span> : null}
          {source ? (
            <cite className="not-italic">
              <a href={source} {...(isInternal(source) ? {} : { target: '_blank', rel: 'noopener noreferrer nofollow' })}>
                {t.quoteSource}
                {isInternal(source) ? null : <span className="sr-only"> {t.opensNewTab}</span>}
              </a>
            </cite>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* CTA button                                                          */
/* ------------------------------------------------------------------ */

export function CtaButton({
  label,
  url,
  note,
  variant,
  newTab,
  nofollow,
  t,
}: {
  label?: string | null;
  url?: string | null;
  note?: string | null;
  variant?: string | null;
  newTab?: boolean | null;
  nofollow?: boolean | null;
  t: RichBlockStrings;
}) {
  const target = safeHref(url);
  const text = label?.trim();
  if (!target || !text) return null;
  const cls = cn(s.btn, variant === 'secondary' ? s.btnSecondary : s.btnPrimary);
  const rel = [
    ...(newTab || /^https?:/i.test(target) ? ['noopener', 'noreferrer'] : []),
    ...(nofollow ? ['nofollow', 'sponsored'] : []),
  ];
  const inner = (
    <>
      {text}
      {newTab ? (
        <>
          <ArrowSquareOutIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">{t.opensNewTab}</span>
        </>
      ) : (
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      )}
    </>
  );
  return (
    <div className={s.cta}>
      {note?.trim() ? <p className={s.ctaNote}>{note}</p> : null}
      {isInternal(target) && !newTab ? (
        <Link href={target} className={cls} rel={rel.length ? rel.join(' ') : undefined}>
          {inner}
        </Link>
      ) : (
        <a href={target} className={cls} target={newTab ? '_blank' : undefined} rel={rel.length ? rel.join(' ') : undefined}>
          {inner}
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Related news ("Đọc thêm")                                           */
/* ------------------------------------------------------------------ */

type RelatedPost = NewsDocLike;

export function RelatedInline({
  title,
  posts,
  locale,
  currentSlug,
  t,
}: {
  title?: string | null;
  posts: unknown;
  locale: Locale;
  currentSlug?: string;
  t: RichBlockStrings;
}) {
  const items = (Array.isArray(posts) ? posts : []).filter(
    (p): p is RelatedPost =>
      typeof p === 'object' &&
      p !== null &&
      typeof (p as RelatedPost).slug === 'string' &&
      Boolean((p as RelatedPost).title) &&
      // unpublished later -> hide (status is absent only when not selected)
      ((p as RelatedPost)._status ?? 'published') === 'published' &&
      (p as RelatedPost).slug !== currentSlug,
  );
  if (!items.length) return null;
  const heading = title?.trim() || t.relatedDefault;
  return (
    <aside className={s.related} aria-label={heading}>
      <p className={s.relatedTitle}>{heading}</p>
      <ul className={s.relatedList}>
        {items.slice(0, 3).map((post) => {
          const thumb = posterUrl(post.cover, 'thumb');
          return (
            <li key={post.id}>
              <Link href={href(locale, `/news/${post.slug}`)} className={s.relatedLink}>
                {thumb ? (
                  <span className={s.relatedThumb}>
                    <Image src={thumb} alt="" fill sizes="96px" />
                  </span>
                ) : null}
                <span className={s.relatedText}>
                  <span className={s.relatedPostTitle}>{post.title}</span>
                  {post.excerpt ? <span className={s.relatedExcerpt}>{post.excerpt}</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
