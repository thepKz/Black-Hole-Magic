'use client';

import { useEffect, useSyncExternalStore } from 'react';

import type { Locale } from '@site/i18n';

/**
 * Per-page override of the language switcher targets (e.g. a news article
 * whose translation lives at another URL or does not exist).
 *
 * In a page: `<LocaleAlternates paths={{ vi: '/vi/news/abc', en: '/en/news' }} />`
 * Values are locale-prefixed paths. Missing locales fall back to the same path
 * in the other locale.
 */
export type LocalePaths = Partial<Record<Locale, string>>;

let current: LocalePaths | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocaleAlternatesOverride(): LocalePaths | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

export function LocaleAlternates({ paths }: { paths: LocalePaths }) {
  const key = JSON.stringify(paths);
  useEffect(() => {
    const value = JSON.parse(key) as LocalePaths;
    current = value;
    emit();
    return () => {
      if (current === value) {
        current = null;
        emit();
      }
    };
  }, [key]);
  return null;
}
