/**
 * Deployment environment helpers for the Payload config (no secrets are ever
 * logged - only variable NAMES).
 *
 * Targets:
 * - Local dev  : docker Postgres on 127.0.0.1:5440, media on local disk,
 *                schema synced by drizzle `push`, jobs run in-process.
 * - Vercel     : hosted Postgres (Neon), media on Vercel Blob, schema from
 *                migrations (applied in the build, see scripts/vercel-build.mjs),
 *                jobs run by a cron hitting /api/payload-jobs/run.
 * - Self-host  : `next start` on a VM - like Vercel but jobs may run in-process.
 * Full runbook: docs/DEPLOY-ADMIN.md.
 */

/**
 * Postgres connection string. Only DATABASE_URI (the public site's content
 * switch, src/site/lib/content, reads the same name). The Vercel <-> Neon
 * integration creates DATABASE_URL: copy its value into DATABASE_URI
 * (docs/DEPLOY-ADMIN.md).
 */
export const databaseUri = (): string => (process.env.DATABASE_URI || '').trim();

/** Running on Vercel (build or functions). Vercel sets VERCEL=1. */
export const onVercel = (): boolean => Boolean(process.env.VERCEL);

/** `next build` (any platform). */
export const isBuildPhase = (): boolean => process.env.NEXT_PHASE === 'phase-production-build';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'host.docker.internal', 'postgres', 'db']);

/** Hostname of DATABASE_URI, or null when unset / unparsable. */
export function databaseHost(uri = databaseUri()): string | null {
  if (!uri) return null;
  try {
    return new URL(uri).hostname.toLowerCase() || null;
  } catch {
    return null;
  }
}

/**
 * drizzle `push` (auto-sync the schema to the config, may DROP columns) is only
 * allowed against a LOCAL dev database, never in production. This also stops a
 * laptop script (`npm run seed`, NODE_ENV unset) from push-syncing the dev schema
 * into the production database - which would corrupt the migration history.
 * Override for an unusual local setup: PAYLOAD_DB_PUSH=true|false.
 */
export function allowSchemaPush(): boolean {
  const flag = process.env.PAYLOAD_DB_PUSH?.trim().toLowerCase();
  if (flag === 'false') return false;
  if (process.env.NODE_ENV === 'production') return false;
  if (flag === 'true') return true;
  const host = databaseHost();
  return host !== null && LOCAL_HOSTS.has(host);
}

/** Postgres pool sized for serverless (many small instances) or a long-lived server. */
export function poolConfig() {
  const max = Number(process.env.DB_POOL_MAX);
  return {
    connectionString: databaseUri(),
    // pg default is 10 per instance; Vercel can run many instances at once.
    max: Number.isFinite(max) && max > 0 ? max : onVercel() ? 3 : 10,
    // Close idle clients quickly so suspended functions don't hold connections.
    idleTimeoutMillis: onVercel() ? 5_000 : 30_000,
    // pg default 0 = wait forever: an unreachable DB would hang every request
    // (and `next build`) until the platform timeout instead of failing fast.
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 5_000,
    allowExitOnIdle: true,
  };
}

/** Required at runtime for /admin and /api. */
const REQUIRED_RUNTIME_ENV = ['DATABASE_URI', 'PAYLOAD_SECRET'] as const;

/** Recommended on Vercel production (missing = a feature silently degrades). */
const RECOMMENDED_VERCEL_ENV = ['NEXT_PUBLIC_SITE_URL', 'BLOB_READ_WRITE_TOKEN', 'CRON_SECRET'] as const;

export const missingRequiredEnv = (): string[] =>
  REQUIRED_RUNTIME_ENV.filter((k) => (k === 'DATABASE_URI' ? !databaseUri() : !process.env[k]?.trim()));

/** Whether the CMS has what it needs to start (DB + secret). */
export const cmsConfigured = (): boolean => missingRequiredEnv().length === 0;

let reported = false;

/**
 * One log line (per process) naming missing variables. Never throws: the public
 * site imports this config too and must keep rendering without a CMS
 * (news sections degrade to empty); /admin then shows the global error page.
 */
export function reportEnvProblems(): void {
  if (reported) return;
  reported = true;
  const missing = missingRequiredEnv();
  const productionRuntime = process.env.NODE_ENV === 'production' && !isBuildPhase();
  if (missing.length && (productionRuntime || isBuildPhase())) {
    console.error(
      `[cms] CMS is NOT configured - missing env: ${missing.join(', ')}. /admin and /api/* will fail until they are set (docs/DEPLOY-ADMIN.md).`,
    );
  }
  if (onVercel() && process.env.VERCEL_ENV === 'production') {
    const soft = RECOMMENDED_VERCEL_ENV.filter((k) => !process.env[k]?.trim());
    if (soft.length) console.warn(`[cms] Recommended env not set on Vercel production: ${soft.join(', ')} (docs/DEPLOY-ADMIN.md).`);
  }
  if (process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET.length < 32 && productionRuntime) {
    console.warn('[cms] PAYLOAD_SECRET is shorter than 32 characters - use a long random value.');
  }
}

let sweeperStarted = false;

/**
 * Long-lived servers only: Payload's multipart parser writes temp files BEFORE
 * auth/access run, and does not delete them for requests that never reach an
 * upload collection (a guest POSTing a big multipart body to /api/users/login
 * leaves it behind). Delete files older than 1 h from `dir` every 30 min.
 * Timer is unref'd (never keeps a CLI process alive).
 */
export function startTempUploadSweeper(dir: string): void {
  if (sweeperStarted || onVercel() || isBuildPhase()) return;
  sweeperStarted = true;
  const sweep = async () => {
    try {
      const { readdir, stat, unlink } = await import('fs/promises');
      const { join } = await import('path');
      const cutoff = Date.now() - 60 * 60_000;
      for (const name of await readdir(dir).catch(() => [] as string[])) {
        const file = join(dir, name);
        const info = await stat(file).catch(() => null);
        if (info?.isFile() && info.mtimeMs < cutoff) await unlink(file).catch(() => {});
      }
    } catch {
      // best effort
    }
  };
  void sweep();
  setInterval(sweep, 30 * 60_000).unref();
}

/** https origin from a bare Vercel host env var (VERCEL_URL etc. have no scheme). */
const vercelOrigin = (host: string | undefined): string | null => {
  const h = host?.trim().replace(/\/+$/, '');
  if (!h || !/^[a-z0-9.-]+(:\d+)?$/i.test(h)) return null;
  return `https://${h}`;
};

/** Extra admin origins on Vercel: this deployment, its branch alias, and the production domain. */
export function platformOrigins(): string[] {
  if (!onVercel()) return [];
  return [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .map(vercelOrigin)
    .filter((o): o is string => Boolean(o));
}

/** https://www.x <-> https://x so an un-redirected www host still keeps the admin session. */
export function wwwTwin(origin: string): string | null {
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.port || /^(localhost|\d+\.\d+\.\d+\.\d+)$/.test(url.hostname)) return null;
    const host = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`;
    return host.split('.').length >= 2 ? `https://${host}` : null;
  } catch {
    return null;
  }
}
