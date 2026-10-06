'use client';

import { Button, toast, useAuth, useConfig, useDocumentInfo, useForm, useFormFields, useLocale, useTranslation } from '@payloadcms/ui';
import { formatAdminURL } from 'payload/shared';
import { useCallback, useState } from 'react';

/**
 * Review workflow buttons in the news edit view (`edit.beforeDocumentControls`,
 * left of "Lưu nháp"):
 * - Phóng viên (author): "Gửi duyệt" saves the draft AND sets "Trạng thái biên
 *   tập" = Chờ duyệt in one click (no need to find the sidebar select). Once
 *   pending it shows "Đã gửi duyệt" (disabled); editing and saving again keeps it
 *   in the queue.
 * - Biên tập viên / Quản trị (editor, admin): on an article "Chờ duyệt",
 *   "Trả lại (Cần sửa)" saves it back as "Cần sửa". A note in "Ghi chú biên
 *   tập" is required so the author knows what to fix.
 * Both save as draft (`?draft=true`): the live version, if any, is untouched.
 * Server rules still apply (src/cms/hooks/newsWorkflow.ts).
 */
type Roles = { roles?: string[] | null } | null | undefined;

const canPublish = (u: Roles) => Boolean(u?.roles?.includes('admin') || u?.roles?.includes('editor'));

export function ReviewActions() {
  const { user } = useAuth();
  const { id, collectionSlug, hasSavePermission, isTrashed } = useDocumentInfo();
  const { submit } = useForm();
  const { code: locale } = useLocale();
  const { i18n } = useTranslation();
  const {
    config: {
      routes: { api },
    },
  } = useConfig();
  const en = i18n.language === 'en';
  const reviewStatus = useFormFields(([fields]) => fields?.reviewStatus?.value) as string | undefined;
  const reviewNote = useFormFields(([fields]) => fields?.reviewNote?.value) as string | undefined;
  const dispatch = useFormFields(([, d]) => d);
  const [busy, setBusy] = useState(false);

  const editable = hasSavePermission !== false && !isTrashed;
  const editor = canPublish(user as Roles);

  const saveAs = useCallback(
    async (status: 'pending' | 'changes') => {
      if (busy) return;
      setBusy(true);
      try {
        dispatch({ type: 'UPDATE', path: 'reviewStatus', value: status });
        const action = formatAdminURL({
          apiRoute: api,
          path: `/${collectionSlug}${id ? `/${id}` : ''}?locale=${locale}&depth=0&fallback-locale=null&draft=true`,
        });
        await submit({
          action,
          method: id ? 'PATCH' : 'POST',
          overrides: { _status: 'draft', reviewStatus: status },
          skipValidation: true,
        });
      } finally {
        setBusy(false);
      }
    },
    [api, busy, collectionSlug, dispatch, id, locale, submit],
  );

  if (!user || !editable) return null;

  if (!editor) {
    const pending = reviewStatus === 'pending';
    return (
      <Button
        buttonStyle={pending ? 'secondary' : 'primary'}
        size="medium"
        disabled={pending || busy}
        onClick={() => void saveAs('pending')}
        tooltip={
          pending
            ? en
              ? 'An editor will review and publish it. You can keep editing; saves keep it in the queue.'
              : 'Biên tập viên sẽ duyệt và đăng. Bạn vẫn sửa tiếp được, bài vẫn nằm trong hàng chờ.'
            : en
              ? 'Save and send to an editor for review'
              : 'Lưu và chuyển bài cho biên tập viên duyệt'
        }
        className="bh-review-btn"
      >
        {pending ? (en ? 'Submitted for review' : 'Đã gửi duyệt') : en ? 'Submit for review' : 'Gửi duyệt'}
      </Button>
    );
  }

  if (!id || reviewStatus !== 'pending') return null;
  return (
    <Button
      buttonStyle="secondary"
      size="medium"
      disabled={busy}
      className="bh-review-btn"
      tooltip={en ? 'Send back to the author with a note' : 'Trả bài cho phóng viên kèm ghi chú cần sửa'}
      onClick={() => {
        if (!reviewNote?.trim()) {
          toast.error(
            en
              ? 'Write what needs fixing in the "Editorial note" field first (the cursor is there now).'
              : 'Hãy ghi điều cần sửa vào ô "Ghi chú biên tập" (con trỏ đã được đưa tới ô này) trước khi trả bài.',
          );
          const note = document.getElementById('field-reviewNote');
          note?.scrollIntoView({ block: 'center', behavior: 'smooth' });
          note?.focus({ preventScroll: true });
          return;
        }
        void saveAs('changes');
      }}
    >
      {en ? 'Return (needs changes)' : 'Trả lại (Cần sửa)'}
    </Button>
  );
}

export default ReviewActions;
