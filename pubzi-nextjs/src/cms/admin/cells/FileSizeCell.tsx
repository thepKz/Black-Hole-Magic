'use client';

import type { DefaultCellComponentProps, NumberFieldClient } from 'payload';

/** `filesize` column in the image / video libraries: "158 KB" instead of 158734. */
export function FileSizeCell({ cellData }: DefaultCellComponentProps<NumberFieldClient>) {
  if (typeof cellData !== 'number' || !Number.isFinite(cellData)) return null;
  const kb = cellData / 1024;
  const text = kb < 1024 ? `${Math.max(1, Math.round(kb))} KB` : `${(kb / 1024).toFixed(kb < 10 * 1024 ? 1 : 0)} MB`;
  return <span style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{text}</span>;
}

export default FileSizeCell;
