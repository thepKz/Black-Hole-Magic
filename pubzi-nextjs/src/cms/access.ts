import type { Access, FieldAccess, PayloadRequest, Where } from 'payload';

/**
 * Newsroom roles (users.roles, saved to the JWT):
 * - admin  (Quản trị viên): everything, incl. users, categories, hard delete.
 * - editor (Biên tập viên): edit / approve / publish / schedule / unpublish any
 *   article, handle contact requests.
 * - author (Phóng viên / Cộng tác viên): create articles and edit their OWN
 *   drafts, submit them for review ("Chờ duyệt"); can never publish, schedule,
 *   unpublish or edit someone else's article. Can move their own unpublished
 *   drafts to the trash.
 *
 * Enforced server-side by the access functions below (the admin UI derives the
 * Publish / Schedule / Delete buttons from them) plus the `guardNewsroomRules`
 * hook in src/cms/hooks/newsWorkflow.ts.
 */
export type Role = 'admin' | 'editor' | 'author';

type MaybeUser = { id?: number | string; roles?: Role[] | null } | null | undefined;

export const hasRole = (user: MaybeUser, role: Role): boolean => Boolean(user?.roles?.includes(role));

export const isAdminUser = (req: PayloadRequest): boolean => hasRole(req.user as MaybeUser, 'admin');

/** Admin or editor: may publish / approve / manage the inbox. */
export const canPublish = (user: MaybeUser): boolean => hasRole(user, 'admin') || hasRole(user, 'editor');

/** Logged in, but only an author (no editor/admin role). */
export const isAuthorOnly = (user: MaybeUser): boolean => Boolean(user) && !canPublish(user);

/** Any logged-in CMS user. */
export const authenticated: Access = ({ req }) => Boolean(req.user);

export const adminOnly: Access = ({ req }) => isAdminUser(req);

export const adminOnlyField: FieldAccess = ({ req }) => isAdminUser(req);

/** Admin or editor. */
export const editorOrAdmin: Access = ({ req }) => canPublish(req.user as MaybeUser);

export const editorOrAdminField: FieldAccess = ({ req }) => canPublish(req.user as MaybeUser);

export const anyone: Access = () => true;

export const nobody: Access = () => false;

/**
 * Public read for draft-enabled collections: guests only see published docs,
 * CMS users see everything. This is what makes the REST API a safe public API.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  const where: Where = { _status: { equals: 'published' } };
  return where;
};

/** Admin can do anything; others can only read/update themselves. */
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req)) return true;
  const where: Where = { id: { equals: req.user.id } };
  return where;
};

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

const ownArticle = (user: NonNullable<MaybeUser>): Where => ({ author: { equals: user.id } });

/**
 * Update = save draft / publish / unpublish. Payload asks this function with
 * `data._status = 'published'` to decide whether to show Publish + Schedule
 * (see @payloadcms/next getDocumentPermissions), so returning false there hides
 * them for authors and rejects a forged REST publish.
 */
export const newsUpdate: Access = ({ req, data }) => {
  const user = req.user as MaybeUser;
  if (!user) return false;
  if (canPublish(user)) return true;
  if ((data as { _status?: string } | undefined)?._status === 'published') return false;
  return ownArticle(user);
};

/**
 * Delete. Payload asks with `data.deletedAt` set for "move to trash" and
 * without it for permanent deletion. Authors may only trash their own
 * never-published drafts; only editors/admins delete permanently.
 */
export const newsDelete: Access = ({ req, data }) => {
  const user = req.user as MaybeUser;
  if (!user) return false;
  if (canPublish(user)) return true;
  if (!(data as { deletedAt?: unknown } | undefined)?.deletedAt) return false;
  return { and: [ownArticle(user), { _status: { not_equals: 'published' } }] };
};
