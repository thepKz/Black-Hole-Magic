'use client';

import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

import { track } from '@site/components/analytics/track';
import { Button } from '@site/components/ui/Button';
import { Field } from '@site/components/ui/Field';
import { Input } from '@site/components/ui/Input';
import { Select, type SelectOption } from '@site/components/ui/Select';
import { Textarea } from '@site/components/ui/Textarea';
import { sendContact } from '@site/lib/contact/actions';
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  contactErrorText,
  emptyContactValues,
  initialContactState,
  validateContact,
  validateContactField,
  type ContactField,
  type ContactFieldErrors,
  type ContactFormState,
  type ContactValues,
} from '@site/lib/contact/schema';
import { cn } from '@site/lib/cn';
import type { Locale } from '@site/lib/types';
import type { ContactFormLabels } from './labels';
import { Turnstile } from './Turnstile';

/**
 * Focus ring that FADES (motion rules: no box-shadow transitions). The control's
 * own instant ring is switched off (`ringOff`); the ring lives on this wrapper's
 * ::after and only its opacity animates. Red when the control is invalid.
 */
function FocusFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        'relative rounded-md',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-[0_0_0_3px_rgb(141_77_255/0.22)]',
        'after:transition-opacity after:duration-(--dur-2) after:ease-standard focus-within:after:opacity-100',
        'has-[[aria-invalid=true]]:after:shadow-[0_0_0_3px_rgb(196_48_26/0.16)]',
      )}
    >
      {children}
    </div>
  );
}
const ringOff = 'focus:ring-0!';

/**
 * Field error messages (rendered by <Field> as `#…-error`) and the form alert
 * enter with a short fade + 4px drop via @starting-style. They only ever mount
 * after an interaction, so the first paint never animates.
 */
const errorEnter =
  '[&_[id$=-error]]:transition-[opacity,translate] [&_[id$=-error]]:duration-(--dur-2) [&_[id$=-error]]:ease-standard [&_[id$=-error]]:starting:-translate-y-1 [&_[id$=-error]]:starting:opacity-0';

export interface ContactFormProps {
  locale: Locale;
  labels: ContactFormLabels;
  /** Request type options (value = ContactType, label already localized). */
  typeOptions: SelectOption[];
  /** Locale-prefixed privacy page path. */
  privacyHref: string;
  /** NEXT_PUBLIC_TURNSTILE_SITE_KEY (empty -> no captcha). */
  turnstileSiteKey?: string;
  className?: string;
}

/**
 * Contact form (design v2 right column). zod on the client for instant feedback,
 * the server action re-validates. Honeypot + fill-time trap, optional Turnstile,
 * pending state and a success panel.
 */
