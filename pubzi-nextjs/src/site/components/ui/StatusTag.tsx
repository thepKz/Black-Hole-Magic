import type { Dictionary } from '@site/i18n';
import type { GameStatus } from '@site/lib/types';
import { cn } from '@site/lib/cn';

const styles: Record<Exclude<GameStatus, 'none'>, string> = {
  new: 'bg-cyan text-cyan-ink shadow-glow-cyan',
  soon: 'bg-accent text-white shadow-glow-accent',
  hot: 'bg-hot text-white shadow-glow-hot',
};

/** Label of a status from the dictionary ('' for 'none'). */
export function statusLabel(status: GameStatus, t: Pick<Dictionary, 'statusNew' | 'statusSoon' | 'statusHot'>): string {
  return status === 'new' ? t.statusNew : status === 'soon' ? t.statusSoon : status === 'hot' ? t.statusHot : '';
}

export interface StatusTagProps {
  status: GameStatus;
  /** Visible text, usually `statusLabel(status, t)`. */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Game status pill: Mới ra mắt (cyan glow) / Sắp ra mắt (purple) / Đang hot (red-orange). Renders nothing for 'none'. */
export function StatusTag({ status, label, size = 'sm', className }: StatusTagProps) {
  if (status === 'none' || !label) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm font-semibold tracking-[0.04em] whitespace-nowrap',
        size === 'sm' ? 'px-2 py-[3px] text-[11px]' : 'px-2.5 py-1 text-xs',
        styles[status],
        className,
      )}
    >
      <span
        className={cn('size-1.5 rounded-full bg-current', status === 'hot' && 'motion-safe:animate-pulse')}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
