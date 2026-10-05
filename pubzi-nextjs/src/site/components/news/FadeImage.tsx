'use client';

import Image, { type ImageProps } from 'next/image';
import { useCallback, type SyntheticEvent } from 'react';

import { cn } from '@site/lib/cn';

/**
 * next/image that fades in once its pixels arrive (opacity only, no CLS: the
 * box is sized by width/height or a `fill` parent with an aspect ratio).
 *
 * Progressive enhancement, no re-render: the server HTML is a normal visible
 * image. On mount, an image that is NOT yet decoded gets data-fade="wait"
 * (opacity 0); its load/error event flips it to "in". Images that finished
 * before hydration (cache, preloaded LCP cover) are left alone, so there is
 * never a flash and nothing is hidden without JS.
 */
export function FadeImage({ className, onLoad, onError, alt, ...props }: ImageProps) {
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img && !img.complete) img.dataset.fade = 'wait';
  }, []);

  const reveal = (e: SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.dataset.fade) e.currentTarget.dataset.fade = 'in';
  };

  return (
    <Image
      {...props}
      alt={alt}
      ref={ref}
      onLoad={(e) => {
        reveal(e);
        onLoad?.(e);
      }}
      onError={(e) => {
        reveal(e);
        onError?.(e);
      }}
      className={cn('transition-opacity duration-(--dur-4) ease-standard data-[fade=wait]:opacity-0', className)}
    />
  );
}
