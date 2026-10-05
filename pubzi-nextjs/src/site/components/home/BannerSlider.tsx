'use client';

import { CaretLeftIcon, CaretRightIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

import { track } from '@site/components/analytics/track';
import { buttonClasses } from '@site/components/ui/Button';
import { cn } from '@site/lib/cn';
import styles from './BannerSlider.module.css';

/** Autoplay interval (ms). */
const DURATION = 6000;
/** Cross-fade (ms) - keep in sync with --dur-4 (700ms) used on the layers. */
const FADE = 700;
/** Longest wait for the next image to decode before swapping anyway (ms). */
const DECODE_TIMEOUT = 1200;
/** Minimum horizontal travel (px) for a swipe. */
const SWIPE_MIN = 48;
const IMAGE_QUALITY = 85;
/** Banner slot width: 1200px boxed (container-site), full width below. */
const SIZES = '(min-width: 1248px) 1200px, calc(100vw - 32px)';

export interface BannerSlideImage {
  src: string;
  width: number;
  height: number;
  /** Focal point in % -> object-position (and Ken Burns origin). */
  focal?: { x: number; y: number };
}

/** Serializable, already-localized slide (built by the server component HomeBanner). */
export interface BannerSlide {
  id: string;
  /** Locale-prefixed path or absolute URL; null = not clickable. */
  href: string | null;
  external: boolean;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  gameSlug?: string;
  image: BannerSlideImage;
  /** Optional dedicated 16:9 mobile source (art direction < 768px). */
  mobileImage?: BannerSlideImage;
}

export interface BannerSliderLabels {
  region: string;
  prev: string;
  next: string;
  pause: string;
  play: string;
  newTab: string;
  /** One per slide: "Chuyển đến banner 1". */
  goTo: string[];
  /** One per slide: "Banner 1 / 4". */
  slideOf: string[];
}

export interface BannerSliderProps {
  slides: BannerSlide[];
  labels: BannerSliderLabels;
  className?: string;
}

/* ------------------------------------------------------------------------ */
/* External stores (no setState-in-effect)                                  */
/* ------------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

function subscribeVisibility(cb: () => void) {
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
}
const getVisible = () => document.visibilityState !== 'hidden';
const serverFalse = () => false;
const serverTrue = () => true;

const focalPosition = (focal?: { x: number; y: number }) => (focal ? `${focal.x}% ${focal.y}%` : '50% 50%');

const wrap = (i: number, count: number) => ((i % count) + count) % count;

/* ------------------------------------------------------------------------ */
/* Slide image (single source, or <picture> when a mobile source exists)    */
/* ------------------------------------------------------------------------ */

interface SlideImageProps {
  slide: BannerSlide;
  first: boolean;
  onReady: (e: SyntheticEvent<HTMLImageElement>) => void;
}

function SlideImage({ slide, first, onReady }: SlideImageProps) {
  const { image, mobileImage, alt } = slide;
  const imgClass =
    'pointer-events-none absolute inset-0 size-full object-cover [object-position:var(--fp-m)] md:[object-position:var(--fp-d)]';
  const style = {
    '--fp-d': focalPosition(image.focal),
    '--fp-m': focalPosition(mobileImage?.focal ?? image.focal),
  } as CSSProperties;

  // First slide = LCP: eager + fetchpriority="high" (Next 16 docs: prefer this
  // over `preload`, which emits a priority-less <link> and can't be combined
  // with fetchPriority). The <img> is in the SSR HTML, so it is discovered at
  // once. Others are only mounted when they are next in line (see `mounted` in
  // BannerSlider), then load at once with low priority so they never compete.
  if (!mobileImage) {
    return (
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={SIZES}
        quality={IMAGE_QUALITY}
        loading="eager"
        fetchPriority={first ? 'high' : 'low'}
        decoding="async"
        draggable={false}
        className={imgClass}
        style={style}
        onLoad={onReady}
      />
    );
  }

  // Art direction (Next docs, getImageProps): no <link rel=preload> (it would
  // fetch both sources); <picture> + eager/high priority loads only the match.
  const common = { alt, sizes: SIZES, quality: IMAGE_QUALITY };
  const {
    props: { srcSet: desktopSet },
  } = getImageProps({ ...common, src: image.src, width: image.width, height: image.height });
  const {
    props: { srcSet: mobileSet, ...rest },
  } = getImageProps({ ...common, src: mobileImage.src, width: mobileImage.width, height: mobileImage.height });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSet} />
      <source srcSet={mobileSet} />
      <img
        {...rest}
        alt={alt}
        loading="eager"
        fetchPriority={first ? 'high' : 'low'}
        decoding="async"
        draggable={false}
        className={imgClass}
        style={style}
        onLoad={onReady}
        // Already loaded before hydration (SSR first slide): report it now.
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0) el.dispatchEvent(new Event('load'));
        }}
      />
    </picture>
  );
}

