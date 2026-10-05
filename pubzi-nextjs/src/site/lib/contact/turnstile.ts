import 'server-only';

/**
 * Cloudflare Turnstile (optional).
 * - The widget renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * - The server verifies only when TURNSTILE_SECRET_KEY is set.
 * Leave both empty to disable the captcha (honeypot + timing + rate limit still apply).
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

/** True when the token is valid (or verification is disabled). */
export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
