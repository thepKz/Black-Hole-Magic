'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { buttonClasses } from '@site/components/ui/Button';

/**
 * Article error boundary. The article page reads the content source in
 * `strict` mode (a source outage THROWS so ISR keeps the last good page instead
 * of caching a 404); when there is no good page yet, readers land here instead
 * of the bare Next error screen: a branded "temporarily unavailable" message,
 * a retry and a way back to the news list.
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

export default function ArticleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === 'en' ? 'en' : 'vi';
  const t = COPY[locale];

  useEffect(() => {
    // Only the digest: server error details are not sent to the browser anyway.
    if (error.digest) console.error('[news] article render failed, digest', error.digest);
  }, [error]);

  return (
    <main id="main" tabIndex={-1} className="section-y flex flex-1 items-center outline-none">
      <div className="container-site flex flex-col items-center gap-4 text-center">
        <h1 className="m-0 text-2xl text-ink md:text-[32px]">{t.title}</h1>
        <p className="m-0 max-w-md text-[15px] text-muted">{t.desc}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => retry()} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            {t.retry}
          </button>
          <Link href={`/${locale}/news`} className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
