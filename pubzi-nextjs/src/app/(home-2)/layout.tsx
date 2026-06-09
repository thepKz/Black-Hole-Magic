import Header2 from '@/components/home-2/Header2';
import Footer2 from '@/components/home-2/Footer2';
import Offcanvas from '@/components/common/Offcanvas';

export default function Home2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Offcanvas variant="style-2" />
      <Header2 />
      {children}
      <Footer2 />
    </>
  );
}
