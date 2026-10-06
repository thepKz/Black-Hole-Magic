import type { ContactSink } from '../sink';

/**
 * Development / demo sink: accepts the request and logs ONLY its type and
 * locale (no personal data). Nothing is stored - never use it in production
 * unless losing requests is acceptable (CONTACT_SINK=log must then be explicit).
 */
export const logContactSink: ContactSink = {
  id: 'log',
  async submit({ data, meta }) {
    const id = `log-${Date.now().toString(36)}`;
    console.info(`[contact] (log sink, not stored) type=${data.type} locale=${meta.locale} id=${id}`);
    return { ok: true, id };
  },
};
