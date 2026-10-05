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
} from 'react';

import { track } from '@site/components/analytics/track';
import { buttonClasses } from '@site/components/ui/Button';
import { cn } from '@site/lib/cn';
import styles from './BannerSlider.module.css';

/** Autoplay interval (ms). */
const DURATION = 6000;
/** Minimum horizontal travel (px) for a swipe. */
const SWIPE_MIN = 48;
const IMAGE_QUALITY = 85;

export interface BannerSlideImage {
  src: string;
  width: number;
  height: number;
  /** Focal point in % -> object-position. */
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

/* ------------------------------------------------------------------------ */
/* Slide image (single source, or <picture> when a mobile source exists)    */
/* ------------------------------------------------------------------------ */

function SlideImage({ slide, first }: { slide: BannerSlide; first: boolean }) {
  const { image, mobileImage, alt } = slide;
  const imgClass =
    'pointer-events-none absolute inset-0 size-full object-cover [object-position:var(--fp-m)] md:[object-position:var(--fp-d)]';
  const style = {
    '--fp-d': focalPosition(image.focal),
    '--fp-m': focalPosition(mobileImage?.focal ?? image.focal),
  } as CSSProperties;

  if (!mobileImage) {
    return (
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes="100vw"
        quality={IMAGE_QUALITY}
        preload={first}
        draggable={false}
        className={imgClass}
        style={style}
      />
    );
  }

  // Art direction (Next docs, getImageProps): no <link rel=preload> (it would
  // fetch both sources); <picture> + eager/high priority loads only the match.
  const common = { alt, sizes: '100vw', quality: IMAGE_QUALITY };
  const {
    props: { srcSet: desktopSet },
  } = getImageProps({
    ...common,
    src: image.src,
    width: image.width,
    height: image.height,
  });
  const {
    props: { srcSet: mobileSet, ...rest },
  } = getImageProps({
    ...common,
    src: mobileImage.src,
    width: mobileImage.width,
    height: mobileImage.height,
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSet} />
      <source srcSet={mobileSet} />
      <img
        {...rest}
        alt={alt}
        loading={first ? 'eager' : 'lazy'}
        fetchPriority={first ? 'high' : undefined}
        draggable={false}
        className={imgClass}
        style={style}
      />
    </picture>
  );
}

/* ------------------------------------------------------------------------ */
/* Slider                                                                   */
/* ------------------------------------------------------------------------ */

/**
 * Home banner slider (design v2): full-bleed, 8:3 (>=768) / 16:9 (mobile) with
 * focal-point crop, max height = viewport minus header. Cross-fade .7s, autoplay
 * 6s that pauses on hover, keyboard focus, hidden tab and user pause; autoplay is
 * off under prefers-reduced-motion (the user can still start it). Dots (active =
 * 28px pill with progress), prev/next arrows (>=768, on hover/focus), thumbnails
 * 104x58 bottom-right (>=1060), swipe, ←/→ keys. Fires `banner_click`.
 * APG carousel pattern: region + roledescription, inactive slides inert.
 */
export function BannerSlider({ slides, labels, className }: BannerSliderProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  /** null = follow the default (paused only under reduced motion). */
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, serverFalse);
  const visible = useSyncExternalStore(subscribeVisibility, getVisible, serverTrue);

  const paused = userPaused ?? reducedMotion;
  const autoplay = count > 1 && !paused;
  const running = autoplay && !hovered && !focused && visible;

