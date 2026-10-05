import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { en } from '@payloadcms/translations/languages/en';
import { vi } from '@payloadcms/translations/languages/vi';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Media } from './collections/Media';
import { News } from './collections/News';
import { NewsCategories } from './collections/NewsCategories';
import { Users } from './collections/Users';
import { defaultEditor } from './editor';
import { siteOrigin } from './lib/preview';
import { bearer, safeEqual } from './lib/revalidateSecret';
import { seo } from './plugins/seo';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * CSRF allowlist for the payload-token cookie (payload/dist/auth/extractJWT.js):
 * with an empty list ANY Origin is accepted. Site origin + extra admin origins
 * (comma-separated PAYLOAD_CSRF_ORIGINS, e.g. a QA port or a separate admin host).
 * Does not need `serverURL`, so media URLs stay relative.
 */
function csrfOrigins(): string[] {
  const extra = (process.env.PAYLOAD_CSRF_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter((o) => /^https?:\/\/[^/]+$/i.test(o));
  return [...new Set([siteOrigin(), ...extra])];
}

/**
 * Payload CMS - used ONLY to publish news at /admin.
 * Everything else on the public site (games, banners, partners, company info,
 * contact) is typed mock data in src/site/data/*.
 */
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  // No `serverURL`: media URLs stay relative (/api/media/file/...) so next/image
  // treats them as local images (Next 16 blocks optimising remote URLs that
  // resolve to private IPs, which would break localhost dev).
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
      importMapFile: path.resolve(dirname, '../app/(payload)/admin/importMap.js'),
    },
    meta: {
      titleSuffix: ' · Black Hole CMS',
      robots: 'noindex, nofollow',
    },
    dateFormat: 'dd/MM/yyyy HH:mm',
  },
  collections: [News, NewsCategories, Media, Users],
  localization: {
    locales: [
      { code: 'vi', label: 'Tiếng Việt' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  i18n: {
    supportedLanguages: { vi, en },
    fallbackLanguage: 'vi',
  },
  editor: defaultEditor,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [seo],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  jobs: {
    // Runs scheduled publish / unpublish of news drafts. Disabled during
    // `next build` and in CLI scripts (seed) via PAYLOAD_DISABLE_AUTORUN.
    // The jobs run outside a Next request, so their revalidation goes through
    // POST /api/revalidate (src/cms/hooks/revalidate.ts).
    // Serverless / multi-instance: set PAYLOAD_DISABLE_AUTORUN=true and have a
    // cron call GET /api/payload-jobs/run?queue=default with
    // `Authorization: Bearer $CRON_SECRET` every minute instead.
    access: {
      run: ({ req }) => {
        if (req.user) return true;
        const secret = process.env.CRON_SECRET?.trim();
        return Boolean(secret) && safeEqual(bearer(req.headers.get('authorization')), secret);
      },
    },
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
    shouldAutoRun: () =>
      process.env.PAYLOAD_DISABLE_AUTORUN !== 'true' &&
      process.env.NEXT_PHASE !== 'phase-production-build',
  },
  csrf: csrfOrigins(),
  telemetry: false,
});
