import type { ElementType, ReactNode } from 'react';

import { cn } from '@site/lib/cn';

export interface ContainerProps {
  /** Rendered element (default div). */
  as?: ElementType;
  /** 'site' = 1200 column (default), 'article' = 760 reading column. */
  size?: 'site' | 'article';
  className?: string;
  children?: ReactNode;
  id?: string;
}

/** Centered content column with responsive gutter (24px / 16px < 768). */
export function Container({ as: Tag = 'div', size = 'site', className, children, id }: ContainerProps) {
  return (
    <Tag id={id} className={cn(size === 'article' ? 'container-article' : 'container-site', className)}>
      {children}
    </Tag>
  );
}
