/**
 * Company / site information (MOCK - typed). Source: legacy footer
 * (src/components/home-7/Footer7.tsx). Replace values here when the company
 * provides the final data; no component should hard-code any of it.
 */
import type { Localized, SiteInfo } from '../lib/types';

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : '#');

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const site: SiteInfo = {
  name: 'Black Hole Game',
  title: {
    vi: 'Black Hole Game — Nhà phát hành game tại Việt Nam',
    en: 'Black Hole Game — Game publisher in Vietnam',
  },
  description: {
    vi: 'Black Hole Game phát hành và vận hành các tựa game nhập vai, kiếm hiệp tại Việt Nam: pháp lý nhanh, thanh toán nội địa, bản địa hoá và vận hành cộng đồng.',
    en: 'Black Hole Game publishes and operates RPG and martial-arts games in Vietnam: fast licensing, local payments, localization and community operations.',
  },
  url: siteUrl,
  logo: {
    mark: { src: '/site/brand/logo-mark@2x.webp', width: 197, height: 128, alt: 'Black Hole Game' },
    markWhite: { src: '/site/brand/logo-mark-white@2x.webp', width: 197, height: 128, alt: 'Black Hole Game' },
    square: { src: '/site/brand/logo-512.png', width: 512, height: 512, alt: 'Black Hole Game' },
  },
  ogImage: { src: '/site/og-default.jpg', width: 1200, height: 630, alt: 'Black Hole Game' },
  company: {
    legalName: {
      vi: 'Công ty Cổ phần Giải pháp Công nghệ Black Hole',
      en: 'Black Hole Technology Solutions Joint Stock Company',
    },
    shortName: 'Black Hole',
    address: {
      vi: 'Số 777 Nguyễn Thiện Thuật, Mỹ Hào, Hưng Yên, Việt Nam',
      en: '777 Nguyen Thien Thuat, My Hao, Hung Yen, Vietnam',
    },
    postal: {
      street: '777 Nguyễn Thiện Thuật',
      locality: 'Mỹ Hào',
      region: 'Hưng Yên',
      country: 'VN',
    },
    mapQuery: '777 Nguyễn Thiện Thuật, Mỹ Hào, Hưng Yên',
    taxId: '0901214374',
    phone: '0779 467 868',
    phoneE164: '+84779467868',
  },
  emails: {
    biz: 'contact@blackholegame.com',
    support: 'contact@blackholegame.com',
    press: 'contact@blackholegame.com',
    other: 'contact@blackholegame.com',
  },
  legalLines: {
    vi: [
      'Giấy chứng nhận ĐKKD số 0901214374, cấp ngày 20/10/2025.',
      'Giấy phép cung cấp dịch vụ trò chơi điện tử G1 trên mạng số 105/GP-PTTH&TTĐT, cấp ngày 02/06/2026 do Cục PTTH & TTĐT - Bộ VHTTDL cấp.',
    ],
    en: [
      'Business Registration Certificate No. 0901214374, issued on 20/10/2025.',
      'G1 online game service license No. 105/GP-PTTH&TTĐT, issued on 02/06/2026 by the Authority of Broadcasting and Electronic Information (MCST).',
    ],
  },
  // TODO(company): full name of the person responsible for the content
  // ("Người chịu trách nhiệm nội dung"). The footer line stays hidden while empty.
  contentOwner: '',
  healthWarning: {
    vi: 'Chơi game quá 180 phút mỗi ngày sẽ ảnh hưởng xấu đến sức khỏe.',
    en: 'Playing games for more than 180 minutes a day can harm your health.',
  },
  // TODO(company): real social URLs. '#' = placeholder; exclude '#' from JSON-LD sameAs.
  socials: [
    { platform: 'facebook', label: 'Facebook', url: '#' },
    { platform: 'youtube', label: 'YouTube', url: '#' },
    { platform: 'tiktok', label: 'TikTok', url: '#' },
  ],
  id: {
    loginUrl: env(process.env.NEXT_PUBLIC_ID_LOGIN_URL),
    topupUrl: env(process.env.NEXT_PUBLIC_ID_TOPUP_URL),
  },
  foundingYear: 2025,
};

/** Contact type options for the contact form (value + label). */
export const contactTypes: { value: keyof SiteInfo['emails']; label: Localized }[] = [
  { value: 'biz', label: { vi: 'Hợp tác phát hành', en: 'Publishing partnership' } },
  { value: 'support', label: { vi: 'Hỗ trợ người chơi', en: 'Player support' } },
  { value: 'press', label: { vi: 'Báo chí', en: 'Press' } },
  { value: 'other', label: { vi: 'Khác', en: 'Other' } },
];

/** Main navigation (paths are locale-less; build with `href(locale, path)`). */
export const mainNav: { key: 'home' | 'games' | 'news' | 'contact'; path: string }[] = [
  { key: 'home', path: '/' },
  { key: 'games', path: '/games' },
  { key: 'news', path: '/news' },
  { key: 'contact', path: '/contact' },
];

/** True when a link is a real target (not the '#' placeholder). */
export const isRealUrl = (url: string | null | undefined): url is string =>
  Boolean(url && url !== '#');
