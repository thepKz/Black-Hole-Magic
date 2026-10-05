'use client';

import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react';

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

  const showSuccess = state.status === 'success' && state.id !== dismissedId;

  // Fill-time trap: stamp when a fresh form mounts / after "send another". React
  // resets uncontrolled inputs after each action, so the ORIGINAL stamp is
  // re-applied after an error response (the server treats a missing stamp as a bot).
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
  };

  const sendAnother = () => {
    if (state.status === 'success') setDismissedId(state.id);
    setValues(emptyContactValues);
    setErrors({});
    setTouched({});
    setFormError(null);
  };

  const err = (field: ContactField) => contactErrorText(errors[field], t);
  const cardClass = cn(
    'relative rounded-xl bg-surface p-5 shadow-sm transition-shadow duration-200 ease-out-soft hover:shadow-md sm:p-7',
    className,
  );

  if (showSuccess) {
    return (
      <div className={cn(cardClass, 'flex min-h-[420px] flex-col items-center justify-center gap-4 text-center')} role="status">
        <span className="grid size-16 place-items-center rounded-full bg-success/12 text-success">
          <CheckCircleIcon size={36} weight="fill" aria-hidden="true" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="m-0 text-[22px] text-ink outline-none">
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
      className={cn(cardClass, 'flex flex-col gap-4')}
    >
      <div className="mb-2 flex flex-col gap-1.5">
        <p className="m-0 text-[11px] font-medium tracking-[0.12em] text-accent-600 uppercase">{t.formKicker}</p>
        <h2 id="contact-form-title" className="m-0 text-xl text-ink text-balance md:text-[22px]">
          {t.formTitle}
        </h2>
      </div>

      <input type="hidden" name="locale" value={locale} />
      <input ref={startedRef} type="hidden" name={STARTED_AT_FIELD} defaultValue="" />

      {/* Honeypot: off-screen, not focusable, ignored by password managers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">{t.honeypotLabel}</label>
        <input id="contact-website" type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label={t.fName} required error={err('name')}>
          {(a11y) => (
            <Input
              {...a11y}
              name="name"
              autoComplete="name"
              placeholder={t.fNamePh}
              maxLength={CONTACT_LIMITS.name.max}
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => onBlur('name')}
            />
          )}
        </Field>
        <Field id="contact-email" label={t.fEmail} required error={err('email')}>
          {(a11y) => (
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
            />
          )}
        </Field>
      </div>

      <Field id="contact-type" label={t.fType} required error={err('type')}>
        {(a11y) => (
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
          />
        )}
      </Field>

      <Field id="contact-subject" label={t.fSubject} required error={err('subject')}>
        {(a11y) => (
          <Input
            {...a11y}
            name="subject"
            placeholder={t.fSubjectPh}
            maxLength={CONTACT_LIMITS.subject.max}
            value={values.subject}
            onChange={(e) => setField('subject', e.target.value)}
            onBlur={() => onBlur('subject')}
          />
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
          <Textarea
            {...a11y}
            name="message"
            rows={6}
            placeholder={t.fMsgPh}
            maxLength={CONTACT_LIMITS.message.max}
            value={values.message}
            onChange={(e) => setField('message', e.target.value)}
            onBlur={() => onBlur('message')}
          />
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

      <div
        ref={alertRef}
        tabIndex={-1}
        role="alert"
        className={cn(
          'outline-none',
          formErrorText &&
            'flex items-start gap-2 rounded-md border border-danger/25 bg-danger/6 px-3.5 py-2.5 text-sm leading-snug text-danger',
        )}
      >
        {formErrorText ? (
          <>
            <WarningCircleIcon size={18} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
            <span>{formErrorText}</span>
          </>
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
