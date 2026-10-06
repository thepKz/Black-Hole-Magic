import type { Payload } from 'payload';

import { canPublish } from '../../access';
import { isListPage, QuickFilters, type QuickFilter } from './QuickFilters';

type Props = {
  payload: Payload;
  user?: { id: number | string; roles?: string[] | null } | null;
  searchParams?: Record<string, string | string[] | undefined>;
  i18n?: { language?: string };
  params?: { segments?: string[] };
};

/** "Tất cả · Bài của tôi · Bản nháp · Chờ duyệt · Cần sửa · Đã xuất bản · Tin nóng" above the news list. */
export async function NewsQuickFilters({ payload, user, searchParams, i18n, params }: Props) {
  if (!user) return null;
  const en = i18n?.language === 'en';
  // Trash view (/collections/news/trash): the chips count and link to the
  // normal list, which is confusing there. Show a short hint instead.
  const seg = params?.segments ?? [];
  if (seg[0] === 'collections' && seg[1] === 'news' && seg[2] === 'trash' && seg.length === 3) {
    return (
      <p className="bh-field-hint bh-field-hint--info">
        {en
          ? 'Trashed articles are hidden from the site. Open one to restore it, or delete it permanently.'
          : 'Bài trong thùng rác không hiện trên site. Mở bài để khôi phục, hoặc xoá vĩnh viễn.'}
      </p>
    );
  }
  if (!isListPage(params, 'news')) return null;
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
