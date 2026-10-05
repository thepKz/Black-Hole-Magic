import type { CollectionConfig } from 'payload';

import { adminOnly, adminOnlyField, adminOrSelf } from '../access';
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
    defaultColumns: ['email', 'name', 'roles', 'updatedAt'],
    group: { vi: 'Hệ thống', en: 'System' },
  },
  // Article pages cache the populated author (name, avatar, bio) under the
  // 'news' tag: purge it when an author profile changes.
  hooks: revalidateCollection(CACHE_TAGS.news, CACHE_TAGS.users),
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: adminOnly,
    read: adminOrSelf,
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
      defaultValue: ['editor'],
      saveToJWT: true,
      label: { vi: 'Vai trò', en: 'Roles' },
      options: [
        { label: { vi: 'Quản trị', en: 'Admin' }, value: 'admin' },
        { label: { vi: 'Biên tập', en: 'Editor' }, value: 'editor' },
      ],
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
  ],
};
