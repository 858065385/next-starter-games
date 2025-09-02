import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/Providers";
import "./globals.css";

// 导出字体以便在子布局中使用
const geistSans = GeistSans;

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "PlayNow - Online Games Platform",
  description: "Play online games for free with multiplayer support and user authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZZ0N846B6L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZZ0N846B6L');
          `}
        </Script>
      </body>
    </html>
  );
}
