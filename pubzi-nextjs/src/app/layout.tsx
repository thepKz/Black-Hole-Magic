import type { Metadata } from "next";
import "./globals.css";
import Preloader from "@/components/shared/Preloader";
import BackToTop from "@/components/shared/BackToTop";
import MouseCursor from "@/components/shared/MouseCursor";
import ClientInit from "@/components/ClientInit";

export const metadata: Metadata = {
  title: "Pubzi - eSports and Gaming",
  description: "Pubzi - eSports and Gaming HTML Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/assets/img/favicon.svg" />
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
        <Preloader />
        <BackToTop />
        <MouseCursor />
        {children}
        <ClientInit />
      </body>
    </html>
  );
}
