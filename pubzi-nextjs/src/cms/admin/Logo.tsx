/**
 * /admin login-screen logo (Payload `admin.components.graphics.Logo`).
 * Server component, plain <img> (no next/image: the admin has its own root layout).
 * Styles: .bh-admin-logo* in src/app/(payload)/custom.scss.
 */
export function Logo() {
  return (
    <span className="bh-admin-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/site/brand/logo-mark.png" alt="" width={79} height={51} className="bh-admin-logo__mark" />
      <span className="bh-admin-logo__text">
        <span className="bh-admin-logo__name">Black Hole</span>
        <span className="bh-admin-logo__sub">Admin</span>
      </span>
    </span>
  );
}

export default Logo;
