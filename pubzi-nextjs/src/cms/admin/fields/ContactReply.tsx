'use client';

import { toast, useFormFields, useTranslation } from '@payloadcms/ui';

/**
 * `ui` field on a contact request: "Trả lời qua email" opens the editor's mail
 * app with the sender, "Re: <subject>" and the original message quoted, plus a
 * "Sao chép email" button. Nothing is sent from the CMS itself.
 */
const MAX_QUOTE = 1500; // keep the mailto: URL well under client limits

export function ContactReply() {
  const { i18n } = useTranslation();
  const en = i18n.language === 'en';
  const email = useFormFields(([f]) => f?.email?.value) as string | undefined;
  const name = useFormFields(([f]) => f?.name?.value) as string | undefined;
  const subject = useFormFields(([f]) => f?.subject?.value) as string | undefined;
  const message = useFormFields(([f]) => f?.message?.value) as string | undefined;

  if (!email) return null;

  const quoted = (message ?? '').slice(0, MAX_QUOTE).replace(/\r?\n/g, '\n> ');
  const greeting = en ? `Hello ${name ?? ''},` : `Chào ${name ?? 'bạn'},`;
  const body = `${greeting}\n\n\n\n---\n> ${quoted}${(message ?? '').length > MAX_QUOTE ? '\n> …' : ''}`;
  // The address is a validated email field; only the query part needs encoding.
  const href = `mailto:${email.trim()}?subject=${encodeURIComponent(`Re: ${subject ?? ''}`)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success(en ? 'Email copied.' : 'Đã sao chép email.');
    } catch {
      toast.error(en ? 'Could not copy.' : 'Không sao chép được, hãy chọn và sao chép thủ công.');
    }
  };

  return (
    <div className="bh-contact-reply">
      <a className="btn btn--style-primary btn--size-medium bh-contact-reply__btn" href={href}>
        {en ? 'Reply by email' : 'Trả lời qua email'}
      </a>
      <button type="button" className="btn btn--style-secondary btn--size-medium" onClick={() => void copy()}>
        {en ? 'Copy email' : 'Sao chép email'}
      </button>
      <span className="bh-contact-reply__hint">
        {en
          ? 'Opens your mail app. After replying, set the Status to "Done".'
          : 'Mở ứng dụng email của bạn. Trả lời xong, đổi Trạng thái sang "Đã xong".'}
      </span>
    </div>
  );
}

export default ContactReply;
