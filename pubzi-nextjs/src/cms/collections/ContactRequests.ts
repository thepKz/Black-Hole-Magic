import type { Access, CollectionBeforeChangeHook, CollectionConfig, FieldAccess, Where } from 'payload';

import { canPublish, editorOrAdmin, isAdminUser, nobody } from '../access';

/** Submitted fields are read-only in /admin (the server action writes them with overrideAccess). */
const submitted: { update: FieldAccess } = { update: () => false };

/** Admins delete anything; editors may delete requests marked "Spam". */
const deleteContact: Access = ({ req }) => {
  if (isAdminUser(req)) return true;
  if (!canPublish(req.user as never)) return false;
  const where: Where = { status: { equals: 'spam' } };
  return where;
};

/**
 * "Người xử lý" + "Xử lý lúc": stamped whenever the status changes (by a CMS
 * user); cleared when it goes back to "Mới" so the list never shows a new
 * request with a handler.
 */
const stampHandling: CollectionBeforeChangeHook = ({ data, operation, originalDoc, req }) => {
  if (!data || operation !== 'update' || !req.user) return data;
  if (data.status && data.status !== originalDoc?.status) {
    const reopened = data.status === 'new';
    data.handledBy = reopened ? null : req.user.id;
    data.handledAt = reopened ? null : new Date().toISOString();
  }
  return data;
};

/**
 * Contact requests sent from the site's /[locale]/contact form ("Hộp thư").
 *
 * Write path: ONLY the contact server action (src/site/lib/contact/submit.ts)
 * through the Local API with `overrideAccess: true`, after honeypot, zod,
 * optional Turnstile and the per-IP rate limit. Public REST / GraphQL create
 * is closed (`create: nobody`), and guests cannot read anything.
 *
 * Editors + admins read the inbox and update status / internal note (authors
 * do not see it); admins delete, editors delete only requests marked "Spam".
 * Changing the status records who handled it and when. Email notification of
 * new requests needs an email adapter (see submit.ts / payload.config).
 *
 * Personal data (Decree 13/2023): we store the IP only as a salted SHA-256
 * hash (`ipHash`, used for rate limiting); delete requests once handled if
 * they are no longer needed.
 */
export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: {
    singular: { vi: 'Liên hệ', en: 'Contact request' },
    plural: { vi: 'Liên hệ', en: 'Contact requests' },
  },
  admin: {
    group: { vi: 'Hộp thư', en: 'Inbox' },
    useAsTitle: 'subject',
    // First column is the row link: the subject reads as the thing to click.
    defaultColumns: ['subject', 'status', 'name', 'email', 'type', 'handledBy', 'createdAt'],
    listSearchableFields: ['subject', 'name', 'email'],
    hideAPIURL: true,
    pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    enableListViewSelectAPI: true,
    components: {
      beforeListTable: ['/cms/admin/list/ContactQuickFilters#ContactQuickFilters'],
    },
    description: {
      vi: 'Yêu cầu gửi từ trang Liên hệ. Nội dung khách gửi chỉ đọc. Mở yêu cầu, bấm "Trả lời qua email", rồi đổi Trạng thái (hệ thống tự ghi người xử lý và thời gian). Tin rác: chọn "Spam" rồi xoá.',
      en: 'Requests sent from the Contact page. Submitted content is read-only. Open a request, click "Reply by email", then update the Status (handler and time are recorded). Junk: set "Spam", then delete.',
    },
  },
  defaultSort: '-createdAt',
  // Rate-limit count: recent requests per hashed IP (src/site/lib/contact/rate-limit.ts).
  indexes: [{ fields: ['ipHash', 'createdAt'] }],
  access: {
    // Public REST / GraphQL create is closed; the server action uses the Local API.
    create: nobody,
    read: editorOrAdmin,
    update: editorOrAdmin,
    delete: deleteContact,
  },
  hooks: { beforeChange: [stampHandling] },
  fields: [
    {
      // mailto: button with "Re: <subject>" + quoted message.
      name: 'replyAction',
      type: 'ui',
      admin: { components: { Field: '/cms/admin/fields/ContactReply#ContactReply' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 100,
          access: submitted,
          label: { vi: 'Họ và tên', en: 'Full name' },
          admin: { width: '50%' },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          access: submitted,
          label: { vi: 'Email', en: 'Email' },
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      access: submitted,
      label: { vi: 'Loại yêu cầu', en: 'Request type' },
      options: [
        { label: { vi: 'Hợp tác phát hành', en: 'Publishing partnership' }, value: 'biz' },
        { label: { vi: 'Hỗ trợ người chơi', en: 'Player support' }, value: 'support' },
        { label: { vi: 'Báo chí', en: 'Press' }, value: 'press' },
        { label: { vi: 'Khác', en: 'Other' }, value: 'other' },
      ],
      admin: {
        components: {
          Cell: {
            path: '/cms/admin/cells/BadgeCell#BadgeCell',
            clientProps: { tones: { biz: 'accent', support: 'info', press: 'warn', other: 'neutral' } },
          },
        },
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      maxLength: 150,
      access: submitted,
      label: { vi: 'Tiêu đề', en: 'Subject' },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 5000,
      access: submitted,
      label: { vi: 'Nội dung', en: 'Message' },
      admin: { rows: 10 },
    },
    // Sidebar: workflow
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      label: { vi: 'Trạng thái', en: 'Status' },
      options: [
        { label: { vi: 'Mới', en: 'New' }, value: 'new' },
        { label: { vi: 'Đang xử lý', en: 'Processing' }, value: 'processing' },
        { label: { vi: 'Đã xong', en: 'Done' }, value: 'done' },
        { label: { vi: 'Spam / rác', en: 'Spam' }, value: 'spam' },
      ],
      admin: {
        position: 'sidebar',
        components: {
          Cell: {
            path: '/cms/admin/cells/BadgeCell#BadgeCell',
            clientProps: { tones: { new: 'danger', processing: 'warn', done: 'success', spam: 'neutral' } },
          },
        },
      },
    },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'handledBy',
          type: 'relationship',
          relationTo: 'users',
          label: { vi: 'Người xử lý', en: 'Handled by' },
          admin: { readOnly: true, allowCreate: false, placeholder: 'Chưa có', width: '50%' },
        },
        {
          name: 'handledAt',
          type: 'date',
          label: { vi: 'Xử lý lúc', en: 'Handled at' },
          admin: {
            readOnly: true,
            width: '50%',
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
          },
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      maxLength: 5000,
      label: { vi: 'Ghi chú nội bộ', en: 'Internal note' },
      admin: {
        position: 'sidebar',
        rows: 6,
        description: { vi: 'Chỉ người dùng CMS thấy.', en: 'Visible to CMS users only.' },
      },
    },
    // Sidebar: technical metadata (read-only)
    {
      name: 'locale',
      type: 'select',
      access: submitted,
      label: { vi: 'Ngôn ngữ trang', en: 'Page language' },
      options: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'English', value: 'en' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'ipHash',
      type: 'text',
      index: true,
      access: submitted,
      label: { vi: 'IP (đã băm)', en: 'IP (hashed)' },
      admin: {
        position: 'sidebar',
        description: {
          vi: 'SHA-256 có salt, dùng để giới hạn tần suất gửi. Không lưu IP gốc.',
          en: 'Salted SHA-256, used for rate limiting. The raw IP is never stored.',
        },
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      maxLength: 512,
      access: submitted,
      label: { vi: 'Trình duyệt', en: 'User agent' },
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
};
