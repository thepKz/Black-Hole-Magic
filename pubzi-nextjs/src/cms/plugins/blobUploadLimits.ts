import { generateClientTokenFromReadWriteToken, getPayloadFromClientToken } from '@vercel/blob/client';
import type { Config, Endpoint, PayloadHandler, Plugin } from 'payload';

import { IMAGE_MAX_BYTES, VIDEO_MAX_BYTES } from '../lib/uploads';

/**
 * Size cap for Vercel Blob CLIENT uploads (browser -> Blob directly).
 *
 * @payloadcms/storage-vercel-blob mints the upload token without
 * `maximumSizeInBytes`, so any logged-in user could put an object of any size
 * into the store, and Payload then trusts the size the browser CLAIMS when it
 * creates the document (videos are even streamed whole into the function's
 * /tmp). This plugin wraps the plugin's token route and re-signs every token
 * with a per-collection cap, which Vercel Blob enforces server-side: an
 * oversized file is refused before it is stored.
 *
 * Must run AFTER vercelBlobStorage in `plugins` (it edits the endpoint that
 * plugin registers). No-op when Blob storage is disabled (no token).
 * uploadGuard (lib/uploads.ts) additionally re-checks the real byte size.
 */

const ROUTE_PREFIX = '/vercel-blob-client-upload-route';

/** Storage prefix -> cap. Keep in sync with the `collections` prefixes in payload.config. */
const CAP_BY_PREFIX: Record<string, number> = {
  videos: VIDEO_MAX_BYTES,
  media: IMAGE_MAX_BYTES,
};

export function capForPathname(pathname: string | undefined): number {
  const prefix = (pathname ?? '').replace(/^\/+/, '').split('/')[0];
  return CAP_BY_PREFIX[prefix] ?? IMAGE_MAX_BYTES;
}

function wrap(handler: PayloadHandler, token: string): PayloadHandler {
  return async (req) => {
    const res = await handler(req);
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('application/json')) return res;
    const body = (await res.clone().json().catch(() => null)) as { type?: string; clientToken?: unknown } | null;
    if (body?.type !== 'blob.generate-client-token' || typeof body.clientToken !== 'string') return res;

    const decoded = getPayloadFromClientToken(body.clientToken);
    const cap = capForPathname(decoded.pathname);
    const maximumSizeInBytes = Math.min(decoded.maximumSizeInBytes ?? cap, cap);
    const clientToken = await generateClientTokenFromReadWriteToken({ ...decoded, maximumSizeInBytes, token });
    return Response.json({ ...body, clientToken }, { status: res.status });
  };
}

export const blobUploadLimits =
  (token: string | undefined): Plugin =>
  (config: Config): Config => {
    if (!token || !config.endpoints) return config;
    return {
      ...config,
      endpoints: config.endpoints.map((ep): Endpoint =>
        ep.path?.startsWith(ROUTE_PREFIX) && ep.method === 'post' ? { ...ep, handler: wrap(ep.handler, token) } : ep,
      ),
    };
  };
