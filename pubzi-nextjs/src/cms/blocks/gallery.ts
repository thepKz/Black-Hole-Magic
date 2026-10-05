import type { Block } from 'payload';

/**
 * Block `gallery`: several images from the media library (multi-select and
 * bulk upload in one drawer), shown as a grid or a slider.
 *
 * Renderer contract: `images` = populated media docs (depth >= 1). Show each
 * image's own caption/credit (media.caption, media.credit) when `showCaptions`.
 * `ratio` 'auto' keeps each image's natural ratio; otherwise crop to that ratio
 * (object-fit: cover + the media focal point).
 */
export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: { vi: 'Bộ ảnh', en: 'Gallery' },
    plural: { vi: 'Bộ ảnh', en: 'Galleries' },
  },
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 2,
      maxRows: 40,
      label: { vi: 'Ảnh', en: 'Images' },
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: {
          vi: 'Chọn hoặc kéo thả nhiều ảnh cùng lúc (2–40 ảnh). Kéo để đổi thứ tự.',
          en: 'Pick or drop several images at once (2-40). Drag to reorder.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'grid',
          label: { vi: 'Kiểu hiển thị', en: 'Layout' },
          options: [
            { label: { vi: 'Lưới ảnh', en: 'Grid' }, value: 'grid' },
            { label: { vi: 'Trình chiếu (lướt ngang)', en: 'Slider' }, value: 'slider' },
          ],
          admin: { width: '34%' },
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          label: { vi: 'Số cột', en: 'Columns' },
          options: [
            { label: { vi: '2 cột', en: '2 columns' }, value: '2' },
            { label: { vi: '3 cột', en: '3 columns' }, value: '3' },
            { label: { vi: '4 cột', en: '4 columns' }, value: '4' },
          ],
          admin: { width: '33%', condition: (_, siblingData) => siblingData?.layout !== 'slider' },
        },
        {
          name: 'ratio',
          type: 'select',
          defaultValue: 'auto',
          label: { vi: 'Tỉ lệ ảnh', en: 'Image ratio' },
          options: [
            { label: { vi: 'Giữ nguyên', en: 'Original' }, value: 'auto' },
            { label: '16:9', value: '16:9' },
            { label: '4:3', value: '4:3' },
            { label: { vi: '1:1 (vuông)', en: '1:1 (square)' }, value: '1:1' },
          ],
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'showCaptions',
      type: 'checkbox',
      defaultValue: true,
      label: { vi: 'Hiện chú thích từng ảnh (lấy từ Thư viện ảnh)', en: 'Show per-image captions (from the media library)' },
    },
    {
      name: 'caption',
      type: 'text',
      label: { vi: 'Chú thích chung', en: 'Gallery caption' },
    },
  ],
};
