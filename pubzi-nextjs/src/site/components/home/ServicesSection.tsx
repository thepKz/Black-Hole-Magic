import { reveal } from '@site/components/motion';
import { Container } from '@site/components/ui/Container';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { ServiceCard } from '@site/components/ui/ServiceCard';
import { services, servicesTitle } from '@site/data/services';
import { pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/**
 * "Dịch vụ phát hành" (design v2): title + accent bar, 4 service blocks in
 * `repeat(auto-fit, minmax(min(100%, 460px), 1fr))` -> 2x2 on the 1200
 * container, one column below ~950px (so the 72px icon + copy never cramp).
 * Heading fades, cards rise in with a stagger (shared reveal primitive).
 */
export function ServicesSection({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <section aria-labelledby="home-services-title" className={cn('section-y', className)}>
      <Container>
        <div {...reveal(0, 'fade')}>
          <SectionHeading id="home-services-title" title={pick(servicesTitle, locale)} />
        </div>
        <ul
          role="list"
          className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-4 p-0"
        >
          {services.map((service, i) => (
            <li key={service.id} className="flex" {...reveal(i)}>
              <ServiceCard service={service} locale={locale} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
