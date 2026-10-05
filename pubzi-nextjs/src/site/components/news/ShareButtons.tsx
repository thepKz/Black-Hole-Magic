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

const btn =
  'tip relative inline-grid size-10 shrink-0 place-items-center rounded-md border border-divider bg-surface text-ink/75 no-underline transition-[color,border-color,background-color,box-shadow] duration-150 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700';

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
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
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
          {toast?.ok ? (
            <CheckIcon className="size-[18px] text-success" weight="bold" aria-hidden="true" />
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
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg',
              'transition-[opacity,translate] duration-200 ease-out-soft starting:translate-y-2 starting:opacity-0',
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
