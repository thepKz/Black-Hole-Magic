'use client';

import { useDocumentInfo, useTranslation } from '@payloadcms/ui';

/**
 * `ui` field at the top of the news form: tells the signed-in user that this
 * article is view-only for them (an author opening a colleague's article),
 * instead of a form that looks editable with every input greyed out.
 */
export function ReadOnlyNotice() {
  const { id, hasSavePermission, isTrashed } = useDocumentInfo();
  const { i18n } = useTranslation();
  if (id == null || (hasSavePermission !== false && !isTrashed)) return null;
  const en = i18n.language === 'en';
  return (
    <div className="bh-readonly-notice" role="status">
      <strong>{en ? 'View only.' : 'Chỉ xem.'}</strong>{' '}
      {isTrashed
        ? en
          ? 'This article is in the trash. Restore it to edit.'
          : 'Bài đang ở thùng rác. Khôi phục bài để chỉnh sửa.'
        : en
          ? 'You can read this article but not edit it (someone else’s article, or your role cannot change it). Ask an editor if it needs changes.'
          : 'Bạn xem được nhưng không sửa được bài này (bài của người khác, hoặc vai trò của bạn không có quyền). Cần sửa gì, hãy báo biên tập viên.'}
    </div>
  );
}

export default ReadOnlyNotice;
