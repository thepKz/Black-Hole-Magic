import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;
const localeCookieName = 'NEXT_LOCALE';
// Legacy site, served as /v2/{locale}/…; the new publisher site owns /{locale}/…
const legacySegment = 'v2';

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

// Payload admin language cookie (payload/dist/utilities/getRequestLanguage.js).
const adminLangCookie = 'payload-lng';

/**
 * /admin (Payload): never indexed, Vietnamese by default. Payload picks the
 * admin language from this cookie first, then Accept-Language, so seed 'vi'
 * when the editor has not chosen one yet (they can switch in Account).
 */
function adminResponse(request: NextRequest) {
  const seedLang = !request.cookies.has(adminLangCookie);
  if (seedLang) request.cookies.set(adminLangCookie, 'vi');
  const response = seedLang
    ? NextResponse.next({ request: { headers: request.headers } })
    : NextResponse.next();
  if (seedLang) {
    response.cookies.set(adminLangCookie, 'vi', {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) return adminResponse(request);

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === legacySegment) {
    if (isLocale(segments[1])) return;
    const rest = segments.slice(1).join('/');
    request.nextUrl.pathname = `/${legacySegment}/${getPreferredLocale(request)}${rest ? `/${rest}` : ''}`;
    return NextResponse.redirect(request.nextUrl);
  }

  if (isLocale(segments[0])) return;

  const locale = getPreferredLocale(request);
  request.nextUrl.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // /admin is matched on purpose (see adminResponse); _next, api, assets and files are not.
  matcher: ['/((?!_next|api|assets|.*\\..*).*)'],
};
