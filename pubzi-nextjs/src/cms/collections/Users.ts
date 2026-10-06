import type { CollectionBeforeOperationHook, CollectionConfig } from 'payload';
import { APIError } from 'payload';

import { adminOnly, adminOnlyField, adminOrSelf, adminOrSelfField, authenticated, canPublish } from '../access';
import { preventUserDeleteInUse } from '../hooks/preventDeleteInUse';
import { revalidateCollection } from '../hooks/revalidate';
import { hitAuthLimit, passwordProblem, resetAuthLimit } from '../lib/authGuard';
import { siteOrigin } from '../lib/preview';
import { CACHE_TAGS } from '../lib/tags';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

/**
 * Account security, all server-side (REST, GraphQL and the admin UI):
 * - First-user bootstrap: /admin/create-first-user + POST /api/users/first-register
 *   are closed unless ALLOW_FIRST_REGISTER=true (create the first admin from a
 *   trusted machine via the Local API instead: `npm run bootstrap:admin`).
 *   Otherwise anyone reaching an empty production DB first would become admin.
 * - Per-IP limit on login (10 / 15 min) and forgot-password (5 / h), on top of
 *   Payload's per-account lock (5 wrong passwords -> locked 5 min).
 * - Password policy: >= 12 characters, not a common password, not the email name.
 * - "Quên mật khẩu" fails with a clear message while no email adapter is
 *   configured (Payload would otherwise report success and only log the mail).
 */
const guardAuthOperations: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  const external = req.payloadAPI !== 'local';

  if (operation === 'login') hitAuthLimit('login', req);

  if (operation === 'forgotPassword' && external) {
    hitAuthLimit('forgotPassword', req);
    if ((req.payload.email as { name?: string } | undefined)?.name === 'console') {
      throw new APIError(
        'Hệ thống chưa cấu hình gửi email nên không thể tự đặt lại mật khẩu. Vui lòng liên hệ Quản trị viên để được cấp lại mật khẩu.',
        503,
        null,
        true,
      );
    }
  }

  if (operation === 'create' && external && !req.user && process.env.ALLOW_FIRST_REGISTER !== 'true') {
    throw new APIError(
      'Không thể tự tạo tài khoản. Quản trị viên tạo tài khoản trong mục "Người dùng" (tài khoản quản trị đầu tiên được tạo bằng lệnh trên máy chủ).',
      403,
      null,
      true,
    );
  }

  if ((operation === 'create' || operation === 'update' || operation === 'resetPassword') && external) {
    const data = (args as { data?: { password?: unknown; email?: unknown } }).data;
    if (data && typeof data.password === 'string' && data.password) {
      const email = typeof data.email === 'string' ? data.email : (req.user as { email?: string } | null)?.email;
      const problem = passwordProblem(data.password, email);
      if (problem) throw new APIError(problem, 400, null, true);
    }
  }
  return args;
};

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { vi: 'Người dùng', en: 'User' },
    plural: { vi: 'Người dùng', en: 'Users' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    // Short lock: limits password guessing without locking a real editor out
    // for long when someone else hammers their account (admins can unlock).
    lockTime: 5 * 60 * 1000,
    cookies: {
      // HTTPS-only cookie in production (no leak over a first http:// hit).
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
    forgotPassword: {
      expiration: 60 * 60 * 1000,
      generateEmailSubject: () => 'Đặt lại mật khẩu trang quản trị Black Hole',
      // Link built from NEXT_PUBLIC_SITE_URL, never from the request Host header
      // (a forged Host would otherwise send the reset token to another domain).
      generateEmailHTML: (args) => {
        const token = args?.token ?? '';
        const user = args?.user as { name?: string | null } | undefined;
        const url = `${siteOrigin()}/admin/reset/${encodeURIComponent(token)}`;
        const name = user?.name ? escapeHtml(user.name) : 'bạn';
        return `<p>Xin chào ${name},</p>
<p>Có người (có thể là bạn) vừa yêu cầu đặt lại mật khẩu trang quản trị Black Hole. Bấm vào liên kết dưới đây trong vòng 1 giờ để đặt mật khẩu mới:</p>
<p><a href="${url}">${url}</a></p>
<p>Nếu bạn không yêu cầu, hãy bỏ qua email này, mật khẩu cũ vẫn dùng được.</p>`;
      },
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles', 'updatedAt'],
    // Name only: email is readable by admins / the owner only (field access), and
    // Payload rejects the whole search for editors when a non-readable path is in it.
    listSearchableFields: ['name'],
    group: { vi: 'Hệ thống', en: 'System' },
    // Authors / contributors do not need the staff directory in the nav; their
    // own profile + password stay under "Tài khoản" (avatar menu).
    hidden: ({ user }) => !canPublish(user as never),
    description: {
      vi: 'Tài khoản CMS. Chỉ Quản trị viên tạo tài khoản và đổi vai trò; không có đăng ký công khai. Quên mật khẩu: Quản trị viên mở tài khoản, bấm "Đổi mật khẩu" để đặt mật khẩu tạm; tài khoản bị khoá do nhập sai nhiều lần tự mở sau 5 phút.',
      en: 'CMS accounts. Only admins create accounts and change roles; there is no public sign-up. Forgotten password: an admin opens the account and sets a temporary password; accounts locked after failed logins unlock after 5 minutes.',
    },
  },
  hooks: {
    // Article pages cache the populated author (name, avatar, bio) under the
    // 'news' tag: purge it when an author profile changes.
    ...revalidateCollection(CACHE_TAGS.news, CACHE_TAGS.users),
    beforeOperation: [guardAuthOperations],
    beforeDelete: [preventUserDeleteInUse],
    afterLogin: [
      ({ req, user }) => {
        resetAuthLimit('login', req);
        return user;
      },
    ],
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: adminOnly,
    // Every CMS user can see the team (needed to pick author / co-authors);
    // emails are visible only to admins and the account owner (field access).
    read: authenticated,
    update: adminOrSelf,
    delete: adminOnly,
  },
  fields: [
    {
      // Base auth field, re-declared only to restrict who can READ it.
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: { vi: 'Email', en: 'Email' },
      access: { read: adminOrSelfField },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { vi: 'Tên hiển thị (tác giả)', en: 'Display name (author)' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: { vi: 'Ảnh đại diện', en: 'Avatar' },
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      maxLength: 300,
      label: { vi: 'Giới thiệu ngắn', en: 'Short bio' },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['author'],
      saveToJWT: true,
      label: { vi: 'Vai trò', en: 'Roles' },
      options: [
        { label: { vi: 'Quản trị viên', en: 'Admin' }, value: 'admin' },
        { label: { vi: 'Biên tập viên', en: 'Editor' }, value: 'editor' },
        { label: { vi: 'Phóng viên / Cộng tác viên', en: 'Author / Contributor' }, value: 'author' },
      ],
      admin: {
        description: {
          vi: 'Phóng viên: viết và sửa bài của mình, gửi duyệt. Biên tập viên: duyệt, đăng, hẹn giờ, gỡ mọi bài và xử lý liên hệ. Quản trị viên: toàn quyền, kể cả tài khoản và danh mục.',
          en: 'Author: writes own articles and submits them. Editor: reviews, publishes, schedules any article and handles contact requests. Admin: everything incl. accounts and categories.',
        },
        components: {
          Cell: {
            path: '/cms/admin/cells/BadgeCell#BadgeCell',
            clientProps: { tones: { admin: 'accent', editor: 'info', author: 'neutral' } },
          },
        },
      },
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
  ],
};
