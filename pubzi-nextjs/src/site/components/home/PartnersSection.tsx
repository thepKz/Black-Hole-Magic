import { reveal } from '@site/components/motion';
import { Container } from '@site/components/ui/Container';
import { PartnerTile } from '@site/components/ui/PartnerTile';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { partners } from '@site/data/partners';
import { getDictionary, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/**
 * "Đối tác của chúng tôi" (design v2): title + accent bar, logo tiles in
 * `repeat(auto-fill, minmax(180px, 1fr))` with 12px gaps (2 cols on phones).
 * Tiles scale in with a stagger.
 * NOT rendered on the home page for now (user decision, plan "CẬP NHẬT 4");
 * kept for when real partner logos arrive.
 */
export function PartnersSection({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  if (!partners.length) return null;
  return (
    <section aria-labelledby="home-partners-title" className={cn('section-b', className)}>
      <Container>
        <div {...reveal(0, 'fade')}>
          <SectionHeading id="home-partners-title" title={t.partners} />
        </div>
        <ul
          role="list"
          className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
        >
          {partners.map((partner, i) => (
            <li key={partner.id} {...reveal(i % 5, 'scale')}>
              <PartnerTile partner={partner} locale={locale} newTabLabel={t.newTab} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
