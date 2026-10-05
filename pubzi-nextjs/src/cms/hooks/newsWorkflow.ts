import type { CollectionBeforeChangeHook, PayloadRequest, ValidationFieldError } from 'payload';
import { APIError, ValidationError } from 'payload';

import { canPublish, isAuthorOnly } from '../access';
import { lexicalToPlainText, readingTimeMinutes } from '../lib/lexical';

/**
 * Newsroom rules for `news` (beforeChange, in this order):
 * 1. guardNewsroomRules  - role rules that access functions alone cannot express.
 * 2. validateBeforePublish - the pre-publish checklist (only when publishing).
 * 3. computeDerived      - reading time, publishedAt on first publish, last editor.
 *
 * All three are cheap on draft / autosave saves: (1) and (3) are pure, (2)
 * returns immediately unless `_status === 'published'`.
 */

export type ReviewStatus = 'draft' | 'pending' | 'changes' | 'approved';

/** Values an author may set themselves. */
const AUTHOR_REVIEW_VALUES: ReviewStatus[] = ['draft', 'pending'];

export const EXCERPT_LIMITS = { min: 50, max: 300 } as const;

type Rel = number | string | { id: number | string } | null | undefined;
const relId = (v: Rel): number | string | null => (v && typeof v === 'object' ? v.id : (v ?? null));

/** True for "Lưu nháp" / autosave requests (`?draft=true`). */
const isDraftRequest = (req: PayloadRequest): boolean => {
  const flag = (req.query as Record<string, unknown> | undefined)?.draft;
  return flag === 'true' || flag === true;
};

const forbidden = (message: string) => new APIError(message, 403, null, true);

export const guardNewsroomRules: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  if (!data || !req.user || !isAuthorOnly(req.user as never)) return data;

  if (data._status === 'published') {
    throw forbidden('Phóng viên chưa có quyền xuất bản. Hãy chuyển "Trạng thái biên tập" sang "Chờ duyệt" để biên tập viên duyệt và đăng bài.');
  }
  // Unpublish = a non-draft save with `_status: 'draft'` while the LIVE doc is
  // published. `originalDoc` is the latest version (may be a newer draft), so
  // read the live status (one indexed lookup, only for authors' non-draft saves).
  if (operation === 'update' && data._status === 'draft' && !isDraftRequest(req) && originalDoc?.id != null) {
    const live = await req.payload
      .findByID({
        collection: 'news',
        id: originalDoc.id,
        draft: false,
        depth: 0,
        select: { _status: true },
        overrideAccess: true,
        disableErrors: true,
        req,
      })
      .catch(() => null);
    if ((live as { _status?: string } | null)?._status === 'published') {
      throw forbidden(
        data.deletedAt
          ? 'Phóng viên không thể xoá bài đã đăng. Hãy liên hệ biên tập viên.'
          : 'Phóng viên không thể gỡ bài đã đăng. Hãy liên hệ biên tập viên.',
      );
    }
  }

  // Authors always own what they write and cannot reassign it.
  data.author = operation === 'create' ? req.user.id : (relId(originalDoc?.author) ?? req.user.id);

  // Authors can only move between "Bản nháp" and "Chờ duyệt".
  if (data.reviewStatus !== undefined && !AUTHOR_REVIEW_VALUES.includes(data.reviewStatus)) {
    data.reviewStatus = originalDoc?.reviewStatus ?? 'draft';
  }
  return data;
};

/**
 * "Khôi phục phiên bản này" on a LIVE article. Payload writes the chosen
 * version's `_status` into the live document, so restoring any draft revision
 * (every autosave is one) silently took the article off the site (verified:
 * the public URL went 404). Newsroom expectation (WordPress-style revisions):
 * the article stays live with the restored content. Editors/admins only;
 * the publish checklist still runs because `_status` becomes 'published'.
 * "Khôi phục thành bản nháp" (`?draft=true`) is unaffected: Payload forces
 * draft and leaves the live document untouched in that case.
 */
export const keepLiveOnRestore: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  if (!data || operation !== 'update' || !req.context?.isRestoringVersion) return data;
  if (data._status === 'published' || originalDoc?.id == null || !canPublish(req.user as never)) return data;
  if (isDraftRequest(req)) return data;
  const live = await req.payload
    .findByID({
      collection: 'news',
      id: originalDoc.id,
      draft: false,
      depth: 0,
      select: { _status: true },
      overrideAccess: true,
      disableErrors: true,
      req,
    })
    .catch(() => null);
  if ((live as { _status?: string } | null)?._status === 'published') data._status = 'published';
  return data;
};

type MediaAlt = { id: number | string; alt?: string | null; filename?: string | null };

/** Media ids of every upload node in a Lexical document. */
function uploadIds(state: unknown): (number | string)[] {
  const ids: (number | string)[] = [];
  const walk = (node: { type?: string; relationTo?: string; value?: Rel; children?: unknown[] } | undefined) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'upload' && node.relationTo === 'media') {
      const id = relId(node.value);
      if (id != null) ids.push(id);
    }
    if (Array.isArray(node.children)) for (const child of node.children) walk(child as never);
  };
  walk((state as { root?: never } | null | undefined)?.root);
  return [...new Set(ids)];
}

