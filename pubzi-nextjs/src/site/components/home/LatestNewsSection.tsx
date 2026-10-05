import { ArrowRightIcon } from '@phosphor-icons/react/ssr';

import { reveal } from '@site/components/motion';
import { Button } from '@site/components/ui/Button';
import { Container } from '@site/components/ui/Container';
import { NewsCard } from '@site/components/ui/NewsCard';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { getDictionary, href, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { getLatestNews } from '@site/lib/news';

/**
 * "Tin tức - Sự kiện" (design v2 home): the 3 latest published posts from
 * /admin + "Xem thêm →" to /news. Renders nothing when there are no posts
 * (or the DB is unreachable — getLatestNews returns []).
 */
export async function LatestNewsSection({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  const items = await getLatestNews(locale, 3);
  if (!items.length) return null;

  const viewMore = (
    <Button variant="secondary" href={href(locale, '/news')} className="group/vm">
      {t.viewMore}
      <ArrowRightIcon
        className="size-4 transition-transform duration-(--dur-2) ease-standard group-hover/vm:translate-x-0.5"
        weight="bold"
        aria-hidden="true"
      />
    </Button>
  );

  return (
    <section aria-labelledby="home-news-title" className={cn('section-b', className)}>
      <Container>
        <div {...reveal(0, 'fade')}>
          <SectionHeading
            id="home-news-title"
            title={t.newsEvents}
            action={<div className="hidden sm:flex">{viewMore}</div>}
          />
        </div>
        <ul role="list" className="m-0 grid list-none grid-cols-1 gap-6 p-0 py-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.id} className="flex min-w-0" {...reveal(i + 1)}>
              <NewsCard item={item} locale={locale} className="w-full" />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center sm:hidden">{viewMore}</div>
      </Container>
    </section>
  );
}
