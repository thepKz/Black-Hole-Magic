import type { PayloadRequest } from 'payload';
import { APIError } from 'payload';

/**
 * Auth hardening helpers for the `users` collection (src/cms/collections/Users.ts):
 * client IP, a per-IP attempt limiter for login / forgot-password, and the
 * password policy.
 *
 * The limiter is in-memory, i.e. per server instance. On a single server that
 * is exact; on serverless (Vercel) each warm instance counts separately, so put
 * a WAF / firewall rate-limit rule on POST /api/users/login and
 * /api/users/forgot-password as well. Payload's own per-ACCOUNT lock
 * (maxLoginAttempts / lockTime) still applies on top.
 */

const IP_RE = /^[0-9a-f:.]{2,45}$/i;

/**
 * Client IP from headers a TRUSTED proxy controls (same rules as the contact
 * form, src/site/lib/contact/actions.ts): CLIENT_IP_HEADER when set (e.g.
 * `x-real-ip` on Vercel, `cf-connecting-ip` behind Cloudflare), else
 * X-Forwarded-For counted from the right (TRUSTED_PROXY_HOPS, default 1).
 */
export function clientIp(headers: Headers | undefined | null): string | null {
  if (!headers) return null;
  const header = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  if (header) {
    const v = headers.get(header)?.split(',')[0]?.trim();
    if (v && IP_RE.test(v)) return v;
  }
  const chain = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!chain.length) return headers.get('x-real-ip')?.trim() || null;
  const hops = Math.max(1, Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? '1', 10) || 1);
  const candidate = chain[Math.max(0, chain.length - hops)];
  return candidate && IP_RE.test(candidate) ? candidate : null;
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  // Still full (an attack from many IPs): drop the oldest half.
  if (buckets.size >= MAX_KEYS) {
    let i = 0;
    for (const k of buckets.keys()) {
      if (i++ > MAX_KEYS / 2) break;
      buckets.delete(k);
    }
  }
}

export const AUTH_LIMITS = {
  login: { max: 10, windowMs: 15 * 60 * 1000 },
  forgotPassword: { max: 5, windowMs: 60 * 60 * 1000 },
} as const;

/**
 * Counts one attempt for `scope` + IP and throws a Vietnamese 429 once the
 * window's budget is spent. Requests without a resolvable IP share one bucket
 * per scope only when no proxy header exists at all (local dev).
 */
export function hitAuthLimit(scope: keyof typeof AUTH_LIMITS, req: PayloadRequest, now = Date.now()): void {
  if (req.payloadAPI === 'local') return; // scripts / server code, not a browser
  const { max, windowMs } = AUTH_LIMITS[scope];
  const key = `${scope}:${clientIp(req.headers) ?? 'unknown'}`;
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  b.count += 1;
  if (b.count > max) {
    const minutes = Math.max(1, Math.ceil((b.resetAt - now) / 60_000));
    throw new APIError(
      scope === 'login'
        ? `Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ${minutes} phút.`
        : `Bạn đã yêu cầu đặt lại mật khẩu quá nhiều lần. Vui lòng thử lại sau ${minutes} phút.`,
      429,
      null,
      true,
    );
  }
}

/** A successful login clears the IP's login budget (an office NAT shares one IP). */
export function resetAuthLimit(scope: keyof typeof AUTH_LIMITS, req: PayloadRequest): void {
  buckets.delete(`${scope}:${clientIp(req.headers) ?? 'unknown'}`);
}

/** Test helper. */
export function _resetAllAuthLimits(): void {
  buckets.clear();
}

// ---------------------------------------------------------------------------
// Password policy
// ---------------------------------------------------------------------------

export const PASSWORD_MIN_LENGTH = 12;

/** Short list of the most common leaked passwords / patterns (lowercase). */
const COMMON = new Set([
  '123456789012',
  '1234567890123',
  'password1234',
  'password12345',
  'matkhau12345',
  'matkhau123456',
  'qwertyuiop12',
  'qwerty123456',
  'abc123456789',
  'admin1234567',
  'administrator',
  '111111111111',
  '000000000000',
  'iloveyou1234',
  'blackhole123',
  'blackhole1234',
  'blackholegame',
  'blackholegame1',
  'blackholegame123',
]);

/** Returns a Vietnamese error, or null when the password is acceptable. */
export function passwordProblem(password: string, email?: string | null): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Mật khẩu cần ít nhất ${PASSWORD_MIN_LENGTH} ký tự. Gợi ý: dùng một cụm 3–4 từ dễ nhớ, ví dụ "may-chu-moi-thang-10".`;
  }
  if (password.length > 128) return 'Mật khẩu tối đa 128 ký tự.';
  const lower = password.toLowerCase();
  if (COMMON.has(lower) || /^(.)\1+$/.test(password) || /^(0123456789|1234567890)+\d*$/.test(password)) {
    return 'Mật khẩu này quá phổ biến, dễ bị dò. Hãy chọn mật khẩu khác.';
  }
  const local = email?.split('@')[0]?.toLowerCase();
  if (local && local.length >= 4 && lower.includes(local)) {
    return 'Mật khẩu không được chứa tên email của bạn.';
  }
  return null;
}