export function ContactForm({ locale, labels: t, typeOptions, privacyHref, turnstileSiteKey, className }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendContact, initialContactState);
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submits, setSubmits] = useState(0);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  // Sync server results into local UI state (React "adjust state on prop change" pattern).
  const [seenState, setSeenState] = useState<ContactFormState>(state);
  if (state !== seenState) {
    setSeenState(state);
    setSubmits((n) => n + 1);
    if (state.status === 'error') {
      setErrors(state.fieldErrors ?? {});
      setFormError(state.error);
    } else {
      setFormError(null);
    }
  }

  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  // Height of the form when it was sent: the success panel keeps it (no jump).
  const [sentHeight, setSentHeight] = useState(0);

  const showSuccess = state.status === 'success' && state.id !== dismissedId;

  // Fill-time trap: stamp when a fresh form mounts / after "send another". React
  // resets uncontrolled inputs after each action, so the ORIGINAL stamp is
  // re-applied after an error response. Without JS the field stays empty and the
  // server treats that as "unknown" (honeypot / Turnstile / rate limit still apply).
  const stampRef = useRef(0);
  useEffect(() => {
    if (showSuccess) {
      stampRef.current = 0;
      return;
    }
    if (!stampRef.current) stampRef.current = Date.now();
    if (startedRef.current) startedRef.current.value = String(stampRef.current);
  }, [state, showSuccess]);

  // After a server response: analytics + focus management.
  useEffect(() => {
    if (state.status === 'success') {
      if (state.id !== 'ignored') track('contact_submit', { form: 'contact', status: 'success', locale });
      successRef.current?.focus();
    } else if (state.status === 'error') {
      track('contact_submit', { form: 'contact', status: 'error', error: state.error, locale });
      const first = CONTACT_FIELDS.find((f) => state.fieldErrors?.[f]);
      const el = first ? formRef.current?.elements.namedItem(first) : null;
      if (el instanceof HTMLElement) el.focus();
      else alertRef.current?.focus();
    }
  }, [state, locale]);

  const setField = (field: ContactField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field] || errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateContactField(field, value) }));
    }
  };

  const onBlur = (field: ContactField) => {
    setTouched((s) => ({ ...s, [field]: true }));
    if (values[field] !== '') setErrors((e) => ({ ...e, [field]: validateContactField(field, values[field]) }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const result = validateContact(values);
    const needsCaptcha = Boolean(turnstileSiteKey) && !token;
    if (!result.ok || needsCaptcha) {
      e.preventDefault();
      setTouched(Object.fromEntries(CONTACT_FIELDS.map((f) => [f, true])));
      setErrors(result.ok ? {} : result.errors);
      setFormError(!result.ok ? 'errForm' : 'errCaptcha');
      const first = result.ok ? null : CONTACT_FIELDS.find((f) => result.errors[f]);
      const el = first ? e.currentTarget.elements.namedItem(first) : null;
      if (el instanceof HTMLElement) el.focus();
      else alertRef.current?.focus();
      return;
    }
    setFormError(null);
    setSentHeight(e.currentTarget.offsetHeight);
  };

  const sendAnother = () => {
    if (state.status === 'success') setDismissedId(state.id);
    setValues(emptyContactValues);
    setErrors({});
    setTouched({});
    setFormError(null);
  };

  const err = (field: ContactField) => contactErrorText(errors[field], t);
  // Design v2 form card. While the visitor is in the form, a soft shadow-md fades
  // in on ::after (opacity only) - the card "wakes up" instead of lifting.
  const cardClass = cn(
    'relative rounded-xl bg-surface p-5 shadow-sm sm:p-7',
    'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-md',
    'after:transition-opacity after:duration-(--dur-3) after:ease-standard focus-within:after:opacity-100',
    className,
  );
  // Panels that replace each other (form <-> success) cross in with fade + slight scale.
  const swapEnter = 'transition-[opacity,scale] duration-(--dur-3) ease-emphasized starting:scale-[0.98] starting:opacity-0';

  if (showSuccess) {
    return (
      <div
        className={cn(cardClass, swapEnter, 'flex min-h-[420px] flex-col items-center justify-center gap-4 text-center')}
        style={sentHeight ? { minHeight: sentHeight } : undefined}
        role="status"
      >
        <span className="grid size-16 place-items-center rounded-full bg-success/12 text-success transition-[opacity,scale] delay-100 duration-(--dur-3) ease-emphasized starting:scale-50 starting:opacity-0">
          <CheckCircleIcon size={36} weight="fill" aria-hidden="true" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="m-0 scroll-mt-[calc(var(--header-h)+112px)] text-[22px] text-ink outline-none">
          {t.sent}
        </h2>
        <p className="m-0 max-w-sm text-[15px] leading-relaxed text-muted">{t.sentDesc}</p>
        <Button variant="secondary" size="md" onClick={sendAnother} className="mt-2">
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  const [consentBefore, consentAfter = ''] = t.privacyConsent.split('{privacy}');
  const formErrorText = contactErrorText(formError ?? undefined, t);
  const msgLen = values.message.trim().length;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      aria-busy={pending || undefined}
      className={cn(cardClass, errorEnter, 'flex flex-col gap-4', dismissedId !== null && swapEnter)}
    >
      <div className="mb-2 flex flex-col gap-1.5">
        <p className="kicker">{t.formKicker}</p>
        <h2 id="contact-form-title" className="m-0 text-xl text-ink text-balance md:text-[22px]">
          {t.formTitle}
        </h2>
      </div>

      <input type="hidden" name="locale" value={locale} />
      {/* No value/defaultValue prop on purpose: for type="hidden" the value IS the
          attribute, so React would wipe the stamp on every re-render. The effect
          above owns it. */}
      <input ref={startedRef} type="hidden" name={STARTED_AT_FIELD} />

      {/* Honeypot: off-screen, not focusable, ignored by password managers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">{t.honeypotLabel}</label>
        <input id="contact-website" type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {/* Fields dim while the request is in flight (the button shows the spinner). */}
      <div className={cn('flex flex-col gap-4 transition-opacity duration-(--dur-2) ease-standard', pending && 'opacity-60')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="contact-name" label={t.fName} required error={err('name')}>
            {(a11y) => (
              <FocusFrame>
                <Input
                  {...a11y}
                  name="name"
                  autoComplete="name"
                  placeholder={t.fNamePh}
                  maxLength={CONTACT_LIMITS.name.max}
                  value={values.name}
                  onChange={(e) => setField('name', e.target.value)}
                  onBlur={() => onBlur('name')}
                  className={ringOff}
                />
              </FocusFrame>
            )}
          </Field>
          <Field id="contact-email" label={t.fEmail} required error={err('email')}>
            {(a11y) => (
              <FocusFrame>
                <Input
                  {...a11y}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder={t.fEmailPh}
                  maxLength={CONTACT_LIMITS.email.max}
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  onBlur={() => onBlur('email')}
                  className={ringOff}
                />
              </FocusFrame>
            )}
          </Field>
        </div>

        <Field id="contact-type" label={t.fType} required error={err('type')}>
          {(a11y) => (
            <FocusFrame>
              <Select
                {...a11y}
                name="type"
                options={typeOptions}
                placeholder={t.fTypePh}
                value={values.type}
                onChange={(e) => {
                  setField('type', e.target.value);
                  setErrors((x) => ({ ...x, type: validateContactField('type', e.target.value) }));
                }}
                onBlur={() => onBlur('type')}
                className={ringOff}
              />
            </FocusFrame>
          )}
        </Field>

        <Field id="contact-subject" label={t.fSubject} required error={err('subject')}>
          {(a11y) => (
            <FocusFrame>
              <Input
                {...a11y}
                name="subject"
                placeholder={t.fSubjectPh}
                maxLength={CONTACT_LIMITS.subject.max}
                value={values.subject}
                onChange={(e) => setField('subject', e.target.value)}
                onBlur={() => onBlur('subject')}
                className={ringOff}
              />
            </FocusFrame>
          )}
        </Field>

        <Field
          id="contact-message"
          label={t.fMsg}
          required
          error={err('message')}
          hint={
            <span className={cn('tabular-nums', msgLen > 0 && msgLen < CONTACT_LIMITS.message.min && 'text-muted')}>
              {msgLen}/{CONTACT_LIMITS.message.max}
            </span>
          }
        >
          {(a11y) => (
            <FocusFrame>
              <Textarea
                {...a11y}
                name="message"
                rows={6}
                placeholder={t.fMsgPh}
                maxLength={CONTACT_LIMITS.message.max}
                value={values.message}
                onChange={(e) => setField('message', e.target.value)}
                onBlur={() => onBlur('message')}
                className={ringOff}
              />
            </FocusFrame>
          )}
        </Field>

        {turnstileSiteKey ? (
          <div className="flex flex-col gap-1.5" role="group" aria-label={t.captchaLabel}>
            <Turnstile
              siteKey={turnstileSiteKey}
              locale={locale}
              onToken={(v) => {
                setToken(v);
                if (v && formError === 'errCaptcha') setFormError(null);
              }}
              resetKey={submits}
            />
          </div>
        ) : null}
      </div>

      <div
        ref={alertRef}
        tabIndex={-1}
        role="alert"
        className="outline-none empty:-mt-4"
      >
        {formErrorText ? (
          <div
            key={formErrorText}
            className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger/6 px-3.5 py-2.5 text-sm leading-snug text-danger transition-[opacity,translate] duration-(--dur-2) ease-standard starting:-translate-y-1 starting:opacity-0"
          >
            <WarningCircleIcon size={18} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
            <span>{formErrorText}</span>
          </div>
        ) : null}
      </div>

      <Button type="submit" variant="primary" size="lg" block loading={pending} disabled={pending} className="mt-1">
        {pending ? t.sending : t.send}
      </Button>

      <p className="m-0 text-center text-xs leading-relaxed text-subtle">
        {consentBefore}
        <Link href={privacyHref} className="text-link underline-offset-2 hover:underline">
          {t.privacy.toLowerCase()}
        </Link>
        {consentAfter}
      </p>
    </form>
  );
}
