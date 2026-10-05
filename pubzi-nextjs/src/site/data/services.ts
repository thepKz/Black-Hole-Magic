/**
 * Publishing services - home page 2x2 grid (MOCK - copy from the v2 design).
 * `icon` maps to @phosphor-icons/react in the ServiceCard component:
 * scales -> Scales, credit-card -> CreditCard, translate -> Translate, users-three -> UsersThree.
 */
import type { Localized, Service } from '../lib/types';

export const servicesTitle: Localized = { vi: 'Dịch vụ phát hành', en: 'Publishing services' };

export const services: Service[] = [
  {
    id: 'licensing',
    icon: 'scales',
    title: { vi: 'Thủ tục pháp lý nhanh chóng', en: 'Fast licensing' },
    description: {
      vi: 'Hỗ trợ trọn gói hồ sơ cấp phép phát hành game tại Việt Nam với thời gian xử lý tối ưu.',
      en: 'End-to-end support for game publishing licenses in Vietnam with optimized processing time.',
    },
  },
  {
    id: 'payments',
    icon: 'credit-card',
    title: { vi: 'Cổng thanh toán nội địa', en: 'Local payment gateway' },
    description: {
      vi: 'Tích hợp đầy đủ các phương thức thanh toán phổ biến: ví điện tử, thẻ ngân hàng, thẻ cào.',
      en: 'Full integration of popular payment methods: e-wallets, bank cards and prepaid cards.',
    },
  },
  {
    id: 'localization',
    icon: 'translate',
    title: { vi: 'Bản địa hoá & tiếp thị', en: 'Localization & marketing' },
    description: {
      vi: 'Đội ngũ am hiểu ngôn ngữ, văn hoá và thị trường, triển khai truyền thông đa kênh.',
      en: 'A team fluent in local language, culture and market, running multi-channel campaigns.',
    },
  },
  {
    id: 'ecosystem',
    icon: 'users-three',
    title: { vi: 'Hệ sinh thái phát hành', en: 'Publishing ecosystem' },
    description: {
      vi: 'Kết nối cộng đồng game thủ, vận hành sự kiện và chăm sóc khách hàng xuyên suốt vòng đời game.',
      en: 'Community building, live events and customer care across the whole game lifecycle.',
    },
  },
];
