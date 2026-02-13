"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  generatePrivacyPolicy,
  generateTermsOfService,
  markdownToHtml,
  PERSONAL_DATA_OPTIONS,
  RETENTION_OPTIONS,
  DocumentInput,
} from "@/lib/docs/templates";

type DocumentType = "privacy" | "terms";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocumentType>("privacy");
  const [showPreview, setShowPreview] = useState(false);
  
  // 폼 상태
  const [formData, setFormData] = useState<DocumentInput>({
    appName: "",
    companyName: "",
    businessNumber: "",
    representativeName: "",
    email: "",
    phone: "",
    address: "",
    serviceDescription: "",
    collectedData: [],
    retentionPeriod: "회원 탈퇴 시까지",
    thirdPartyProvision: false,
    thirdPartyDetails: "",
  });

  // 문서 생성
  const generatedDocument = useMemo(() => {
    if (activeTab === "privacy") {
      return generatePrivacyPolicy(formData);
    }
    return generateTermsOfService(formData);
  }, [formData, activeTab]);

  const documentHtml = useMemo(() => {
    return markdownToHtml(generatedDocument);
  }, [generatedDocument]);

  // 체크박스 토글
  const toggleDataItem = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      collectedData: prev.collectedData.includes(item)
        ? prev.collectedData.filter((d) => d !== item)
        : [...prev.collectedData, item],
    }));
  };

  // 클립보드 복사
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedDocument);
    alert("클립보드에 복사되었습니다!");
  };

  // 다운로드
  const downloadDocument = () => {
    const fileName = activeTab === "privacy" 
      ? `${formData.appName || "앱"}_개인정보처리방침.md`
      : `${formData.appName || "앱"}_이용약관.md`;
    
    const blob = new Blob([generatedDocument], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 필수 입력값 체크
  const isFormValid = 
    formData.appName.trim() !== "" &&
    formData.companyName.trim() !== "" &&
    formData.representativeName.trim() !== "" &&
    formData.email.trim() !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#3182F6]">
            앱인토스 빌더
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900">
              템플릿
            </Link>
            <Link href="/documents" className="text-sm text-[#3182F6] font-medium">
              문서
            </Link>
            <Link
              href="/editor"
              className="text-sm bg-[#3182F6] text-white px-4 py-2 rounded-xl hover:bg-[#1B64DA] transition"
            >
              에디터 열기
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">심사용 문서 생성기</h1>
            <p className="text-gray-500">
              토스 미니앱 심사에 필요한 개인정보처리방침과 이용약관을 자동으로 생성합니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 왼쪽: 입력 폼 */}
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">🏢</span> 기본 정보
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      앱 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.appName}
                      onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                      placeholder="예: 동네마켓"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업자명 (회사명) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="예: 주식회사 동네마켓"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        사업자등록번호
                      </label>
                      <input
                        type="text"
                        value={formData.businessNumber}
                        onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                        placeholder="000-00-00000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        대표자명 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.representativeName}
                        onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                        placeholder="홍길동"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="02-0000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업장 주소
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="서울특별시 강남구..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서비스 설명
                    </label>
                    <textarea
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      placeholder="서비스가 어떤 기능을 제공하는지 간단히 설명해주세요."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 개인정보 수집 항목 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">🔐</span> 수집하는 개인정보
                </h2>
                <div className="space-y-4">
                  {["필수", "선택", "결제", "서비스", "자동수집"].map((category) => {
                    const items = PERSONAL_DATA_OPTIONS.filter((o) => o.category === category);
                    if (items.length === 0) return null;
                    return (
                      <div key={category}>
                        <div className="text-sm font-medium text-gray-500 mb-2">{category}</div>
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleDataItem(item.label)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                formData.collectedData.includes(item.label)
                                  ? "bg-[#3182F6] text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {formData.collectedData.includes(item.label) ? "✓ " : ""}
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 보관 기간 및 제3자 제공 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">⏱️</span> 보관 및 제공
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      개인정보 보관 기간
                    </label>
                    <select
                      value={formData.retentionPeriod}
                      onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                    >
                      {RETENTION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.thirdPartyProvision}
                        onChange={(e) =>
                          setFormData({ ...formData, thirdPartyProvision: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-[#3182F6] focus:ring-[#3182F6]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        개인정보를 제3자에게 제공함
                      </span>
                    </label>
                    {formData.thirdPartyProvision && (
                      <textarea
                        value={formData.thirdPartyDetails}
                        onChange={(e) =>
                          setFormData({ ...formData, thirdPartyDetails: e.target.value })
                        }
                        placeholder="제3자 제공 상세 내용을 입력하세요.&#10;예: 배송업체에 주소/연락처 제공"
                        rows={3}
                        className="mt-3 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3182F6] focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 미리보기 */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* 탭 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                    activeTab === "privacy"
                      ? "bg-[#3182F6] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  개인정보처리방침
                </button>
                <button
                  onClick={() => setActiveTab("terms")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                    activeTab === "terms"
                      ? "bg-[#3182F6] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  이용약관
                </button>
              </div>

              {/* 미리보기 토글 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    !showPreview
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  마크다운
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    showPreview
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  미리보기
                </button>
              </div>

              {/* 문서 내용 */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-[500px] overflow-y-auto p-6">
                  {showPreview ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: documentHtml }}
                      className="text-sm"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {generatedDocument}
                    </pre>
                  )}
                </div>
              </div>

              {/* 버튼들 */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={copyToClipboard}
                  disabled={!isFormValid}
                  className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  복사하기
                </button>
                <button
                  onClick={downloadDocument}
                  disabled={!isFormValid}
                  className="flex-1 py-3 px-4 bg-[#3182F6] text-white rounded-xl font-medium hover:bg-[#1B64DA] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⬇️ 다운로드
                </button>
              </div>
              
              {!isFormValid && (
                <p className="text-sm text-orange-500 text-center mt-3">
                  * 필수 항목을 모두 입력해주세요
                </p>
              )}

              {/* 안내 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-medium text-[#3182F6] mb-2">사용 안내</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 생성된 문서는 마크다운(.md) 형식입니다</li>
                  <li>• 토스 미니앱 설정 페이지에 붙여넣기 하세요</li>
                  <li>• 법적 효력을 위해 전문가 검토를 권장합니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          © 2024 앱인토스 빌더. 토스 미니앱을 쉽게 만드세요.
        </div>
      </footer>
    </div>
  );
}
