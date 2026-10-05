import type { Locale } from '../lib/types';

export type { Locale };

export const locales = ['vi', 'en'] as const satisfies readonly Locale[];
export const defaultLocale: Locale = 'vi';

/** Same cookie as the proxy (src/proxy.ts) and the legacy /v2 site. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Native names for the language switcher (Funtap style: flag + name). */
export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
};

/** Flag code for the switcher's SVG flag. */
export const localeFlags: Record<Locale, 'vn' | 'gb'> = {
  vi: 'vn',
  en: 'gb',
};

/** `<html lang>` / hreflang values. */
export const htmlLang: Record<Locale, string> = {
  vi: 'vi',
  en: 'en',
};

/** Open Graph `og:locale`. */
export const ogLocale: Record<Locale, string> = {
  vi: 'vi_VN',
  en: 'en_US',
};

/** BCP-47 tag for Intl date/number formatting. */
export const intlLocale: Record<Locale, string> = {
  vi: 'vi-VN',
  en: 'en-GB',
};
