/**
 * Which absolute media hosts next/image may optimise (CMS / CDN images).
 * Read by next.config.ts (images.remotePatterns) AND by content adapters (to
 * flag other hosts `unoptimized` instead of letting /_next/image fail with 400).
 *
 * env CONTENT_MEDIA_ORIGINS = comma-separated origins with an optional path prefix:
 *   https://cdn.example.com, https://cms.example.com/uploads
 * (exact hosts, no wildcards - same rules as next.config.ts contentMediaPatterns()).
 * Root-relative URLs (/api/media/file/..., /site/...) are always local and allowed.
 * Pure (no deps) - safe in next.config, server and scripts.
 */
export interface MediaOriginPattern {
  protocol: 'http' | 'https';
  hostname: string;
  port: string;
  pathname: string;
}

export function parseMediaOrigins(raw: string | null | undefined): MediaOriginPattern[] {
  const out: MediaOriginPattern[] = [];
  for (const part of (raw ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
    try {
      const url = new URL(part);
      const protocol = url.protocol.replace(':', '');
      if (protocol !== 'http' && protocol !== 'https') continue;
      out.push({ protocol: protocol as MediaOriginPattern['protocol'], hostname: url.hostname.toLowerCase(), port: url.port, pathname: `${url.pathname.replace(/\/+$/, '')}/**` });
    } catch {
      // ignore malformed entries
    }
  }
  return out;
}

/** True for root-relative URLs and absolute URLs matching one of `patterns`. */
export function isOptimizableMediaUrl(src: string, patterns: MediaOriginPattern[]): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  return patterns.some((p) => {
    if (url.protocol !== `${p.protocol}:`) return false;
    if (p.hostname !== url.hostname.toLowerCase()) return false;
    if ((p.port || '') !== (url.port || '')) return false;
    const prefix = p.pathname.replace(/\/\*\*$/, '');
    return !prefix || url.pathname === prefix || url.pathname.startsWith(`${prefix}/`);
  });
}
