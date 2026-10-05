'use client';

import { CaretLeftIcon, CaretRightIcon, XIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

import { cn } from '@site/lib/cn';

import type { RichImage } from './media';
import s from './rich-blocks.module.css';

export interface GalleryLabels {
  label: string;
  /** "{index}" / "{count}" placeholders. */
  open: string;
  prev: string;
  next: string;
  close: string;
  counter: string;
  credit: string;
}

export interface GalleryProps {
  images: RichImage[];
  layout: 'grid' | 'slider';
  columns: 2 | 3 | 4;
  /** CSS aspect-ratio ("16 / 9") or null for the natural ratio. */
  ratio: string | null;
  showCaptions: boolean;
  caption: string | null;
  labels: GalleryLabels;
}

const fill = (tpl: string, values: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));

function Caption({ img, labels, className }: { img: RichImage; labels: GalleryLabels; className?: string }) {
  if (!img.caption && !img.credit) return null;
  return (
    <span className={className}>
      {img.caption ? <span>{img.caption}</span> : null}
      {img.credit ? (
        <span className={s.credit}>
          {img.caption ? ' · ' : null}
          {fill(labels.credit, { credit: img.credit })}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Article gallery block: grid (fixed ratio grid, or masonry columns for the
 * natural ratio) or a scroll-snap slider. Every image opens a lightweight
 * <dialog> lightbox (keyboard arrows, Esc, swipe). No external library.
 */
export function Gallery({ images, layout, columns, ratio, showCaptions, caption, labels }: GalleryProps) {
  const count = images.length;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const swipeX = useRef<number | null>(null);

  /* ---------------- lightbox ---------------- */
  // Page scroll is locked while the lightbox is open (restored on close, incl. Esc).
  const prevOverflow = useRef<string | null>(null);
  const show = useCallback((i: number) => {
    setOpen(i);
    const dlg = dialogRef.current;
    if (!dlg || dlg.open) return;
    prevOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
  }, []);
  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  );
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      if (prevOverflow.current !== null) document.documentElement.style.overflow = prevOverflow.current;
      prevOverflow.current = null;
      setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    dlg.addEventListener('close', onClose);
    dlg.addEventListener('keydown', onKey);
    return () => {
      if (dlg.open) dlg.close();
      dlg.removeEventListener('close', onClose);
      dlg.removeEventListener('keydown', onKey);
    };
  }, [step]);

  const onPointerDown = (e: PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  /* ---------------- slider ---------------- */
  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(i, track.children.length - 1));
    track.scrollTo({ left: target * track.clientWidth });
  }, []);

  useEffect(() => {
    if (layout !== 'slider') return;
    const track = trackRef.current;
    if (!track) return;
    // setState with an unchanged index is a no-op, so no throttling is needed.
    const onScroll = () => setSlide(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [layout]);

  const cropped = ratio !== null;
  const tileStyle: CSSProperties | undefined = cropped ? { aspectRatio: ratio } : undefined;
  const colsSm = Math.min(columns, 2);
  const gridSizes = `(min-width: 800px) ${Math.round(760 / columns)}px, ${Math.round(100 / colsSm)}vw`;
  const current = open !== null ? images[open] : null;

  const tile = (img: RichImage, i: number, sizes: string, eager = false) => (
    <button
      type="button"
      className={cn(s.tile, cropped && s.cropped)}
      style={layout === 'slider' ? { aspectRatio: ratio ?? '16 / 9' } : tileStyle}
      onClick={() => show(i)}
      aria-label={fill(labels.open, { index: i + 1, count })}
      aria-haspopup="dialog"
    >
      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        alt={img.alt}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        unoptimized={img.mimeType === 'image/svg+xml' || img.mimeType === 'image/gif'}
        style={cropped ? { objectPosition: img.position } : undefined}
      />
    </button>
  );

  return (
    <figure className={s.gallery} role="group" aria-label={caption || fill(labels.label, { count })}>
      {layout === 'slider' ? (
        <div className={s.slider}>
          <ul
            ref={trackRef}
            className={s.track}
            tabIndex={0}
            aria-label={fill(labels.label, { count })}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goTo(slide - 1);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goTo(slide + 1);
              }
            }}
          >
            {images.map((img, i) => (
              <li
                key={`${img.src}-${i}`}
                className={s.slide}
                aria-roledescription="slide"
                aria-label={fill(labels.counter, { index: i + 1, count })}
              >
                {tile(img, i, '(min-width: 800px) 760px, 100vw', i === 0)}
              </li>
            ))}
          </ul>
          <div className={s.sliderBar}>
            <div className={s.sliderCaption} aria-live="polite">
              {showCaptions && images[slide] ? <Caption img={images[slide]} labels={labels} /> : null}
              {!showCaptions && caption ? caption : null}
            </div>
            <span className={s.counter}>{fill(labels.counter, { index: slide + 1, count })}</span>
            <div className={s.navGroup}>
              <button type="button" className={s.navBtn} onClick={() => goTo(slide - 1)} disabled={slide <= 0} aria-label={labels.prev}>
                <CaretLeftIcon className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={s.navBtn}
                onClick={() => goTo(slide + 1)}
                disabled={slide >= count - 1}
                aria-label={labels.next}
              >
                <CaretRightIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ul
          className={cropped ? s.grid : s.masonry}
          style={{ '--cols': columns, '--cols-sm': colsSm } as CSSProperties}
        >
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`}>
              {tile(img, i, gridSizes)}
              {showCaptions ? <Caption img={img} labels={labels} className={s.tileCaption} /> : null}
            </li>
          ))}
        </ul>
      )}

      {caption && (layout !== 'slider' || showCaptions) ? <figcaption className={s.caption}>{caption}</figcaption> : null}

      <dialog ref={dialogRef} className={s.lightbox} aria-label={caption || fill(labels.label, { count })}>
        {current ? (
          <div className={s.lightboxInner}>
            <div className={s.lightboxTop}>
              <span aria-live="polite">{fill(labels.counter, { index: (open ?? 0) + 1, count })}</span>
              <button type="button" className={s.lightboxBtn} onClick={close} aria-label={labels.close} autoFocus>
                <XIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className={s.lightboxStage} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                quality={85}
                unoptimized={current.mimeType === 'image/svg+xml' || current.mimeType === 'image/gif'}
              />
              {count > 1 ? (
                <>
                  <button type="button" className={cn(s.lightboxBtn, s.lightboxPrev)} onClick={() => step(-1)} aria-label={labels.prev}>
                    <CaretLeftIcon className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" className={cn(s.lightboxBtn, s.lightboxNext)} onClick={() => step(1)} aria-label={labels.next}>
                    <CaretRightIcon className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>
            <div className={s.lightboxCaption}>
              <Caption img={current} labels={labels} />
            </div>
          </div>
        ) : null}
      </dialog>
    </figure>
  );
}
