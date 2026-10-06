import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

type RemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number];

/**
 * Public site origin (canonical, hreflang, sitemap, RSS, OG, preview, CSRF).
 * NEXT_PUBLIC_SITE_URL is inlined at BUILD time; when it is missing on Vercel
 * fall back to the deployment's own URL instead of advertising localhost:
 * - production -> VERCEL_PROJECT_PRODUCTION_URL (the primary custom domain),
 * - preview    -> the branch alias / deployment URL.
 * Set NEXT_PUBLIC_SITE_URL=https://blackholegame.vn explicitly in production.
 */
function resolveSiteUrl(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  if (!process.env.VERCEL) return undefined;
  const host =
    process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  return host ? `https://${host.replace(/\/+$/, '')}` : undefined;
}

const SITE_URL = resolveSiteUrl();
if (SITE_URL) process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;

const toPattern = (raw: string, pathname: string): RemotePattern | null => {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
      pathname,
    };
  } catch {
    return null;
  }
};

/**
 * When Payload is given an absolute `serverURL`, media URLs come back absolute
 * (e.g. https://blackholegame.vn/api/media/file/x.webp). Allow that origin so
 * next/image can still optimise them.
 */
function siteMediaPattern(): RemotePattern[] {
  const p = SITE_URL ? toPattern(SITE_URL, '/api/media/file/**') : null;
  return p ? [p] : [];
}

/**
 * Vercel Blob (src/cms/payload.config.ts): media URLs are absolute
 * https://<storeId>.public.blob.vercel-storage.com/... The store id is part of
 * BLOB_READ_WRITE_TOKEN (vercel_blob_rw_<storeId>_<random>), so only OUR store
 * is allowed through the image optimizer (not every Blob store on Vercel).
 */
function blobPatterns(): RemotePattern[] {
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase();
  const fromToken: RemotePattern[] = storeId
    ? [{ protocol: 'https', hostname: `${storeId}.public.blob.vercel-storage.com`, pathname: '/**' }]
    : [];
  const override = process.env.STORAGE_VERCEL_BLOB_BASE_URL;
  const fromOverride = override ? toPattern(override, '/**') : null;
  return [...fromToken, ...(fromOverride ? [fromOverride] : [])];
}

/**
 * Extra image origins (comma-separated CONTENT_MEDIA_ORIGINS, e.g. the asset
 * CDN of an external CMS or an S3/R2 bucket): https://host[/path-prefix].
 */
function contentMediaPatterns(): RemotePattern[] {
  return (process.env.CONTENT_MEDIA_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .map((o) => {
      let prefix = '';
      try {
        prefix = new URL(o).pathname.replace(/\/+$/, '');
      } catch {
        return null;
      }
      return toPattern(o, `${prefix}/**`);
    })
    .filter((p): p is RemotePattern => Boolean(p));
}

/** Clickjacking / MIME-sniffing protection for the CMS (admin + its API + media files). */
const cmsSecurityHeaders = [
  // Live preview iframes the SITE from the admin (same origin); nothing frames the admin.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  // Lets a production build be verified into a separate folder while the dev
  // server keeps using .next (e.g. NEXT_DIST_DIR=.next-verify npm run build).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Inline the resolved origin (see resolveSiteUrl) into server + client bundles.
  env: SITE_URL ? { NEXT_PUBLIC_SITE_URL: SITE_URL } : {},
  images: {
    // Optimisation ON (WebP + srcset). AVIF dropped: its encoder is the most
    // CPU-hungry and concurrent cold AVIF requests were seen hanging the
    // optimizer under `next start` (Next 16.3.8). Put a CDN in front of
    // /_next/image in production.
    formats: ['image/webp'],
    qualities: [60, 75, 85],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    localPatterns: [
      // Payload media route (local disk storage); Payload may append a cache-busting `?<timestamp>`.
      { pathname: '/api/media/file/**' },
      // Everything in public/ (new site /site/**, legacy /assets/**), no query string.
      { pathname: '/**', search: '' },
    ],
    remotePatterns: [
      ...siteMediaPattern(),
      ...blobPatterns(),
      ...contentMediaPatterns(),
      // Legacy /v2 news screen placeholders.
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  // The OG card route reads these with fs at runtime; on Vercel public/ is
  // served by the CDN and is not in the function bundle unless traced.
  outputFileTracingIncludes: {
    '/\\[locale\\]/news/\\[slug\\]/og.png': [
      './public/site/brand/logo-mark.png',
      './public/assets/webfonts/SVN-SOHNEBREIT-EXTRAFETT.OTF',
    ],
  },
  async headers() {
    const site = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ];
    // HSTS only for the real production deployment (browsers ignore it on http).
    if (process.env.VERCEL_ENV === 'production' || process.env.ENABLE_HSTS === 'true') {
      site.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000' });
    }
    return [
      { source: '/:path*', headers: site },
      { source: '/admin', headers: cmsSecurityHeaders },
      { source: '/admin/:path*', headers: cmsSecurityHeaders },
      { source: '/api/:path*', headers: cmsSecurityHeaders },
    ];
  },
  experimental: {
    // Phosphor's barrel re-exports thousands of icons; rewrite to per-icon imports.
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  // Payload ships ESM with `.js` specifiers that point at TS sources.
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // Disable strict mode for jQuery compatibility of the legacy /v2 site.
  reactStrictMode: false,
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
