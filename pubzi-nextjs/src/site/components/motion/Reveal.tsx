import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Reveal-on-scroll primitive (server component, zero JS of its own).
 *
 *   <Reveal>…</Reveal>                         rise 16px + fade
 *   <Reveal variant="fade" as="section">…</Reveal>
 *   {items.map((x, i) => <Reveal key={x.id} i={i}>…</Reveal>)}   staggered
 *
 * Or put the attributes on your own element: <li {...reveal(i)}>.
 *
 * Behaviour lives in site.css (`[data-reveal]`) + <MotionObserver> (fallback):
 * visible without JS, honours prefers-reduced-motion, only opacity/translate
 * animate (no CLS), runs once per element in the IntersectionObserver path.
 * Don't use it on above-the-fold hero content (the banner must paint at once).
 */
export type RevealVariant = 'rise' | 'fade' | 'scale';

export interface RevealAttrs {
  'data-reveal': '' | 'fade' | 'scale';
  style?: CSSProperties;
}

/** Spreadable attributes: `<li {...reveal(i)}>`. `i` = stagger index (0-8, larger values are capped). */
export function reveal(i?: number, variant: RevealVariant = 'rise', style?: CSSProperties): RevealAttrs {
  const attrs: RevealAttrs = { 'data-reveal': variant === 'rise' ? '' : variant };
  const merged = typeof i === 'number' && i > 0 ? ({ ...style, '--i': i } as CSSProperties) : style;
  if (merged) attrs.style = merged;
  return attrs;
}

export interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  /** Stagger index among siblings (0-8). */
  i?: number;
  variant?: RevealVariant;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Reveal({ children, as: Tag = 'div', i, variant = 'rise', className, style, id }: RevealProps) {
  return (
    <Tag id={id} className={className} {...reveal(i, variant, style)}>
      {children}
    </Tag>
  );
}
