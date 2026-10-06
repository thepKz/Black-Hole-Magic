import Link from 'next/link';

import { buttonClasses } from '@site/components/ui/Button';
import type { Locale } from '@site/i18n';

/**
 * Server-rendered "temporarily unavailable" article page, shown when the
 * content source is down AND no copy of this article is cached yet (pages
 * already rendered keep being served by ISR). Same copy as ./error.tsx of the
 * article route, which stays the boundary for unexpected render errors.
 */
const COPY = {
  vi: {
    title: 'Bài viết tạm thời không tải được',
    desc: 'Hệ thống tin tức đang bận hoặc bảo trì. Bạn thử lại sau ít phút nhé.',
    retry: 'Thử lại',
    back: 'Về trang Tin tức',
  },
  en: {
    title: 'This article is temporarily unavailable',
    desc: 'The newsroom is busy or under maintenance. Please try again in a few minutes.',
    retry: 'Try again',
    back: 'Back to News',
  },
} as const;

export function ArticleUnavailable({ locale, path }: { locale: Locale; path: string }) {
  const t = COPY[locale === 'en' ? 'en' : 'vi'];
  return (
    <main id="main" tabIndex={-1} className="section-y flex flex-1 items-center outline-none">
      <div className="container-site flex flex-col items-center gap-4 text-center">
        <h1 className="m-0 text-2xl text-ink md:text-[32px]">{t.title}</h1>
        <p className="m-0 max-w-md text-[15px] text-muted">{t.desc}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <a href={path} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            {t.retry}
          </a>
          <Link href={`/${locale}/news`} className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
