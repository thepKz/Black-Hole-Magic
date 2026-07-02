import type { Locale } from './config';

export const messages = {
  vi: {
    common: {
      nav: {
        home: 'Trang chủ',
        about: 'Về chúng tôi',
        game: 'Danh sách game',
        contact: 'Liên hệ',
      },
      actions: {
        contact: 'Liên hệ',
        contactNow: 'Liên hệ ngay',
        openMenu: 'Mở menu',
        closeMenu: 'Đóng menu',
        submitSearch: 'Gửi tìm kiếm',
      },
      search: {
        placeholder: 'Tìm trận đấu, đội tuyển, tin tức...',
      },
      contact: {
        heading: 'Liên hệ',
        address: '777 Nguyễn Thiện Thuật, Mỹ Hào, Hưng Yên',
      },
    },
    gamePage: {
      hero: {
        title1: 'Bước qua cổng,',
        title2: 'chọn thế giới của bạn',
        subtitle:
          'Mỗi tựa game được chọn vì có cộng đồng, nhịp vận hành và câu chuyện riêng. Black Hole dựng bối cảnh để người chơi muốn ở lại.',
        factsLabel: 'Thông tin catalog',
        gameCount: 'tựa game',
        platforms: 'PC và Mobile',
        localOps: 'Vận hành nội địa',
        cta: 'Xem các thế giới',
      },
      showcaseLabel: 'Danh sách game Black Hole',
      cardCtaPrefix: 'Trao đổi về',
      cardCta: 'Trao đổi',
      opsLabel: 'Cách Black Hole vận hành danh mục game',
      opsKicker: 'Vận hành danh mục game',
      opsTitle: 'Không chỉ đưa game lên kệ.',
      opsBody:
        'Với đối tác phát hành, điều quan trọng hơn là thấy rõ Black Hole giới thiệu game ra thị trường, theo dõi hiệu quả và giữ nhịp vận hành ổn định sau khi ra mắt.',
      partnerKicker: 'Đối tác phát hành',
      partnerTitle: 'Có game cần bước vào thị trường Việt?',
      partnerBody:
        'Black Hole hỗ trợ bản địa hóa, vận hành cộng đồng, chiến dịch ra mắt và kênh phân phối cho game PC lẫn Mobile.',
      partnerCta: 'Bắt đầu trao đổi',
      games: {
        VLTK2: {
          title: 'Võ Lâm Truyền Kỳ 2',
          shortTitle: 'VLTK2',
          genre: 'Kiếm hiệp MMORPG',
          hook: 'Giang hồ vẫn đông như ngày đó. Bang hội, công thành, săn boss mỗi tối.',
          forWho: 'Dành cho ai mê chiến trường đông và muốn có anh em chinh chiến cùng.',
          status: 'Đang vận hành',
          details: ['Bang hội', 'Công thành', 'Boss thế giới'],
          ctaLabel: 'Trao đổi về game này',
        },
        KT: {
          title: 'Kiếm Thế',
          shortTitle: 'Kiếm Thế',
          genre: 'Nhập vai võ hiệp',
          hook: 'Tống Kim 9 giờ tối, cả server lao vào nhau. Bạn đứng phe nào?',
          forWho: 'Dành cho dân máu chiến, thích PvP nhanh và mỗi tối một trận lớn.',
          status: 'Sắp mở',
          details: ['Tống Kim', 'Gia tộc', 'PvP phe phái'],
          ctaLabel: 'Trao đổi về game này',
        },
        TLBB: {
          title: 'Thiên Long Bát Bộ',
          shortTitle: 'TLBB',
          genre: 'MMORPG võ hiệp',
          hook: 'Thiên Long trở lại. Vẫn môn phái đó, giờ chơi được cả trên điện thoại.',
          forWho: 'Dành cho ai muốn chơi lại huyền thoại mà không phải ngồi mãi bên máy.',
          status: 'Ra mắt 2026',
          details: ['Môn phái', 'PvP lớn', 'PC & Mobile'],
          ctaLabel: 'Trao đổi về game này',
        },
        TNGH: {
          title: 'Tiếu Ngạo Giang Hồ',
          shortTitle: 'TNGH',
          genre: 'Hành động nhập vai',
          hook: 'Combo tay nhanh, phe phái rõ ràng. Giang hồ đúng chất phim kiếm hiệp.',
          forWho: 'Dành cho game thủ thích đánh đấm có kỹ năng, không chỉ bấm auto.',
          status: 'Sắp mở',
          details: ['Combo võ học', 'Thế lực', 'Chiến trường'],
          ctaLabel: 'Trao đổi về game này',
        },
        SRO: {
          title: 'Con Đường Tơ Lụa',
          shortTitle: 'Silkroad',
          genre: 'MMORPG thương lộ',
          hook: 'Buôn lụa hay cướp lụa? Mỗi chuyến hàng là một canh bạc.',
          forWho: 'Dành cho dân thích vai trò xã hội, buôn bán và phục kích nhau trên đường.',
          status: 'Sắp mở',
          details: ['Buôn bán', 'Cướp đường', 'Bảo tiêu'],
          ctaLabel: 'Trao đổi về game này',
        },
      },
      opsSteps: [
        {
          label: 'Chọn game',
          text: 'Đọc cộng đồng, thể loại, nền tảng và khả năng vận hành lâu dài trước khi đưa vào catalog.',
        },
        {
          label: 'Định vị ra mắt',
          text: 'Tách rõ game đang vận hành, game sắp mở và nhóm cần truyền thông trước launch.',
        },
        {
          label: 'Vận hành nội địa',
          text: 'Theo dõi nhịp sự kiện, cộng đồng, phản hồi người chơi và kênh hỗ trợ tại Việt Nam.',
        },
        {
          label: 'Mở rộng vòng đời',
          text: 'Giữ game sống bằng nội dung, chiến dịch, cộng đồng và lịch cập nhật có nhịp.',
        },
      ],
    },
  },
  en: {
    common: {
      nav: {
        home: 'Home',
        about: 'About',
        game: 'Games',
        contact: 'Contact',
      },
      actions: {
        contact: 'Contact',
        contactNow: 'Contact now',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        submitSearch: 'Submit search',
      },
      search: {
        placeholder: 'Search matches, teams, news...',
      },
      contact: {
        heading: 'Contact',
        address: '777 Nguyen Thien Thuat, My Hao, Hung Yen',
      },
    },
    gamePage: {
      hero: {
        title1: 'Step through the gate,',
        title2: 'choose your world',
        subtitle:
          'Each game is selected for its community, operating rhythm, and distinct story. Black Hole builds the context that makes players want to stay.',
        factsLabel: 'Catalog information',
        gameCount: 'games',
        platforms: 'PC and Mobile',
        localOps: 'Local operation',
        cta: 'View worlds',
      },
      showcaseLabel: 'Black Hole game catalog',
      cardCtaPrefix: 'Discuss',
      cardCta: 'Discuss',
      opsLabel: 'How Black Hole operates the game catalog',
      opsKicker: 'Game catalog operation',
      opsTitle: 'More than putting games on a shelf.',
      opsBody:
        'For publishing partners, what matters is seeing how Black Hole brings games to market, tracks performance, and keeps operations stable after launch.',
      partnerKicker: 'Publishing partners',
      partnerTitle: 'Have a game entering Vietnam?',
      partnerBody:
        'Black Hole supports localization, community operations, launch campaigns, and distribution channels for both PC and Mobile games.',
      partnerCta: 'Start a conversation',
      games: {
        VLTK2: {
          title: 'Vo Lam Truyen Ky 2',
          shortTitle: 'VLTK2',
          genre: 'Wuxia MMORPG',
          hook: 'The martial world is still alive: guilds, sieges, and nightly world boss hunts.',
          forWho: 'For players who want crowded battlefields and a guild to fight beside.',
          status: 'Live',
          details: ['Guilds', 'Sieges', 'World bosses'],
          ctaLabel: 'Discuss this game',
        },
        KT: {
          title: 'Kiem The',
          shortTitle: 'Kiem The',
          genre: 'Wuxia role-playing',
          hook: 'Tong Kim at 9 PM: the whole server charges in. Which side are you on?',
          forWho: 'For competitive players who want fast PvP and a major fight every night.',
          status: 'Coming soon',
          details: ['Tong Kim', 'Families', 'Faction PvP'],
          ctaLabel: 'Discuss this game',
        },
        TLBB: {
          title: 'Thien Long Bat Bo',
          shortTitle: 'TLBB',
          genre: 'Wuxia MMORPG',
          hook: 'Thien Long returns with familiar sects, now playable from mobile as well.',
          forWho: 'For players who want to revisit a legend without being tied to a desktop.',
          status: 'Launching 2026',
          details: ['Sects', 'Large PvP', 'PC & Mobile'],
          ctaLabel: 'Discuss this game',
        },
        TNGH: {
          title: 'Tieu Ngao Giang Ho',
          shortTitle: 'TNGH',
          genre: 'Action RPG',
          hook: 'Fast hand combos and clear factions, with the feel of a wuxia film.',
          forWho: 'For players who enjoy skill-based combat, not just auto-play.',
          status: 'Coming soon',
          details: ['Martial combos', 'Factions', 'Battlefields'],
          ctaLabel: 'Discuss this game',
        },
        SRO: {
          title: 'Silkroad Online',
          shortTitle: 'Silkroad',
          genre: 'Trade-route MMORPG',
          hook: 'Trade silk or steal it? Every caravan run is a wager.',
          forWho: 'For players who like social roles, trading, and ambushes on the road.',
          status: 'Coming soon',
          details: ['Trading', 'Road raids', 'Escort runs'],
          ctaLabel: 'Discuss this game',
        },
      },
      opsSteps: [
        {
          label: 'Select the game',
          text: 'Read the community, genre, platform fit, and long-term operating potential before adding it to the catalog.',
        },
        {
          label: 'Position the launch',
          text: 'Separate live games, upcoming releases, and titles that need pre-launch communication.',
        },
        {
          label: 'Operate locally',
          text: 'Track event rhythm, community feedback, player response, and support channels in Vietnam.',
        },
        {
          label: 'Extend lifecycle',
          text: 'Keep games alive through content, campaigns, community, and a steady update cadence.',
        },
      ],
    },
  },
} as const;

export type Messages = (typeof messages)[Locale];

