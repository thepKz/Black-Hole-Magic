'use client';

import { usePathname } from 'next/navigation';

/**
 * Last-resort error page for a crash in a ROOT layout (Next `global-error`).
 *
 * Main case: /admin when Payload cannot start (DATABASE_URI / PAYLOAD_SECRET
 * missing, database unreachable, migrations not applied). Payload's admin root
 * layout initialises Payload before rendering anything, so instead of the bare
 * "Internal Server Error" page editors get an explanation and what to check.
 * The public site does not depend on the CMS to render (news sections degrade),
 * so visitors should rarely see this page; they get a neutral message.
 *
 * Self-contained: global-error replaces the root layout, so no site CSS/fonts.
 * Never shows error details (production hides them anyway); `digest` matches
 * the server log line.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const pathname = usePathname() ?? '';
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 16,
          boxSizing: 'border-box',
          background: '#08060f',
          color: '#ece9f5',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          lineHeight: 1.6,
        }}
      >
        <title>{isAdmin ? 'CMS chưa sẵn sàng — Black Hole Admin' : 'Đã có lỗi xảy ra — Black Hole Game'}</title>
        <meta name="robots" content="noindex, nofollow" />
        <main style={{ maxWidth: 560, width: '100%' }}>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a79fc4' }}>
            {isAdmin ? 'Black Hole Admin' : 'Black Hole Game'}
          </p>
          <h1 style={{ margin: '8px 0 12px', fontSize: 26, lineHeight: 1.25 }}>
            {isAdmin ? 'Hệ thống quản trị tạm thời không khởi động được' : 'Trang tạm thời gặp sự cố'}
          </h1>
          {isAdmin ? (
            <>
              <p style={{ margin: '0 0 12px' }}>
                CMS không kết nối được cơ sở dữ liệu hoặc chưa được cấu hình. Trang web công khai vẫn hoạt động bình
                thường; chỉ khu vực biên tập bị ảnh hưởng.
              </p>
              <p style={{ margin: '0 0 12px', color: '#c9c3dd' }}>
                Người quản trị kỹ thuật cần kiểm tra: biến môi trường <code>DATABASE_URI</code> và{' '}
                <code>PAYLOAD_SECRET</code>, cơ sở dữ liệu còn chạy, và migration đã được áp dụng. Trạng thái nhanh:{' '}
                <code>/api/health</code>. Hướng dẫn: <code>docs/DEPLOY-ADMIN.md</code>.
              </p>
            </>
          ) : (
            <p style={{ margin: '0 0 12px' }}>
              Vui lòng thử lại sau ít phút. / Something went wrong, please try again shortly.
            </p>
          )}
          {error?.digest ? (
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#8d86a8' }}>Mã lỗi: {error.digest}</p>
          ) : null}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                font: 'inherit',
                padding: '10px 18px',
                borderRadius: 999,
                border: 0,
                background: '#7b5cff',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
            <a
              href={isAdmin ? '/admin' : '/'}
              style={{ padding: '10px 18px', borderRadius: 999, background: '#1d1830', color: '#ece9f5', textDecoration: 'none' }}
            >
              {isAdmin ? 'Tải lại trang quản trị' : 'Về trang chủ'}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
