import type { ReactNode } from 'react';

import { cn } from '@site/lib/cn';

export interface SectionHeadingProps {
  title: ReactNode;
  /** Small uppercase line above the title (design `.card-kicker`). */
  kicker?: ReactNode;
  description?: ReactNode;
  /** Right-aligned slot, e.g. <Button variant="secondary" href=…>Xem thêm →</Button>. */
  action?: ReactNode;
  /** h2 by default (32px desktop). h1 renders 40px for page titles. */
  as?: 'h1' | 'h2' | 'h3';
  /** id of the heading (use with aria-labelledby on the <section>). */
  id?: string;
  align?: 'start' | 'center';
  className?: string;
}

/** Section title + 40x3 accent bar + optional action (design v2). */
export function SectionHeading({ title, kicker, description, action, as = 'h2', id, align = 'start', className }: SectionHeadingProps) {
  const Heading = as;
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'mb-6 flex gap-4 md:mb-7',
        centered ? 'flex-col items-center text-center' : 'flex-wrap items-end justify-between',
        className,
      )}
    >
      <div className={cn('flex min-w-0 flex-1 flex-col gap-2.5', centered && 'items-center')}>
        {kicker ? (
          <p className="kicker -mb-1.5">{kicker}</p>
        ) : null}
        <Heading
          id={id}
          className={cn(
            'm-0 text-ink',
            as === 'h1' ? 'text-[30px] md:text-[36px] lg:text-[40px]' : as === 'h2' ? 'text-2xl md:text-[28px] lg:text-[32px]' : 'text-xl md:text-[22px]',
          )}
        >
          {title}
        </Heading>
        <span className="heading-bar" aria-hidden="true" />
        {description ? <p className="m-0 mt-1 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
