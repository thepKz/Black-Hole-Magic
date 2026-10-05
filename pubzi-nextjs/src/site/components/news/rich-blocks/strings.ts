import type { Locale } from '@site/i18n';

/**
 * UI strings of the article rich-text blocks (gallery, video, social embed,
 * callout, quote, CTA, related news). Kept next to the blocks so this feature
 * does not touch the shared dictionary.
 */
const strings = {
  vi: {
    photoCredit: 'Ảnh: {credit}',
    videoCredit: 'Video: {credit}',
    galleryLabel: 'Bộ ảnh ({count} ảnh)',
    galleryOpen: 'Xem ảnh {index} trên {count} cỡ lớn',
    galleryPrev: 'Ảnh trước',
    galleryNext: 'Ảnh tiếp theo',
    galleryClose: 'Đóng',
    galleryCounter: '{index} / {count}',
    playVideo: 'Phát video: {title}',
    videoFallbackTitle: 'Video',
    videoFrom: 'Video từ {provider}',
    embedNotice: 'Trình phát của {provider} chỉ tải khi bạn bấm phát.',
    socialPostOn: 'Bài đăng trên {provider}',
    socialLoad: 'Xem bài đăng tại đây',
    socialOpen: 'Mở trên {provider}',
    socialNotice: 'Nội dung từ {provider} chỉ tải khi bạn bấm xem.',
    calloutNote: 'Ghi chú',
    calloutImportant: 'Quan trọng',
    calloutWarning: 'Lưu ý',
    quoteSource: 'Nguồn',
    relatedDefault: 'Đọc thêm',
    opensNewTab: '(mở tab mới)',
  },
  en: {
    photoCredit: 'Photo: {credit}',
    videoCredit: 'Video: {credit}',
    galleryLabel: 'Gallery ({count} photos)',
    galleryOpen: 'View photo {index} of {count} full size',
    galleryPrev: 'Previous photo',
    galleryNext: 'Next photo',
    galleryClose: 'Close',
    galleryCounter: '{index} / {count}',
    playVideo: 'Play video: {title}',
    videoFallbackTitle: 'Video',
    videoFrom: 'Video from {provider}',
    embedNotice: 'The {provider} player only loads when you press play.',
    socialPostOn: 'Post on {provider}',
    socialLoad: 'Show the post here',
    socialOpen: 'Open on {provider}',
    socialNotice: 'Content from {provider} only loads when you choose to view it.',
    calloutNote: 'Note',
    calloutImportant: 'Important',
    calloutWarning: 'Heads up',
    quoteSource: 'Source',
    relatedDefault: 'Read more',
    opensNewTab: '(opens in a new tab)',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type RichBlockStrings = Record<keyof (typeof strings)['vi'], string>;

export function richBlockStrings(locale: Locale): RichBlockStrings {
  return strings[locale] ?? strings.vi;
}
