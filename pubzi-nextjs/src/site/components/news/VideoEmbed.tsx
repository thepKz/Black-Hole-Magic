'use client';

import { PlayIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { cssAspectRatio, type ParsedVideo } from '@/cms/lib/video';

export interface VideoEmbedProps {
  video: ParsedVideo;
  aspectRatio?: string | null;
  title: string;
  /** aria-label of the play button (already formatted). */
  playLabel: string;
}

const IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';

/**
 * Video in an article.
 * - YouTube: click-to-load facade (thumbnail + play button). The youtube-nocookie
 *   iframe is only created on click, so articles stay light (no ~1MB player JS).
 * - Vimeo: lazy iframe. Direct files: <video controls preload="metadata">.
 */
export function VideoEmbed({ video, aspectRatio, title, playLabel }: VideoEmbedProps) {
  const [active, setActive] = useState(false);
  // Portrait / square videos are capped so they do not fill a whole screen height.
  const maxWidth = aspectRatio === '9:16' ? 400 : aspectRatio === '1:1' ? 560 : undefined;
  const style = { aspectRatio: cssAspectRatio(aspectRatio), maxWidth, marginInline: maxWidth ? 'auto' : undefined };

  if (video.provider === 'file') {
    return (
      <div className="embed m-0" style={style}>
        <video src={video.embedUrl} controls preload="metadata" playsInline title={title} className="size-full bg-black" />
      </div>
    );
  }

  if (video.provider === 'vimeo' || active || !video.thumbnailUrl) {
    const src = new URL(video.embedUrl);
    if (active) src.searchParams.set('autoplay', '1');
    return (
      <div className="embed m-0" style={style}>
        <iframe
          src={src.toString()}
          title={title}
          loading="lazy"
          allow={IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full"
        />
      </div>
    );
  }

  return (
    <div className="embed group relative m-0 bg-black" style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, decorative */}
      <img
        src={video.thumbnailUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 m-0 size-full rounded-none object-cover opacity-90 transition-opacity duration-(--dur-3) group-hover:opacity-100"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      <button
        type="button"
        onClick={() => setActive(true)}
        aria-label={playLabel}
        className="absolute inset-0 grid size-full cursor-pointer place-items-center border-0 bg-transparent p-0"
      >
        <span className="grid size-16 place-items-center rounded-full bg-accent text-white shadow-glow-accent transition-transform duration-(--dur-2) ease-standard group-hover:scale-110 md:size-[72px]">
          <PlayIcon weight="fill" className="ml-1 size-7 md:size-8" aria-hidden="true" />
        </span>
      </button>
      <span className="pointer-events-none absolute right-4 bottom-3 left-4 line-clamp-1 text-left text-sm font-medium text-white drop-shadow">
        {title}
      </span>
    </div>
  );
}
