import Header7 from '@/components/home-7/Header7';
import Footer7 from '@/components/home-7/Footer7';
import Offcanvas from '@/components/common/Offcanvas';

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Offcanvas variant="default" />
      <Header7 />
      {children}
      <Footer7 />
    </>
  );
}
