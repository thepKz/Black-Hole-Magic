import 'server-only';

import config from '@payload-config';
import { getPayload } from 'payload';

import type { ContactSink } from '../sink';

/**
 * Stores the request in the Payload collection `contact-requests`
 * (src/cms/collections/ContactRequests.ts) through the Local API with
 * `overrideAccess: true` - public REST/GraphQL create is closed.
 * Loaded only through the dynamic import in ../submit.ts.
 */
export const payloadContactSink: ContactSink = {
  id: 'payload',

  async submit({ data, meta }) {
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
        `[contact] store failed type=${data.type} locale=${meta.locale}: ${err instanceof Error ? err.message.split('\n')[0].slice(0, 200) : 'unknown error'}`,
      );
      return { ok: false, reason: 'upstream' };
    }
  },

  async countRecent(ipHash, sinceIso) {
    const payload = await getPayload({ config });
    const { totalDocs } = await payload.count({
      collection: 'contact-requests',
      overrideAccess: true,
      where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: sinceIso } }] },
    });
    return totalDocs;
  },
};
