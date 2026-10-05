import type { ComponentPropsWithRef } from 'react';

import { cn } from '@site/lib/cn';
import { controlBase } from './formStyles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'children'> & {
  options: SelectOption[];
  /** Renders a first empty option (value "") - e.g. t.fTypePh. */
  placeholder?: string;
  invalid?: boolean;
  /** Class of the wrapper (the <select> gets `className`). */
  wrapperClassName?: string;
};

/** Native <select> with custom caret (keeps native a11y + mobile pickers). */
export function Select({ className, wrapperClassName, options, placeholder, invalid, ...props }: SelectProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <select
        aria-invalid={invalid || props['aria-invalid'] || undefined}
        className={cn(controlBase, 'h-11 cursor-pointer appearance-none pr-10 pl-3.5', className)}
        {...props}
      >
        {placeholder !== undefined ? (
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-subtle"
        viewBox="0 0 256 256"
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M64 96l64 64 64-64" />
      </svg>
    </div>
  );
}
