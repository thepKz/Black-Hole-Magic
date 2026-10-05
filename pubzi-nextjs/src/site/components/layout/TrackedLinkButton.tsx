'use client';

import type { MouseEvent } from 'react';

import { track } from '@site/components/analytics/track';
import { Button, type ButtonAsLinkProps } from '../ui/Button';

/**
 * Link-mode Button that fires `track('outbound_click', { target })` on click
 * (Trang ID login). Client wrapper so the server Header can stay a server component.
 */
export function TrackedLinkButton({ trackTarget, onClick, ...props }: ButtonAsLinkProps & { trackTarget: string }) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!props.disabled) track('outbound_click', { target: trackTarget, url: props.href });
    onClick?.(e);
  };
  return <Button {...props} onClick={handleClick} />;
}
