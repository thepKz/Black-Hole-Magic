'use server';

import { headers } from 'next/headers';

import { isLocale } from '@site/i18n';
import { rateLimit } from './rate-limit';
import {
  CONTACT_FIELDS,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_AT_FIELD,
  TURNSTILE_FIELD,
  validateContact,
  type ContactFormState,
} from './schema';
import { submitContact } from './submit';
import { verifyTurnstile } from './turnstile';

const IP_RE = /^[0-9a-f.:]{3,45}$/i;

/**
 * Client IP for rate limiting, from headers a TRUSTED proxy controls - never
 * the left-most X-Forwarded-For entry, which the client can forge.
 * - CLIENT_IP_HEADER (e.g. `cf-connecting-ip` behind Cloudflare, or `x-real-ip`
 *   set by your own nginx) wins when configured.
 * - Otherwise X-Forwarded-For counted from the RIGHT: TRUSTED_PROXY_HOPS
 *   (default 1) = number of proxies in front of Next that append to it.
 *   Next itself only fills XFF with the socket address when it is absent.
 */
function clientIp(h: Headers): string | null {
  const header = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  if (header) {
    const v = h.get(header)?.split(',')[0]?.trim();
    if (v && IP_RE.test(v)) return v;
  }
  const chain = (h.get('x-forwarded-for') ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!chain.length) return null;
  const hops = Math.max(1, Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? '1', 10) || 1);
  const candidate = chain[Math.max(0, chain.length - hops)];
  return candidate && IP_RE.test(candidate) ? candidate : null;
}

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v : '');

/**
 * Contact form server action (use with React `useActionState`).
 * Pipeline: honeypot + fill-time check -> zod -> Turnstile (if secret set) ->
 * rate limit -> `submitContact()` adapter (mock, see ./submit.ts).
 * Bots caught by the honeypot get a fake success so they learn nothing.
 */
export async function sendContact(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const h = await headers();
  const ip = clientIp(h);

  // 1. Spam traps (silent).
  const honeypot = str(formData.get(HONEYPOT_FIELD));
  const startedAt = Number(str(formData.get(STARTED_AT_FIELD)));
  // A missing / invalid / future stamp is treated as a bot too (the form always
  // stamps it on mount and re-applies it after an error response).
  const validStamp = Number.isFinite(startedAt) && startedAt > 0 && startedAt <= Date.now() + 60_000;
  const tooFast = !validStamp || Date.now() - startedAt < MIN_FILL_MS;
  if (honeypot.trim() !== '' || tooFast) {
    return { status: 'success', id: 'ignored' };
  }

  // 2. Validation (authoritative - the client check is only UX).
  const raw = Object.fromEntries(CONTACT_FIELDS.map((f) => [f, str(formData.get(f))]));
  const parsed = validateContact(raw);
  if (!parsed.ok) return { status: 'error', error: 'errForm', fieldErrors: parsed.errors };

  // 3. Captcha (only when TURNSTILE_SECRET_KEY is set).
  const token = str(formData.get(TURNSTILE_FIELD)) || null;
  if (!(await verifyTurnstile(token, ip))) return { status: 'error', error: 'errCaptcha' };

  // 4. Rate limit.
  // No usable IP -> one shared bucket (never "no limit").
  if (!rateLimit(`contact:${ip ?? 'unknown'}`)) return { status: 'error', error: 'errRateLimit' };

  // 5. Hand off to the adapter.
  const localeRaw = str(formData.get('locale'));
  const result = await submitContact({
    data: parsed.data,
    meta: {
      locale: isLocale(localeRaw) ? localeRaw : 'vi',
      ip,
      userAgent: h.get('user-agent'),
      referer: h.get('referer'),
      submittedAt: new Date().toISOString(),
    },
  });
  if (!result.ok) return { status: 'error', error: 'errServer' };
  return { status: 'success', id: result.id };
}
