import type { SeedCategorySlug } from './base';

/**
 * Sample articles for `npm run seed:news`.
 * Based on the 9 NEWS items of the v2 design (same categories, dates and
 * story types), adapted to the real Black Hole catalogue (VLTK2, Thiên Long
 * Bát Bộ, Kiếm Thế, Tiếu Ngạo Giang Hồ, Con Đường Tơ Lụa) instead of the
 * design's placeholder game names. All copy is SAMPLE content.
 */

export type SeedGameArt =
  | 'vo-lam-truyen-ky-2'
  | 'thien-long-bat-bo'
  | 'kiem-the'
  | 'tieu-ngao-giang-ho'
  | 'con-duong-to-lua';

export interface SeedArticleCopy {
  title: string;
  excerpt: string;
  intro: string;
  heading: string;
  body: string;
  listIntro: string;
  list: string[];
  imageCaption: string;
  quote?: string;
  outro: string;
  tags: string[];
}

export interface SeedArticle {
  slug: string;
  category: SeedCategorySlug;
  /** dd/mm/yyyy from the design, published at 09:00 Asia/Ho_Chi_Minh. */
  date: string;
  cover: SeedGameArt | null;
  inlineImage: SeedGameArt;
  featured?: boolean;
  related?: string[];
  vi: SeedArticleCopy;
  en: SeedArticleCopy;
}

export const SEED_ART_ALT: Record<SeedGameArt, { vi: string; en: string }> = {
  'vo-lam-truyen-ky-2': { vi: 'Ảnh chủ đề Võ Lâm Truyền Kỳ 2', en: 'Võ Lâm Truyền Kỳ 2 key art' },
  'thien-long-bat-bo': { vi: 'Ảnh chủ đề Thiên Long Bát Bộ', en: 'Thiên Long Bát Bộ key art' },
  'kiem-the': { vi: 'Ảnh chủ đề Kiếm Thế', en: 'Kiếm Thế key art' },
  'tieu-ngao-giang-ho': { vi: 'Ảnh chủ đề Tiếu Ngạo Giang Hồ', en: 'Tiếu Ngạo Giang Hồ key art' },
  'con-duong-to-lua': { vi: 'Ảnh chủ đề Con Đường Tơ Lụa', en: 'Con Đường Tơ Lụa key art' },
};

