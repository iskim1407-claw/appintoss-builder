import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "미니앱 빌더로 만든 앱",
  description: "코딩 없이 토스 미니앱을 만들어보세요",
  openGraph: {
    title: "미니앱 빌더로 만든 앱",
    description: "코딩 없이 토스 미니앱을 만들어보세요",
    siteName: "미니앱 빌더",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "미니앱 빌더로 만든 앱",
    description: "코딩 없이 토스 미니앱을 만들어보세요",
  },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
