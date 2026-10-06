#!/usr/bin/env node
/**
 * Vercel build command (vercel.json "buildCommand": "npm run vercel-build").
 *
 *   1. `payload migrate`  - only for the PRODUCTION deployment (VERCEL_ENV=production)
 *      or when MIGRATE_ON_BUILD=true (e.g. a Preview with its own Neon branch DB).
 *      Uses DATABASE_URI_UNPOOLED when set (migrations take advisory locks and run
 *      DDL; Neon's -pooler endpoint is PgBouncer in transaction mode).
 *      A failing migration FAILS THE BUILD, so new code never goes live on an
 *      old schema.
 *   2. `next build`.
 *
 * Why migrate here and not `prodMigrations` (migrate on server start):
 * - runs once per deploy instead of being checked on every cold start;
 * - no race between many cold functions on the first request after a deploy;
 * - a broken migration stops the deploy instead of 500-ing the live site.
 *
 * Without DATABASE_URI the build continues (the site renders with empty news
 * sections, /admin shows the "CMS chưa được cấu hình" page) and logs why.
 * Secrets are never printed.
 */
import { spawnSync } from 'node:child_process';

const env = { ...process.env };
const vercelEnv = env.VERCEL_ENV || '';
const wantMigrate = vercelEnv === 'production' || env.MIGRATE_ON_BUILD === 'true';
const skipMigrate = env.SKIP_MIGRATE === 'true';

function run(cmd, args, extraEnv = {}) {
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...env, ...extraEnv },
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

if (!wantMigrate || skipMigrate) {
  console.log(
    `[vercel-build] skip migrations (VERCEL_ENV=${vercelEnv || 'unset'}${skipMigrate ? ', SKIP_MIGRATE=true' : ''}).`,
  );
} else if (!env.DATABASE_URI || !env.PAYLOAD_SECRET) {
  console.warn(
    '[vercel-build] DATABASE_URI / PAYLOAD_SECRET not set - skipping migrations. /admin stays disabled until they are configured (docs/DEPLOY-ADMIN.md).',
  );
} else {
  // Our name first, then the ones the Vercel <-> Neon integration creates.
  const unpooled = env.DATABASE_URI_UNPOOLED || env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL_NON_POOLING || '';
  console.log(`[vercel-build] payload migrate (${unpooled ? 'unpooled' : 'DATABASE_URI'} connection)...`);
  run('npx', ['payload', 'migrate'], {
    NODE_ENV: 'production',
    NODE_OPTIONS: '--no-deprecation',
    PAYLOAD_DISABLE_AUTORUN: 'true',
    PAYLOAD_DISABLE_REVALIDATE: 'true',
    ...(unpooled ? { DATABASE_URI: unpooled } : {}),
  });
}

run('npm', ['run', 'build']);
