import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Field } from 'payload';

import { authenticatedField } from '../access';
import { revalidateTags } from '../hooks/revalidate';

/**
 * `createdBy` for the upload libraries (media, videos): stamped once on create
 * from the signed-in user, never editable. Drives `ownUploadOrEditor`
 * (authors may only edit / replace their own files). Files that existed before
 * this field (createdBy empty) are editable by editors/admins only.
 */
export const createdByField: Field = {
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  index: true,
  label: { vi: 'Người tải lên', en: 'Uploaded by' },
  access: { read: authenticatedField, update: () => false },
  hooks: {
    beforeChange: [
      ({ operation, req, value }) => (operation === 'create' ? (req.user?.id ?? value ?? null) : value),
    ],
    beforeDuplicate: [({ req }) => req.user?.id ?? null],
  },
  admin: {
    position: 'sidebar',
    readOnly: true,
    allowCreate: false,
    placeholder: 'Không rõ',
  },
};

/**
 * Cache purge for upload libraries. A NEW file is referenced by nothing yet, so
 * creating one purges nothing (a 20-image press-kit upload used to purge every
 * news page 20 times). Updates (alt, caption, crop, file replace) and deletes
 * purge the given tags.
 */
export const revalidateUploadUsage = (
  ...tags: string[]
): { afterChange: CollectionAfterChangeHook[]; afterDelete: CollectionAfterDeleteHook[] } => ({
  afterChange: [
    async ({ doc, operation, req }) => {
      if (operation === 'update') await revalidateTags(tags, req);
      return doc;
    },
  ],
  afterDelete: [
    async ({ doc, req }) => {
      await revalidateTags(tags, req);
      return doc;
    },
  ],
});
