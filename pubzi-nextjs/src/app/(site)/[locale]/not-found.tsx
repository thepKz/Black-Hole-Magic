import type { Metadata } from 'next';

import { Button } from '@site/components/ui/Button';
import { Container } from '@site/components/ui/Container';
import { defaultLocale, getDictionary, href } from '@site/i18n';

/**
 * 404 of the new site, rendered inside the [locale] root layout.
 * not-found.tsx receives no params, so it uses the default locale copy with an
 * English secondary line.
 */
export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const vi = getDictionary(defaultLocale);
  const en = getDictionary('en');
  return (
    <main id="main" tabIndex={-1} className="section-y flex flex-1 items-center outline-none">
      <Container className="flex flex-col items-center gap-4 text-center">
        <p className="m-0 bg-gradient-to-br from-accent to-cyan bg-clip-text text-[96px] leading-none font-semibold tracking-[-0.04em] text-transparent md:text-[128px]">
          404
        </p>
        <h1 className="m-0 text-2xl text-ink md:text-[32px]">{vi.notFoundTitle}</h1>
        <p className="m-0 max-w-md text-[15px] text-muted">{vi.notFoundDesc}</p>
        <p lang="en" className="m-0 text-sm text-subtle">
          {en.notFoundTitle}. {en.notFoundDesc}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button href={href(defaultLocale, '/')} variant="primary" size="lg">
            {vi.backHome}
          </Button>
          <Button href={href('en', '/')} variant="secondary" size="lg" lang="en">
            {en.backHome}
          </Button>
        </div>
      </Container>
    </main>
  );
}
