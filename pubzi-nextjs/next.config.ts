import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * When Payload is given an absolute `serverURL`, media URLs come back absolute
 * (e.g. https://blackholegame.com/api/media/file/x.webp). Allow that origin so
 * next/image can still optimise them.
 */
function siteMediaPattern(): NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: '/api/media/file/**',
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // Lets a production build be verified into a separate folder while the dev
  // server keeps using .next (e.g. NEXT_DIST_DIR=.next-verify npm run build).
  distDir: process.env.NEXT_DIST_DIR || '.next',
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
      // Payload media route; Payload may append a cache-busting `?<timestamp>`.
      { pathname: '/api/media/file/**' },
      // Everything in public/ (new site /site/**, legacy /assets/**), no query string.
      { pathname: '/**', search: '' },
    ],
    remotePatterns: [
      ...siteMediaPattern(),
      // Legacy /v2 news screen placeholders.
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
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