  /** Elapsed autoplay time of the slide `index` (survives hover/focus pauses). */
  const elapsed = useRef({ index: 0, ms: 0 });
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const goTo = useCallback(
    (next: number) => {
      if (count < 2) return;
      const target = ((next % count) + count) % count;
      elapsed.current = { index: target, ms: 0 };
      setIndex(target);
      return target;
    },
    [count],
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
        const next = (index + 1) % count;
        elapsed.current = { index: next, ms: 0 };
        setIndex(next);
      },
      Math.max(0, DURATION - elapsed.current.ms),
    );
    return () => {
      window.clearTimeout(id);
      if (!fired && elapsed.current.index === index) {
        elapsed.current.ms = Math.min(DURATION, elapsed.current.ms + performance.now() - startedAt);
      }
    };
  }, [running, index, count]);

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
    const target = goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
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

  /* ---- swipe ---- */
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
      goTo(index + (dx < 0 ? 1 : -1));
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

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.region}
      className={cn('group/banner relative w-full overflow-hidden bg-[#1a1446] text-white', className)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      {/* Viewport: 16:9 mobile, 8:3 >= 768, never taller than the visible viewport. */}
      <div
        className="relative aspect-video max-h-[calc(100svh-var(--header-h))] w-full touch-pan-y bg-[radial-gradient(60%_80%_at_85%_10%,rgba(24,214,242,.22),transparent_60%),radial-gradient(70%_90%_at_10%_100%,rgba(141,77,255,.55),transparent_65%),linear-gradient(125deg,#2a0f5c_0%,#1a1446_45%,#0b1a3a_100%)] select-none md:aspect-[8/3]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointer.current = null)}
        onClickCapture={onClickCapture}
      >
        <div className="absolute inset-0" aria-live={running ? 'off' : 'polite'}>
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={labels.slideOf[i]}
                aria-hidden={!active}
                inert={!active}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none',
                  active ? 'z-[1] opacity-100' : 'z-0 opacity-0',
                )}
              >
                <SlideLink slide={slide} newTabLabel={labels.newTab} onClick={() => onSlideClick(slide, i)}>
                  <SlideImage slide={slide} first={i === 0} />
                  {slide.title ? <SlideOverlay slide={slide} /> : null}
                </SlideLink>
              </div>
            );
          })}
        </div>

        {count > 1 ? (
          <>
            {/* Prev / next arrows (>= 768; revealed on hover or keyboard focus). */}
            <ArrowButton side="left" label={labels.prev} onClick={() => goTo(index - 1)}>
              <CaretLeftIcon className="size-5" weight="bold" aria-hidden="true" />
            </ArrowButton>
            <ArrowButton side="right" label={labels.next} onClick={() => goTo(index + 1)}>
              <CaretRightIcon className="size-5" weight="bold" aria-hidden="true" />
            </ArrowButton>

            {/* Pause/play + dots. */}
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:bottom-4">
              <button
                type="button"
                data-toggle="play"
                onClick={togglePlay}
                aria-label={paused ? labels.play : labels.pause}
                className="mr-1 grid size-7 place-items-center rounded-full bg-[rgba(20,12,38,.45)] text-white shadow-[0_0_0_1px_rgba(255,255,255,.18)] backdrop-blur-sm transition-colors hover:bg-[rgba(20,12,38,.7)]"
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
                    onClick={() => goTo(i)}
                    aria-label={labels.goTo[i]}
                    aria-current={active ? 'true' : undefined}
                    className="group/dot grid h-7 place-items-center rounded-full px-0.5"
                  >
                    <span
                      className={cn(
                        'relative block h-1.5 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(20,12,38,.25)] transition-[width,background-color] duration-300 ease-out-soft',
                        active
                          ? cn('w-7', autoplay ? 'bg-white/45' : 'bg-accent')
                          : 'w-2.5 bg-white/70 group-hover/dot:bg-white',
                      )}
                    >
                      {active && autoplay ? (
                        <span
                          key={index}
                          aria-hidden="true"
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

            {/* Thumbnails 104x58 (>= 1060px). Mouse shortcut duplicating the dots -> hidden from AT / tab order. */}
            <div aria-hidden="true" className="absolute right-5 bottom-5 z-10 hidden gap-2 min-[1060px]:flex">
              {slides.map((slide, i) => {
                const active = i === index;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    tabIndex={-1}
                    onClick={() => goTo(i)}
                    className={cn(
                      'relative h-[58px] w-[104px] overflow-hidden rounded-lg border bg-surface shadow-md transition-[opacity,border-color,transform] duration-300 ease-out-soft hover:-translate-y-0.5',
                      active
                        ? 'border-accent opacity-100 shadow-glow-accent'
                        : 'border-white/30 opacity-60 hover:opacity-90',
                    )}
                  >
                    <Image
                      src={slide.image.src}
                      alt=""
                      width={104}
                      height={58}
                      sizes="104px"
                      quality={60}
                      draggable={false}
                      className="size-full object-cover"
                      style={{
                        objectPosition: focalPosition(slide.image.focal),
                      }}
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
      <a
        href={slide.href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        onClick={onClick}
        className={cls}
      >
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
        <span className="container-site flex w-full flex-col items-start gap-1.5 pb-11 sm:gap-2 md:pb-16 lg:gap-3 lg:pb-20">
          <span className="block max-w-[min(560px,70%)] text-xl leading-tight font-semibold tracking-[-0.02em] text-balance text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.35)] sm:text-3xl lg:text-5xl">
            {slide.title}
          </span>
          {slide.subtitle ? (
            <span className="hidden max-w-[min(520px,60%)] text-sm leading-relaxed text-white/85 sm:block md:text-base lg:text-lg">
              {slide.subtitle}
            </span>
          ) : null}
          {slide.ctaLabel ? (
            <span
              className={cn(
                buttonClasses({ variant: 'primary', size: 'md' }),
                'mt-1 h-8 px-3 text-[13px] shadow-glow-accent group-hover/slide:border-accent-600 group-hover/slide:bg-accent-600 sm:h-10 sm:px-4 sm:text-sm lg:mt-2 lg:h-12 lg:px-6 lg:text-[15px]',
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
        'absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-[rgba(20,12,38,.45)] text-white shadow-[0_0_0_1px_rgba(255,255,255,.18)] backdrop-blur-sm md:grid',
        'opacity-0 transition-[opacity,background-color] duration-200 group-hover/banner:opacity-100 pointer-coarse:opacity-100 hover:bg-[rgba(20,12,38,.72)] focus-visible:opacity-100',
        side === 'left' ? 'left-3 lg:left-5' : 'right-3 lg:right-5',
      )}
    >
      {children}
    </button>
  );
}
