'use client';

import { useDocumentInfo } from '@payloadcms/ui';
import { useEffect } from 'react';

/**
 * News edit view (`admin.components.edit.beforeDocumentControls`), renders nothing.
 *
 * Payload's "Hẹn giờ đăng" drawer pre-selects "Gỡ bài" whenever the document
 * has no unpublished changes (PublishButton: `defaultType: !hasNewerVersions
 * ? 'unpublish' : 'publish'`). For a draft that has never been published
 * (e.g. reopened after saving) that default is a trap: the editor picks a
 * time, saves, and the article is never published (seen in E2E testing).
 * When the article is not live, switch the drawer to "Xuất bản" once as it opens.
 */
export function ScheduleDefault() {
  const { id, hasPublishedDoc } = useDocumentInfo();

  useEffect(() => {
    if (hasPublishedDoc || id == null) return;
    const handled = new WeakSet<Element>();
    const fix = () => {
      const publish = document.querySelector<HTMLInputElement>(`input[id$="-${id}-type-publish"]`);
      const unpublish = document.querySelector<HTMLInputElement>(`input[id$="-${id}-type-unpublish"]`);
      if (!publish || !unpublish || handled.has(publish)) return;
      handled.add(publish);
      if (unpublish.checked && !publish.checked) publish.click();
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
