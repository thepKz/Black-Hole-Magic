'use client';

import { track } from '@site/components/analytics/track';
import { SegmentedControl, type SegmentOption } from '@site/components/ui/SegmentedControl';

/**
 * Category filter of /news: link-mode SegmentedControl (crawlable `?cat=` links,
 * server-rendered results) + `filter_change` analytics.
 */
export function NewsCategoryTabs({ options, value, label }: { options: SegmentOption[]; value: string; label: string }) {
  return (
    <SegmentedControl
      options={options}
      value={value}
      label={label}
      className="min-w-0"
      onNavigate={(v) => track('filter_change', { context: 'news', filter: 'category', value: v })}
    />
  );
}