export const SEED_ARTICLES: SeedArticle[] = [
  {
    slug: 'thien-long-bat-bo-chinh-thuc-ra-mat',
    category: 'game',
    date: '28/09/2026',
    cover: 'thien-long-bat-bo',
    inlineImage: 'thien-long-bat-bo',
    featured: true,
    related: ['kiem-the-mo-dang-ky-truoc', 'tieu-ngao-giang-ho-he-lo-mon-phai-moi'],
    vi: {
      title: 'Thiên Long Bát Bộ chính thức ra mắt: máy chủ đầu tiên mở cửa ngày 28/09',
      excerpt:
        'Máy chủ đầu tiên mở cửa lúc 10:00 ngày 28/09, tặng gói quà tân thủ cho mọi người chơi đăng nhập trong tuần đầu.',
      intro:
        'Sau thời gian thử nghiệm kín, Thiên Long Bát Bộ chính thức mở cửa máy chủ đầu tiên vào 10:00 sáng 28/09/2026 trên PC, Android và iOS.',
      heading: 'Quà tân thủ cho tuần đầu ra mắt',
      body:
        'Mọi tài khoản đăng nhập từ 28/09 đến hết 04/10 đều nhận gói quà tân thủ gồm trang bị khởi đầu, thú cưỡi 7 ngày và vật phẩm hồi phục. Quà được gửi trực tiếp vào hòm thư trong game.',
      listIntro: 'Những điểm nổi bật của phiên bản ra mắt:',
      list: [
        'Mười đại môn phái với lối chơi riêng biệt',
        'Hệ thống bang hội và công thành chiến hằng tuần',
        'Tối ưu cho cả máy cấu hình thấp',
      ],
      imageCaption: 'Thiên Long Bát Bộ có mặt trên PC, Android và iOS.',
      quote: 'Chúng tôi muốn mang lại trải nghiệm kiếm hiệp trọn vẹn và công bằng cho người chơi Việt.',
      outro:
        'Theo dõi fanpage chính thức để cập nhật lịch mở máy chủ mới và các sự kiện tiếp theo.',
      tags: ['Thiên Long Bát Bộ', 'ra mắt', 'quà tân thủ'],
    },
    en: {
      title: 'Thiên Long Bát Bộ launches: first server opens on 28/09',
      excerpt:
        'The first server opens at 10:00 on 28/09, with a starter pack for every player who logs in during launch week.',
      intro:
        'After a closed beta, Thiên Long Bát Bộ opens its first server at 10:00 on 28/09/2026 on PC, Android and iOS.',
      heading: 'Starter rewards for launch week',
      body:
        'Every account that logs in between 28/09 and 04/10 receives a starter pack with beginner gear, a 7-day mount and recovery items, delivered straight to the in-game mailbox.',
      listIntro: 'Launch highlights:',
      list: [
        'Ten major sects, each with its own play style',
        'Guilds and weekly siege battles',
        'Optimised for low-end devices',
      ],
      imageCaption: 'Thiên Long Bát Bộ is available on PC, Android and iOS.',
      quote: 'We want to bring a complete and fair wuxia experience to Vietnamese players.',
      outro: 'Follow the official fanpage for new server schedules and upcoming events.',
      tags: ['Thiên Long Bát Bộ', 'launch', 'starter pack'],
    },
  },
  {
    slug: 'su-kien-trung-thu-vo-lam-truyen-ky-2',
    category: 'event',
    date: '25/09/2026',
    cover: 'vo-lam-truyen-ky-2',
    inlineImage: 'vo-lam-truyen-ky-2',
    vi: {
      title: 'Sự kiện Trung Thu: nhận lồng đèn giới hạn trong Võ Lâm Truyền Kỳ 2',
      excerpt: 'Từ 25/09 đến 06/10, đăng nhập mỗi ngày để nhận lồng đèn và trang phục Trung Thu giới hạn.',
      intro:
        'Mùa trăng rằm năm nay, Võ Lâm Truyền Kỳ 2 mang đến chuỗi hoạt động Trung Thu kéo dài 12 ngày cho toàn bộ máy chủ.',
      heading: 'Cách tham gia',
      body:
        'Người chơi chỉ cần đăng nhập mỗi ngày và hoàn thành nhiệm vụ "Rước đèn" tại Tương Dương để tích luỹ điểm hội trăng, đổi lấy phần thưởng giới hạn.',
      listIntro: 'Phần thưởng nổi bật:',
      list: ['Lồng đèn cá chép (vĩnh viễn)', 'Trang phục Hằng Nga – Chú Cuội', 'Bánh trung thu tăng kinh nghiệm x2'],
      imageCaption: 'Tương Dương được trang hoàng đón Trung Thu.',
      outro: 'Sự kiện kết thúc lúc 23:59 ngày 06/10/2026. Phần thưởng chưa nhận sẽ không được bảo lưu.',
      tags: ['Võ Lâm Truyền Kỳ 2', 'Trung Thu', 'sự kiện'],
    },
    en: {
      title: 'Mid-Autumn event: limited lanterns in Võ Lâm Truyền Kỳ 2',
      excerpt: 'From 25/09 to 06/10, log in daily for limited Mid-Autumn lanterns and outfits.',
      intro:
        'This full-moon season, Võ Lâm Truyền Kỳ 2 runs a 12-day Mid-Autumn celebration across every server.',
      heading: 'How to join',
      body:
        'Log in every day and complete the "Lantern Parade" quest in Tương Dương to earn moon points, then exchange them for limited rewards.',
      listIntro: 'Top rewards:',
      list: ['Carp lantern (permanent)', 'Moon Lady & Cuội outfits', 'Mooncakes with double EXP'],
      imageCaption: 'Tương Dương dressed up for the Mid-Autumn festival.',
      outro: 'The event ends at 23:59 on 06/10/2026. Unclaimed rewards will not be kept.',
      tags: ['Võ Lâm Truyền Kỳ 2', 'Mid-Autumn', 'event'],
    },
  },
  {
    slug: 'lich-bao-tri-he-thong-nap-30-09-2026',
    category: 'notice',
    date: '22/09/2026',
    cover: 'con-duong-to-lua',
    inlineImage: 'kiem-the',
    vi: {
      title: 'Lịch bảo trì hệ thống nạp ngày 30/09/2026',
      excerpt: 'Hệ thống nạp tạm dừng từ 02:00 đến 05:00 để nâng cấp. Các giao dịch khác không bị ảnh hưởng.',
      intro:
        'Nhằm nâng cao tốc độ và độ ổn định, Black Hole Game sẽ bảo trì hệ thống nạp vào rạng sáng 30/09/2026.',
      heading: 'Thời gian và phạm vi',
      body:
        'Từ 02:00 đến 05:00, mọi kênh nạp (ví điện tử, thẻ ngân hàng, thẻ cào) tạm dừng. Đăng nhập và chơi game vẫn diễn ra bình thường.',
      listIntro: 'Lưu ý cho người chơi:',
      list: [
        'Không thực hiện giao dịch nạp trong thời gian bảo trì',
        'Giao dịch bị gián đoạn sẽ được đối soát và hoàn trả tự động',
        'Liên hệ bộ phận hỗ trợ nếu sau 24 giờ chưa nhận được vật phẩm',
      ],
      imageCaption: 'Hệ thống nạp sẽ hoạt động trở lại từ 05:00.',
      outro: 'Thời gian bảo trì có thể kết thúc sớm hơn dự kiến. Xin cảm ơn sự thông cảm của quý người chơi.',
      tags: ['bảo trì', 'nạp'],
    },
    en: {
      title: 'Top-up system maintenance on 30/09/2026',
      excerpt: 'Top-up is paused from 02:00 to 05:00 for upgrades. Other services are unaffected.',
      intro:
        'To improve speed and stability, Black Hole Game will maintain the top-up system early on 30/09/2026.',
      heading: 'Time and scope',
      body:
        'From 02:00 to 05:00 every top-up channel (e-wallets, bank cards, prepaid cards) is paused. Logging in and playing are not affected.',
      listIntro: 'Please note:',
      list: [
        'Do not top up during the maintenance window',
        'Interrupted transactions are reconciled and refunded automatically',
        'Contact support if items have not arrived after 24 hours',
      ],
      imageCaption: 'Top-up services resume from 05:00.',
      outro: 'Maintenance may finish early. Thank you for your understanding.',
      tags: ['maintenance', 'top-up'],
    },
  },
  {
    slug: 'kiem-the-mo-dang-ky-truoc',
    category: 'game',
    date: '18/09/2026',
    cover: 'kiem-the',
    inlineImage: 'kiem-the',
    related: ['thien-long-bat-bo-chinh-thuc-ra-mat'],
    vi: {
      title: 'Kiếm Thế mở đăng ký trước, mốc 500.000 lượt nhận quà',
      excerpt: 'Đăng ký trước ngay hôm nay để nhận quà theo từng mốc cộng đồng, cao nhất ở mốc 500.000 lượt.',
      intro: 'Kiếm Thế chính thức mở trang đăng ký trước, chuẩn bị cho ngày ra mắt cuối năm 2026.',
      heading: 'Quà theo mốc đăng ký',
      body:
        'Mỗi mốc lượt đăng ký mà cộng đồng đạt được sẽ mở khoá thêm phần quà cho tất cả người chơi đã đăng ký trước.',
      listIntro: 'Các mốc thưởng:',
      list: ['100.000 lượt: túi vàng khởi đầu', '250.000 lượt: thú cưỡi Tuyết Lang', '500.000 lượt: danh hiệu và ngoại trang giới hạn'],
      imageCaption: 'Kiếm Thế dự kiến ra mắt cuối năm 2026.',
      outro: 'Quà sẽ được gửi bằng mã kích hoạt qua email đã đăng ký khi game ra mắt.',
      tags: ['Kiếm Thế', 'đăng ký trước'],
    },
    en: {
      title: 'Kiếm Thế pre-registration opens, rewards at 500,000 sign-ups',
      excerpt: 'Pre-register today to unlock community milestone rewards, topping out at 500,000 sign-ups.',
      intro: 'Kiếm Thế has opened pre-registration ahead of its late-2026 launch.',
      heading: 'Milestone rewards',
      body: 'Every community milestone unlocks another reward for everyone who pre-registered.',
      listIntro: 'Milestones:',
      list: ['100,000: starter gold pouch', '250,000: Snow Wolf mount', '500,000: limited title and outfit'],
      imageCaption: 'Kiếm Thế is expected to launch in late 2026.',
      outro: 'Rewards are sent as activation codes to your registered email at launch.',
      tags: ['Kiếm Thế', 'pre-registration'],
    },
  },
  {
    slug: 'giai-dau-vo-lam-truyen-ky-2-mua-3',
    category: 'event',
    date: '12/09/2026',
    cover: 'vo-lam-truyen-ky-2',
    inlineImage: 'vo-lam-truyen-ky-2',
    vi: {
      title: 'Giải đấu Võ Lâm Truyền Kỳ 2 mùa 3 chính thức khởi tranh',
      excerpt: 'Hơn 256 đội tranh tài qua vòng loại trực tuyến, chung kết offline tại Hà Nội.',
      intro: 'Mùa giải thứ ba của Võ Lâm Truyền Kỳ 2 quay trở lại với quy mô lớn nhất từ trước tới nay.',
      heading: 'Thể thức thi đấu',
      body: 'Vòng loại diễn ra trực tuyến theo thể thức loại kép; 16 đội mạnh nhất vào vòng chung kết offline.',
      listIntro: 'Lịch trình:',
      list: ['12/09 – 26/09: đăng ký và vòng loại', '03/10: vòng 16 đội', '17/10: chung kết offline'],
      imageCaption: 'Đấu trường mùa 3 của Võ Lâm Truyền Kỳ 2.',
      quote: 'Mỗi mùa giải là dịp để cộng đồng võ lâm gặp gỡ và giao lưu.',
      outro: 'Toàn bộ trận đấu được phát sóng trực tiếp trên fanpage chính thức.',
      tags: ['Võ Lâm Truyền Kỳ 2', 'giải đấu', 'esports'],
    },
    en: {
      title: 'Võ Lâm Truyền Kỳ 2 tournament season 3 kicks off',
      excerpt: 'More than 256 teams battle through online qualifiers, with an offline final in Hanoi.',
      intro: 'Season three of the Võ Lâm Truyền Kỳ 2 tournament returns at its biggest scale yet.',
      heading: 'Format',
      body: 'Qualifiers are played online in double elimination; the top 16 teams advance to the offline finals.',
      listIntro: 'Schedule:',
      list: ['12/09 – 26/09: sign-ups and qualifiers', '03/10: round of 16', '17/10: offline final'],
      imageCaption: 'The season 3 arena of Võ Lâm Truyền Kỳ 2.',
      quote: 'Every season is a chance for the community to meet and compete.',
      outro: 'Every match is streamed live on the official fanpage.',
      tags: ['Võ Lâm Truyền Kỳ 2', 'tournament', 'esports'],
    },
  },
  {
    slug: 'cap-nhat-chinh-sach-bao-mat-du-lieu-ca-nhan',
    category: 'notice',
    date: '05/09/2026',
    cover: null,
    inlineImage: 'con-duong-to-lua',
    vi: {
      title: 'Cập nhật chính sách bảo mật dữ liệu cá nhân',
      excerpt: 'Chính sách mới áp dụng từ 01/10/2026, làm rõ cách chúng tôi thu thập và bảo vệ dữ liệu của bạn.',
      intro: 'Black Hole Game cập nhật Chính sách bảo mật để phù hợp quy định hiện hành về bảo vệ dữ liệu cá nhân.',
      heading: 'Những thay đổi chính',
      body: 'Chính sách mới mô tả rõ hơn loại dữ liệu được thu thập, mục đích sử dụng và quyền của người dùng.',
      listIntro: 'Bạn có quyền:',
      list: ['Yêu cầu truy cập và chỉnh sửa dữ liệu', 'Rút lại sự đồng ý', 'Yêu cầu xoá tài khoản và dữ liệu liên quan'],
      imageCaption: 'Dữ liệu người chơi được bảo vệ theo tiêu chuẩn hiện hành.',
      outro: 'Vui lòng đọc toàn văn Chính sách bảo mật trên website. Mọi thắc mắc xin gửi về bộ phận hỗ trợ.',
      tags: ['chính sách', 'bảo mật'],
    },
    en: {
      title: 'Update to our personal data privacy policy',
      excerpt: 'The new policy applies from 01/10/2026 and clarifies how we collect and protect your data.',
      intro: 'Black Hole Game has updated its Privacy Policy in line with current personal data protection rules.',
      heading: 'Key changes',
      body: 'The new policy explains more clearly what data we collect, why we use it and what rights you have.',
      listIntro: 'You have the right to:',
      list: ['Access and correct your data', 'Withdraw consent', 'Request deletion of your account and related data'],
      imageCaption: 'Player data is protected to current standards.',
      outro: 'Please read the full Privacy Policy on our website. Questions can be sent to our support team.',
      tags: ['policy', 'privacy'],
    },
  },
  {
    slug: 'tieu-ngao-giang-ho-he-lo-mon-phai-moi',
    category: 'game',
    date: '29/08/2026',
    cover: 'tieu-ngao-giang-ho',
    inlineImage: 'tieu-ngao-giang-ho',
    vi: {
      title: 'Tiếu Ngạo Giang Hồ hé lộ môn phái mới trước ngày ra mắt',
      excerpt: 'Môn phái thứ chín sở trường kiếm khí tầm xa, sẽ có mặt ngay từ phiên bản ra mắt.',
      intro: 'Nhà phát triển vừa công bố môn phái mới của Tiếu Ngạo Giang Hồ cùng loạt ảnh và video giới thiệu.',
      heading: 'Lối chơi môn phái',
      body: 'Môn phái mới tập trung vào kiếm khí tầm xa, khống chế mục tiêu và hỗ trợ đồng đội trong giao tranh lớn.',
      listIntro: 'Kỹ năng tiêu biểu:',
      list: ['Kiếm khí xuyên tâm', 'Tuyệt ảnh bộ pháp', 'Hộ thể kiếm trận'],
      imageCaption: 'Tiếu Ngạo Giang Hồ đang trong giai đoạn hoàn thiện.',
      outro: 'Thông tin chi tiết về ngày ra mắt sẽ được công bố trong thời gian tới.',
      tags: ['Tiếu Ngạo Giang Hồ', 'môn phái'],
    },
    en: {
      title: 'Tiếu Ngạo Giang Hồ reveals a new sect ahead of launch',
      excerpt: 'The ninth sect specialises in long-range sword qi and will be available at launch.',
      intro: 'The developer has revealed a new Tiếu Ngạo Giang Hồ sect with fresh screenshots and a trailer.',
      heading: 'Play style',
      body: 'The new sect focuses on long-range sword qi, crowd control and supporting allies in large battles.',
      listIntro: 'Signature skills:',
      list: ['Piercing Sword Qi', 'Shadow Step', 'Guardian Sword Array'],
      imageCaption: 'Tiếu Ngạo Giang Hồ is in final development.',
      outro: 'Launch date details will be announced soon.',
      tags: ['Tiếu Ngạo Giang Hồ', 'sect'],
    },
  },
  {
    slug: 'uu-dai-nap-lan-dau-x2',
    category: 'event',
    date: '20/08/2026',
    cover: 'thien-long-bat-bo',
    inlineImage: 'vo-lam-truyen-ky-2',
    vi: {
      title: 'Ưu đãi nạp lần đầu x2 cho toàn bộ game',
      excerpt: 'Lần nạp đầu tiên trên mỗi game được nhân đôi giá trị, áp dụng cho mọi kênh thanh toán.',
      intro: 'Black Hole Game triển khai chương trình nhân đôi giá trị nạp lần đầu trên toàn bộ các game đang phát hành.',
      heading: 'Điều kiện áp dụng',
      body: 'Áp dụng cho lần nạp đầu tiên của mỗi nhân vật trên từng game, không giới hạn mệnh giá.',
      listIntro: 'Kênh thanh toán hỗ trợ:',
      list: ['Ví điện tử', 'Thẻ ngân hàng nội địa và quốc tế', 'Thẻ cào'],
      imageCaption: 'Ưu đãi áp dụng cho mọi game của Black Hole.',
      outro: 'Chương trình có thể kết thúc sớm mà không cần báo trước.',
      tags: ['khuyến mãi', 'nạp'],
    },
    en: {
      title: 'Double first top-up bonus across all games',
      excerpt: 'Your first top-up in each game is doubled, on every payment channel.',
      intro: 'Black Hole Game is doubling the value of the first top-up in every game it publishes.',
      heading: 'Eligibility',
      body: 'Applies to the first top-up of each character in each game, any amount.',
      listIntro: 'Supported payment channels:',
      list: ['E-wallets', 'Domestic and international bank cards', 'Prepaid cards'],
      imageCaption: 'The offer applies to every Black Hole game.',
      outro: 'The programme may end early without notice.',
      tags: ['promotion', 'top-up'],
    },
  },
  {
    slug: 'con-duong-to-lua-cong-bo-thuong-lo-moi',
    category: 'game',
    date: '10/08/2026',
    cover: 'con-duong-to-lua',
    inlineImage: 'con-duong-to-lua',
    vi: {
      title: 'Con Đường Tơ Lụa công bố bản đồ thương lộ đầu tiên',
      excerpt: 'Bản đồ thương lộ trải dài qua 12 thành trì với hệ thống giao thương và hộ tống đoàn xe.',
      intro: 'Con Đường Tơ Lụa hé lộ bản đồ thương lộ đầu tiên, trái tim của lối chơi kinh doanh trong game.',
      heading: 'Giao thương và hộ tống',
      body: 'Người chơi mua bán đặc sản giữa các thành trì, lập thương đoàn và hộ tống hàng hoá qua những vùng đất nguy hiểm.',
      listIntro: 'Điểm mới:',
      list: ['12 thành trì với đặc sản riêng', 'Sự kiện cướp tiêu theo khung giờ', 'Bảng xếp hạng thương nhân hằng tuần'],
      imageCaption: 'Thương lộ đầu tiên của Con Đường Tơ Lụa.',
      outro: 'Game đang mở đăng ký trước trên trang chủ chính thức.',
      tags: ['Con Đường Tơ Lụa', 'bản đồ'],
    },
    en: {
      title: 'Con Đường Tơ Lụa unveils its first trade route map',
      excerpt: 'The first trade route spans 12 cities with trading and caravan escort systems.',
      intro: 'Con Đường Tơ Lụa has unveiled its first trade route map, the heart of its trading gameplay.',
      heading: 'Trade and escort',
      body: 'Players trade local goods between cities, form caravans and escort cargo through dangerous lands.',
      listIntro: "What's new:",
      list: ['12 cities with their own specialities', 'Timed caravan raid events', 'Weekly merchant leaderboard'],
      imageCaption: 'The first trade route of Con Đường Tơ Lụa.',
      outro: 'Pre-registration is open on the official website.',
      tags: ['Con Đường Tơ Lụa', 'map'],
    },
  },
];
