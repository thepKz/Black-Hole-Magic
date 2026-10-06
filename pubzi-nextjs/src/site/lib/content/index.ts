import 'server-only';

import type { ContentSourceId, NewsSource } from './source';

/**
 * Picks the content source from env (read once per process):
 *
 *   CONTENT_SOURCE=payload  Payload Local API (needs DATABASE_URI + PAYLOAD_SECRET)
 *   CONTENT_SOURCE=http     generic REST/JSON CMS (CMS_BASE_URL, ./http/mapping.ts)
 *   CONTENT_SOURCE=mock     in-memory: empty newsroom, or demo fixtures when
 *                           CONTENT_MOCK_FIXTURES=true (or outside production)
 *   (unset)                 'payload' when DATABASE_URI is set, else 'mock'
 *                           (empty) - production without a CMS shows clean empty
 *                           states and never tries to boot Payload.
 *
 * Adapters are loaded with a dynamic import so '@payload-config' (and the
 * postgres driver) is only evaluated when the payload source is active.
 */

export function contentSourceId(env: NodeJS.ProcessEnv = process.env): ContentSourceId {
  const raw = env.CONTENT_SOURCE?.trim().toLowerCase();
  if (raw === 'payload' || raw === 'http' || raw === 'mock') return raw;
  if (raw) console.warn(`[content] unknown CONTENT_SOURCE "${raw.slice(0, 20)}" - falling back to the default`);
  return env.DATABASE_URI?.trim() ? 'payload' : 'mock';
}

/**
 * True when the configured source cannot work at all (missing required env).
 * The facade then serves empty results instead of throwing on every request.
 */
export function contentSourceMisconfigured(env: NodeJS.ProcessEnv = process.env): string | null {
  switch (contentSourceId(env)) {
    case 'payload':
      if (!env.DATABASE_URI?.trim()) return 'DATABASE_URI is not set';
      if (!env.PAYLOAD_SECRET?.trim()) return 'PAYLOAD_SECRET is not set';
      return null;
    case 'http':
      return /^https?:\/\//i.test(env.CMS_BASE_URL?.trim() ?? '') ? null : 'CMS_BASE_URL is not set';
    default:
      return null;
  }
}

const mockFixturesEnabled = (env: NodeJS.ProcessEnv) =>
  env.CONTENT_MOCK_FIXTURES === 'true' ||
  (env.CONTENT_MOCK_FIXTURES !== 'false' && env.CONTENT_SOURCE?.trim().toLowerCase() === 'mock' && env.NODE_ENV !== 'production');

/**
 * Cache-key part for the active source: the id plus what changes its data
 * without changing the id (mock demo fixtures on/off, the HTTP CMS host), so
 * switching either never serves the other variant's cached results.
 */
export function contentSourceCacheKey(env: NodeJS.ProcessEnv = process.env): string {
  const id = contentSourceId(env);
  if (id === 'mock') return mockFixturesEnabled(env) ? 'mock:fixtures' : 'mock';
  if (id === 'http') {
    try {
      return `http:${new URL(env.CMS_BASE_URL?.trim() ?? '').host}`;
    } catch {
      return 'http';
    }
  }
  return id;
}

let sourcePromise: Promise<NewsSource> | null = null;

async function load(): Promise<NewsSource> {
  const id = contentSourceId();
  const problem = contentSourceMisconfigured();
  if (problem) {
    console.error(`[content] source "${id}" disabled: ${problem}. Serving an empty newsroom.`);
    const { createMockNewsSource } = await import('./mock/news-source');
    // Keep the configured id: cache keys stay stable once the env is fixed.
    return { ...createMockNewsSource({ withFixtures: false }), id };
  }
  switch (id) {
    case 'payload': {
      const { payloadNewsSource } = await import('./payload/news-source');
      return payloadNewsSource;
    }
    case 'http': {
      const { createHttpNewsSource } = await import('./http/news-source');
      return createHttpNewsSource();
    }
    case 'mock': {
      const { createMockNewsSource } = await import('./mock/news-source');
      const withFixtures = mockFixturesEnabled(process.env);
      if (!process.env.CONTENT_SOURCE && !withFixtures) {
        console.warn('[content] no CMS configured (DATABASE_URI / CONTENT_SOURCE unset): news is empty.');
      }
      return createMockNewsSource({ withFixtures });
    }
  }
}

/** The active NewsSource (memoised; a failed load is retried on the next call). */
export function getNewsSource(): Promise<NewsSource> {
  if (!sourcePromise) {
    sourcePromise = load();
    sourcePromise.catch(() => {
      sourcePromise = null;
    });
  }
  return sourcePromise;
}

export type { ContentSourceId, NewsSource } from './source';
