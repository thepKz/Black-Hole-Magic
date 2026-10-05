import type { MetadataRoute } from 'next';

import { siteUrl } from '@site/data/site';

/**
 * /robots.txt
 * - Crawl the new site; keep the legacy site (/v2), the CMS (/admin) and the API (/api) out.
 * - Exception: /api/media/file/ (CMS images) stays crawlable so Google Images and
 *   link-preview bots that honour robots.txt (e.g. Twitterbot) can fetch og:image / covers.
 *   Google applies the most specific (longest) matching rule, so the Allow wins there.
 * - Set NEXT_PUBLIC_NOINDEX=true on staging/preview deployments to block everything.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === 'true') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/file/'],
        disallow: ['/v2', '/admin', '/api/', '/*?*preview='],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
