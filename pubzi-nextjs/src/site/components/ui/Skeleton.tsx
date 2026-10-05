import { cn } from '@site/lib/cn';

export interface SkeletonProps {
  className?: string;
}

/** Shimmer block (pulse disabled under prefers-reduced-motion). Decorative: aria-hidden. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('rounded-md bg-neutral-200/70 motion-safe:animate-pulse', className)} />;
}

/** Placeholder matching <GameCard> (4:3). */
export function GameCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2 rounded-xl bg-surface p-2 shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <div className="flex flex-col gap-2 px-1 py-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </div>
  );
}

/** Placeholder matching <NewsCard> (16:9). */
export function NewsCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2.5 rounded-xl bg-surface p-2.5 pb-5 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex flex-col gap-2 px-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-1 h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

/** Grid of skeleton cards for loading.tsx files. */
export function CardGridSkeleton({ kind, count = 6, label }: { kind: 'game' | 'news'; count?: number; label?: string }) {
  const Item = kind === 'game' ? GameCardSkeleton : NewsCardSkeleton;
  return (
    <div role="status" aria-live="polite">
      {label ? <span className="sr-only">{label}</span> : null}
      <div
        className={cn(
          'grid gap-4',
          kind === 'game' ? 'grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]' : 'gap-y-8 md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {Array.from({ length: count }, (_, i) => (
          <Item key={i} />
        ))}
      </div>
    </div>
  );
}
