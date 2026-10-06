import { bearer, safeEqual } from '@/cms/lib/revalidateSecret';
import { cmsConfigured, missingRequiredEnv, onVercel } from '@/cms/lib/runtime-env';

/**
 * GET /api/health - uptime check for the CMS (point a monitor at it:
 * BetterStack, UptimeRobot, cron-job.org, Vercel checks...).
 *
 * Public response (no details):   200 { ok: true,  cms: 'up' }
 *                                 503 { ok: false, cms: 'down' | 'not-configured' }
 * With `Authorization: Bearer $CRON_SECRET` (or $HEALTH_TOKEN) it also reports
 * which pieces are wired up - variable NAMES only, never values or error text:
 *   { checks: { database, migrations, storage, jobsCron, overdueJobs, missingEnv } }
 *
 * More specific than the Payload catch-all /api/[...slug], like /api/revalidate.
 * The public site keeps working when this is 503 (news sections degrade).
 */
export const dynamic = 'force-dynamic';

const TIMEOUT_MS = 8_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

function authorized(request: Request): boolean {
  const token = bearer(request.headers.get('authorization'));
  const secrets = [process.env.HEALTH_TOKEN, process.env.CRON_SECRET].map((s) => s?.trim()).filter(Boolean);
  return secrets.some((s) => safeEqual(token, s));
}

const json = (body: unknown, status: number) =>
  Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex' },
  });

export async function GET(request: Request) {
  const detailed = authorized(request);
  const storage = process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : onVercel() ? 'MISSING (local disk is ephemeral on Vercel)' : 'local-disk';
  const jobsCron = onVercel()
    ? process.env.CRON_SECRET
      ? 'vercel-cron'
      : 'MISSING CRON_SECRET'
    : process.env.PAYLOAD_DISABLE_AUTORUN === 'true'
      ? 'external'
      : 'in-process';

  if (!cmsConfigured()) {
    return json(
      {
        ok: false,
        cms: 'not-configured',
        ...(detailed ? { checks: { missingEnv: missingRequiredEnv(), storage, jobsCron } } : {}),
      },
      503,
    );
  }

  const started = Date.now();
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('@payload-config')]);
    const payload = await withTimeout(getPayload({ config }), TIMEOUT_MS);
    // A real query: proves the connection AND that the schema exists.
    const migrations = await withTimeout(
      payload.count({ collection: 'payload-migrations', overrideAccess: true }),
      TIMEOUT_MS,
    );

    let overdueJobs: number | null = null;
    if (detailed) {
      // Scheduled publish jobs that should have run > 5 min ago = the cron is not firing.
      const overdue = await withTimeout(
        payload.count({
          collection: 'payload-jobs',
          overrideAccess: true,
          where: {
            and: [
              { completedAt: { exists: false } },
              { hasError: { not_equals: true } },
              { waitUntil: { less_than: new Date(Date.now() - 5 * 60_000).toISOString() } },
            ],
          },
        }),
        TIMEOUT_MS,
      ).catch(() => null);
      overdueJobs = overdue?.totalDocs ?? null;
    }

    return json(
      {
        ok: true,
        cms: 'up',
        ...(detailed
          ? {
              checks: {
                database: 'up',
                latencyMs: Date.now() - started,
                migrations: migrations.totalDocs,
                storage,
                jobsCron,
                overdueJobs,
                missingEnv: [],
              },
            }
          : {}),
      },
      200,
    );
  } catch {
    // Details are in the function log (Payload logs the init error); never echoed here.
    return json(
      {
        ok: false,
        cms: 'down',
        ...(detailed ? { checks: { database: 'down', latencyMs: Date.now() - started, storage, jobsCron } } : {}),
      },
      503,
    );
  }
}
