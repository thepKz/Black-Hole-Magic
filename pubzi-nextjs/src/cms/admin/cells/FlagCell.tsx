'use client';

import { useTranslation } from '@payloadcms/ui';
import type { CheckboxFieldClient, DefaultCellComponentProps } from 'payload';

/**
 * Checkbox column shown as a small badge when true, empty otherwise
 * (instead of the raw "đúng" / "sai").
 * clientProps: { vi: string; en: string; tone?: 'accent' | 'danger' | 'warn' }
 */
export function FlagCell({
  cellData,
  vi,
  en,
  tone = 'accent',
}: DefaultCellComponentProps<CheckboxFieldClient> & { vi: string; en: string; tone?: 'accent' | 'danger' | 'warn' }) {
  const { i18n } = useTranslation();
  if (!cellData) return null;
  return <span className={`bh-badge bh-badge--${tone}`}>{i18n.language === 'en' ? en : vi}</span>;
}

export default FlagCell;
