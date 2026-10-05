import Header7 from '@/components/home-7/Header7';
import Footer7 from '@/components/home-7/Footer7';
import Offcanvas from '@/components/common/Offcanvas';
import './game-critical.css';

export default function GameLayout({
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
      <section className="gm-secret-section" aria-hidden="true" aria-label="Tầng bí mật Black Hole">
        <div className="gm-secret-inner">
          <div className="gm-secret-story">
            <p className="gm-secret-line gm-secret-line-main">Bạn đã đi qua đáy trang.</p>
            <p className="gm-secret-line">Ở đây, Black Hole giữ lại những tín hiệu chưa công bố.</p>
            <p className="gm-secret-line">Một cổng mới đang khóa thử nghiệm.</p>
            <p className="gm-secret-line gm-secret-line-code">Tên mã: Black Gate.</p>
          </div>
        </div>
      </section>
    </>
  );
}
