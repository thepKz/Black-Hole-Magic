import type { Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/** Vietnam flag (3:2). */
export function FlagVN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#DA251D" />
      <path fill="#FFFF00" d="M15 4.2l1.35 4.15h4.37l-3.54 2.57 1.35 4.15L15 12.5l-3.53 2.57 1.35-4.15-3.54-2.57h4.37z" />
    </svg>
  );
}

/** United Kingdom flag (3:2 crop of the Union Jack). */
export function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
        <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

/** Flag for a site locale, rounded with a hairline border. `sm` = 16x11 (segmented control), `md` = 21x14. */
export function LocaleFlag({ locale, size = 'md', className }: { locale: Locale; size?: 'sm' | 'md'; className?: string }) {
  const cls = cn(
    'block shrink-0 overflow-hidden shadow-[0_0_0_1px_rgb(28_22_51/.12)]',
    size === 'sm' ? 'h-[11px] w-4 rounded-[2px]' : 'h-[14px] w-[21px] rounded-[3px]',
    className,
  );
  return locale === 'vi' ? <FlagVN className={cls} /> : <FlagGB className={cls} />;
}
