import 'server-only';

import type { Locale } from '@site/lib/types';

import type { ContactInput } from './schema';

/**
 * CONTACT SINK CONTRACT - where a validated contact request goes.
 * The server action (./actions.ts) validates, de-spams and rate-limits, then
 * calls submitContact() (./submit.ts), which hands the request to the active sink.
 *
 * Implementations (./sinks), selected by env CONTACT_SINK:
 * - payload : Payload collection `contact-requests` (read in /admin -> "Liên hệ")
 * - http    : POST JSON to CONTACT_SINK_URL (another CMS, CRM, Zapier/Make,
 *             a mailer...) with Bearer token + HMAC signature (docs/CONNECT-CMS.md)
 * - log     : logs type + locale only (dev/demo). Refused in production unless
 *             CONTACT_SINK=log is set explicitly (requests would be lost).
 * Default: follows the content source - payload when CONTENT_SOURCE resolves to
 * payload, http when CONTACT_SINK_URL is set, otherwise log.
 *
 * Rules: submit() never throws (returns { ok: false }); never log the message
 * body or the full email (personal data, Decree 13/2023).
 */

export interface ContactSubmission {
  data: ContactInput;
  meta: {
    locale: Locale;
    /** Salted hash of the client IP (see ./rate-limit.ts `hashIp`). */
    ipHash: string;
    userAgent: string | null;
    submittedAt: string;
  };
}

export type SubmitContactResult = { ok: true; id: string } | { ok: false; reason: 'upstream' | 'unknown' | 'disabled' };

export type ContactSinkId = 'payload' | 'http' | 'log';

export interface ContactSink {
  readonly id: ContactSinkId;
  submit(submission: ContactSubmission): Promise<SubmitContactResult>;
  /**
   * Requests stored for `ipHash` since `sinceIso` (shared, durable rate limit).
   * Only sinks that store data can answer; without it the in-memory counter
   * of ./rate-limit.ts is the only limit (per server instance).
   * May throw (the action then reports errServer).
   */
  countRecent?(ipHash: string, sinceIso: string): Promise<number>;
}
