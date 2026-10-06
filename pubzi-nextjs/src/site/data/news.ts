/**
 * News FIXTURES (demo only) for the `mock` content source
 * (src/site/lib/content/mock/news-source.ts).
 *
 * Shown only when CONTENT_MOCK_FIXTURES=true, or CONTENT_SOURCE=mock outside
 * production - never by default, so fake news is never indexed. Titles start
 * with "[Demo]" on purpose. Bodies are HTML (the format an external CMS sends)
 * and go through the same sanitizer as the http source.
 */
import type { Localized } from '../lib/types';

export interface NewsFixture {
  id: string;
  slug: string;
  /** Missing `en` = not translated (VI fallback, noindex on /en). */
  title: Partial<Localized> & { vi: string };
  excerpt: Partial<Localized> & { vi: string };
  html: Partial<Localized> & { vi: string };
  category: 'game' | 'event' | 'notice';
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  cover: { src: string; width: number; height: number; alt: string };
  author?: string;
  tags?: string[];
  related?: string[];
}

export const newsFixtureCategories: { slug: NewsFixture['category']; name: Localized; order: number }[] = [
  { slug: 'game', name: { vi: 'Tin game', en: 'Game news' }, order: 1 },
  { slug: 'event', name: { vi: 'Sự kiện', en: 'Events' }, order: 2 },
  { slug: 'notice', name: { vi: 'Thông báo', en: 'Notices' }, order: 3 },
];

const wide = (slug: string, alt: string) => ({ src: `/site/games/${slug}-wide.webp`, width: 1400, height: 788, alt });

export const newsFixtures: NewsFixture[] = [
  {
    id: 'demo-1',
    slug: 'demo-kiem-the-big-update',
    title: { vi: '[Demo] Kiếm Thế ra mắt bản cập nhật lớn', en: '[Demo] Kiem The launches a major update' },
    excerpt: {
      vi: 'Bài mẫu cho chế độ không có CMS: môn phái mới, bản đồ mới và chuỗi sự kiện mừng phiên bản.',
      en: 'Sample article for the no-CMS mode: a new sect, new maps and a launch event series.',
    },
    html: {
      vi: '<p>Nội dung mẫu, dùng để kiểm thử giao diện khi chưa nối CMS.</p><h2>Môn phái mới</h2><p>Mô tả môn phái.</p><h2>Bản đồ mới</h2><p>Mô tả bản đồ.</p><h3>Phần thưởng</h3><ul><li>Vật phẩm A</li><li>Vật phẩm B</li></ul><h2>Lịch sự kiện</h2><table><thead><tr><th>Ngày</th><th>Sự kiện</th></tr></thead><tbody><tr><td>01/11</td><td>Mở máy chủ</td></tr></tbody></table>',
      en: '<p>Sample content used to test the UI before a CMS is connected.</p><h2>New sect</h2><p>Sect description.</p><h2>New maps</h2><p>Map description.</p><h2>Event schedule</h2><p>Schedule.</p>',
    },
    category: 'game',
    publishedAt: '2026-10-01T03:00:00.000Z',
    featured: true,
    cover: wide('kiem-the', 'Kiếm Thế'),
    author: 'Black Hole Game',
    tags: ['Kiếm Thế', 'cập nhật'],
    related: ['demo-trung-thu-event'],
  },
  {
    id: 'demo-2',
    slug: 'demo-trung-thu-event',
    title: { vi: '[Demo] Sự kiện Trung Thu trong game', en: '[Demo] Mid-Autumn in-game event' },
    excerpt: { vi: 'Bài mẫu: sự kiện theo mùa.', en: 'Sample: a seasonal event.' },
    html: {
      vi: '<p>Sự kiện mẫu. <a href="https://example.com" target="_blank">Liên kết ngoài</a>.</p><blockquote><p>Trích dẫn mẫu.</p></blockquote>',
      en: '<p>Sample event.</p>',
    },
    category: 'event',
    publishedAt: '2026-09-20T03:00:00.000Z',
    cover: wide('thien-long-bat-bo', 'Thiên Long Bát Bộ'),
    author: 'Black Hole Game',
  },
  {
    id: 'demo-3',
    slug: 'demo-server-maintenance',
    title: { vi: '[Demo] Thông báo bảo trì máy chủ' },
    excerpt: { vi: 'Bài mẫu chỉ có tiếng Việt (trang /en hiển thị bản VI và noindex).' },
    html: { vi: '<p>Thời gian bảo trì dự kiến 2 giờ.</p>' },
    category: 'notice',
    publishedAt: '2026-09-10T01:00:00.000Z',
    cover: wide('vo-lam-truyen-ky-2', 'Võ Lâm Truyền Kỳ 2'),
  },
  {
    id: 'demo-4',
    slug: 'demo-con-duong-to-lua-teaser',
    title: { vi: '[Demo] Con Đường Tơ Lụa hé lộ teaser', en: '[Demo] Con Duong To Lua teaser revealed' },
    excerpt: { vi: 'Bài mẫu có video nhúng.', en: 'Sample with an embedded video.' },
    html: {
      vi: '<p>Video mẫu:</p><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Teaser" width="560" height="315"></iframe>',
      en: '<p>Sample video above.</p>',
    },
    category: 'game',
    publishedAt: '2026-08-28T03:00:00.000Z',
    cover: wide('con-duong-to-lua', 'Con Đường Tơ Lụa'),
  },
];
