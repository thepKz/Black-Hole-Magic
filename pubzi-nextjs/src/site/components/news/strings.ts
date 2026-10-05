import type { Locale } from '@site/i18n';

/**
 * News-only UI strings that are not (yet) in the shared dictionary
 * (src/site/i18n/{vi,en}.ts). Kept here so the news feature does not edit the
 * shared dictionary while other agents work on it in parallel.
 * TODO: move these keys into the shared dictionary.
 */
const strings = {
  vi: {
    categories: 'Danh mục tin',
    prevPost: 'Bài trước',
    nextPost: 'Bài tiếp theo',
    morePosts: 'Bài viết khác',
    playVideo: 'Phát video: {title}',
    videoFallbackTitle: 'Video',
    copyFailed: 'Không sao chép được, hãy sao chép thủ công.',
    shareNative: 'Chia sẻ…',
    latestPosts: 'Mới cập nhật',
    pageSuffix: 'Trang {page}',
    code: 'Mã',
    table: 'Bảng dữ liệu (cuộn ngang)',
    rssTitle: 'Tin tức Black Hole Game',
    ogTagline: 'Tin tức & Sự kiện',
  },
  en: {
    categories: 'News categories',
    prevPost: 'Previous article',
    nextPost: 'Next article',
    morePosts: 'More articles',
    playVideo: 'Play video: {title}',
    videoFallbackTitle: 'Video',
    copyFailed: 'Could not copy, please copy the link manually.',
    shareNative: 'Share…',
    latestPosts: 'Latest',
    pageSuffix: 'Page {page}',
    code: 'Code',
    table: 'Data table (scrolls horizontally)',
    rssTitle: 'Black Hole Game News',
    ogTagline: 'News & Events',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type NewsStrings = Record<keyof (typeof strings)['vi'], string>;

export function newsStrings(locale: Locale): NewsStrings {
  return strings[locale] ?? strings.vi;
}
