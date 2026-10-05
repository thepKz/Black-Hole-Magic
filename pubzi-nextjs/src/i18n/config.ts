export const locales = ['vi', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export const localeLabels: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// This legacy site is served under /v2 (the new publisher site owns the root),
// so its URLs look like /v2/{locale}/about.
export const V2_BASE = '/v2';

function pathSegments(pathname: string): string[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === V2_BASE.slice(1)) parts.shift();
  return parts;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathSegments(pathname)[0];
  return isLocale(segment) ? segment : defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
  const parts = pathSegments(pathname);
  if (isLocale(parts[0])) parts.shift();
  return parts.length ? `/${parts.join('/')}` : '/';
}

export function localizedPath(pathname: string, locale: Locale): string {
  const cleanPath = stripLocalePrefix(pathname);
  return cleanPath === '/' ? `${V2_BASE}/${locale}` : `${V2_BASE}/${locale}${cleanPath}`;
}

