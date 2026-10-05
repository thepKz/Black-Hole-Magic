import type { Dictionary } from '@site/i18n';

/** Dictionary keys the client contact form needs (only these are serialized to the client). */
export const CONTACT_FORM_KEYS = [
  'formKicker',
  'formTitle',
  'fName',
  'fNamePh',
  'fEmail',
  'fEmailPh',
  'fType',
  'fTypePh',
  'fSubject',
  'fSubjectPh',
  'fMsg',
  'fMsgPh',
  'send',
  'sending',
  'sent',
  'sentDesc',
  'sendAnother',
  'captchaLabel',
  'honeypotLabel',
  'privacyConsent',
  'privacy',
  'errRequired',
  'errEmail',
  'errMin',
  'errMax',
  'errType',
  'errCaptcha',
  'errRateLimit',
  'errServer',
  'errHoneypot',
  'errForm',
] as const satisfies readonly (keyof Dictionary)[];

export type ContactFormLabels = Pick<Dictionary, (typeof CONTACT_FORM_KEYS)[number]>;

export function contactFormLabels(t: Dictionary): ContactFormLabels {
  return Object.fromEntries(CONTACT_FORM_KEYS.map((k) => [k, t[k]])) as ContactFormLabels;
}
