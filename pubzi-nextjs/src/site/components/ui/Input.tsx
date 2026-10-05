import type { ComponentPropsWithRef } from 'react';

import { cn } from '@site/lib/cn';
import { controlBase } from './formStyles';

export type InputProps = ComponentPropsWithRef<'input'> & {
  /** Sets aria-invalid (red border). Usually wired by <Field>. */
  invalid?: boolean;
};

/** Text input (44px). Pair with <Field> for label / hint / error. */
export function Input({ className, invalid, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={cn(controlBase, 'h-11 px-3.5', className)}
      {...props}
    />
  );
}
