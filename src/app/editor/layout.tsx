import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "앱인토스 에디터 - 드래그앤드롭으로 미니앱 제작",
  description:
    "33종 컴포넌트를 드래그앤드롭으로 배치하고 실시간 미리보기로 토스 미니앱을 완성하세요. 코딩 불필요.",
  alternates: { canonical: "/editor" },
  openGraph: {
    title: "앱인토스 에디터 - 드래그앤드롭으로 미니앱 제작",
    description: "33종 컴포넌트를 드래그앤드롭으로 배치하고 실시간 미리보기로 토스 미니앱을 완성하세요.",
    url: "/editor",
  },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
