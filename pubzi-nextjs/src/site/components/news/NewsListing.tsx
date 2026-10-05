import { NewsCard } from '@site/components/ui/NewsCard';
import type { Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { NewsListItem } from '@site/lib/types';

/** 3-column news grid (1 col < 768, 2 cols < 1024). */
export function NewsGrid({
  items,
  locale,
  preloadFirst = false,
  className,
}: {
  items: NewsListItem[];
  locale: Locale;
  preloadFirst?: boolean;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <ul role="list" className={cn('grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, i) => (
        <li key={item.id} className="min-w-0">
          <NewsCard
            item={item}
            locale={locale}
            headingLevel="h2"
            preload={preloadFirst && i === 0}
            sizes="(min-width: 1280px) 376px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Featured block of the unfiltered first page: 1 large card (2/3) + 2 stacked
 * cards (1/3) on desktop; a single column on mobile. The large slot takes the
 * first post flagged `featured` in `items`, otherwise the first one (the page
 * passes the CMS-pinned post first, see getFeaturedNews).
 */
export function NewsFeatured({ items, locale }: { items: NewsListItem[]; locale: Locale }) {
  if (!items.length) return null;
  const leadIndex = Math.max(0, items.findIndex((i) => i.featured));
  const lead = items[leadIndex];
  const rest = items.filter((_, i) => i !== leadIndex).slice(0, 2);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2">
        <NewsCard item={lead} locale={locale} variant="large" headingLevel="h2" preload className="h-full" />
      </div>
      {rest.length ? (
        <ul role="list" className="grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-1">
          {rest.map((item) => (
            <li key={item.id} className="min-w-0">
              <NewsCard
                item={item}
                locale={locale}
                headingLevel="h2"
                sizes="(min-width: 1280px) 376px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
