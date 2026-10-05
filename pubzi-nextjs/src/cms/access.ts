import type { Access, FieldAccess, PayloadRequest, Where } from 'payload';

export type Role = 'admin' | 'editor';

type MaybeUser = { roles?: Role[] | null } | null | undefined;

export const hasRole = (user: MaybeUser, role: Role): boolean =>
  Boolean(user?.roles?.includes(role));

export const isAdminUser = (req: PayloadRequest): boolean => hasRole(req.user as MaybeUser, 'admin');

/** Any logged-in CMS user (admin or editor). */
export const authenticated: Access = ({ req }) => Boolean(req.user);

export const adminOnly: Access = ({ req }) => isAdminUser(req);

export const adminOnlyField: FieldAccess = ({ req }) => isAdminUser(req);

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

/** Admin can do anything; an editor can only read/update themselves. */
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req)) return true;
  const where: Where = { id: { equals: req.user.id } };
  return where;
};
