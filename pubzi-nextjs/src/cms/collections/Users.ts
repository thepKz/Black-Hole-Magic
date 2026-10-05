import type { CollectionConfig } from 'payload';

import { adminOnly, adminOnlyField, adminOrSelf, authenticated } from '../access';
import { revalidateCollection } from '../hooks/revalidate';
import { CACHE_TAGS } from '../lib/tags';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { vi: 'Người dùng', en: 'User' },
    plural: { vi: 'Người dùng', en: 'Users' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles', 'updatedAt'],
    listSearchableFields: ['name', 'email'],
    group: { vi: 'Hệ thống', en: 'System' },
    description: {
      vi: 'Tài khoản CMS. Chỉ Quản trị viên tạo tài khoản và đổi vai trò; không có đăng ký công khai.',
      en: 'CMS accounts. Only admins create accounts and change roles; there is no public sign-up.',
    },
  },
  // Article pages cache the populated author (name, avatar, bio) under the
  // 'news' tag: purge it when an author profile changes.
  hooks: revalidateCollection(CACHE_TAGS.news, CACHE_TAGS.users),
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: adminOnly,
    // Every CMS user can see the team (needed to pick author / co-authors);
    // only admins edit other accounts.
    read: authenticated,
    update: adminOrSelf,
    delete: adminOnly,
  },
  fields: [
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
