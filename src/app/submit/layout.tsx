import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "앱인토스 심사 제출 - 자동 체크 + 가이드",
  description:
    "토스 미니앱 심사 기준을 자동 검증하고, 제출 패키지를 원클릭으로 다운로드. 심사 통과율을 높이세요.",
  alternates: { canonical: "/submit" },
  openGraph: {
    title: "앱인토스 심사 제출 - 자동 체크 + 가이드",
    description: "토스 미니앱 심사 기준을 자동 검증하고, 제출 패키지를 원클릭으로 다운로드.",
    url: "/submit",
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
