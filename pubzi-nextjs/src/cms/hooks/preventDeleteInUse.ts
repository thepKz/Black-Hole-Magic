import type { CollectionBeforeDeleteHook, CollectionSlug, PayloadRequest, Where } from 'payload';
import { APIError } from 'payload';

/**
 * "Đang được dùng" guards (beforeDelete). Deleting something an article still
 * points at used to succeed silently: the cover became null (a live article
 * lost its image), inline images kept a dangling id, and a deleted category
 * left articles that can no longer be saved (category is required).
 *
 * Each guard lists up to 5 article titles in a Vietnamese 409 error, so the
 * admin shows exactly what to fix first. Queries are small (`limit` 5,
 * `depth` 0, `select` title) and only run on delete, which is rare.
 *
 * Lexical content is searched with JSON-path `where` clauses (db-postgres
 * `jsonb_path_exists`) for the places the editor can put a media / video id:
 * top-level inline images, gallery images, video block file + poster. Images
 * nested inside lists / tables / quotes are not detected (the editor cannot
 * put them there with the default toolbar).
 */

type Ref = { id: number | string; title?: string | null };

const LIMIT = 5;

function localesOf(req: PayloadRequest): (string | undefined)[] {
  const loc = req.payload.config.localization;
  return loc ? loc.localeCodes : [undefined];
}

/**
 * Fail CLOSED: if a reference query errors (DB timeout, pool exhausted...),
 * refuse the delete instead of assuming "not used" - otherwise a transient
 * error lets an editor delete an image a live article still shows.
 */
function checkFailed(req: PayloadRequest, err: unknown): never {
  req.payload.logger.error({ err, msg: '[preventDeleteInUse] reference query failed - delete refused' });
  throw new APIError(
    'Không kiểm tra được mục này có đang được bài viết nào dùng hay không, nên chưa xoá. Vui lòng thử lại sau ít phút.',
    503,
    null,
    true,
  );
}

/** News using `where` in their live OR latest-draft data, any locale (trash excluded unless asked). */
async function newsUsing(req: PayloadRequest, where: Where, { trash = false } = {}): Promise<{ docs: Ref[]; total: number }> {
  const found = new Map<string, Ref>();
  let total = 0;
  for (const draft of [false, true]) {
    for (const locale of localesOf(req)) {
      const res = await req.payload
        .find({
          collection: 'news',
          where,
          draft,
          locale: locale as never,
          fallbackLocale: false as never,
          trash,
          limit: LIMIT,
          depth: 0,
          select: { title: true },
          overrideAccess: true,
          req,
        })
        .catch((err: unknown) => checkFailed(req, err));
      total = Math.max(total, res.totalDocs);
      for (const d of res.docs as Ref[]) if (!found.has(String(d.id))) found.set(String(d.id), d);
    }
  }
  return { docs: [...found.values()], total: Math.max(total, found.size) };
}

async function countIn(req: PayloadRequest, collection: CollectionSlug, where: Where): Promise<number> {
  const res = await req.payload
    .count({ collection, where, overrideAccess: true, req })
    .catch((err: unknown) => checkFailed(req, err));
  return res.totalDocs;
}

function titles(refs: Ref[]): string {
  const list = refs.slice(0, LIMIT).map((r) => `"${(r.title || `#${r.id}`).slice(0, 80)}"`);
  return list.join(', ');
}

function inUse(what: string, refs: { docs: Ref[]; total: number }, extra: string[], fix: string): never {
  const parts: string[] = [];
  if (refs.total > 0) {
    parts.push(`${refs.total} bài viết (${titles(refs.docs)}${refs.total > refs.docs.length ? ', …' : ''})`);
  }
  parts.push(...extra);
  throw new APIError(`Không thể xoá: ${what} đang được dùng trong ${parts.join('; ')}. ${fix}`, 409, null, true);
}

/** Media (images): cover, SEO image, inline images, gallery images, video posters, avatars. */
export const preventMediaDeleteInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.context?.skipInUseCheck) return;
  const value = Number.isNaN(Number(id)) ? id : Number(id);
  const where: Where = {
    or: [
      { cover: { equals: value } },
      { 'meta.image': { equals: value } },
      { 'content.root.children.value': { equals: value } },
      { 'content.root.children.fields.images': { equals: value } },
      { 'content.root.children.fields.poster': { equals: value } },
    ],
  };
  // Sequential: the queries share the request's DB transaction, and pg refuses
  // (deprecation now, error in pg@9) concurrent queries on one client.
  const refs = await newsUsing(req, where);
  const avatars = await countIn(req, 'users', { avatar: { equals: value } });
  const posters = await countIn(req, 'videos', { poster: { equals: value } });
  const extra = [
    ...(avatars ? [`${avatars} ảnh đại diện tài khoản`] : []),
    ...(posters ? [`${posters} video (ảnh poster)`] : []),
  ];
  if (refs.total || extra.length) {
    inUse('ảnh này', refs, extra, 'Hãy thay ảnh khác trong các bài / mục trên rồi xoá lại.');
  }
};

/** Videos: video blocks that use the uploaded file. */
export const preventVideoDeleteInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.context?.skipInUseCheck) return;
  const value = Number.isNaN(Number(id)) ? id : Number(id);
  const refs = await newsUsing(req, { 'content.root.children.fields.file': { equals: value } });
  if (refs.total) inUse('video này', refs, [], 'Hãy gỡ khối Video khỏi các bài trên rồi xoá lại.');
};

/** Categories: required on every article (trash included - a restored article would be unsaveable). */
export const preventCategoryDeleteInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.context?.skipInUseCheck) return;
  const refs = await newsUsing(req, { category: { equals: id } }, { trash: true });
  if (refs.total) inUse('danh mục này', refs, [], 'Hãy chuyển các bài sang danh mục khác trước.');
};

/** Users: author / co-author of articles (the site shows the byline). */
export const preventUserDeleteInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.context?.skipInUseCheck) return;
  if (req.user && String(req.user.id) === String(id)) {
    throw new APIError('Bạn không thể tự xoá tài khoản đang đăng nhập.', 403, null, true);
  }
  const refs = await newsUsing(req, { or: [{ author: { equals: id } }, { coAuthors: { in: [id] } }] }, { trash: true });
  if (refs.total) {
    inUse('tài khoản này', refs, [], 'Hãy đổi "Tác giả" / "Đồng tác giả" của các bài sang người khác, hoặc chỉ đổi mật khẩu để khoá tài khoản.');
  }
};
