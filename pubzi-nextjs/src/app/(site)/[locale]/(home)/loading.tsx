import { Container } from '@site/components/ui/Container';
import { GameCardSkeleton, Skeleton } from '@site/components/ui/Skeleton';

/**
 * Home skeleton (banner + services + featured games), shown while a /{l}
 * segment streams. Loading UI receives no params, so it carries no localized
 * text: the page is marked aria-busy and every block is aria-hidden.
 * Lives in the (home) route group on purpose: a loading.tsx at [locale]/ would
 * wrap every child route, make it stream, and turn notFound()/redirect() into
 * soft 200s (see node_modules/next/dist/docs/01-app/02-guides/streaming.md,
 * "The HTTP contract").
 */
export default function Loading() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="outline-none">
      <Skeleton className="aspect-video max-h-[calc(100svh-var(--header-h))] w-full rounded-none md:aspect-[8/3]" />

      <section aria-hidden="true" className="section-y">
        <Container>
          <SkeletonHeading />
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 rounded-xl bg-surface p-5 shadow-sm sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5 sm:p-7"
              >
                <Skeleton className="size-14 rounded-xl sm:size-[72px]" />
                <div className="flex flex-col gap-2.5 pt-1">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-hidden="true" className="section-b">
        <Container>
          <SkeletonHeading />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {Array.from({ length: 4 }, (_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

function SkeletonHeading() {
  return (
    <div className="mb-6 flex flex-col gap-2.5 md:mb-7">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-64 max-w-full md:h-9" />
      <Skeleton className="h-[3px] w-10 rounded-full" />
    </div>
  );
}
