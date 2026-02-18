"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  X as XIcon,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
  Eye,
  Menu,
  X,
  Lock,
  FileCode,
  DollarSign,
} from "lucide-react";

const plans = [
  {
    name: "무료",
    price: "₩0",
    period: "영구 무료",
    desc: "에디터 체험 & 미리보기",
    icon: Eye,
    gradient: "from-gray-100 to-gray-50",
    borderColor: "border-gray-200",
    features: [
      { text: "드래그앤드롭 에디터", included: true },
      { text: "33종 컴포넌트", included: true },
      { text: "실시간 미리보기", included: true },
      { text: "프로젝트 저장", included: true },
      { text: "ZIP 내보내기", included: false },
      { text: "프리미엄 템플릿", included: false },
      { text: "AI 자동 채우기", included: false },
      { text: "우선 지원", included: false },
    ],
    cta: "무료로 시작하기",
    ctaStyle: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    popular: false,
  },
  {
    name: "스타터",
    price: "₩14,900",
    period: "/ 월",
    desc: "ZIP 내보내기 & 기본 템플릿",
    icon: Zap,
    gradient: "from-blue-100 to-indigo-50",
    borderColor: "border-[#3182F6]",
    features: [
      { text: "무료 플랜의 모든 기능", included: true },
      { text: "ZIP 내보내기 1회/월", included: true },
      { text: "기본 템플릿 10종", included: true },
      { text: "심사 자동 체크", included: true },
      { text: "이메일 지원", included: true },
      { text: "프리미엄 템플릿", included: false },
      { text: "AI 자동 채우기", included: false },
      { text: "우선 지원", included: false },
    ],
    cta: "스타터 시작하기",
    ctaStyle: "bg-[#3182F6] text-white hover:bg-[#1B64DA] shadow-lg shadow-blue-200/50",
    popular: true,
  },
  {
    name: "프로",
    price: "₩29,900",
    period: "/ 월",
    desc: "무제한 내보내기 & AI 기능",
    icon: Crown,
    gradient: "from-purple-100 to-pink-50",
    borderColor: "border-purple-300",
    features: [
      { text: "스타터 플랜의 모든 기능", included: true },
      { text: "ZIP 무제한 내보내기", included: true },
      { text: "프리미엄 템플릿 20종+", included: true },
      { text: "AI 자동 채우기", included: true },
      { text: "우선 지원", included: true },
      { text: "워터마크 제거", included: true },
      { text: "커스텀 폰트", included: true },
      { text: "전담 매니저", included: true },
    ],
    cta: "프로 시작하기",
    ctaStyle: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-200/50",
    popular: false,
  },
];

const comparisons = [
  { feature: "드래그앤드롭 에디터", free: true, starter: true, pro: true },
  { feature: "33종 컴포넌트", free: true, starter: true, pro: true },
  { feature: "실시간 미리보기", free: true, starter: true, pro: true },
  { feature: "프로젝트 저장", free: true, starter: true, pro: true },
  { feature: "ZIP 내보내기", free: false, starter: "1회/월", pro: "무제한" },
  { feature: "기본 템플릿", free: false, starter: true, pro: true },
  { feature: "프리미엄 템플릿", free: false, starter: false, pro: true },
  { feature: "AI 자동 채우기", free: false, starter: false, pro: true },
  { feature: "워터마크 제거", free: false, starter: false, pro: true },
  { feature: "커스텀 폰트", free: false, starter: false, pro: true },
  { feature: "우선 지원", free: false, starter: false, pro: true },
];

