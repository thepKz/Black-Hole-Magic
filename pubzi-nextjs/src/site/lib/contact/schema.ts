/**
 * Contact form schema - SHARED by the client form (instant validation) and the
 * server action (authoritative validation). No server-only imports here.
 *
 * Error messages are dictionary codes, not text, so one schema serves VI + EN:
 *   'errRequired' | 'errEmail' | 'errType' | 'errMin:2' | 'errMax:100'
 * Turn them into text with `contactErrorText(code, t)`.
 */
import { z } from 'zod';

import type { Dictionary } from '@site/i18n';
import type { ContactType } from '@site/lib/types';

export const CONTACT_TYPES = ['biz', 'support', 'press', 'other'] as const satisfies readonly ContactType[];

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
} as const;

/** Form field names (also the `name` attributes of the inputs). */
export const CONTACT_FIELDS = ['name', 'email', 'type', 'subject', 'message'] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

/** Honeypot input name - real users never see or fill it. */
export const HONEYPOT_FIELD = 'website';
/** Hidden timestamp (ms) set when the form mounts; submissions faster than this are treated as bots. */
export const STARTED_AT_FIELD = 'startedAt';
export const MIN_FILL_MS = 2500;
/** Token field Cloudflare Turnstile writes into the form. */
export const TURNSTILE_FIELD = 'cf-turnstile-response';

const text = (min: number, max: number) =>
  z
    .string({ error: 'errRequired' })
    .trim()
    .min(1, { error: 'errRequired' })
    .min(min, { error: `errMin:${min}` })
    .max(max, { error: `errMax:${max}` });

export const contactSchema = z.object({
  name: text(CONTACT_LIMITS.name.min, CONTACT_LIMITS.name.max),
  email: z
    .string({ error: 'errRequired' })
    .trim()
    .min(1, { error: 'errRequired' })
    .max(CONTACT_LIMITS.email.max, { error: `errMax:${CONTACT_LIMITS.email.max}` })
    .pipe(z.email({ error: 'errEmail' })),
  type: z.enum(CONTACT_TYPES, { error: 'errType' }),
  subject: text(CONTACT_LIMITS.subject.min, CONTACT_LIMITS.subject.max),
  message: text(CONTACT_LIMITS.message.min, CONTACT_LIMITS.message.max),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactValues = Record<ContactField, string>;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export const emptyContactValues: ContactValues = { name: '', email: '', type: '', subject: '', message: '' };

/** Validate raw values. Returns parsed data or the FIRST error code per field. */
export function validateContact(
  values: Partial<Record<ContactField, unknown>>,
): { ok: true; data: ContactInput } | { ok: false; errors: ContactFieldErrors } {
  const result = contactSchema.safeParse(values);
  if (result.success) return { ok: true, data: result.data };
  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && (CONTACT_FIELDS as readonly string[]).includes(field)) {
      const key = field as ContactField;
      errors[key] ??= issue.message;
    }
  }
  return { ok: false, errors };
}

/** Validate a single field (blur / live re-validation). */
export function validateContactField(field: ContactField, value: string): string | undefined {
  const result = contactSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/** Error code -> localized text. Unknown codes fall back to errForm. */
export function contactErrorText(
  code: string | undefined,
  t: Pick<
    Dictionary,
    'errMin' | 'errMax' | 'errRequired' | 'errEmail' | 'errType' | 'errCaptcha' | 'errRateLimit' | 'errServer' | 'errHoneypot' | 'errForm'
  >,
): string | undefined {
  if (!code) return undefined;
  const [key, arg] = code.split(':');
  switch (key) {
    case 'errMin':
      return t.errMin.replace('{min}', arg ?? '');
    case 'errMax':
      return t.errMax.replace('{max}', arg ?? '');
    case 'errRequired':
    case 'errEmail':
    case 'errType':
    case 'errCaptcha':
    case 'errRateLimit':
    case 'errServer':
    case 'errHoneypot':
    case 'errForm':
      return t[key];
    default:
      return t.errForm;
  }
}

/** Result of the server action (useActionState state). */
export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success'; id: string }
  | {
      status: 'error';
      /** Form-level error code (errForm / errCaptcha / errRateLimit / errServer). */
      error: string;
      fieldErrors?: ContactFieldErrors;
    };

export const initialContactState: ContactFormState = { status: 'idle' };
