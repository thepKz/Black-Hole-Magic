import type { ReactNode } from 'react';

import { cn } from '@site/lib/cn';

export type TagTone = 'accent' | 'neutral' | 'cyan' | 'outline' | 'onImage';

export interface TagProps {
  children: ReactNode;
  tone?: TagTone;
  className?: string;
}

const tones: Record<TagTone, string> = {
  accent: 'bg-accent-100 text-accent-800',
  neutral: 'bg-neutral-100 text-neutral-700',
  cyan: 'bg-cyan-50 text-cyan-ink',
  outline: 'border border-accent text-accent-700',
  onImage: 'bg-white/95 text-accent-800 shadow-sm backdrop-blur-sm',
};

/** Small label (news category, game genre). `onImage` = solid chip for placement over photos. */
export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-[3px] text-[11px] leading-tight font-medium tracking-[0.02em] whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
