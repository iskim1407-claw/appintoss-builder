"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { templates } from "@/lib/templates";

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (data: string) => {
    sessionStorage.setItem("appintoss-template", data);
    router.push("/editor");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#3182F6]">앱인토스 빌더</Link>
          <Link href="/editor" className="text-sm bg-[#3182F6] text-white px-4 py-2 rounded-xl hover:bg-[#1B64DA] transition">
            에디터 열기
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">템플릿 갤러리</h1>
          <p className="text-gray-500">원하는 템플릿을 선택하면 바로 에디터에서 편집할 수 있습니다.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
              <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition">{t.icon}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.category}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{t.description}</p>
                <button
                  onClick={() => handleUseTemplate(t.data)}
                  className="w-full bg-[#3182F6] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1B64DA] transition"
                >
                  이 템플릿 사용하기
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/editor" className="text-[#3182F6] font-medium hover:underline">
            또는 빈 캔버스에서 시작하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
