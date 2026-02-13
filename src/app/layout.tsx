import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "앱인토스 빌더 - 코딩 없이 토스 미니앱 만들기",
  description: "비개발자도 드래그앤드롭으로 토스 미니앱을 만들 수 있는 노코드 빌더",
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
