import { HOME_VERSION } from '@/config/home';

// Home 2 Components
import Header2 from '@/components/home-2/Header2';
import Footer2 from '@/components/home-2/Footer2';

// Home 7 Components
import Header7 from '@/components/home-7/Header7';
import Footer7 from '@/components/home-7/Footer7';

import Offcanvas from '@/components/common/Offcanvas';
import Preloader from '@/components/shared/Preloader';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render home-2 or home-7 layout based on config
  if (HOME_VERSION === 'home-7') {
    return (
      <>
        <Preloader />
        <Offcanvas variant="default" />
        <Header7 />
        {children}
        <Footer7 />
      </>
    );
  }

  return (
    <>
      <Preloader />
      <Offcanvas variant="style-2" />
      <Header2 />
      {children}
      <Footer2 />
    </>
  );
}
