'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react';

import { foldText } from '@/cms/lib/text';
import { track } from '@site/components/analytics/track';
import { Button } from '@site/components/ui/Button';
import { Chip } from '@site/components/ui/Chip';
import { EmptyState } from '@site/components/ui/EmptyState';
import { SearchInput } from '@site/components/ui/SearchInput';

/** One server-rendered game card + the data needed to filter it on the client. */
export interface GamesBrowserItem {
  slug: string;
  name: string;
  /** Extra searchable text (code, e.g. "VLTK2"). */
  keywords?: string;
  genres: string[];
  /** The rendered <GameCard> (server component output). */
  card: ReactNode;
}

export interface GamesBrowserGenre {
  slug: string;
  name: string;
  count: number;
}

export interface GamesBrowserLabels {
  all: string;
  genreFilter: string;
  searchGame: string;
  clearSearch: string;
  /** Template with {count}, e.g. "{count} game". */
  gamesCount: string;
  /** Template with {q}, e.g. "Kết quả cho “{q}”". */
  resultsFor: string;
  loadMore: string;
  emptyTitle: string;
  emptyDesc: string;
  clearFilters: string;
}

export interface GamesBrowserProps {
  items: GamesBrowserItem[];
  genres: GamesBrowserGenre[];
  labels: GamesBrowserLabels;
  /** Cards shown before "Xem thêm"; also the increment. Default 12. */
  pageSize?: number;
  className?: string;
}

const ALL = 'all';
const fill = (tpl: string, values: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));

function matches(item: GamesBrowserItem, genre: string, foldedQuery: string) {
  if (genre !== ALL && !item.genres.includes(genre)) return false;
  if (!foldedQuery) return true;
  const haystack = foldText(`${item.name} ${item.keywords ?? ''}`);
  // Every word must appear (order-insensitive): "the kiem" finds "Kiếm Thế".
  return foldedQuery.split(' ').every((word) => haystack.includes(word));
}

interface ViewProps extends GamesBrowserProps {
  genre: string;
  query: string;
  /** Interactive handlers; absent in the static (pre-hydration) fallback. */
  onGenre?: (slug: string) => void;
  onQuery?: (q: string) => void;
  onReset?: () => void;
}

