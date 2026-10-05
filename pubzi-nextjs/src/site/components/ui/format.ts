import { intlLocale, type Locale } from '@site/i18n';

const TZ = 'Asia/Ho_Chi_Minh';

/**
 * Format an ISO date for display (Vietnam time zone, stable on server + client).
 * 'short' -> 05/10/2026 ; 'long' -> 5 tháng 10, 2026 / 5 October 2026.
 */
export function formatDate(iso: string | null | undefined, locale: Locale, style: 'short' | 'long' = 'short'): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(
    intlLocale[locale],
    style === 'short'
      ? { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ }
      : { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ },
  ).format(date);
}
