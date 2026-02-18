import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미니앱 빌더 - 코딩 없이 미니앱 만들기",
  description: "노코드로 토스 미니앱을 만들어보세요. 드래그앤드롭으로 쉽게!",
  openGraph: {
    title: "미니앱 빌더 - 코딩 없이 미니앱 만들기",
    description: "노코드로 토스 미니앱을 만들어보세요. 드래그앤드롭으로 쉽게!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
