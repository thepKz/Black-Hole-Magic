import type { Payload } from 'payload';

import { isListPage, QuickFilters, type QuickFilter } from './QuickFilters';

type Props = {
  payload: Payload;
  user?: { id: number | string } | null;
  searchParams?: Record<string, string | string[] | undefined>;
  i18n?: { language?: string };
  params?: { segments?: string[] };
};

/**
 * Above the image library: "Tất cả · Cần sửa alt · Ảnh tôi tải lên".
 * "Cần sửa alt" = alt generated from the file name and not reviewed yet; an
 * article using such an image as cover / inline image cannot be published.
 */
export async function MediaQuickFilters({ payload, user, searchParams, i18n, params }: Props) {
  if (!user || !isListPage(params, 'media')) return null;
  const en = i18n?.language === 'en';
  const filters: QuickFilter[] = [
    { key: 'all', label: en ? 'All' : 'Tất cả' },
    { key: 'altAuto', label: en ? 'Alt to review' : 'Cần sửa alt', where: { altAuto: { equals: true } }, count: true },
    { key: 'mine', label: en ? 'My uploads' : 'Ảnh tôi tải lên', where: { createdBy: { equals: user.id } }, count: true },
  ];
  return (
    <QuickFilters
      collection="media"
      filters={filters}
      payload={payload}
      searchParams={searchParams}
      user={user}
      ariaLabel={en ? 'Quick filters' : 'Lọc nhanh'}
    />
  );
}

export default MediaQuickFilters;