/* ------------------------------------------------------------------------ */
/* Slider                                                                   */
/* ------------------------------------------------------------------------ */

/**
 * Home banner slider (design v2), boxed in the 1200 container by HomeBanner.
 * 9:4 (>= 768) / 16:9 (mobile), focal-point crop.
 *
 * Motion (transform / opacity only):
 * - Stacked layers cross-fade 700ms; `will-change: opacity` only on the two
 *   layers involved, only while the swap runs.
 * - Subtle Ken Burns (scale 1 -> 1.04 towards the focal point), CSS only,
 *   desktop + no reduced motion; paused together with autoplay.
 * - Autoplay progress = scaleX fill in the active dot.
 *
 * Loading: slide 1 paints immediately (SSR, eager + fetchpriority high, visible without JS).
 * Only the NEXT slide's image is mounted (after window load), and a swap waits
 * for `img.decode()` (max 1.2s) so a slide never fades in half-painted.
 *
 * Autoplay 6s pauses on hover, keyboard focus, user pause, hidden tab and when
 * the banner is scrolled out of view; off by default under reduced motion.
 * Dots (+ pause), arrows (>= 768, on hover / focus), thumbnails 80x45
 * (>= 1060), swipe (pointer events, never preventDefault -> scroll stays
 * smooth), ←/→ keys. APG carousel pattern; inactive slides are inert.
 * Fires `banner_click`.
 */
