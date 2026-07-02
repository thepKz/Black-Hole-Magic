'use client';

import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, localizedPath, type Locale } from './config';
import { messages } from './messages';

export function useI18n() {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);

  return {
    locale,
    messages: messages[locale],
    localizedPath: (href: string) => localizedPath(href, locale),
    switchLocalePath: (targetLocale: Locale) => localizedPath(pathname, targetLocale),
  };
}

