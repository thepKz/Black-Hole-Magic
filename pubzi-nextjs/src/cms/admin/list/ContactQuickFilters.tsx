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
 * Above the contact-requests list: "Tất cả · Mới · Đang xử lý · Đã xong · Spam | Hợp tác ·
 * Hỗ trợ · Báo chí · Khác", every pill with its count (all 4 contact types).
 */
export async function ContactQuickFilters({ payload, user, searchParams, i18n, params }: Props) {
  if (!user || !isListPage(params, 'contact-requests')) return null;
  const en = i18n?.language === 'en';
  const filters: QuickFilter[] = [
    { key: 'all', label: en ? 'All' : 'Tất cả', count: true },
    { key: 'new', label: en ? 'New' : 'Mới', where: { status: { equals: 'new' } }, count: true },
    { key: 'processing', label: en ? 'In progress' : 'Đang xử lý', where: { status: { equals: 'processing' } }, count: true },
    { key: 'done', label: en ? 'Done' : 'Đã xong', where: { status: { equals: 'done' } }, count: true },
    { key: 'spam', label: en ? 'Spam' : 'Spam', where: { status: { equals: 'spam' } }, count: true },
    { key: 'biz', label: en ? 'Partnership' : 'Hợp tác', where: { type: { equals: 'biz' } }, count: true, divider: true },
    { key: 'support', label: en ? 'Player support' : 'Hỗ trợ', where: { type: { equals: 'support' } }, count: true },
    { key: 'press', label: en ? 'Press' : 'Báo chí', where: { type: { equals: 'press' } }, count: true },
    { key: 'other', label: en ? 'Other' : 'Khác', where: { type: { equals: 'other' } }, count: true },
  ];
  return (
    <QuickFilters
      collection="contact-requests"
      filters={filters}
      payload={payload}
      searchParams={searchParams}
      user={user}
      ariaLabel={en ? 'Quick filters' : 'Lọc nhanh'}
    />
  );
}

export default ContactQuickFilters;