function GamesView({ items, genres, labels, pageSize = 12, className, genre, query, onGenre, onQuery, onReset }: ViewProps) {
  const foldedQuery = foldText(query);
  const filtered = useMemo(() => items.filter((item) => matches(item, genre, foldedQuery)), [items, genre, foldedQuery]);

  // Reset the "Xem thêm" window whenever the filter changes.
  const filterKey = `${genre}|${foldedQuery}`;
  const [limit, setLimit] = useState({ key: filterKey, value: pageSize });
  const visibleCount = limit.key === filterKey ? limit.value : pageSize;
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  const listRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef<number | null>(null);
  useEffect(() => {
    // After "Xem thêm", move focus to the first newly revealed card (keyboard users).
    if (focusIndex.current === null) return;
    const li = listRef.current?.children[focusIndex.current] as HTMLElement | undefined;
    focusIndex.current = null;
    li?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus({ preventScroll: false });
  }, [visibleCount]);

  const loadMore = () => {
    focusIndex.current = visible.length;
    setLimit({ key: filterKey, value: visibleCount + pageSize });
  };

  const total = items.length;
  const filtering = genre !== ALL || Boolean(foldedQuery);

  // "Xoá bộ lọc" unmounts itself: move keyboard focus to the search field
  // (stays mounted) so focus does not fall back to <body>.
  const rootRef = useRef<HTMLDivElement>(null);
  const handleReset = () => {
    onReset?.();
    requestAnimationFrame(() => {
      rootRef.current?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: false });
    });
  };

  return (
    <div ref={rootRef} className={className}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div
          role="group"
          aria-label={labels.genreFilter}
          className="scrollbar-none -mx-[var(--gutter)] flex gap-1.5 overflow-x-auto px-[var(--gutter)] md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          <Chip label={labels.all} count={total} selected={genre === ALL} onClick={() => onGenre?.(ALL)} />
          {genres.map((g) => (
            <Chip key={g.slug} label={g.name} count={g.count} selected={genre === g.slug} onClick={() => onGenre?.(g.slug)} />
          ))}
        </div>
        <SearchInput
          label={labels.searchGame}
          placeholder={labels.searchGame}
          clearLabel={labels.clearSearch}
          param="q"
          resetParams={[]}
          navigation="router"
          trackContext="games"
          onValueChange={onQuery}
          className="md:w-[280px] md:shrink-0"
        />
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {foldedQuery ? `${fill(labels.resultsFor, { q: query })}: ` : ''}
        {fill(labels.gamesCount, { count: filtered.length })}
      </p>

      {filtered.length ? (
        <>
          <ul
            ref={listRef}
            role="list"
            className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
          >
            {visible.map((item) => (
              <li key={item.slug} className="min-w-0">
                {item.card}
              </li>
            ))}
          </ul>
          {remaining > 0 ? (
            <div className="mt-8 flex justify-center">
              <Button variant="secondary" size="lg" onClick={loadMore}>
                {labels.loadMore}
                <span className="text-subtle tabular-nums">+{Math.min(remaining, pageSize)}</span>
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState
          title={labels.emptyTitle}
          description={labels.emptyDesc}
          action={
            filtering ? (
              <Button variant="secondary" onClick={handleReset}>
                {labels.clearFilters}
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function GamesBrowserInner(props: GamesBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const validGenres = useMemo(() => new Set(props.genres.map((g) => g.slug)), [props.genres]);
  const urlGenreRaw = searchParams.get('genre') ?? ALL;
  const urlGenre = validGenres.has(urlGenreRaw) ? urlGenreRaw : ALL;
  const urlQuery = (searchParams.get('q') ?? '').trim();

  // Local state = instant UI; the URL follows via router.replace.
  const [genre, setGenre] = useState(urlGenre);
  const [query, setQuery] = useState(urlQuery);

  // Back/forward or external URL edits -> follow the URL.
  const [syncedUrl, setSyncedUrl] = useState(`${urlGenre}|${urlQuery}`);
  const urlKey = `${urlGenre}|${urlQuery}`;
  if (urlKey !== syncedUrl) {
    setSyncedUrl(urlKey);
    setGenre(urlGenre);
    setQuery(urlQuery);
  }

  const replaceUrl = useCallback(
    (next: { genre?: string; q?: string }) => {
      const params = new URLSearchParams(window.location.search);
      if (next.genre !== undefined) {
        if (next.genre === ALL) params.delete('genre');
        else params.set('genre', next.genre);
      }
      if (next.q !== undefined) {
        if (next.q) params.set('q', next.q);
        else params.delete('q');
      }
      const qs = params.toString();
      startTransition(() => router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false }));
    },
    [pathname, router],
  );

  const onGenre = (slug: string) => {
    if (slug === genre) return;
    setGenre(slug);
    replaceUrl({ genre: slug });
    track('filter_change', { context: 'games', filter: 'genre', value: slug });
  };

  const onReset = () => {
    setGenre(ALL);
    setQuery('');
    replaceUrl({ genre: ALL, q: '' });
  };

  return <GamesView {...props} genre={genre} query={query} onGenre={onGenre} onQuery={setQuery} onReset={onReset} />;
}

/**
 * /games browser: genre chips with counts, accent-insensitive search, URL state
 * (?genre=&q=, router.replace without scroll), instant client filtering, "Xem thêm"
 * paging and an empty state with reset. Cards are rendered on the server and passed in.
 * The Suspense fallback (static prerender, before hydration) shows the full list.
 */
export function GamesBrowser(props: GamesBrowserProps) {
  return (
    <Suspense fallback={<GamesView {...props} genre={ALL} query="" />}>
      <GamesBrowserInner {...props} />
    </Suspense>
  );
}

