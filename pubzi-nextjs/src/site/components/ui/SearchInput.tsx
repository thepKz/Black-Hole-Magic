'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';

import { track } from '@site/components/analytics/track';
import { cn } from '@site/lib/cn';
import { controlBase } from './formStyles';

export interface SearchInputProps {
  /** Accessible label (visually hidden), e.g. t.searchNews. */
  label: string;
  placeholder?: string;
  /** aria-label of the clear (x) button, e.g. t.clearSearch. */
  clearLabel: string;
  /** Query-string key. Default 'q'. */
  param?: string;
  /** Params removed whenever the query changes. Default ['page']. */
  resetParams?: string[];
  /** Default 300ms. */
  debounceMs?: number;
  /**
   * 'router'  -> router.replace (server re-render; use on dynamic pages such as /news).
   * 'history' -> window.history.replaceState (no server round-trip; use on static pages
   *              that filter on the client, e.g. /games; useSearchParams still updates).
   */
  navigation?: 'router' | 'history';
  /** Called with the debounced, trimmed value (client-side filtering). */
  onValueChange?: (value: string) => void;
  /** Analytics context sent with the `search` event ('news' | 'games'). */
  trackContext?: string;
  id?: string;
  className?: string;
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="112" cy="112" r="72" />
      <path d="M163 163l53 53" />
    </svg>
  );
}

const DEFAULT_RESET = ['page'];

const inputClass = cn(controlBase, 'h-11 pr-10 pl-10 [&::-webkit-search-cancel-button]:appearance-none');

function SearchInputInner({
  label,
  placeholder,
  clearLabel,
  param = 'q',
  resetParams = DEFAULT_RESET,
  debounceMs = 300,
  navigation = 'router',
  onValueChange,
  trackContext,
  id,
  className,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlValue = searchParams.get(param) ?? '';

  const autoId = useId();
  const inputId = id ?? `search-${autoId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(urlValue);
  const lastCommitted = useRef(urlValue.trim());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // External URL changes (e.g. "Xoá bộ lọc" link) -> reflect in the field.
  useEffect(() => {
    if (urlValue.trim() !== lastCommitted.current) {
      lastCommitted.current = urlValue.trim();
      setValue(urlValue);
    }
  }, [urlValue]);

  const commit = useCallback(
    (raw: string) => {
      const next = raw.trim();
      if (timer.current) clearTimeout(timer.current);
      if (next === lastCommitted.current) return;
      lastCommitted.current = next;

      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set(param, next);
      else params.delete(param);
      resetParams.forEach((p) => params.delete(p));
      const qs = params.toString();
      const url = `${pathname}${qs ? `?${qs}` : ''}`;

      if (navigation === 'history') window.history.replaceState(null, '', url);
      else router.replace(url, { scroll: false });

      onValueChange?.(next);
      if (next) track('search', { search_term: next, context: trackContext });
    },
    [navigation, onValueChange, param, pathname, resetParams, router, searchParams, trackContext],
  );

  useEffect(() => {
    if (value.trim() === lastCommitted.current) return;
    timer.current = setTimeout(() => commit(value), debounceMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, debounceMs, commit]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    commit(value);
  };

  const clear = () => {
    setValue('');
    commit('');
    inputRef.current?.focus();
  };

  return (
    <form role="search" onSubmit={onSubmit} className={cn('relative w-full sm:w-[300px]', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <SearchIcon />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder ?? label}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.preventDefault();
            clear();
          }
        }}
        className={inputClass}
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label={clearLabel}
          className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-subtle transition-colors hover:bg-neutral-100 hover:text-ink"
        >
          <svg className="size-4" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="22" strokeLinecap="round" aria-hidden="true">
            <path d="M200 56 56 200M56 56l144 144" />
          </svg>
        </button>
      ) : null}
    </form>
  );
}

/**
 * Debounced search box that syncs `?q=` (configurable) in the URL.
 * Wrapped in <Suspense> internally (useSearchParams), so it is safe on
 * statically prerendered pages; the fallback is an identical, inert field.
 */
export function SearchInput(props: SearchInputProps) {
  return (
    <Suspense
      fallback={
        <div className={cn('relative w-full sm:w-[300px]', props.className)}>
          <SearchIcon />
          <input
            type="search"
            aria-label={props.label}
            placeholder={props.placeholder ?? props.label}
            className={cn(inputClass, 'read-only:bg-surface')}
            readOnly
          />
        </div>
      }
    >
      <SearchInputInner {...props} />
    </Suspense>
  );
}
