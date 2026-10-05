import type { ComponentPropsWithRef } from 'react';

import { cn } from '@site/lib/cn';
import { controlBase } from './formStyles';

export type TextareaProps = ComponentPropsWithRef<'textarea'> & { invalid?: boolean };

/** Multi-line input; vertical resize only. */
export function Textarea({ className, invalid, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={cn(controlBase, 'min-h-28 resize-y px-3.5 py-2.5 leading-relaxed', className)}
      {...props}
    />
  );
}
