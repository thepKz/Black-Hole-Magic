import { createHmac, randomUUID } from 'node:crypto';

import type { ContactSink, ContactSubmission, SubmitContactResult } from '../sink';

/**
 * Generic webhook sink (CONTACT_SINK=http): POSTs every request as JSON to
 * CONTACT_SINK_URL - another CMS, a CRM, Zapier/Make, a mail relay...
 *
 *   POST $CONTACT_SINK_URL
 *   Content-Type: application/json
 *   Authorization: Bearer $CONTACT_SINK_TOKEN          (when set)
 *   X-Signature: sha256=<hex HMAC-SHA256(raw body, $CONTACT_SINK_SECRET)>  (when set)
 *   Idempotency-Key: <uuid>                           (same on the retry)
 *   {
 *     "type": "contact.created",
 *     "data": { "name", "email", "type": "biz|support|press|other", "subject", "message" },
 *     "meta": { "locale": "vi|en", "ipHash", "userAgent", "submittedAt" }
 *   }
 *   -> 2xx, optionally { "id": "..." }
 *
 * 8 s timeout, one retry on network errors / 5xx. Never logs the body.
 */

const TIMEOUT_MS = 8000;

export interface HttpSinkConfig {
  url: string;
  token: string | null;
  secret: string | null;
}

export function readHttpSinkConfig(env: NodeJS.ProcessEnv = process.env): HttpSinkConfig | null {
  const url = env.CONTACT_SINK_URL?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return { url, token: env.CONTACT_SINK_TOKEN?.trim() || null, secret: env.CONTACT_SINK_SECRET?.trim() || null };
}

export function contactWebhookBody({ data, meta }: ContactSubmission): string {
  return JSON.stringify({
    type: 'contact.created',
    data: { name: data.name, email: data.email, type: data.type, subject: data.subject, message: data.message },
    meta: { locale: meta.locale, ipHash: meta.ipHash, userAgent: meta.userAgent?.slice(0, 512) ?? null, submittedAt: meta.submittedAt },
  });
}

export function createHttpContactSink(cfg: HttpSinkConfig): ContactSink {
  async function post(body: string, idempotencyKey: string): Promise<Response> {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      accept: 'application/json',
      'idempotency-key': idempotencyKey,
    };
    if (cfg.token) headers.authorization = `Bearer ${cfg.token}`;
    if (cfg.secret) headers['x-signature'] = `sha256=${createHmac('sha256', cfg.secret).update(body, 'utf8').digest('hex')}`;
    return fetch(cfg.url, { method: 'POST', headers, body, cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT_MS) });
  }

  return {
    id: 'http',
    async submit(submission): Promise<SubmitContactResult> {
      const body = contactWebhookBody(submission);
      const key = randomUUID();
      const scope = `type=${submission.data.type} locale=${submission.meta.locale}`;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await post(body, key);
          if (res.ok) {
            let id: string = key;
            try {
              const json = (await res.json()) as { id?: unknown };
              if (typeof json?.id === 'string' || typeof json?.id === 'number') id = String(json.id);
            } catch {
              // empty / non-JSON 2xx is fine
            }
            return { ok: true, id };
          }
          console.error(`[contact] webhook HTTP ${res.status} ${scope} attempt=${attempt}`);
          if (res.status < 500) return { ok: false, reason: 'upstream' };
        } catch (err) {
          console.error(`[contact] webhook ${err instanceof Error ? err.name : 'error'} ${scope} attempt=${attempt}`);
        }
      }
      return { ok: false, reason: 'upstream' };
    },
    // No countRecent: the webhook target is not queried; ./rate-limit.ts uses
    // its in-memory counter (per instance) - see TODO there.
  };
}
