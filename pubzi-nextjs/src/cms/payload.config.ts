import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { en } from '@payloadcms/translations/languages/en';
import { vi } from '@payloadcms/translations/languages/vi';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { canPublish } from './access';
import { ContactRequests } from './collections/ContactRequests';
import { Media } from './collections/Media';
import { News } from './collections/News';
import { NewsCategories } from './collections/NewsCategories';
import { Users } from './collections/Users';
import { Videos } from './collections/Videos';
import { applyLexicalOverrides, relabelFolderFields, viOverrides } from './admin/translations';
import { defaultEditor } from './editor';
import { restorePayloadErrorNames } from './lib/errorNames';
import { siteOrigin } from './lib/preview';
import { bearer, safeEqual } from './lib/revalidateSecret';
import {
  allowSchemaPush,
  isBuildPhase,
  onVercel,
  platformOrigins,
  poolConfig,
  reportEnvProblems,
  startTempUploadSweeper,
  wwwTwin,
} from './lib/runtime-env';
import { UPLOAD_LIMIT_MESSAGE, VIDEO_MAX_BYTES } from './lib/uploads';
import { blobUploadLimits } from './plugins/blobUploadLimits';
import { seo } from './plugins/seo';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const TEMP_UPLOAD_DIR = path.join(os.tmpdir(), 'payload-uploads');

// Uploads stream to temp files (see `upload` below). libvips keeps opened files
// in its cache, which on Windows makes Payload's temp-file unlink fail (EBUSY ->
// 500 on upload). Not caching open file handles costs nothing measurable.
sharp.cache({ files: 0 });

// Names (never values) of missing DATABASE_URI / PAYLOAD_SECRET, once per process.
reportEnvProblems();

// Minified prod bundle -> real error class names, so `loggingLevels` applies.
restorePayloadErrorNames();

/**
 * Vercel Blob for media + videos when BLOB_READ_WRITE_TOKEN is set (Vercel adds
 * it when a Blob store is connected to the project); otherwise local disk
 * (staticDir 'media', dev / self-hosting). Vercel functions have a read-only,
 * ephemeral filesystem and a 4.5 MB request-body cap, so in production:
 * - clientUploads: the browser uploads the file straight to Blob (any size up to
 *   the collection caps); Payload then fetches it back once to run sharp.
 * - disablePayloadAccessControl: both collections are public (`read: anyone`),
 *   so file URLs point directly at the Blob CDN
 *   (https://<store>.public.blob.vercel-storage.com/media/...) - no function
 *   invocation per image, Range requests for video.
 * - alwaysInsertFields: the `prefix` column exists with or without a token, so a
 *   migration generated locally matches production.
 */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
export const blobStorageEnabled = Boolean(blobToken);

/**
 * Outgoing mail ("Quên mật khẩu", future notifications) over SMTP when
 * SMTP_HOST is set (any provider: Google Workspace, Resend/SES/Mailgun SMTP...).
 * Without it Payload keeps its console adapter: nothing is sent and
 * "Quên mật khẩu" tells the editor to ask an admin (Users.ts).
 */
function emailAdapter() {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return undefined;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER?.trim();
  return nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM?.trim() || 'no-reply@blackholegame.vn',
    defaultFromName: process.env.EMAIL_FROM_NAME?.trim() || 'Black Hole Admin',
    // No SMTP handshake on every cold start (serverless); errors surface on send.
    skipVerify: true,
    transportOptions: {
      host,
      port,
      secure: port === 465,
      ...(user ? { auth: { user, pass: process.env.SMTP_PASS ?? '' } } : {}),
    },
  });
}

/**
 * CSRF allowlist for the payload-token cookie (payload/dist/auth/extractJWT.js):
 * with an empty list ANY Origin is accepted. Site origin (+ its www/apex twin)
 * + this Vercel deployment's own URLs + extra admin origins (comma-separated
 * PAYLOAD_CSRF_ORIGINS, e.g. a QA port or a separate admin host).
 * Does not need `serverURL`, so media URLs stay relative.
 */
