import { Container } from '@site/components/ui/Container';
import { SectionHeading } from '@site/components/ui/SectionHeading';
import { ServiceCard } from '@site/components/ui/ServiceCard';
import { services, servicesTitle } from '@site/data/services';
import { getDictionary, pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

/** "Dịch vụ phát hành": 4 service blocks, 2x2 (1 column < 768). */
export function ServicesSection({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  return (
    <section aria-labelledby="home-services-title" className={cn('section-y', className)}>
      <Container>
        <SectionHeading id="home-services-title" kicker={t.servicesKicker} title={pick(servicesTitle, locale)} />
        <ul role="list" className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 md:gap-5">
          {services.map((service) => (
            <li key={service.id} className="flex">
              <ServiceCard service={service} locale={locale} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
