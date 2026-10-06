import 'server-only';

import type { ContactSink, ContactSinkId, ContactSubmission, SubmitContactResult } from './sink';

/**
 * CONTACT SUBMISSION ADAPTER - the ONLY place that knows where a request goes.
 *
 * The contact server action (./actions.ts) validates, de-spams and rate-limits,
 * then calls `submitContact()`, which forwards to the active ContactSink
 * (./sink.ts for the contract, ./sinks/* for payload | http | log), selected
 * by env CONTACT_SINK. Default (unset):
 *   - CONTACT_SINK_URL set                    -> http
 *   - DATABASE_URI set (Payload content)      -> payload
 *   - otherwise                               -> log in dev; DISABLED in production
 *     (the form reports an error instead of silently dropping requests).
 *
 * TODO(email): once SMTP is configured, add `@payloadcms/email-nodemailer` to
 * payload.config.ts and notify `site.emails[data.type]` from an `afterChange`
 * hook on `contact-requests` (operation === 'create') - this file stays as is.
 *
 * Rules:
 * - Never throw: return `{ ok: false }`; the form then shows t.errServer.
 * - Never log the message body or full email (personal data, Decree 13/2023).
 */

export type { ContactSubmission, SubmitContactResult } from './sink';

export function contactSinkId(env: NodeJS.ProcessEnv = process.env): ContactSinkId | null {
  const raw = env.CONTACT_SINK?.trim().toLowerCase();
  if (raw === 'payload' || raw === 'http' || raw === 'log') return raw;
  if (env.CONTACT_SINK_URL?.trim()) return 'http';
  const content = env.CONTENT_SOURCE?.trim().toLowerCase();
  if (content !== 'http' && content !== 'mock' && env.DATABASE_URI?.trim()) return 'payload';
  return env.NODE_ENV === 'production' ? null : 'log';
}

let sinkPromise: Promise<ContactSink | null> | null = null;

async function loadSink(): Promise<ContactSink | null> {
  const id = contactSinkId();
  switch (id) {
    case 'payload': {
      if (!process.env.DATABASE_URI?.trim()) {
        console.error('[contact] CONTACT_SINK=payload but DATABASE_URI is not set: contact form disabled.');
        return null;
      }
      return (await import('./sinks/payload')).payloadContactSink;
    }
    case 'http': {
      const { createHttpContactSink, readHttpSinkConfig } = await import('./sinks/http');
      const cfg = readHttpSinkConfig();
      if (!cfg) {
        console.error('[contact] CONTACT_SINK=http but CONTACT_SINK_URL is missing/invalid: contact form disabled.');
        return null;
      }
      return createHttpContactSink(cfg);
    }
    case 'log':
      return (await import('./sinks/log')).logContactSink;
    default:
      console.error('[contact] no contact sink configured in production (CONTACT_SINK / CONTACT_SINK_URL / DATABASE_URI).');
      return null;
  }
}

/** The active sink, or null when none is usable (memoised; a failed load is retried). */
export function getContactSink(): Promise<ContactSink | null> {
  if (!sinkPromise) {
    sinkPromise = loadSink();
    sinkPromise.catch(() => {
      sinkPromise = null;
    });
  }
  return sinkPromise;
}

export async function submitContact(submission: ContactSubmission): Promise<SubmitContactResult> {
  try {
    const sink = await getContactSink();
    if (!sink) return { ok: false, reason: 'disabled' };
    return await sink.submit(submission);
  } catch (err) {
    console.error(`[contact] submit failed type=${submission.data.type}: ${err instanceof Error ? err.name : 'error'}`);
    return { ok: false, reason: 'unknown' };
  }
}
