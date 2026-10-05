'use client';

import { CheckIcon, FacebookLogoIcon, LinkSimpleIcon, ShareNetworkIcon, XLogoIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { track } from '@site/components/analytics/track';
import { cn } from '@site/lib/cn';

export interface ShareLabels {
  share: string;
  shareFacebook: string;
  shareX: string;
  copyLink: string;
  linkCopied: string;
  copyFailed: string;
  shareNative: string;
  newTab: string;
}

export interface ShareButtonsProps {
  /** Absolute canonical URL of the article. */
  url: string;
  title: string;
  labels: ShareLabels;
  /** 'row' = inline under the article; 'column' = vertical (sticky sidebar). */
  layout?: 'row' | 'column';
  /** Show the "Chia sẻ" caption. */
  showLabel?: boolean;
  className?: string;
}

const subscribeNoop = () => () => {};
const canNativeShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';

// Hover = `.fx` wash (accent-50, opacity only) + instant colour swap; press nudge from `.fx`.
const btn =
  'fx tip inline-grid size-10 shrink-0 place-items-center rounded-md border border-divider bg-surface text-ink/75 no-underline [--fx-bg:var(--color-accent-50)] [--fx-press:var(--color-accent-100)] hover:border-accent-300 hover:text-accent-700';

function TipLabel({ children }: { children: ReactNode }) {
  return (
    <span className="tip-label" aria-hidden="true">
      {children}
    </span>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Facebook / X / copy link (+ native share sheet where available) with a toast. */
export function ShareButtons({ url, title, labels, layout = 'row', showLabel = true, className }: ShareButtonsProps) {
  const native = useSyncExternalStore(subscribeNoop, canNativeShare, () => false);
  // `open` false = exit transition running; the node is removed after it.
  const [toast, setToast] = useState<{ text: string; ok: boolean; open: boolean; n: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const showToast = (text: string, ok: boolean) => {
    clearTimers();
    // A new `n` remounts the pill, so a repeated copy replays the enter motion.
    setToast((prev) => ({ text, ok, open: true, n: (prev?.n ?? 0) + 1 }));
    timers.current.push(
      setTimeout(() => setToast((t) => (t ? { ...t, open: false } : t)), 2400),
      setTimeout(() => setToast(null), 2400 + 220),
    );
  };

  const enc = encodeURIComponent;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const x = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;

  const onCopy = async () => {
    const ok = await copyText(url);
    showToast(ok ? labels.linkCopied : labels.copyFailed, ok);
    if (ok) track('share', { method: 'copy_link', content_type: 'news', item_id: url });
  };

  const onNative = async () => {
    try {
      await navigator.share({ title, url });
      track('share', { method: 'native', content_type: 'news', item_id: url });
    } catch {
      /* user cancelled */
    }
  };

  const column = layout === 'column';

  return (
    <div className={cn('flex gap-2', column ? 'flex-col items-start' : 'flex-wrap items-center', className)}>
      {showLabel ? (
        <span
          className={cn(
            'text-[13px] font-medium text-subtle',
            column ? 'mb-1 text-[11px] tracking-[0.12em] text-accent-600 uppercase' : 'mr-1',
          )}
        >
          {labels.share}
        </span>
      ) : null}
      <div className={cn('flex gap-2', column ? 'flex-row flex-wrap' : 'flex-row')}>
        <a
          href={fb}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          onClick={() => track('share', { method: 'facebook', content_type: 'news', item_id: url })}
        >
          <FacebookLogoIcon className="size-[18px]" weight="fill" aria-hidden="true" />
          <span className="sr-only">
            {labels.shareFacebook} {labels.newTab}
          </span>
          <TipLabel>{labels.shareFacebook}</TipLabel>
        </a>
        <a
          href={x}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          onClick={() => track('share', { method: 'x', content_type: 'news', item_id: url })}
        >
          <XLogoIcon className="size-[18px]" weight="bold" aria-hidden="true" />
          <span className="sr-only">
            {labels.shareX} {labels.newTab}
          </span>
          <TipLabel>{labels.shareX}</TipLabel>
        </a>
        <button type="button" onClick={onCopy} className={cn(btn, 'cursor-pointer')} aria-label={labels.copyLink}>
          {toast?.ok && toast.open ? (
            <CheckIcon
              className="size-[18px] text-success transition-[scale] duration-(--dur-2) ease-emphasized starting:scale-50"
              weight="bold"
              aria-hidden="true"
            />
          ) : (
            <LinkSimpleIcon className="size-[18px]" weight="bold" aria-hidden="true" />
          )}
          <TipLabel>{labels.copyLink}</TipLabel>
        </button>
        {native ? (
          <button type="button" onClick={onNative} className={cn(btn, 'cursor-pointer')} aria-label={labels.shareNative}>
            <ShareNetworkIcon className="size-[18px]" weight="bold" aria-hidden="true" />
            <TipLabel>{labels.shareNative}</TipLabel>
          </button>
        ) : null}
      </div>

      {/* Toast (announced politely; fixed so it is visible wherever the buttons are). */}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        {toast ? (
          <span
            key={toast.n}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg',
              // Enter: rise + fade (@starting-style); exit: faster sink + fade.
              'transition-[opacity,translate] starting:translate-y-3 starting:opacity-0',
              toast.open
                ? 'translate-y-0 opacity-100 duration-(--dur-3) ease-emphasized'
                : 'translate-y-2 opacity-0 duration-(--dur-2) ease-exit',
              toast.ok ? 'bg-ink' : 'bg-danger',
            )}
          >
            {toast.ok ? <CheckIcon className="size-4" weight="bold" aria-hidden="true" /> : null}
            {toast.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}
