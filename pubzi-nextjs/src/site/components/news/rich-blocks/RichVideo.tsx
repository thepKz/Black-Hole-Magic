'use client';

import { PlayIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@site/lib/cn';

import s from './rich-blocks.module.css';

export type RichVideoSource =
  | {
      kind: 'file';
      src: string;
      mimeType: string;
      autoplay: boolean;
    }
  | {
      kind: 'embed';
      provider: 'youtube' | 'vimeo' | 'facebook' | 'tiktok';
      embedUrl: string;
    };

export interface RichVideoProps {
  source: RichVideoSource;
  /** CSS aspect-ratio, e.g. "16 / 9". */
  aspect: string;
  /** Narrow layout for portrait (9:16) or square videos. */
  shape: 'landscape' | 'portrait' | 'square';
  poster: string | null;
  title: string;
  playLabel: string;
  /** Provider tag ("YouTube") + privacy note under the title (embeds only). */
  providerLabel?: string;
  notice?: string;
  caption?: React.ReactNode;
}

const IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';

function withAutoplay(embedUrl: string, provider: string): string {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set('autoplay', provider === 'facebook' ? 'true' : '1');
    return url.toString();
  } catch {
    return embedUrl;
  }
}

/**
 * Article video.
 * - Uploaded / direct files: native <video controls preload="none" poster>
 *   (preload="metadata" when there is no poster so the first frame shows).
 *   "autoplay" = muted loop inline, skipped under prefers-reduced-motion.
 * - YouTube (nocookie), Vimeo, Facebook, TikTok: click-to-load facade - no
 *   third-party request until the reader presses play.
 */
export function RichVideo({ source, aspect, shape, poster, title, playLabel, providerLabel, notice, caption }: RichVideoProps) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplay = source.kind === 'file' && source.autoplay;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !autoplay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      v.removeAttribute('autoplay');
    }
  }, [autoplay]);

  const frameClass = cn(s.video, shape === 'portrait' && s.videoVertical, shape === 'square' && s.videoSquare);

  let player: React.ReactNode;
  if (source.kind === 'file') {
    player = (
      <video
        ref={videoRef}
        controls
        playsInline
        preload={autoplay ? 'metadata' : poster ? 'none' : 'metadata'}
        poster={poster ?? undefined}
        autoPlay={autoplay || undefined}
        muted={autoplay || undefined}
        loop={autoplay || undefined}
        title={title}
        aria-label={title}
      >
        <source src={source.src} type={source.mimeType} />
      </video>
    );
  } else if (active) {
    player = (
      <iframe
        src={withAutoplay(source.embedUrl, source.provider)}
        title={title}
        allow={IFRAME_ALLOW}
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  } else {
    player = (
      <button type="button" className={s.facade} onClick={() => setActive(true)} aria-label={playLabel}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- third-party / pre-sized poster, decorative
          <img src={poster} alt="" loading="lazy" decoding="async" />
        ) : null}
        {providerLabel ? (
          <span className={s.providerTag} aria-hidden="true">
            {providerLabel}
          </span>
        ) : null}
        <span className={s.playIcon} aria-hidden="true">
          <PlayIcon weight="fill" className="ml-1 size-7 md:size-8" />
        </span>
        <span className={s.facadeMeta} aria-hidden="true">
          <span className={s.facadeTitle}>{title}</span>
          {notice ? <span className={s.facadeNote}>{notice}</span> : null}
        </span>
      </button>
    );
  }

  return (
    <figure className={frameClass}>
      <div className={s.player} style={{ aspectRatio: aspect }}>
        {player}
      </div>
      {caption ? <figcaption className={s.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
