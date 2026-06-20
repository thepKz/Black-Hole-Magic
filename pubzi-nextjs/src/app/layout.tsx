import type { Metadata } from "next";
import "./brand-colors.css";
import "./typography.css";
import "./globals.css";
import "./brand-overrides.css";
import "./force-brand-colors.css";
import "./glow-effects.css";
import "./gsap-animations.css";
import BackToTop from "@/components/shared/BackToTop";
import MouseCursor from "@/components/shared/MouseCursor";
import SmoothScroll from "@/components/shared/SmoothScroll";
import ScrollReset from "@/components/shared/ScrollReset";
import ClientInit from "@/components/ClientInit";

export const metadata: Metadata = {
  title: "Black Hole - eSports and Gaming",
  description: "Black Hole - eSports and Gaming Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="shortcut icon" href="/assets/img/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{history.scrollRestoration='manual'}catch(e){}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Chakra+Petch:wght@400;500;600;700&family=Montserrat:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/meanmenu.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/nice-select.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body>
        <SmoothScroll />
        <ScrollReset />
        <BackToTop />
        <MouseCursor />
        {children}
        <ClientInit />
      </body>
    </html>
  );
}
