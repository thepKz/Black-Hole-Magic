import type { Getter } from './mapping';

/**
 * Minimal JSON client + getters for the http content source. No caching here:
 * the facade wraps calls in unstable_cache (so cache tags / webhooks work).
 */

export class CmsHttpError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = 'CmsHttpError';
  }
}

/** Reads a value with a Getter (dot path with numeric array indexes, or a function). */
export function get(obj: unknown, getter: Getter | undefined): unknown {
  if (getter == null) return undefined;
  if (typeof getter === 'function') return getter(obj);
  if (getter === '') return obj;
  let cur: unknown = obj;
  for (const key of getter.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = Array.isArray(cur) && /^\d+$/.test(key) ? cur[Number(key)] : (cur as Record<string, unknown>)[key];
  }
  return cur;
}

export const getStr = (obj: unknown, g: Getter | undefined): string | null => {
  const v = get(obj, g);
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return null;
};

export const getNum = (obj: unknown, g: Getter | undefined): number | null => {
  const v = get(obj, g);
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

export const getBool = (obj: unknown, g: Getter | undefined): boolean => {
  const v = get(obj, g);
  return v === true || v === 1 || v === 'true' || v === '1';
};

export interface FetchJsonOptions {
  token: string | null;
  timeoutMs: number;
}

/** Joins an endpoint template with the base URL and query params. */
export function buildUrl(baseUrl: string, template: string, vars: Record<string, string>, params: [string, string][]): string {
  const path = template.replace(/\{(\w+)\}/g, (_, k: string) => encodeURIComponent(vars[k] ?? ''));
  const url = new URL(/^https?:\/\//i.test(path) ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`);
  for (const [k, v] of params) url.searchParams.append(k, v);
  return url.toString();
}

export async function fetchJson(url: string, { token, timeoutMs }: FetchJsonOptions): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    // Never echo the URL query (may contain search terms) or tokens.
    throw new CmsHttpError(`request failed: ${err instanceof Error ? err.name : 'error'}`, null);
  }
  if (!res.ok) throw new CmsHttpError(`HTTP ${res.status}`, res.status);
  try {
    return await res.json();
  } catch {
    throw new CmsHttpError('invalid JSON', res.status);
  }
}