/**
 * Pre-publish checklist. Runs for every save that results in a published
 * article (Publish button, re-publishing changes, scheduled publish jobs - those
 * run as the user who scheduled them). Drafts and autosaves are never checked.
 * Skipped for system calls without a user (seed scripts) and with
 * `req.context.skipPublishChecks = true`.
 */
export const validateBeforePublish: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (!data || data._status !== 'published' || !req.user || req.context?.skipPublishChecks) return data;

  // A scheduled publish sends only `{ _status }`: check the full document.
  const doc = { ...(originalDoc ?? {}), ...data } as Record<string, unknown>;
  const errors: ValidationFieldError[] = [];
  const add = (path: string, message: string) => errors.push({ path, message });

  const title = typeof doc.title === 'string' ? doc.title.trim() : '';
  if (!title) add('title', 'Bài viết chưa có tiêu đề.');

  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : '';
  if (!slug) add('slug', 'Chưa có đường dẫn (slug). Nhập tiêu đề hoặc bấm "Tạo" cạnh ô slug.');

  if (relId(doc.category as Rel) == null) add('category', 'Chưa chọn danh mục.');

  const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt.replace(/\s+/g, ' ').trim() : '';
  if (!excerpt) {
    add('excerpt', `Chưa có sapo. Viết ${EXCERPT_LIMITS.min}–${EXCERPT_LIMITS.max} ký tự (hoặc bấm "Lấy từ đoạn đầu").`);
  } else if (excerpt.length < EXCERPT_LIMITS.min) {
    add('excerpt', `Sapo quá ngắn (${excerpt.length} ký tự). Cần tối thiểu ${EXCERPT_LIMITS.min} ký tự.`);
  } else if (excerpt.length > EXCERPT_LIMITS.max) {
    add('excerpt', `Sapo quá dài (${excerpt.length} ký tự). Tối đa ${EXCERPT_LIMITS.max} ký tự.`);
  }

  // Alt text of the cover + every inline image (one query).
  const coverId = relId(doc.cover as Rel);
  const inlineIds = uploadIds(doc.content);

  const contentText = lexicalToPlainText(doc.content as never);
  const hasEmbeds = inlineIds.length > 0 || JSON.stringify(doc.content ?? '').includes('"type":"block"');
  if (!contentText.trim() && !hasEmbeds) add('content', 'Nội dung bài viết đang trống.');
  const ids = [...new Set([...(coverId != null ? [coverId] : []), ...inlineIds])];
  let media: MediaAlt[] = [];
  if (ids.length) {
    const res = await req.payload.find({
      collection: 'media',
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 0,
      pagination: false,
      locale: req.locale ?? undefined,
      select: { alt: true, filename: true },
      req,
      overrideAccess: true,
    });
    media = res.docs as unknown as MediaAlt[];
  }
  const byId = new Map(media.map((m) => [String(m.id), m]));
  const hasAlt = (id: number | string) => Boolean(byId.get(String(id))?.alt?.trim());

  if (coverId == null) {
    add('cover', 'Chưa có ảnh bìa.');
  } else if (!byId.has(String(coverId))) {
    add('cover', 'Ảnh bìa không còn trong thư viện. Hãy chọn lại.');
  } else if (!hasAlt(coverId)) {
    add('cover', 'Ảnh bìa chưa có mô tả ảnh (alt). Bấm vào ảnh để bổ sung.');
  }

  const missingAlt = inlineIds.filter((id) => byId.has(String(id)) && !hasAlt(id));
  if (missingAlt.length) {
    const names = missingAlt.map((id) => byId.get(String(id))?.filename || `#${id}`).slice(0, 5);
    add('content', `${missingAlt.length} ảnh trong bài chưa có mô tả (alt): ${names.join(', ')}${missingAlt.length > 5 ? '…' : ''}.`);
  }

  if (errors.length) {
    const err = new ValidationError({ collection: 'news', errors, req }, req.t);
    err.message = `Chưa thể xuất bản: ${errors
      .map((e) => e.message.replace(/\.$/, ''))
      .map((m) => m.charAt(0).toLowerCase() + m.slice(1))
      .join('; ')}.`;
    throw err;
  }
  return data;
};

/** Reading time, publishedAt on first publish, review status on publish, last editor. */
export const computeDerived: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (!data) return data;
  if (data.content !== undefined) {
    data.readingTime = readingTimeMinutes(data.content);
  }
  if (data._status === 'published') {
    // First publish (manual or scheduled) stamps the display date unless set by hand.
    if (!data.publishedAt && !originalDoc?.publishedAt) data.publishedAt = new Date().toISOString();
    data.reviewStatus = 'approved';
  }
  if (req.user && canPublish(req.user as never) === false && data.reviewStatus === 'approved') {
    // Defensive: approval is an editor decision (guardNewsroomRules already reverts it).
    data.reviewStatus = originalDoc?.reviewStatus ?? 'draft';
  }
  if (req.user) data.lastEditedBy = req.user.id;
  return data;
};
