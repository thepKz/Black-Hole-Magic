import Link from 'next/link';
import { Fragment } from 'react';
import type { CollectionSlug, Payload, Where } from 'payload';
import { formatAdminURL } from 'payload/shared';

/**
 * Quick filter chips above a list table (`admin.components.beforeListTable`).
 * Plain links to `?where[...]=...`: the list view, its "Bộ lọc" panel and the
 * pagination all read that query, so the chips stay in sync with them.
 */
export type QuickFilter = {
  key: string;
  label: string;
  /** Flat where: { field: { operator: value } }. Empty = "all". */
  where?: Record<string, Record<string, string | number | boolean>>;
  /** Show the number of matching docs (one count query each). */
  count?: boolean;
  /** Draw a thin divider before this chip (separates filter groups, e.g. status | type). */
  divider?: boolean;
};

type SearchParams = Record<string, string | string[] | undefined> | undefined;

const flatten = (where: QuickFilter['where']): [string, string][] =>
  Object.entries(where ?? {}).flatMap(([field, ops]) =>
    Object.entries(ops).map(([op, v]) => [`where[${field}][${op}]`, String(v)] as [string, string]),
  );

function isActive(filter: QuickFilter, searchParams: SearchParams): boolean {
  const current = Object.entries(searchParams ?? {})
    .filter(([k]) => k.startsWith('where'))
    .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v] as [string, string | undefined]);
  const wanted = flatten(filter.where);
  if (wanted.length !== current.length) return false;
  return wanted.every(([k, v]) => current.some(([ck, cv]) => ck === k && cv === v));
}

export async function QuickFilters({
  collection,
  filters,
  payload,
  searchParams,
  user,
  draft,
  ariaLabel,
}: {
  collection: CollectionSlug;
  filters: QuickFilter[];
  payload: Payload;
  searchParams: SearchParams;
  user: unknown;
  draft?: boolean;
  ariaLabel: string;
}) {
  const base = formatAdminURL({ adminRoute: payload.config.routes.admin, path: `/collections/${collection}` });
  const counts = await Promise.all(
    filters.map(async (f) => {
      if (!f.count) return null;
      try {
        const res = await payload.find({
          collection,
          where: (f.where ?? {}) as Where,
          limit: 1,
          depth: 0,
          draft,
          select: {},
          overrideAccess: false,
          user: user as never,
        });
        return res.totalDocs;
      } catch {
        return null;
      }
    }),
  );

  return (
    <nav className="bh-quick-filters" aria-label={ariaLabel}>
      {filters.map((f, i) => {
        const qs = flatten(f.where)
          .map(([k, v]) => `${encodeURIComponent(k).replace(/%5B/g, '[').replace(/%5D/g, ']')}=${encodeURIComponent(v)}`)
          .join('&');
        const active = isActive(f, searchParams);
        const count = counts[i];
        return (
          <Fragment key={f.key}>
            {f.divider && <span className="bh-quick-filters__divider" aria-hidden="true" />}
            <Link
              href={qs ? `${base}?${qs}` : base}
              className={`bh-quick-filters__chip${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              prefetch={false}
            >
              {f.label}
              {typeof count === 'number' && <span className="bh-quick-filters__count">{count}</span>}
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}
