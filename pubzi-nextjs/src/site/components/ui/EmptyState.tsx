import type { ReactNode } from 'react';

import { cn } from '@site/lib/cn';

export interface EmptyStateProps {
  /** e.g. t.noResult "Không tìm thấy kết quả phù hợp." */
  title: string;
  description?: ReactNode;
  /** Reset slot, e.g. <Button href={href(locale,'/games')} variant="secondary">{t.clearFilters}</Button>. */
  action?: ReactNode;
  /** Replaces the default magnifier illustration. */
  icon?: ReactNode;
  headingLevel?: 'h2' | 'h3' | 'p';
  className?: string;
}

/** Empty / no-results block. role="status" so client-side filtering announces it. */
export function EmptyState({ title, description, action, icon, headingLevel = 'h2', className }: EmptyStateProps) {
  const Heading = headingLevel;
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-divider bg-surface/60 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-1 grid size-16 place-items-center rounded-xl bg-accent-50 text-accent shadow-[inset_0_0_0_1px_var(--color-accent-100)]">
        {icon ?? (
          <svg className="size-8" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" aria-hidden="true">
            <circle cx="112" cy="112" r="72" />
            <path d="M163 163l53 53M88 112h48" />
          </svg>
        )}
      </div>
      <Heading className="m-0 text-lg font-medium text-ink">{title}</Heading>
      {description ? <p className="m-0 max-w-md text-sm leading-relaxed text-muted">{description}</p> : null}
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
