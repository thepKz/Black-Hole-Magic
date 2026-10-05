import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { en } from '@payloadcms/translations/languages/en';
import { vi } from '@payloadcms/translations/languages/vi';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { ContactRequests } from './collections/ContactRequests';
import { Media } from './collections/Media';
import { News } from './collections/News';
import { NewsCategories } from './collections/NewsCategories';
import { Users } from './collections/Users';
import { Videos } from './collections/Videos';
import { applyLexicalOverrides, relabelFolderFields, viOverrides } from './admin/translations';
import { defaultEditor } from './editor';
import { siteOrigin } from './lib/preview';
import { bearer, safeEqual } from './lib/revalidateSecret';
import { UPLOAD_LIMIT_MESSAGE, VIDEO_MAX_BYTES } from './lib/uploads';
import { seo } from './plugins/seo';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Uploads stream to temp files (see `upload` below). libvips keeps opened files
// in its cache, which on Windows makes Payload's temp-file unlink fail (EBUSY ->
// 500 on upload). Not caching open file handles costs nothing measurable.
sharp.cache({ files: 0 });

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
 * Payload CMS at /admin - publishes news and receives contact requests.
 * Everything else on the public site (games, banners, partners, company info)
 * is typed mock data in src/site/data/*.
 *
 * Admin hardening (see also src/cms/collections/Users.ts, src/proxy.ts):
 * - Nothing on the public site links here; /admin (any sub-route) without a
 *   session renders only the login form (Payload default).
 * - No public sign-up: `users.create` is admin-only, so POST /api/users is 403
 *   for guests. /admin/create-first-user and POST /api/users/first-register
 *   only work while the users table is EMPTY (Payload redirects / returns 403
 *   once a user exists) - create the first admin with `npm run seed` before
 *   exposing a fresh database.
 * - noindex: meta robots below + X-Robots-Tag (proxy) + robots.txt disallow.
 * - GraphQL playground is disabled in production.
 *
 * `.then(applyLexicalOverrides)`: editor toolbar labels can only be reworded
 * after the Lexical features have merged their own i18n (src/cms/admin/translations.ts).
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
      titleSuffix: '— Black Hole Admin', // Payload joins it with a space
      robots: 'noindex, nofollow',
      icons: [
        { rel: 'icon', type: 'image/png', url: '/site/brand/logo-mark.png' },
        { rel: 'apple-touch-icon', url: '/site/brand/apple-touch-icon.png' },
      ],
      openGraph: { siteName: 'Black Hole Admin' },
    },
    components: {
      graphics: {
        Logo: '/cms/admin/Logo#Logo',
        Icon: '/cms/admin/Icon#Icon',
      },
      // Newsroom desk: counters, "Viết bài mới", my drafts, review queue, schedule.
      beforeDashboard: ['/cms/admin/dashboard/Dashboard#Dashboard'],
      // Vietnamese tooltips + accessible names for the editor's icon-only toolbar.
      providers: ['/cms/admin/EditorHints#EditorHints'],
    },
    // Scheduling and dates in Vietnam time for every editor.
    timezones: {
      defaultTimezone: 'Asia/Ho_Chi_Minh',
      supportedTimezones: [{ label: 'Giờ Việt Nam (GMT+7)', value: 'Asia/Ho_Chi_Minh' }],
    },
    // Built-in initials avatar: no Gravatar request leaking editor email hashes.
    avatar: 'default',
    dateFormat: 'dd/MM/yyyy HH:mm',
  },
  // Nav order = group order: Nội dung (news, categories, media) · Hộp thư · Hệ thống.
  collections: [News, NewsCategories, Media, Videos, ContactRequests, Users],
  localization: {
    locales: [
      { code: 'vi', label: 'Tiếng Việt' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  i18n: {
    // Default admin language is Vietnamese: the proxy seeds the `payload-lng`
    // cookie with 'vi' on first visit (otherwise an English browser would get
    // EN). Users can still switch in Account settings.
    supportedLanguages: { vi, en },
    fallbackLanguage: 'vi',
    // Newsroom wording over the stock VI pack (src/cms/admin/translations.ts).
    translations: { vi: viOverrides },
  },
  editor: defaultEditor,
  // Multipart parser (all upload collections). One global cap = the largest
  // allowed file (video); media/videos enforce their own caps with Vietnamese
  // messages (src/cms/lib/uploads.ts). Temp files keep 300 MB videos out of RAM.
  upload: {
    limits: { fileSize: VIDEO_MAX_BYTES },
    requestSizeLimit: VIDEO_MAX_BYTES + 5 * 1024 * 1024,
    abortOnLimit: true,
    responseOnLimit: UPLOAD_LIMIT_MESSAGE,
    useTempFiles: true,
    tempFileDir: path.join(os.tmpdir(), 'payload-uploads'),
    uploadTimeout: 120_000,
  },
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
}).then((config) => relabelFolderFields(applyLexicalOverrides(config)));
