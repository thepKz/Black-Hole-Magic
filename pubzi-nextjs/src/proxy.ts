import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;
const localeCookieName = 'NEXT_LOCALE';

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  const accepted = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim())
    .filter(Boolean);

  for (const language of accepted) {
    const baseLanguage = language.split('-')[0];
    if (isLocale(language)) return language;
    if (isLocale(baseLanguage)) return baseLanguage;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (isLocale(firstSegment)) return;

  const locale = getPreferredLocale(request);
  request.nextUrl.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|assets|.*\\..*).*)'],
};