function csrfOrigins(): string[] {
  const extra = (process.env.PAYLOAD_CSRF_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter((o) => /^https?:\/\/[^/]+$/i.test(o));
  const site = siteOrigin();
  const twin = wwwTwin(site);
  return [...new Set([site, ...(twin ? [twin] : []), ...platformOrigins(), ...extra])];
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
 *   for guests. /admin/create-first-user + POST /api/users/first-register are
 *   refused for anonymous requests even on an EMPTY users table
 *   (Users.ts beforeOperation, escape hatch ALLOW_FIRST_REGISTER=true); the
 *   first admin comes from `npm run bootstrap:admin` on a trusted machine
 *   (src/cms/seed/bootstrap-admin.ts).
 * - Auth cookie is `Secure` in production (Users.ts).
 * - noindex: meta robots below + X-Robots-Tag (proxy) + robots.txt disallow.
 * - GraphQL is disabled (neither the site nor the admin uses it).
 *
 * Production (Vercel) runbook: docs/DEPLOY-ADMIN.md - Neon Postgres, schema
 * from src/cms/migrations (applied by `npm run vercel-build`), Vercel Blob for
 * uploads, Vercel Cron for scheduled publishing.
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
  // Payload default is 10; the site reads at depth <= 2. Caps abusive ?depth= on REST.
  maxDepth: 4,
  // Guest / bot hits on protected REST routes (403, Payload default 'info') are
  // expected traffic; failed logins (401) stay visible as WARN, not ERROR.
  // Needs restorePayloadErrorNames() above in the minified production build.
  loggingLevels: { Forbidden: 'info', AuthenticationError: 'warn' },
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
  // On Vercel the platform rejects bodies > 4.5 MB before Payload runs, files
  // go browser -> Blob (clientUploads below), so the parser stays in memory:
  // no temp files left in /tmp by multipart posts to non-upload endpoints.
  upload: onVercel()
    ? {
        limits: { fileSize: 4.5 * 1024 * 1024 },
        abortOnLimit: true,
        responseOnLimit: UPLOAD_LIMIT_MESSAGE,
        useTempFiles: false,
        uploadTimeout: 60_000,
      }
    : {
        limits: { fileSize: VIDEO_MAX_BYTES },
        requestSizeLimit: VIDEO_MAX_BYTES + 5 * 1024 * 1024,
        abortOnLimit: true,
        responseOnLimit: UPLOAD_LIMIT_MESSAGE,
        useTempFiles: true,
        tempFileDir: TEMP_UPLOAD_DIR,
        uploadTimeout: 120_000,
      },
  db: postgresAdapter({
    pool: poolConfig(),
    // Local dev: drizzle push keeps the schema in sync (localhost DB only, see
    // allowSchemaPush). Everywhere else the schema comes ONLY from
    // src/cms/migrations - every schema change ships with
    // `npm run migrate:create <name>` in the same commit.
    push: allowSchemaPush(),
    migrationDir: path.resolve(dirname, 'migrations'),
    // Hosted roles (Neon, Supabase...) cannot CREATE DATABASE; the DB must exist.
    disableCreateDatabase: true,
  }),
  sharp,
  plugins: [
    seo,
    vercelBlobStorage({
      enabled: blobStorageEnabled,
      token: blobToken,
      alwaysInsertFields: true,
      clientUploads: { access: ({ req }) => Boolean(req.user) },
      collections: {
        media: { prefix: 'media', disablePayloadAccessControl: true },
        videos: { prefix: 'videos', disablePayloadAccessControl: true },
      },
    }),
    // After vercelBlobStorage: caps client-upload tokens at IMAGE/VIDEO_MAX_BYTES.
    blobUploadLimits(blobToken),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Not used by the site (Local API) nor the admin (REST): one less public API
  // surface whose access rules must be kept in sync (POST /api/graphql -> 404).
  graphQL: {
    disable: true,
    disablePlaygroundInProduction: true,
  },
  jobs: {
    // Runs scheduled publish / unpublish of news drafts.
    // - Long-lived server (dev, `next start` on a VM): in-process cron every minute.
    // - Vercel / serverless: no in-process cron (it would never fire without a
    //   warm instance, or fire in every instance). Vercel Cron (vercel.json)
    //   calls GET /api/payload-jobs/run?queue=default with
    //   `Authorization: Bearer $CRON_SECRET` instead (daily in the repo so Hobby
    //   deploys work; every minute on Pro or via an external cron, DEPLOY-ADMIN §6).
    // Also off during `next build` and in CLI scripts (PAYLOAD_DISABLE_AUTORUN).
    // Jobs run outside a Next request when in-process, so their revalidation
    // goes through POST /api/revalidate (src/cms/hooks/revalidate.ts).
    access: {
      // Cron (bearer CRON_SECRET) or an editor/admin - not every author.
      run: ({ req }) => {
        if (req.user) return canPublish(req.user as Parameters<typeof canPublish>[0]);
        const secret = process.env.CRON_SECRET?.trim();
        return Boolean(secret) && safeEqual(bearer(req.headers.get('authorization')), secret);
      },
    },
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
    shouldAutoRun: () =>
      process.env.PAYLOAD_DISABLE_AUTORUN !== 'true' && !onVercel() && !isBuildPhase(),
  },
  email: emailAdapter(),
  // Self-hosted / dev: purge stale multipart temp files (see startTempUploadSweeper).
  onInit: () => startTempUploadSweeper(TEMP_UPLOAD_DIR),
  csrf: csrfOrigins(),
  telemetry: false,
}).then((config) => relabelFolderFields(applyLexicalOverrides(config)));
