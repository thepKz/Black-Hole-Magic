import type { ReactNode } from 'react';

import { cn } from '@site/lib/cn';

/** Props to spread on the control inside a <Field>. */
export interface FieldA11yProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
}

export interface FieldProps {
  /** Control id (label `for`). Hint id = `${id}-hint`, error id = `${id}-error`. */
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  /** Error message; truthy -> control gets aria-invalid + aria-describedby. */
  error?: string | null;
  required?: boolean;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
  className?: string;
  /**
   * Render prop (preferred): `{(a11y) => <Input {...a11y} name="email" />}`.
   * A plain element is rendered as-is (wire ids yourself via `fieldIds(id)`).
   */
  children: ReactNode | ((a11y: FieldA11yProps) => ReactNode);
}

export function fieldIds(id: string) {
  return { hint: `${id}-hint`, error: `${id}-error` };
}

/** Label + control + hint + error, with ARIA wiring. */
export function Field({ id, label, hint, error, required, hideLabel, className, children }: FieldProps) {
  const ids = fieldIds(id);
  const describedBy = [hint ? ids.hint : null, error ? ids.error : null].filter(Boolean).join(' ') || undefined;
  const a11y: FieldA11yProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    required: required || undefined,
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-[13px] font-medium text-ink/80', hideLabel && 'sr-only')}>
        {label}
        {required ? (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {typeof children === 'function' ? children(a11y) : children}
      {hint && !error ? (
        <p id={ids.hint} className="text-xs leading-snug text-subtle">
          {hint}
        </p>
      ) : null}
      {hint && error ? (
        <p id={ids.hint} className="sr-only">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={ids.error} className="flex items-start gap-1.5 text-[13px] leading-snug text-danger">
          <svg className="mt-px size-3.5 shrink-0" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z" />
          </svg>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
