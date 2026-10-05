'use client';

import { ArrowSquareOutIcon, FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon, XLogoIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@site/lib/cn';

import s from './rich-blocks.module.css';

type Provider = 'facebook' | 'x' | 'tiktok' | 'instagram';

export interface SocialEmbedProps {
  provider: Provider;
  providerLabel: string;
  url: string;
  embedUrl: string | null;
  /** Facebook video / reel embeds use the video plugin (16:9-ish box). */
  isVideo: boolean;
  caption: string | null;
  labels: { postOn: string; load: string; open: string; notice: string; newTab: string };
}

const ICONS = { facebook: FacebookLogoIcon, x: XLogoIcon, tiktok: TiktokLogoIcon, instagram: InstagramLogoIcon };

/** Iframe box per provider (their embeds do not report their height without a script). */
const FRAME: Record<Exclude<Provider, 'x'>, { maxWidth: number; height: number }> = {
  facebook: { maxWidth: 500, height: 640 },
  tiktok: { maxWidth: 340, height: 760 },
  instagram: { maxWidth: 540, height: 720 },
};

const X_WIDGETS = 'https://platform.twitter.com/widgets.js';

type Twttr = { widgets?: { load: (el?: Element) => void } };

function loadXWidgets(): Promise<void> {
  const w = window as unknown as { twttr?: Twttr };
  if (w.twttr?.widgets) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${X_WIDGETS}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = X_WIDGETS;
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('x widgets')), { once: true });
  });
}

/**
 * Social post (Facebook, X, TikTok, Instagram): privacy-friendly link card;
 * the provider's embed (iframe, or widgets.js for X) only loads after the
 * reader chooses "Show the post here". The original link always stays.
 */
export function SocialEmbed({ provider, providerLabel, url, embedUrl, isVideo, caption, labels }: SocialEmbedProps) {
  const [active, setActive] = useState(false);
  const xRef = useRef<HTMLDivElement>(null);
  const Icon = ICONS[provider];
  const canEmbed = provider === 'x' || Boolean(embedUrl);

  useEffect(() => {
    if (!active || provider !== 'x' || !xRef.current) return;
    const el = xRef.current;
    loadXWidgets()
      .then(() => (window as unknown as { twttr?: Twttr }).twttr?.widgets?.load(el))
      .catch(() => setActive(false));
  }, [active, provider]);

  let host = url;
  try {
    const u = new URL(url);
    host = `${u.hostname.replace(/^www\./, '')}${u.pathname.length > 1 ? u.pathname : ''}`;
  } catch {
    /* keep raw */
  }

  let body: React.ReactNode = null;
  if (active && provider === 'x') {
    body = (
      <div ref={xRef}>
        <blockquote className="twitter-tweet" data-dnt="true">
          <a href={url}>{url}</a>
        </blockquote>
      </div>
    );
  } else if (active && embedUrl && provider !== 'x') {
    const box = FRAME[provider];
    body = (
      <iframe
        className={s.socialFrame}
        src={embedUrl}
        title={labels.postOn}
        style={{ maxWidth: box.maxWidth, height: isVideo ? undefined : box.height, aspectRatio: isVideo ? '16 / 9' : undefined }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <figure className={s.social}>
      {body ?? (
        <div className={s.socialCard}>
          <div className={s.socialHead}>
            <span className={s.socialIcon} aria-hidden="true">
              <Icon weight="fill" className="size-5" />
            </span>
            <div className="min-w-0">
              <div className={s.socialProvider}>{labels.postOn}</div>
              <div className={s.socialUrl}>{host}</div>
            </div>
          </div>
          {canEmbed ? <p className={s.socialNote}>{labels.notice}</p> : null}
          <div className={s.socialActions}>
            {canEmbed ? (
              <button type="button" className={cn(s.btn, s.btnPrimary)} onClick={() => setActive(true)}>
                {labels.load}
              </button>
            ) : null}
            <a className={cn(s.btn, s.btnSecondary)} href={url} target="_blank" rel="noopener noreferrer nofollow">
              {labels.open}
              <ArrowSquareOutIcon className="size-4" aria-hidden="true" />
              <span className="sr-only">{labels.newTab}</span>
            </a>
          </div>
        </div>
      )}
      {caption ? <figcaption className={s.caption}>{caption}</figcaption> : null}
      {active ? (
        <p className={s.caption}>
          <a href={url} target="_blank" rel="noopener noreferrer nofollow">
            {providerLabel}: {host}
          </a>
        </p>
      ) : null}
    </figure>
  );
}
