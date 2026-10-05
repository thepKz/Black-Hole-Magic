/**
 * Terms of use + privacy policy (MOCK static content, VI/EN).
 * TODO(company/legal): have the legal team review and replace this text
 * (account / top-up clauses were reworded: no site login; top-up = pay.blackholegame.vn).
 * Body paragraphs starting with "- " are list items (consecutive ones form one list).
 */
import type { LegalPage } from '../lib/types';

export const terms: LegalPage = {
  slug: 'terms',
  title: { vi: 'Điều khoản sử dụng', en: 'Terms of use' },
  description: {
    vi: 'Điều khoản sử dụng website và dịch vụ của Black Hole Game.',
    en: 'Terms of use for the Black Hole Game website and services.',
  },
  updatedAt: '2026-10-05',
  sections: {
    vi: [
      {
        id: 'pham-vi',
        heading: '1. Phạm vi áp dụng',
        body: [
          'Điều khoản này điều chỉnh việc bạn truy cập và sử dụng website blackholegame.com, các trang con và dịch vụ do Công ty Cổ phần Giải pháp Công nghệ Black Hole ("Black Hole", "chúng tôi") cung cấp.',
          'Mỗi trò chơi có thể có điều khoản riêng. Khi có khác biệt, điều khoản riêng của trò chơi được ưu tiên áp dụng.',
        ],
      },
      {
        id: 'tai-khoan',
        heading: '2. Tài khoản',
        body: [
          'Website này không yêu cầu đăng nhập hay đăng ký. Tài khoản chơi game được tạo và quản lý trong hệ thống tài khoản riêng của từng trò chơi; việc nạp được thực hiện qua cổng nạp chính thức pay.blackholegame.vn. Bạn chịu trách nhiệm bảo mật thông tin tài khoản game và mọi hoạt động phát sinh từ tài khoản của mình.',
          '- Chỉ nạp qua cổng chính thức pay.blackholegame.vn; Black Hole không chịu trách nhiệm với giao dịch qua kênh không chính thức.',
          '- Cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản game.',
          '- Không chia sẻ, mua bán hoặc chuyển nhượng tài khoản.',
          '- Thông báo ngay cho chúng tôi khi phát hiện truy cập trái phép.',
        ],
      },
      {
        id: 'hanh-vi',
        heading: '3. Hành vi bị nghiêm cấm',
        body: [
          '- Sử dụng phần mềm thứ ba, công cụ gian lận hoặc khai thác lỗi để trục lợi.',
          '- Phát tán nội dung vi phạm pháp luật, thuần phong mỹ tục hoặc xâm phạm quyền của người khác.',
          '- Can thiệp, gây quá tải hoặc làm gián đoạn hệ thống.',
          'Black Hole có quyền tạm khoá hoặc chấm dứt tài khoản vi phạm theo quy định.',
        ],
      },
      {
        id: 'so-huu-tri-tue',
        heading: '4. Sở hữu trí tuệ',
        body: [
          'Toàn bộ nội dung trên website (logo, hình ảnh, văn bản, video) thuộc quyền sở hữu của Black Hole hoặc đối tác cấp phép. Nghiêm cấm sao chép, sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.',
        ],
      },
      {
        id: 'suc-khoe',
        heading: '5. Quản lý thời gian chơi',
        body: [
          'Chơi game quá 180 phút mỗi ngày sẽ ảnh hưởng xấu đến sức khỏe. Người chơi dưới 18 tuổi cần có sự đồng ý và giám sát của cha mẹ hoặc người giám hộ.',
        ],
      },
      {
        id: 'trach-nhiem',
        heading: '6. Giới hạn trách nhiệm',
        body: [
          'Chúng tôi nỗ lực đảm bảo dịch vụ hoạt động liên tục nhưng không cam kết dịch vụ không bao giờ gián đoạn. Black Hole không chịu trách nhiệm đối với thiệt hại phát sinh do lỗi từ phía người dùng hoặc sự kiện bất khả kháng.',
        ],
      },
      {
        id: 'thay-doi',
        heading: '7. Thay đổi điều khoản',
        body: [
          'Điều khoản có thể được cập nhật. Phiên bản mới có hiệu lực kể từ ngày đăng tải trên trang này. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận điều khoản đã cập nhật.',
        ],
      },
      {
        id: 'lien-he',
        heading: '8. Liên hệ',
        body: [
          'Mọi thắc mắc vui lòng gửi về contact@blackholegame.com hoặc gọi 0779 467 868.',
        ],
      },
    ],
    en: [
      {
        id: 'scope',
        heading: '1. Scope',
        body: [
          'These terms govern your access to and use of blackholegame.com, its sub-pages and services provided by Black Hole Technology Solutions JSC ("Black Hole", "we").',
          'Individual games may have their own terms. Where they differ, the game-specific terms prevail.',
        ],
      },
      {
        id: 'accounts',
        heading: '2. Accounts',
        body: [
          'This website does not require sign-in or registration. Game accounts are created and managed in each game’s own account system; top-up is done through the official portal pay.blackholegame.vn. You are responsible for keeping your game account credentials safe and for all activity under your account.',
          '- Only top up through the official portal pay.blackholegame.vn; Black Hole is not responsible for transactions made through unofficial channels.',
          '- Provide accurate and complete information when registering a game account.',
          '- Do not share, sell or transfer your account.',
          '- Notify us immediately of any unauthorised access.',
        ],
      },
      {
        id: 'prohibited',
        heading: '3. Prohibited conduct',
        body: [
          '- Using third-party software, cheats or exploits for unfair advantage.',
          '- Distributing unlawful or offensive content or infringing the rights of others.',
          '- Interfering with, overloading or disrupting our systems.',
          'Black Hole may suspend or terminate accounts that violate these rules.',
        ],
      },
      {
        id: 'ip',
        heading: '4. Intellectual property',
        body: [
          'All content on this website (logos, images, text, video) belongs to Black Hole or its licensors. Copying or commercial use without written permission is prohibited.',
        ],
      },
      {
        id: 'health',
        heading: '5. Playtime',
        body: [
          'Playing games for more than 180 minutes a day can harm your health. Players under 18 need the consent and supervision of a parent or guardian.',
        ],
      },
      {
        id: 'liability',
        heading: '6. Limitation of liability',
        body: [
          'We strive to keep our services available but do not guarantee uninterrupted operation. Black Hole is not liable for damage caused by user error or force majeure.',
        ],
      },
      {
        id: 'changes',
        heading: '7. Changes',
        body: [
          'These terms may be updated. New versions take effect when published on this page. Continued use of the services means you accept the updated terms.',
        ],
      },
      {
        id: 'contact',
        heading: '8. Contact',
        body: ['Questions? Email contact@blackholegame.com or call +84 779 467 868.'],
      },
    ],
  },
};

