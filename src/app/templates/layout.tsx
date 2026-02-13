import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "앱인토스 템플릿 - MBTI, 퀴즈, 쇼핑몰 17종",
  description:
    "MBTI 테스트, 퀴즈, 쇼핑몰 등 17종 무료 템플릿으로 토스 미니앱을 빠르게 시작하세요.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "앱인토스 템플릿 - MBTI, 퀴즈, 쇼핑몰 17종",
    description: "17종 무료 템플릿으로 토스 미니앱을 빠르게 시작하세요.",
    url: "/templates",
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
