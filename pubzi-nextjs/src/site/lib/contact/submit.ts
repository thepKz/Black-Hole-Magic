import 'server-only';

import config from '@payload-config';
import { getPayload } from 'payload';

import type { Locale } from '@site/lib/types';
import type { ContactInput } from './schema';

/**
 * CONTACT SUBMISSION ADAPTER.
 *
 * The contact server action (./actions.ts) validates, de-spams and rate-limits,
 * then calls `submitContact()`. This is the ONLY place that knows where a request goes.
 *
 * Current behaviour: stores the request in the Payload collection
 * `contact-requests` (src/cms/collections/ContactRequests.ts) through the Local
 * API with `overrideAccess: true` - public REST/GraphQL create is closed.
 * CMS users read it in /admin -> "Hộp thư" -> "Liên hệ".
 *
 * TODO(email): once SMTP is configured, add `@payloadcms/email-nodemailer` to
 * payload.config.ts and send (a) a notification to `site.emails[data.type]`
 * and (b) a confirmation to the sender - best done in an `afterChange` hook
 * (operation === 'create') on the collection so this signature stays as is.
 *
 * Rules:
 * - Never throw: return `{ ok: false }`; the form then shows t.errServer.
 * - Never log the message body or full email (personal data, Decree 13/2023).
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

export type SubmitContactResult = { ok: true; id: string } | { ok: false; reason: 'upstream' | 'unknown' };

export async function submitContact(submission: ContactSubmission): Promise<SubmitContactResult> {
  const { data, meta } = submission;
  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: 'contact-requests',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        type: data.type,
        subject: data.subject,
        message: data.message,
        locale: meta.locale,
        status: 'new',
        ipHash: meta.ipHash,
        userAgent: meta.userAgent ? meta.userAgent.slice(0, 512) : null,
      },
    });
    return { ok: true, id: String(doc.id) };
  } catch (err) {
    console.error(
      `[contact] store failed type=${data.type} locale=${meta.locale}: ${err instanceof Error ? err.message : 'unknown error'}`,
    );
    return { ok: false, reason: 'upstream' };
  }
}
