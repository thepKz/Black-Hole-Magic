import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { formatDate } from '@site/components/ui/format';
import { newsStrings } from '@site/components/news/strings';
import { isLocale } from '@site/i18n';
import { getNewsBySlug } from '@site/lib/news';
import { SITE_NAME } from '@site/lib/seo';

/**
 * GET /{locale}/news/{slug}/og.png - auto-generated 1200x630 social card for
 * articles without a cover / SEO image (see articleOgImage()). Brand gradient,
 * logo, category, title and date.
 *
 * Not the `opengraph-image` file convention on purpose: that would override
 * the per-article cover image chosen in generateMetadata for every post.
 *
 * Fonts: Inter (Google Fonts, subset to the glyphs used, for Vietnamese
 * diacritics) -> local SVN Sohne Breit -> next/og default.
 */
const SIZE = { width: 1200, height: 630 };

type FontDef = { name: string; data: ArrayBuffer; weight: 500 | 700; style: 'normal' };

async function googleFont(weight: 500 | 700, text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl, { signal: AbortSignal.timeout(2500), cache: 'force-cache' })).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src, { signal: AbortSignal.timeout(2500), cache: 'force-cache' });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function localFile(...segments: string[]): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(join(process.cwd(), ...segments));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

async function loadFonts(text: string): Promise<FontDef[]> {
  const [regular, bold] = await Promise.all([googleFont(500, text), googleFont(700, text)]);
  if (regular && bold) {
    return [
      { name: 'Inter', data: regular, weight: 500, style: 'normal' },
      { name: 'Inter', data: bold, weight: 700, style: 'normal' },
    ];
  }
  const svn = await localFile('public', 'assets', 'webfonts', 'SVN-SOHNEBREIT-EXTRAFETT.OTF');
  return svn ? [{ name: 'Inter', data: svn, weight: 700, style: 'normal' }] : [];
}

function toDataUrl(buf: ArrayBuffer | null, mime: string): string | null {
  return buf ? `data:${mime};base64,${Buffer.from(buf).toString('base64')}` : null;
}

export async function GET(_req: Request, ctx: RouteContext<'/[locale]/news/[slug]/og.png'>) {
  const { locale, slug } = await ctx.params;
  if (!isLocale(locale)) return new Response('Not found', { status: 404 });
  const post = await getNewsBySlug(locale, slug);
  if (!post) return new Response('Not found', { status: 404 });

  const s = newsStrings(locale);
  const title = post.title.length > 120 ? `${post.title.slice(0, 117).trimEnd()}…` : post.title;
  const category = post.category?.name ?? s.ogTagline;
  const date = formatDate(post.publishedAt, locale, 'long');
  const host = (process.env.NEXT_PUBLIC_SITE_URL || 'blackholegame.com').replace(/^https?:\/\//, '').replace(/\/+$/, '');

  const text = `${title}${category}${date}${SITE_NAME}${host}${s.ogTagline}`;
  const [fonts, logo] = await Promise.all([
    loadFonts(text),
    localFile('public', 'site', 'brand', 'logo-mark.png').then((b) => toDataUrl(b, 'image/png')),
  ]);
  const titleSize = title.length > 90 ? 50 : title.length > 60 ? 58 : 66;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: '#ffffff',
          fontFamily: fonts.length ? 'Inter' : undefined,
          backgroundColor: '#140c33',
          backgroundImage:
            'radial-gradient(circle at 88% 8%, rgba(24,214,242,0.32), rgba(24,214,242,0) 42%), radial-gradient(circle at 6% 104%, rgba(141,77,255,0.78), rgba(141,77,255,0) 58%), linear-gradient(125deg, #2a0f5c 0%, #1a1446 48%, #0b1a3a 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img>
              <img src={logo} width={93} height={60} alt="" style={{ objectFit: 'contain' }} />
            ) : null}
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em' }}>{SITE_NAME}</span>
          </div>
          <span
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.28)',
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            {category}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ display: 'flex', width: 72, height: 6, borderRadius: 3, backgroundColor: '#18D6F2' }} />
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.16,
              letterSpacing: '-0.02em',
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.72)',
          }}
        >
          <span>{date}</span>
          <span>{host}</span>
        </div>
      </div>
    ),
    { ...SIZE, fonts: fonts.length ? fonts : undefined },
  );

  image.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  return image;
}
