'use client';

import { useDocumentInfo } from '@payloadcms/ui';
import { useEffect } from 'react';

/**
 * News edit view (`admin.components.edit.beforeDocumentControls`), renders nothing.
 * Fixes two traps in Payload's "Hẹn giờ đăng" drawer (ScheduleDrawer, not
 * configurable in 3.90):
 *
 * 1. It pre-selects "Gỡ bài" whenever the document has no unpublished changes
 *    (PublishButton: `defaultType: !hasNewerVersions ? 'unpublish' : 'publish'`).
 *    For a draft that has never been published (e.g. reopened after saving)
 *    the editor picks a time, saves, and the article is never published (seen
 *    in E2E testing). When the article is not live, switch to "Xuất bản" once.
 *
 * 2. Its date input uses the US pattern "MMM d, yyyy h:mm a" (no displayFormat
 *    prop), so a typed "06/10/2026 11:32" is silently discarded and saving says
 *    "Không có ngày nào được chọn". The input is made read-only (click opens the
 *    calendar + time list as before) with a Vietnamese hint, so editors always
 *    use the picker. The chosen time is shown in Vietnam time in the list below.
 */
const HINT_CLASS = 'bh-schedule-hint';

export function ScheduleDefault() {
  const { id, hasPublishedDoc } = useDocumentInfo();

  useEffect(() => {
    if (id == null) return;
    const handled = new WeakSet<Element>();
    const fix = () => {
      const drawer = document.querySelector('.schedule-publish');
      if (!drawer) return;

      if (!hasPublishedDoc) {
        const publish = drawer.querySelector<HTMLInputElement>(`input[id$="-${id}-type-publish"]`);
        const unpublish = drawer.querySelector<HTMLInputElement>(`input[id$="-${id}-type-unpublish"]`);
        if (publish && unpublish && !handled.has(publish)) {
          handled.add(publish);
          if (unpublish.checked && !publish.checked) publish.click();
        }
      }

      const input = drawer.querySelector<HTMLInputElement>('.date-time-picker input, .react-datepicker__input-container input');
      if (input && !handled.has(input)) {
        handled.add(input);
        input.readOnly = true;
        input.placeholder = 'Bấm để chọn ngày và giờ';
        input.setAttribute('aria-description', 'Chọn ngày trên lịch và giờ trong danh sách bên phải; không gõ tay.');
        const wrap = input.closest('.date-time-picker') ?? input.parentElement;
        if (wrap && !wrap.parentElement?.querySelector(`.${HINT_CLASS}`)) {
          const hint = document.createElement('p');
          hint.className = `bh-field-hint bh-field-hint--info ${HINT_CLASS}`;
          hint.textContent = 'Bấm vào ô để chọn ngày trên lịch và giờ (bước 5 phút) ở cột bên phải. Giờ Việt Nam.';
          wrap.insertAdjacentElement('afterend', hint);
        }
      }
    };
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), fix()));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [id, hasPublishedDoc]);

  return null;
}

export default ScheduleDefault;
