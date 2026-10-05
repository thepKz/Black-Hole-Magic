import type { Payload } from 'payload';

import { canPublish } from '../../access';
import { QuickFilters, type QuickFilter } from './QuickFilters';

type Props = {
  payload: Payload;
  user?: { id: number | string; roles?: string[] | null } | null;
  searchParams?: Record<string, string | string[] | undefined>;
  i18n?: { language?: string };
};

/** "Tất cả · Bài của tôi · Bản nháp · Chờ duyệt · Cần sửa · Đã xuất bản · Tin nóng" above the news list. */
export async function NewsQuickFilters({ payload, user, searchParams, i18n }: Props) {
  if (!user) return null;
  const en = i18n?.language === 'en';
  const filters: QuickFilter[] = [
    { key: 'all', label: en ? 'All' : 'Tất cả' },
    { key: 'mine', label: en ? 'My articles' : 'Bài của tôi', where: { author: { equals: user.id } }, count: true },
    { key: 'draft', label: en ? 'Drafts' : 'Bản nháp', where: { _status: { equals: 'draft' } }, count: true },
    { key: 'pending', label: en ? 'Awaiting review' : 'Chờ duyệt', where: { reviewStatus: { equals: 'pending' } }, count: true },
    { key: 'changes', label: en ? 'Needs changes' : 'Cần sửa', where: { reviewStatus: { equals: 'changes' } }, count: true },
    { key: 'published', label: en ? 'Published' : 'Đã xuất bản', where: { _status: { equals: 'published' } } },
    { key: 'breaking', label: en ? 'Breaking' : 'Tin nóng', where: { breaking: { equals: true } } },
  ];
  // Authors mostly care about their own pieces; keep the review queue for editors.
  const visible = canPublish(user as never) ? filters : filters.filter((f) => f.key !== 'pending');
  return (
    <QuickFilters
      collection="news"
      filters={visible}
      payload={payload}
      searchParams={searchParams}
      user={user}
      draft
      ariaLabel={en ? 'Quick filters' : 'Lọc nhanh'}
    />
  );
}

export default NewsQuickFilters;
