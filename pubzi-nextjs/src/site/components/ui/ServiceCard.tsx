import { CreditCardIcon, ScalesIcon, TranslateIcon, UsersThreeIcon } from '@phosphor-icons/react/ssr';

import { pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { Service, ServiceIcon } from '@site/lib/types';

const icons: Record<ServiceIcon, typeof ScalesIcon> = {
  scales: ScalesIcon,
  'credit-card': CreditCardIcon,
  translate: TranslateIcon,
  'users-three': UsersThreeIcon,
};

export interface ServiceCardProps {
  service: Service;
  locale: Locale;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

/** Publishing service block (design v2): 72px icon tile + title + description. Server component. */
export function ServiceCard({ service, locale, headingLevel = 'h3', className }: ServiceCardProps) {
  const Icon = icons[service.icon] ?? ScalesIcon;
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        'card-lift-soft grid grid-cols-[56px_minmax(0,1fr)] items-start gap-4 rounded-xl bg-surface p-5 shadow-sm sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5 sm:p-7',
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-xl bg-accent-50 text-accent shadow-[inset_0_0_0_1px_var(--color-accent-100)] sm:size-[72px]">
        <Icon className="size-8 sm:size-10" weight="regular" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <Heading className="m-0 text-[17px] leading-[1.3] font-medium text-ink sm:text-[19px]">{pick(service.title, locale)}</Heading>
        <p className="m-0 text-sm leading-relaxed text-muted">{pick(service.description, locale)}</p>
      </div>
    </article>
  );
}