function showToast(msg: string) {
  const existing = document.querySelector("[data-pricing-toast]");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.setAttribute("data-pricing-toast", "");
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 glass-dark text-white px-5 py-3 rounded-2xl text-sm font-medium z-50 animate-fade-in-up shadow-xl";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export default function PricingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCTA = async (planName: string) => {
    if (planName === "무료") {
      window.location.href = "/editor";
      return;
    }

    const planKey = planName === "스타터" ? "starter" : "pro";
    setLoadingPlan(planName);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();

      if (data.error === "NOT_CONFIGURED") {
        showToast("🚧 결제 시스템 준비 중입니다. 곧 만나요!");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast("❌ 결제 페이지를 불러올 수 없습니다.");
      }
    } catch {
      showToast("❌ 네트워크 오류가 발생했습니다.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full glass z-50 border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] bg-clip-text text-transparent">
            미니앱 빌더
          </Link>
          <div className="hidden md:flex gap-5 items-center">
            <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium">템플릿</Link>
            <Link href="/security" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium flex items-center gap-1"><Lock size={13} /> 보안점검</Link>
            <Link href="/documents" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium flex items-center gap-1"><FileCode size={13} /> 문서</Link>
            <Link href="/pricing" className="text-sm text-[#3182F6] font-semibold transition-smooth">요금제</Link>
            <Link href="/editor" className="text-sm bg-[#3182F6] text-white px-4 py-2.5 min-h-[44px] flex items-center rounded-xl hover:bg-[#1B64DA] transition-smooth shadow-sm shadow-blue-200/40 active:scale-[0.98]">에디터 열기</Link>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl active:bg-gray-100 transition-smooth" aria-label="메뉴">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100/60 bg-white/95 backdrop-blur-md animate-fade-in-up">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              <Link href="/templates" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth">템플릿</Link>
              <Link href="/security" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth"><Lock size={16} /> 보안점검</Link>
              <Link href="/documents" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth"><FileCode size={16} /> 문서</Link>
              <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-semibold text-[#3182F6] active:bg-gray-50 transition-smooth"><DollarSign size={16} /> 요금제</Link>
              <div className="pt-2 pb-1">
                <Link href="/editor" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-[#3182F6] text-white px-4 py-3.5 min-h-[52px] rounded-xl text-sm font-semibold hover:bg-[#1B64DA] transition-smooth shadow-sm shadow-blue-200/40 active:scale-[0.98]">에디터 열기</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-10 md:pb-14 px-5 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#3182F6] text-sm font-medium px-4 py-1.5 rounded-full mb-5 md:mb-6">
            <Sparkles size={14} /> 심플한 요금제
          </div>
          <h1 className="text-[1.65rem] sm:text-3xl md:text-5xl font-bold leading-tight mb-4 md:mb-5">
            필요한 만큼만,{" "}
            <span className="bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] bg-clip-text text-transparent">합리적으로</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            무료로 에디터를 체험하고, 준비가 되면 업그레이드하세요.
            <br className="hidden md:block" />
            모든 플랜에 <span className="font-medium text-gray-700">7일 무료 체험</span>이 포함됩니다.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 md:pb-20 px-5 md:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 md:gap-6">
          {plans.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className={`relative bg-white rounded-3xl p-6 md:p-7 border-2 ${p.borderColor} ${
                  p.popular ? "shadow-2xl shadow-blue-100/60 scale-[1.02] md:scale-105" : "shadow-sm"
                } hover-lift transition-smooth`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    가장 인기 ✨
                  </div>
                )}

                {/* Icon + Name */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={p.popular ? "text-[#3182F6]" : p.name === "프로" ? "text-purple-500" : "text-gray-500"} />
                </div>

                <h3 className="font-bold text-xl mb-1">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{p.desc}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="text-gray-400 text-sm">{p.period}</span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleCTA(p.name)}
                  disabled={loadingPlan === p.name}
                  className={`w-full py-3.5 min-h-[48px] rounded-xl text-center font-semibold transition-smooth active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 ${p.ctaStyle}`}
                >
                  {loadingPlan === p.name ? "처리 중..." : p.cta}
                  {loadingPlan !== p.name && <ArrowRight size={16} />}
                </button>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-green-500" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <XIcon size={12} className="text-gray-300" />
                        </div>
                      )}
                      <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table (Desktop) */}
      <section className="hidden md:block pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">플랜 비교</h2>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500">기능</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold">무료</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#3182F6]">스타터</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-purple-500">프로</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3.5 px-6 text-sm text-gray-700">{row.feature}</td>
                    {[row.free, row.starter, row.pro].map((val, j) => (
                      <td key={j} className="text-center py-3.5 px-4">
                        {val === true ? (
                          <Check size={16} className="text-green-500 mx-auto" />
                        ) : val === false ? (
                          <XIcon size={16} className="text-gray-200 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-gray-700">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-5 md:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">요금제 관련 FAQ</h2>
          <p className="text-center text-gray-500 mb-10">궁금한 점이 있으시면 편하게 물어보세요</p>
          <div className="space-y-4">
            {[
              { q: "무료 플랜으로 뭘 할 수 있나요?", a: "에디터의 모든 컴포넌트를 사용하고 실시간 미리보기를 할 수 있어요. ZIP 내보내기만 유료 플랜에서 가능합니다." },
              { q: "스타터에서 프로로 업그레이드할 수 있나요?", a: "물론이죠! 언제든 업그레이드할 수 있고, 이미 결제한 기간은 일할 계산으로 반영됩니다." },
              { q: "환불 정책은 어떻게 되나요?", a: "결제 후 7일 이내에 요청하시면 전액 환불해드립니다. 이후에는 남은 기간 일할 계산으로 환불됩니다." },
              { q: "AI 자동 채우기가 뭔가요?", a: "앱 이름, 설명, 이미지 등을 AI가 자동으로 추천해주는 기능이에요. 프로 플랜에서 사용할 수 있습니다." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 md:p-5 min-h-[56px] cursor-pointer hover:bg-gray-50 transition-smooth font-medium">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-4 flex-shrink-0">▾</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-5 md:px-6 bg-gradient-to-br from-[#3182F6] to-[#1B64DA]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">무료로 시작하세요</h2>
          <p className="text-blue-100 mb-8 text-base md:text-lg">
            회원가입 없이 바로 에디터를 사용할 수 있어요.
            <br />
            준비가 되면 그때 업그레이드하세요.
          </p>
          <Link
            href="/editor"
            className="group inline-flex items-center gap-2 bg-white text-[#3182F6] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-50 transition-smooth shadow-lg active:scale-[0.98]"
          >
            에디터 열기
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Link href="/" className="text-lg font-bold text-[#3182F6]">미니앱 빌더</Link>
              <p className="text-sm text-gray-500 mt-1">미니앱을 쉽게 만드세요</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/templates" className="hover:text-gray-900">템플릿</Link>
              <Link href="/security" className="hover:text-gray-900">보안점검</Link>
              <Link href="/documents" className="hover:text-gray-900">문서</Link>
              <Link href="/pricing" className="text-[#3182F6] font-medium">요금제</Link>
              <Link href="/editor" className="hover:text-gray-900">에디터</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>© 2024 미니앱 빌더. 미니앱을 쉽게 만드세요.</p>
            <p className="mt-2 text-xs text-gray-300">본 서비스는 (주)비바리퍼블리카(토스)와 무관한 독립 서비스입니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
