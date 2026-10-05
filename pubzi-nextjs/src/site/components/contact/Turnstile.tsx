'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

import type { Locale } from '@site/lib/types';
import { TURNSTILE_FIELD } from '@site/lib/contact/schema';

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileProps {
  siteKey: string;
  locale: Locale;
  /** Token (null when expired / errored). */
  onToken: (token: string | null) => void;
  /** Change it to reset the widget (tokens are single-use). */
  resetKey: number | string;
  /** aria-describedby target when the captcha has an error. */
  describedBy?: string;
}

/**
 * Cloudflare Turnstile widget (explicit render). The widget writes its token into
 * a hidden `cf-turnstile-response` input inside the form, so it is posted with FormData.
 * Only mounted when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 */
export function Turnstile({ siteKey, locale, onToken, resetKey, describedBy }: TurnstileProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const mount = useCallback(() => {
    const el = boxRef.current;
    if (!el || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(el, {
      sitekey: siteKey,
      language: locale,
      theme: 'light',
      size: 'flexible',
      'response-field-name': TURNSTILE_FIELD,
      callback: (token: string) => onTokenRef.current(token),
      'expired-callback': () => onTokenRef.current(null),
      'error-callback': () => onTokenRef.current(null),
    });
  }, [siteKey, locale]);

  // Mount when the script is already loaded (client navigation), unmount on leave.
  useEffect(() => {
    mount();
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [mount]);

  // Reset after every submission.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    onTokenRef.current(null);
  }, [resetKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={mount}
      />
      <div ref={boxRef} className="min-h-[65px] w-full" aria-describedby={describedBy} />
    </>
  );
}
