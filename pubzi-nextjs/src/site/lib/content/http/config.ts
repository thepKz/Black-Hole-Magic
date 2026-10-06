import { parseMediaOrigins, type MediaOriginPattern } from '@/shared/media-origins';

/**
 * Environment of the generic REST/JSON content source (CONTENT_SOURCE=http).
 * All values are read once per process. Secrets are never logged.
 *
 *   CMS_BASE_URL         https://cms.example.com/api      (required)
 *   CMS_TOKEN            read token, sent as `Authorization: Bearer ...`   (optional)
 *   CMS_PREVIEW_TOKEN    token with draft access, used for preview reads  (optional, defaults to CMS_TOKEN)
 *   CMS_PREVIEW_SECRET   shared secret the CMS puts in /api/draft?token=  (enables preview)
 *   CMS_TIMEOUT_MS       per-request timeout, default 6000
 *   CMS_MEDIA_BASE       prefix for relative asset URLs (default: origin of CMS_BASE_URL)
 *   CONTENT_MEDIA_ORIGINS  hosts next/image may optimise (also read by next.config.ts)
 */
export interface HttpSourceConfig {
  baseUrl: string;
  token: string | null;
  previewToken: string | null;
  previewSecret: string | null;
  timeoutMs: number;
  mediaBase: string;
  mediaOrigins: MediaOriginPattern[];
}

export function readHttpConfig(env: NodeJS.ProcessEnv = process.env): HttpSourceConfig {
  const baseUrl = (env.CMS_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new Error('[content/http] CMS_BASE_URL is missing or not an http(s) URL');
  }
  const timeout = Number.parseInt(env.CMS_TIMEOUT_MS ?? '', 10);
  const token = env.CMS_TOKEN?.trim() || null;
  let mediaBase = (env.CMS_MEDIA_BASE ?? '').trim().replace(/\/+$/, '');
  if (!mediaBase) mediaBase = new URL(baseUrl).origin;
  return {
    baseUrl,
    token,
    previewToken: env.CMS_PREVIEW_TOKEN?.trim() || token,
    previewSecret: env.CMS_PREVIEW_SECRET?.trim() || null,
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? Math.min(timeout, 30_000) : 6000,
    mediaBase,
    mediaOrigins: parseMediaOrigins(env.CONTENT_MEDIA_ORIGINS),
  };
}
