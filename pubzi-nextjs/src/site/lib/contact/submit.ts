import 'server-only';

import { randomUUID } from 'node:crypto';

import type { Locale } from '@site/lib/types';
import type { ContactInput } from './schema';

/**
 * CONTACT SUBMISSION ADAPTER (MOCK).
 *
 * The contact form's server action (./actions.ts) validates, de-spams and then
 * calls `submitContact()`. This is the ONLY place that knows where a request goes.
 *
 * Current behaviour: logs a redacted summary and returns `{ ok: true }`.
 * Nothing is stored and no email is sent.
 *
 * TODO(company): plug this into the company's existing CMS / CRM / ticketing.
 * Keep the signature; replace the body, e.g.
 *
 *   const res = await fetch(process.env.CONTACT_ENDPOINT_URL!, {
 *     method: 'POST',
 *     headers: {
 *       'content-type': 'application/json',
 *       authorization: `Bearer ${process.env.CONTACT_ENDPOINT_TOKEN}`,
 *     },
 *     body: JSON.stringify({ ...submission.data, ...submission.meta }),
 *     signal: AbortSignal.timeout(8000),
 *   });
 *   if (!res.ok) return { ok: false, reason: 'upstream' };
 *   return { ok: true, id: (await res.json()).id };
 *
 * Rules for the real implementation:
 * - Never throw: return `{ ok: false }`; the form then shows t.errServer.
 * - Never log the message body or full email (personal data, Decree 13/2023).
 * - Route by `data.type` if the CMS has separate queues (biz/support/press/other);
 *   the public mailbox for each type is `site.emails[type]` in @site/data/site.
 */

export interface ContactSubmission {
  data: ContactInput;
  meta: {
    locale: Locale;
    /** Client IP (x-forwarded-for / x-real-ip), when known. */
    ip: string | null;
    userAgent: string | null;
    /** Page the form was sent from. */
    referer: string | null;
    submittedAt: string;
  };
}

export type SubmitContactResult = { ok: true; id: string } | { ok: false; reason: 'upstream' | 'unknown' };

function maskEmail(email: string): string {
  const [user = '', domain = ''] = email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
}

export async function submitContact(submission: ContactSubmission): Promise<SubmitContactResult> {
  try {
    const id = randomUUID();
    console.info(
      `[contact:mock] ${id} type=${submission.data.type} locale=${submission.meta.locale} ` +
        `from=${maskEmail(submission.data.email)} subjectLen=${submission.data.subject.length} ` +
        `messageLen=${submission.data.message.length}`,
    );
    return { ok: true, id };
  } catch {
    return { ok: false, reason: 'unknown' };
  }
}
