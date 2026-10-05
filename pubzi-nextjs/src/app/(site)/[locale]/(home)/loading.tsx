import { Container } from '@site/components/ui/Container';
import { GameCardSkeleton, Skeleton } from '@site/components/ui/Skeleton';

/**
 * Home skeleton (boxed banner + services + featured games), shown while a /{l}
 * segment streams. Same boxes as the real page, so nothing shifts when it swaps in.
 * Loading UI receives no params, so it carries no localized text: the page is
 * marked aria-busy and every block is aria-hidden.
 * Lives in the (home) route group on purpose: a loading.tsx at [locale]/ would
 * wrap every child route, make it stream, and turn notFound()/redirect() into
 * soft 200s (see node_modules/next/dist/docs/01-app/02-guides/streaming.md,
 * "The HTTP contract").
 */
export default function Loading() {
  return (
    <main id="main" tabIndex={-1} aria-busy="true" className="outline-none">
      <div aria-hidden="true" className="container-site pt-4 md:pt-6">
        <Skeleton className="aspect-video max-h-[calc(100svh-var(--header-h))] w-full rounded-[10px] md:aspect-[9/4] md:rounded-[14px]" />
      </div>

      <section aria-hidden="true" className="section-y">
        <Container>
          <SkeletonHeading />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-4">
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
          <div className="-mx-[var(--gutter)] grid auto-cols-[78%] grid-flow-col gap-4 overflow-hidden px-[var(--gutter)] py-2 sm:mx-0 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

/** Title + 40x3 bar (home headings carry no kicker, per design v2). */
function SkeletonHeading() {
  return (
    <div className="mb-6 flex flex-col gap-2.5 md:mb-7">
      <Skeleton className="h-8 w-64 max-w-full md:h-9" />
      <Skeleton className="h-[3px] w-10 rounded-full" />
    </div>
  );
}
