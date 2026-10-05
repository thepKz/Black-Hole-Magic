import { format } from '@site/i18n';
import { cn } from '@site/lib/cn';

import { FadeImage } from '../FadeImage';
import { toRichImage } from './media';
import s from './rich-blocks.module.css';
import type { RichBlockStrings } from './strings';

export type FigureSize = 'full' | 'medium' | 'small';
export type FigureAlign = 'center' | 'left' | 'right';

/** Rendered width (px) of each display size in the 760px column; used for `sizes`. */
const SIZE_PX: Record<FigureSize, number> = { full: 760, medium: 560, small: 320 };

/**
 * Inline image (Lexical `upload` node): display size (full / medium / small),
 * alignment (center, or left / right with text wrapping - floats only from
 * 640px, stacked on phones), caption (node caption > media caption) + credit.
 * Small originals are never upscaled past their natural width.
 */
export function RichFigure({
  value,
  caption,
  size,
  align,
  t,
}: {
  value: unknown;
  caption?: string | null;
  size?: string | null;
  align?: string | null;
  t: RichBlockStrings;
}) {
  const img = toRichImage(value);
  if (!img) return null;
  const displaySize: FigureSize = size === 'medium' || size === 'small' ? size : 'full';
  const displayAlign: FigureAlign = displaySize !== 'full' && (align === 'left' || align === 'right') ? align : 'center';
  const text = caption?.trim() || img.caption;
  const isSvg = img.mimeType === 'image/svg+xml';
  const px = Math.min(SIZE_PX[displaySize], img.width);

  return (
    <figure
      className={cn(
        s.figure,
        displaySize === 'medium' && s.sizeMedium,
        displaySize === 'small' && s.sizeSmall,
        displayAlign === 'left' && s.alignLeft,
        displayAlign === 'right' && s.alignRight,
      )}
      // never stretch a small original beyond its natural width
      style={img.width < SIZE_PX[displaySize] ? { maxWidth: `min(100%, ${img.width}px)` } : undefined}
    >
      <FadeImage
        src={img.src}
        width={img.width}
        height={img.height}
        alt={img.alt}
        sizes={`(min-width: 800px) ${px}px, ${displaySize === 'full' ? 'calc(100vw - 32px)' : `${Math.min(px, 600)}px`}`}
        unoptimized={isSvg}
        loading="lazy"
      />
      {text || img.credit ? (
        <figcaption className={s.caption}>
          {text ? <span>{text}</span> : null}
          {img.credit ? <span className={s.credit}>{format(t.photoCredit, { credit: img.credit })}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
