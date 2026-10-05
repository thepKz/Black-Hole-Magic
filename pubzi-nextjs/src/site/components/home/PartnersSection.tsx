import { Container } from '@site/components/ui/Container';
import { PartnerTile } from '@site/components/ui/PartnerTile';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { partners } from '@site/data/partners';
import { getDictionary, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/** "Đối tác của chúng tôi": 10 logo tiles, 5x2 (>= 1024) -> 3 cols (>= 640) -> 2 cols. */
export function PartnersSection({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  if (!partners.length) return null;
  return (
    <section aria-labelledby="home-partners-title" className={cn('section-b', className)}>
      <Container>
        <SectionHeading id="home-partners-title" kicker={t.partnersKicker} title={t.partners} />
        <ul role="list" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 md:grid-cols-5">
          {partners.map((partner) => (
            <li key={partner.id}>
              <PartnerTile partner={partner} locale={locale} newTabLabel={t.newTab} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