export function BannerSlider({ slides, labels, className }: BannerSliderProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  /** Layer fading out during a swap (null = no swap running). */
  const [leaving, setLeaving] = useState<number | null>(null);
  /** Slides whose image is in the DOM (first slide always; others on demand). */
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0]));
  /** null = follow the default (paused only under reduced motion). */
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, serverFalse);
  const visible = useSyncExternalStore(subscribeVisibility, getVisible, serverTrue);

  const paused = userPaused ?? reducedMotion;
  const autoplay = count > 1 && !paused;
  const running = autoplay && !hovered && !focused && visible && inView;

  const rootRef = useRef<HTMLElement>(null);
  /** Mirrors `index` for async callbacks (decode); written only in commit(). */
  const indexRef = useRef(0);
  /** Slides whose image has loaded + decoded. */
  const decoded = useRef<Set<number>>(new Set());
  /** Slide waiting for its image before the swap. */
  const pending = useRef<{ target: number; timer: number } | null>(null);
  const leaveTimer = useRef(0);
  /** Elapsed autoplay time of the slide `index` (survives pauses). */
  const elapsed = useRef({ index: 0, ms: 0 });
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const mount = useCallback((...ids: number[]) => {
    setMounted((prev) => (ids.every((id) => prev.has(id)) ? prev : new Set([...prev, ...ids])));
  }, []);

  /** Swap now (image ready or timed out). */
  const commit = useCallback(
    (target: number) => {
      if (pending.current) {
        window.clearTimeout(pending.current.timer);
        pending.current = null;
      }
      const from = indexRef.current;
      if (target === from) return;
      indexRef.current = target;
      elapsed.current = { index: target, ms: 0 };
      setLeaving(from);
      setIndex(target);
      // Warm up only the slide after this one.
      if (count > 1) mount(wrap(target + 1, count));
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setLeaving(null), FADE + 80);
    },
    [count, mount],
  );

  /** Ask for a slide: swaps once its image is decoded (or after DECODE_TIMEOUT). */
  const requestSlide = useCallback(
    (next: number) => {
      if (count < 2) return undefined;
      const target = wrap(next, count);
      if (target === indexRef.current && !pending.current) return target;
      if (decoded.current.has(target)) {
        commit(target);
        return target;
      }
      if (pending.current) window.clearTimeout(pending.current.timer);
      pending.current = { target, timer: window.setTimeout(() => commit(target), DECODE_TIMEOUT) };
      mount(target);
      return target;
    },
    [commit, count, mount],
  );

  const onImageReady = useCallback(
    (i: number, e: SyntheticEvent<HTMLImageElement>) => {
      if (decoded.current.has(i)) return;
      const img = e.currentTarget;
      const done = () => {
        decoded.current.add(i);
        if (pending.current?.target === i) commit(i);
      };
      // decode() resolves once the bitmap is ready to paint -> no half-drawn fade.
      if (typeof img.decode === 'function') img.decode().then(done, done);
      else done();
    },
    [commit],
  );

  // After the page has loaded (never competing with the LCP image), mount the
  // second slide so the first autoplay swap is instant.
  useEffect(() => {
    if (count < 2) return;
    let id = 0;
    const warm = () => {
      id = window.setTimeout(() => mount(wrap(indexRef.current + 1, count)), 300);
    };
    if (document.readyState === 'complete') warm();
    else window.addEventListener('load', warm, { once: true });
    return () => {
      window.removeEventListener('load', warm);
      window.clearTimeout(id);
    };
  }, [count, mount]);

  // Pause while the banner is scrolled out of view (one observer, this element only).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || count < 2 || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  // Cleanup pending timers on unmount.
  useEffect(
    () => () => {
      window.clearTimeout(leaveTimer.current);
      if (pending.current) window.clearTimeout(pending.current.timer);
    },
    [],
  );

  // Autoplay timer: resumes with the remaining time after a pause so the
  // progress pill (CSS animation, paused in sync) and the timer agree.
  useEffect(() => {
    if (!running) return;
    if (elapsed.current.index !== index) elapsed.current = { index, ms: 0 };
    const startedAt = performance.now();
    let fired = false;
    const id = window.setTimeout(
      () => {
        fired = true;
        requestSlide(index + 1);
      },
      Math.max(0, DURATION - elapsed.current.ms),
    );
    return () => {
      window.clearTimeout(id);
      if (!fired && elapsed.current.index === index) {
        elapsed.current.ms = Math.min(DURATION, elapsed.current.ms + performance.now() - startedAt);
      }
    };
  }, [running, index, requestSlide]);

  const togglePlay = () => {
    // Restart the current slide's countdown when resuming.
    if (paused) elapsed.current = { index, ms: 0 };
    setUserPaused(!paused);
  };

  /* ---- keyboard ---- */
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const target = requestSlide(index + (e.key === 'ArrowRight' ? 1 : -1));
    // Roving focus when the user is on the dots.
    if (target !== undefined && dotRefs.current.includes(e.target as HTMLButtonElement)) {
      dotRefs.current[target]?.focus();
    }
  };

  /* ---- focus pause: keyboard focus only, never the play/pause toggle ---- */
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    const el = e.target as HTMLElement;
    if (el.dataset.toggle === 'play') return setFocused(false);
    let keyboard = false;
    try {
      keyboard = el.matches(':focus-visible');
    } catch {
      keyboard = false;
    }
    setFocused(keyboard);
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  /* ---- swipe (pointer events are never cancelled -> page scroll is untouched) ---- */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointer.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || count < 2) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true;
      requestSlide(index + (dx < 0 ? 1 : -1));
    }
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!swiped.current) return;
    // A swipe that ended on the slide link must not navigate.
    swiped.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const onSlideClick = (slide: BannerSlide, i: number) => {
    track('banner_click', {
      banner_id: slide.id,
      position: i + 1,
      game: slide.gameSlug ?? null,
      href: slide.href,
    });
  };

  if (count === 0) return null;

  const swapping = leaving !== null;
  const rootStyle = {
    '--kb-play': running ? 'running' : 'paused',
    '--kb-dur': `${DURATION + FADE}ms`,
  } as CSSProperties;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={labels.region}
      className={cn('group/banner relative w-full overflow-hidden bg-[#1a1446] text-white', className)}
      style={rootStyle}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      {/* Viewport: 16:9 mobile, 9:4 >= 768 (1200x533 when boxed), never taller than the visible viewport. */}
      <div
        className="relative aspect-video max-h-[calc(100svh-var(--header-h))] w-full touch-pan-y bg-[radial-gradient(60%_80%_at_85%_10%,rgba(24,214,242,.22),transparent_60%),radial-gradient(70%_90%_at_10%_100%,rgba(141,77,255,.55),transparent_65%),linear-gradient(125deg,#2a0f5c_0%,#1a1446_45%,#0b1a3a_100%)] select-none md:aspect-[9/4]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointer.current = null)}
        onClickCapture={onClickCapture}
      >
        <div className="absolute inset-0" aria-live={running ? 'off' : 'polite'}>
          {slides.map((slide, i) => {
            const active = i === index;
            const isLeaving = i === leaving;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={labels.slideOf[i]}
                aria-hidden={!active}
                inert={!active}
                data-state={active ? 'active' : isLeaving ? 'leaving' : 'idle'}
                className={cn(
                  styles.layer,
                  'absolute inset-0 transition-opacity duration-(--dur-4) ease-standard',
                  // Incoming layer on top, fading in over the outgoing one.
                  active ? 'z-[2] opacity-100' : isLeaving ? 'z-[1] opacity-100' : 'z-0 opacity-0',
                )}
                style={swapping && (active || isLeaving) ? { willChange: 'opacity' } : undefined}
              >
                <SlideLink slide={slide} newTabLabel={labels.newTab} onClick={() => onSlideClick(slide, i)}>
                  <span
                    className={styles.kb}
                    style={{ '--kb-origin': focalPosition(slide.image.focal) } as CSSProperties}
                  >
                    {mounted.has(i) ? (
                      <SlideImage slide={slide} first={i === 0} onReady={(e) => onImageReady(i, e)} />
                    ) : null}
                  </span>
                  {slide.title ? <SlideOverlay slide={slide} /> : null}
                </SlideLink>
              </div>
            );
          })}
        </div>

        {count > 1 ? (
          <>
            {/* Prev / next arrows (>= 768; revealed on hover or keyboard focus). */}
            <ArrowButton side="left" label={labels.prev} onClick={() => requestSlide(index - 1)}>
              <CaretLeftIcon className="size-5" weight="bold" aria-hidden="true" />
            </ArrowButton>
            <ArrowButton side="right" label={labels.next} onClick={() => requestSlide(index + 1)}>
              <CaretRightIcon className="size-5" weight="bold" aria-hidden="true" />
            </ArrowButton>

            {/* Pause/play + dots (28x28 hit targets). */}
            <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 items-center md:bottom-3">
              <button
                type="button"
                data-toggle="play"
                onClick={togglePlay}
                aria-label={paused ? labels.play : labels.pause}
                className="fx mr-1 grid size-7 place-items-center rounded-full bg-[rgba(20,12,38,.55)] text-white shadow-[0_0_0_1px_rgba(255,255,255,.18)] [--fx-bg:rgba(255,255,255,.14)] [--fx-press:rgba(255,255,255,.22)]"
              >
                {paused ? (
                  <PlayIcon className="size-3.5" weight="fill" aria-hidden="true" />
                ) : (
                  <PauseIcon className="size-3.5" weight="fill" aria-hidden="true" />
                )}
              </button>
              {slides.map((slide, i) => {
                const active = i === index;
                return (
                  <button
                    key={slide.id}
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => requestSlide(i)}
                    aria-label={labels.goTo[i]}
                    aria-current={active ? 'true' : undefined}
                    className="relative grid h-7 w-7 place-items-center rounded-full"
                  >
                    {/* Inactive: 10px dot. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        styles.dot,
                        'col-start-1 row-start-1 block h-1.5 w-2.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(20,12,38,.25)]',
                      )}
                    />
                    {/* Active: 28px pill with the autoplay progress fill. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        styles.pill,
                        'relative col-start-1 row-start-1 block h-1.5 w-7 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(20,12,38,.25)]',
                        autoplay ? 'bg-white/45' : 'bg-accent',
                      )}
                    >
                      {active && autoplay ? (
                        <span
                          key={index}
                          className={cn('absolute inset-0 rounded-full bg-accent', styles.progress)}
                          style={{
                            animationDuration: `${DURATION}ms`,
                            animationPlayState: running ? 'running' : 'paused',
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Thumbnails 80x45 (>= 1060px), sized for the boxed 1200 banner. Mouse shortcut duplicating the dots -> hidden from AT / tab order. */}
            <div aria-hidden="true" className="absolute right-4 bottom-4 z-10 hidden gap-2 min-[1060px]:flex">
              {slides.map((slide, i) => {
                const active = i === index;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    tabIndex={-1}
                    onClick={() => requestSlide(i)}
                    className={cn(
                      'group/thumb relative h-[45px] w-[80px] rounded-md transition-[opacity,translate] duration-(--dur-2) ease-standard hover:-translate-y-0.5',
                      active ? 'opacity-100' : 'opacity-60 hover:opacity-90',
                    )}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#1a1446] shadow-[0_0_0_1px_rgba(255,255,255,.3),0_4px_10px_-2px_rgba(0,0,0,.35)]">
                      <Image
                        src={slide.image.src}
                        alt=""
                        width={80}
                        height={45}
                        sizes="80px"
                        quality={60}
                        draggable={false}
                        className="size-full object-cover"
                        style={{ objectPosition: focalPosition(slide.image.focal) }}
                      />
                    </span>
                    {/* Active ring + glow: separate layer, opacity only. */}
                    <span
                      className={cn(
                        'pointer-events-none absolute -inset-px rounded-[7px] shadow-[inset_0_0_0_2px_var(--color-accent),var(--shadow-glow-accent)] transition-opacity duration-(--dur-3) ease-standard',
                        active ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Parts                                                                    */
/* ------------------------------------------------------------------------ */

function SlideLink({
  slide,
  newTabLabel,
  onClick,
  children,
}: {
  slide: BannerSlide;
  newTabLabel: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const cls =
    'group/slide absolute inset-0 block outline-none focus-visible:outline-none focus-visible:after:absolute focus-visible:after:inset-1 focus-visible:after:z-[3] focus-visible:after:rounded-lg focus-visible:after:shadow-[inset_0_0_0_3px_var(--color-cyan)]';
  if (!slide.href) return <div className="absolute inset-0">{children}</div>;
  if (slide.external) {
    return (
      <a href={slide.href} target="_blank" rel="noopener noreferrer" draggable={false} onClick={onClick} className={cls}>
        {children}
        <span className="sr-only"> {newTabLabel}</span>
      </a>
    );
  }
  return (
    <Link href={slide.href} draggable={false} onClick={onClick} className={cls}>
      {children}
    </Link>
  );
}

/** Optional copy over the art (only slides with a title). */
function SlideOverlay({ slide }: { slide: BannerSlide }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(14,8,32,.78)_0%,rgba(14,8,32,.35)_38%,transparent_65%),linear-gradient(90deg,rgba(14,8,32,.55)_0%,transparent_55%)]"
      />
      <span className="absolute inset-0 z-[2] flex items-end">
        <span className="flex w-full flex-col items-start gap-1.5 px-5 pb-11 sm:gap-2 md:px-10 md:pb-14 lg:gap-3 lg:px-14 lg:pb-16">
          <span className="block max-w-[min(560px,70%)] text-xl leading-tight font-semibold tracking-[-0.02em] text-balance text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.35)] sm:text-3xl lg:text-[44px]">
            {slide.title}
          </span>
          {slide.subtitle ? (
            <span className="hidden max-w-[min(520px,60%)] text-sm leading-relaxed text-white/85 sm:block md:text-base">
              {slide.subtitle}
            </span>
          ) : null}
          {slide.ctaLabel ? (
            <span
              className={cn(
                buttonClasses({ variant: 'primary', size: 'md' }),
                'mt-1 h-8 px-3 text-[13px] shadow-glow-accent group-hover/slide:border-accent-600 group-hover/slide:bg-accent-600 sm:h-10 sm:px-4 sm:text-sm lg:mt-2 lg:h-11 lg:px-5',
              )}
            >
              {slide.ctaLabel}
              <CaretRightIcon className="size-4" weight="bold" aria-hidden="true" />
            </span>
          ) : null}
        </span>
      </span>
    </>
  );
}

function ArrowButton({
  side,
  label,
  onClick,
  children,
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        // No backdrop blur: it would re-blur every frame over the Ken Burns image.
        'fx absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-[rgba(20,12,38,.55)] text-white shadow-[0_0_0_1px_rgba(255,255,255,.18)] md:grid',
        '[--fx-bg:rgba(255,255,255,.14)] [--fx-press:rgba(255,255,255,.22)]',
        'opacity-0 transition-[opacity,transform] duration-(--dur-2) ease-standard group-hover/banner:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100',
        side === 'left' ? 'left-3 lg:left-4' : 'right-3 lg:right-4',
      )}
    >
      {children}
    </button>
  );
}
