import Header7 from '@/components/home-7/Header7';
import Footer7 from '@/components/home-7/Footer7';
import Offcanvas from '@/components/common/Offcanvas';
import Preloader from '@/components/shared/Preloader';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
