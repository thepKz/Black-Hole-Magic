'use client';

import { getTranslation } from '@payloadcms/translations';
import { useTranslation } from '@payloadcms/ui';
import type { DefaultCellComponentProps, SelectFieldClient } from 'payload';

export type BadgeTone = 'neutral' | 'info' | 'warn' | 'success' | 'danger' | 'accent';

/**
 * Coloured status pill for select fields in list views.
 * clientProps: { tones: Record<optionValue, BadgeTone> }
 */
export function BadgeCell({
  cellData,
  field,
  tones = {},
}: DefaultCellComponentProps<SelectFieldClient> & { tones?: Record<string, BadgeTone> }) {
  const { i18n } = useTranslation();
  const values = (Array.isArray(cellData) ? cellData : cellData ? [cellData] : []).map(String);
  if (!values.length) return <span className="bh-badge bh-badge--empty">—</span>;
  const labelOf = (value: string) => {
    const option = field?.options?.find((o) => (typeof o === 'string' ? o : o.value) === value);
    return option && typeof option === 'object' ? getTranslation(option.label, i18n) : value;
  };
  return (
    <span className="bh-badges">
      {values.map((v) => (
        <span key={v} className={`bh-badge bh-badge--${tones[v] ?? 'neutral'}`}>
          {labelOf(v)}
        </span>
      ))}
    </span>
  );
}

export default BadgeCell;
