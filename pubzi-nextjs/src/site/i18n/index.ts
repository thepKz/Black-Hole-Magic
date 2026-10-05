/**
 * i18n entry point of the new site. Safe on server and client (no server-only
 * imports). Server Components: `const t = getDictionary(locale)`; pass `t` (or a
 * subset) to Client Components as a prop.
 */
import en from './en';
import vi from './vi';
import { defaultLocale, isLocale, locales, type Locale } from './config';
import type { Localized } from '../lib/types';

export * from './config';

export type DictionaryKey = keyof typeof vi;
export type Dictionary = Record<DictionaryKey, string>;

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Interpolate `{name}` placeholders: format(t.readTime, { min: 4 }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Resolve a `Localized` value (or plain string) for a locale, falling back to VI. */
export function pick<T>(value: Localized<T> | T, locale: Locale): T {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'vi' in value && 'en' in value) {
    const v = value as Localized<T>;
    return v[locale] ?? v[defaultLocale];
  }
  return value as T;
}

/**
 * Build an internal URL with locale prefix.
 * href('vi') -> '/vi'; href('en', '/news') -> '/en/news'; href('vi', 'games?q=x') -> '/vi/games?q=x'.
 * Absolute URLs (http:, https:, mailto:, tel:, #) are returned unchanged.
 */
export function href(locale: Locale, path = '/'): string {
  if (/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

/** Same path in another locale: switchLocalePath('/vi/news?page=2', 'en') -> '/en/news?page=2'. */
export function switchLocalePath(pathWithQuery: string, to: Locale): string {
  const [pathname, ...rest] = pathWithQuery.split(/(?=[?#])/);
  const parts = (pathname || '/').split('/').filter(Boolean);
  if (isLocale(parts[0])) parts.shift();
  return href(to, `/${parts.join('/')}`) + rest.join('');
}

/** Absolute site URL (NEXT_PUBLIC_SITE_URL, no trailing slash) + path. */
export function absoluteUrl(path = '/'): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * `alternates` block for generateMetadata: canonical + hreflang vi/en/x-default.
 * `path` is locale-less ('/news/abc'). Pass `available` to limit languages
 * (e.g. an article without an EN translation).
 */
export function localeAlternates(
  locale: Locale,
  path = '/',
  available: readonly Locale[] = locales,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = absoluteUrl(href(l, path));
  languages['x-default'] = absoluteUrl(href(available.includes(defaultLocale) ? defaultLocale : available[0] ?? defaultLocale, path));
  return { canonical: absoluteUrl(href(locale, path)), languages };
}