export const privacy: LegalPage = {
  slug: 'privacy',
  title: { vi: 'Chính sách bảo mật', en: 'Privacy policy' },
  description: {
    vi: 'Cách Black Hole Game thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.',
    en: 'How Black Hole Game collects, uses and protects your personal data.',
  },
  updatedAt: '2026-10-05',
  sections: {
    vi: [
      {
        id: 'du-lieu-thu-thap',
        heading: '1. Dữ liệu chúng tôi thu thập',
        body: [
          '- Thông tin bạn cung cấp: họ tên, email, nội dung khi gửi biểu mẫu liên hệ.',
          '- Dữ liệu kỹ thuật: địa chỉ IP, loại trình duyệt, thiết bị, trang đã xem (qua cookie và công cụ phân tích).',
          '- Website không có đăng nhập. Dữ liệu tài khoản game được xử lý trong hệ thống tài khoản của từng trò chơi, dữ liệu giao dịch nạp được xử lý trên cổng nạp pay.blackholegame.vn, theo chính sách riêng của các hệ thống đó.',
        ],
      },
      {
        id: 'muc-dich',
        heading: '2. Mục đích sử dụng',
        body: [
          '- Phản hồi yêu cầu hợp tác, hỗ trợ và báo chí.',
          '- Vận hành, bảo mật và cải thiện website.',
          '- Đo lường hiệu quả truyền thông (khi bạn cho phép cookie phân tích).',
        ],
      },
      {
        id: 'co-so-phap-ly',
        heading: '3. Cơ sở pháp lý',
        body: [
          'Chúng tôi xử lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và các quy định pháp luật liên quan, dựa trên sự đồng ý của bạn hoặc nhu cầu thực hiện yêu cầu bạn gửi.',
        ],
      },
      {
        id: 'chia-se',
        heading: '4. Chia sẻ dữ liệu',
        body: [
          'Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với nhà cung cấp dịch vụ (lưu trữ, phân tích, chống spam) theo hợp đồng bảo mật, hoặc khi cơ quan nhà nước có thẩm quyền yêu cầu.',
        ],
      },
      {
        id: 'luu-tru',
        heading: '5. Thời gian lưu trữ',
        body: [
          'Dữ liệu liên hệ được lưu trong thời gian cần thiết để xử lý yêu cầu và tối đa 24 tháng, sau đó được xoá hoặc ẩn danh.',
        ],
      },
      {
        id: 'quyen',
        heading: '6. Quyền của bạn',
        body: [
          'Bạn có quyền yêu cầu truy cập, chỉnh sửa, xoá dữ liệu hoặc rút lại sự đồng ý bất kỳ lúc nào bằng cách gửi email tới contact@blackholegame.com.',
        ],
      },
      {
        id: 'cookie',
        heading: '7. Cookie',
        body: [
          'Website dùng cookie cần thiết (ví dụ ghi nhớ ngôn ngữ) và cookie phân tích. Bạn có thể tắt cookie trong cài đặt trình duyệt; một số tính năng có thể không hoạt động đầy đủ.',
        ],
      },
      {
        id: 'lien-he',
        heading: '8. Liên hệ',
        body: [
          'Công ty Cổ phần Giải pháp Công nghệ Black Hole - Số 777 Nguyễn Thiện Thuật, Mỹ Hào, Hưng Yên - contact@blackholegame.com.',
        ],
      },
    ],
    en: [
      {
        id: 'data-we-collect',
        heading: '1. Data we collect',
        body: [
          '- Information you provide: name, email and message when using the contact form.',
          '- Technical data: IP address, browser, device and pages viewed (via cookies and analytics).',
          '- This website has no sign-in. Game account data is processed by each game’s own account system, and top-up transaction data by the pay.blackholegame.vn portal, under their own policies.',
        ],
      },
      {
        id: 'purposes',
        heading: '2. Purposes',
        body: [
          '- Responding to partnership, support and press requests.',
          '- Operating, securing and improving the website.',
          '- Measuring marketing performance (when you allow analytics cookies).',
        ],
      },
      {
        id: 'legal-basis',
        heading: '3. Legal basis',
        body: [
          'We process personal data under Vietnam Decree 13/2023/ND-CP on personal data protection and related regulations, based on your consent or the need to handle your request.',
        ],
      },
      {
        id: 'sharing',
        heading: '4. Sharing',
        body: [
          'We do not sell personal data. Data is shared only with service providers (hosting, analytics, anti-spam) under confidentiality agreements, or when required by competent authorities.',
        ],
      },
      {
        id: 'retention',
        heading: '5. Retention',
        body: [
          'Contact data is kept as long as needed to handle your request and at most 24 months, then deleted or anonymised.',
        ],
      },
      {
        id: 'rights',
        heading: '6. Your rights',
        body: [
          'You may request access, correction or deletion of your data, or withdraw consent at any time, by emailing contact@blackholegame.com.',
        ],
      },
      {
        id: 'cookies',
        heading: '7. Cookies',
        body: [
          'We use necessary cookies (e.g. remembering your language) and analytics cookies. You can disable cookies in your browser; some features may not work fully.',
        ],
      },
      {
        id: 'contact',
        heading: '8. Contact',
        body: [
          'Black Hole Technology Solutions JSC - 777 Nguyen Thien Thuat, My Hao, Hung Yen, Vietnam - contact@blackholegame.com.',
        ],
      },
    ],
  },
};

export const legalPages = { terms, privacy } as const;
