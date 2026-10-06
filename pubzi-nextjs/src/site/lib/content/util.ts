import { foldText, slugify } from '@/shared/text';

import type { ArticleHeading, ArticleOutline, Locale, Paginated } from '../types';

/**
 * Helpers shared by every content source + the facade. Pure, no CMS imports,
 * safe in scripts (no 'server-only').
 */

export const SITE_LOCALES: Locale[] = ['vi', 'en'];
export const NEWS_PER_PAGE = 9;
/** Slugs accepted by the site (URL segment of /news/{slug}). */
export const NEWS_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/;
/** Words per minute for reading time (VN syllables ~ EN words; same as src/cms/lib/lexical.ts). */
export const READING_WPM = 220;

export const isObj = <T extends object = Record<string, unknown>>(v: unknown): v is T =>
  typeof v === 'object' && v !== null;

export const compact = <T,>(arr: (T | null | undefined)[]): T[] => arr.filter((x): x is T => x != null);

export function paginate<T>(items: T[], page: number, perPage: number, totalItems: number): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  return { items, page, perPage, totalItems, totalPages, hasPrev: page > 1, hasNext: page < totalPages };
}

export function emptyPage<T>(page = 1, perPage = NEWS_PER_PAGE): Paginated<T> {
  return paginate<T>([], Math.max(1, page), perPage, 0);
}

/** Paginates an in-memory list, clamping an out-of-range page to the last one. */
export function paginateArray<T>(all: T[], page: number, perPage: number): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return paginate(all.slice((current - 1) * perPage, current * perPage), current, perPage, all.length);
}

export const countWords = (text: string) => (text ? text.split(/\s+/).filter(Boolean).length : 0);

/** Reading time in minutes (>= 1). */
export const estimateReadingTime = (wordCount: number, mediaCount = 0) =>
  Math.max(1, Math.round(wordCount / READING_WPM + mediaCount / 6));

/** Accent-insensitive "contains" used by sources without server-side search. */
export function foldIncludes(haystack: string | null | undefined, needle: string): boolean {
  const n = foldText(needle);
  return !n || foldText(haystack).includes(n);
}

/**
 * Heading anchor ids: slugify + de-dup in document order ("a", "a-2", ...).
 * The SAME algorithm is used by the Lexical renderer and the HTML sanitizer,
 * so table-of-contents links always match.
 */
export function createHeadingIds() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugify(text) || 'section';
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
}

export function buildOutline(headings: ArticleHeading[], plainText: string): ArticleOutline {
  return { headings, plainText, wordCount: countWords(plainText) };
}

export const EMPTY_OUTLINE: ArticleOutline = { headings: [], plainText: '', wordCount: 0 };

/** ISO string or null (accepts Date-parsable strings and epoch ms). */
export function toIso(value: unknown): string | null {
  if (value == null || value === '') return null;
  const d = typeof value === 'number' ? new Date(value) : new Date(String(value));
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}
