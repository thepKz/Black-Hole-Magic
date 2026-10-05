'use client';

import { useTranslation } from '@payloadcms/ui';

/**
 * Static helper text rendered as a `ui` field (e.g. under the slug, whose
 * built-in SlugField component does not render `admin.description`).
 * clientProps: { vi: string; en?: string; tone?: 'info' | 'warn' }
 */
export function FieldHint({ vi, en, tone = 'info' }: { vi: string; en?: string; tone?: 'info' | 'warn' }) {
  const { i18n } = useTranslation();
  const text = i18n.language === 'en' && en ? en : vi;
  return <p className={`bh-field-hint bh-field-hint--${tone}`}>{text}</p>;
}

export default FieldHint;
