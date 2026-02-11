"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "🎨",
    title: "드래그 앤 드롭",
    desc: "코드 한 줄 없이 컴포넌트를 끌어다 놓으면 끝. 개발자가 아니어도 10분 만에 앱을 만들 수 있어요.",
  },
  {
    icon: "📱",
    title: "토스 네이티브 스타일",
    desc: "토스 디자인 시스템을 따르는 14종 컴포넌트로 토스 앱처럼 자연스러운 UI를 구현합니다.",
  },
  {
    icon: "💳",
    title: "토스페이 연동",
    desc: "버튼 클릭 한 번으로 토스페이 결제를 붙일 수 있어요. 복잡한 결제 연동은 이제 잊으세요.",
  },
  {
    icon: "🚀",
    title: "즉시 배포",
    desc: "내보내기 버튼 하나로 앱인토스 콘솔에 업로드 가능한 ZIP 파일이 생성됩니다.",
  },
  {
    icon: "🌙",
    title: "다크모드 지원",
    desc: "라이트/다크 모드 모두 지원하는 앱을 만들 수 있어요. 실시간 미리보기도 가능합니다.",
  },
  {
    icon: "📋",
    title: "템플릿 제공",
    desc: "쇼핑몰, 예약, 이벤트 등 검증된 템플릿으로 5분 만에 시작하세요.",
  },
];

const components = [
  { name: "헤더", icon: "📝" },
  { name: "텍스트", icon: "✏️" },
  { name: "버튼", icon: "🔘" },
  { name: "이미지", icon: "🖼️" },
  { name: "카드", icon: "🃏" },
  { name: "리스트", icon: "📋" },
  { name: "캐러셀", icon: "🎠" },
  { name: "입력필드", icon: "⌨️" },
  { name: "바텀시트", icon: "📄" },
  { name: "탭바", icon: "📱" },
  { name: "뱃지", icon: "🔴" },
  { name: "진행바", icon: "📊" },
  { name: "구분선", icon: "➖" },
  { name: "여백", icon: "↕️" },
];

const steps = [
  { num: "1", title: "템플릿 선택", desc: "원하는 템플릿을 고르거나\n빈 캔버스에서 시작", icon: "📋" },
  { num: "2", title: "컴포넌트 배치", desc: "드래그앤드롭으로\n원하는 화면 구성", icon: "🎯" },
  { num: "3", title: "스타일 편집", desc: "텍스트, 색상, 크기를\n클릭해서 자유롭게 조정", icon: "✨" },
  { num: "4", title: "내보내기", desc: "ZIP 다운로드 후\n앱인토스에 업로드", icon: "🚀" },
];

const plans = [
  {
    name: "무료",
    price: "₩0",
    period: "영구 무료",
    desc: "개인 프로젝트에 딱!",
    features: [
      "모든 컴포넌트 사용",
      "무제한 프로젝트",
      "ZIP 내보내기",
      "토스 bridge API 지원",
      "기본 템플릿 5종",
    ],
    cta: "무료로 시작하기",
    popular: false,
  },
  {
    name: "프로",
    price: "₩9,900",
    period: "/ 월",
    desc: "성장하는 비즈니스를 위해",
    features: [
      "무료 플랜의 모든 기능",
      "프리미엄 템플릿 20종+",
      "커스텀 폰트 지원",
      "워터마크 제거",
      "우선 지원",
    ],
    cta: "프로 시작하기",
    popular: true,
  },
  {
    name: "비즈니스",
    price: "₩29,900",
    period: "/ 월",
    desc: "팀과 함께 협업하세요",
    features: [
      "프로 플랜의 모든 기능",
      "팀 협업 (5명)",
      "버전 히스토리",
      "화이트라벨 내보내기",
      "전담 매니저",
    ],
    cta: "문의하기",
    popular: false,
  },
];

const faqs = [
  {
    q: "앱인토스 빌더로 만든 앱은 정말 토스에 배포할 수 있나요?",
    a: "네! 앱인토스 빌더로 내보낸 ZIP 파일은 앱인토스 콘솔에 바로 업로드할 수 있습니다. 심사를 통과하면 3,000만 토스 사용자에게 앱이 노출됩니다.",
  },
  {
    q: "코딩을 전혀 몰라도 사용할 수 있나요?",
    a: "물론이죠! 앱인토스 빌더는 비개발자를 위해 만들어졌어요. 마우스로 드래그앤드롭만 하면 됩니다. 코드는 저희가 자동으로 생성해드려요.",
  },
  {
    q: "토스페이 결제 연동은 어떻게 하나요?",
    a: "버튼 컴포넌트를 추가하고, 설정에서 '액션'을 '토스페이 결제'로 선택한 뒤 금액을 입력하면 끝! 실제 결제는 앱인토스 콘솔에서 사업자 인증 후 활성화됩니다.",
  },
  {
    q: "만든 앱의 소유권은 누구에게 있나요?",
    a: "100% 여러분의 것입니다. 앱인토스 빌더는 도구일 뿐, 여러분이 만든 앱에 대한 모든 권리는 여러분에게 있습니다.",
  },
  {
    q: "무료 플랜에 제한이 있나요?",
    a: "무료 플랜으로도 모든 컴포넌트와 기능을 사용할 수 있어요. 프로 플랜은 프리미엄 템플릿, 커스텀 폰트 등 추가 기능을 제공합니다.",
  },
];

const testimonials = [
  {
    text: "개발자 없이 3일 만에 토스 미니앱을 런칭했어요. 믿기 힘들겠지만 사실입니다!",
    author: "김민수",
    role: "1인 쇼핑몰 운영자",
    avatar: "👨‍💼",
  },
  {
    text: "외주 맡기면 500만원, 앱인토스 빌더로 직접 만들면 0원. 선택은 뻔하죠.",
    author: "이지연",
    role: "스타트업 대표",
    avatar: "👩‍💻",
  },
  {
    text: "디자이너인데 개발 몰라서 항상 아이디어만 갖고 있었어요. 이제 직접 만들 수 있게 됐네요!",
    author: "박서준",
    role: "UI/UX 디자이너",
    avatar: "🎨",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#3182F6]">앱인토스 빌더</span>
          <div className="flex gap-4 items-center">
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900">
              템플릿
            </Link>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
              요금제
            </a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">
              FAQ
            </a>
            <Link
              href="/editor"
              className="text-sm bg-[#3182F6] text-white px-4 py-2 rounded-xl hover:bg-[#1B64DA] transition"
            >
              에디터 열기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-50 text-[#3182F6] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🎉 3,000만 토스 유저에게 노출하세요
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            코딩 없이
            <br />
            <span className="text-[#3182F6]">토스 미니앱</span> 만들기
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            드래그앤드롭으로 누구나 쉽게 앱인토스 미니앱을 만들 수 있습니다.
            <br />
            <span className="font-medium text-gray-700">개발자 없이도 아이디어를 현실로 만들어보세요.</span>
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/editor"
              className="bg-[#3182F6] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#1B64DA] transition shadow-lg shadow-blue-200"
            >
              무료로 시작하기 →
            </Link>
            <Link
              href="/templates"
              className="border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition"
            >
              템플릿 보기
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">✓ 회원가입 없이 바로 시작 ✓ 무료로 모든 기능 사용</p>
        </div>
      </section>

      {/* Editor Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-4 md:p-8 border border-gray-200 shadow-2xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gray-100 h-10 flex items-center px-4 gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-lg px-4 py-1 text-xs text-gray-500 flex items-center gap-2">
                    <span>🔒</span> appintoss-builder.com/editor
                  </div>
                </div>
              </div>
              
              {/* Editor Mock */}
              <div className="flex h-[400px]">
                {/* Component Panel */}
                <div className="w-48 border-r border-gray-100 p-4 bg-white">
                  <div className="text-xs font-bold text-gray-500 mb-3">컴포넌트</div>
                  <div className="grid grid-cols-2 gap-2">
                    {components.slice(0, 6).map((c) => (
                      <div key={c.name} className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 text-center">
                        <span className="text-lg">{c.icon}</span>
                        <span className="text-[10px] text-gray-600">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Canvas */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
                  <div className="bg-gray-800 rounded-[2rem] p-2 shadow-2xl">
                    <div className="bg-white rounded-[1.5rem] w-[200px] h-[300px] overflow-hidden">
                      <div className="h-6 flex items-center justify-between px-3 text-[8px]">
                        <span>9:41</span>
                        <span>📶 🔋</span>
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-bold mb-1">환영합니다! 👋</div>
                        <div className="text-[10px] text-gray-500 mb-3">오늘의 특가 상품을 확인하세요</div>
                        <div className="h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg mb-2" />
                        <div className="bg-[#3182F6] text-white text-[10px] text-center py-2 rounded-lg font-medium">
                          지금 구매하기
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Settings Panel */}
                <div className="w-48 border-l border-gray-100 p-4 bg-white">
                  <div className="text-xs font-bold text-gray-500 mb-3">버튼 설정</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-gray-400 mb-1">텍스트</div>
                      <div className="bg-gray-50 rounded-lg p-2 text-xs">지금 구매하기</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 mb-1">배경 색상</div>
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-lg bg-[#3182F6]" />
                        <span className="text-xs text-gray-600">#3182F6</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 mb-1">액션</div>
                      <div className="bg-gray-50 rounded-lg p-2 text-xs">💳 토스페이 결제</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">14종 컴포넌트로 무엇이든</h2>
          <p className="text-center text-gray-500 mb-10">토스 디자인 시스템을 따르는 컴포넌트로 자연스러운 앱을 만드세요</p>
          <div className="flex flex-wrap justify-center gap-3">
            {components.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3182F6] transition cursor-default"
              >
                <span className="text-lg">{c.icon}</span>
                <span className="text-sm font-medium text-gray-700">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">왜 앱인토스 빌더인가요?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            개발자 없이도 프로페셔널한 토스 미니앱을 만들 수 있는 이유
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#3182F6] hover:shadow-lg transition">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 bg-[#3182F6]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">4단계로 완성하세요</h2>
          <p className="text-center text-blue-100 mb-12">처음 해도 10분이면 충분해요</p>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {s.icon}
                </div>
                <div className="text-blue-100 text-sm mb-1">Step {s.num}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-blue-100 whitespace-pre-line">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">실제 사용자 후기</h2>
          <p className="text-center text-gray-500 mb-12">이미 많은 분들이 앱인토스 빌더로 미니앱을 만들고 있어요</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{t.author}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">심플한 요금제</h2>
          <p className="text-center text-gray-500 mb-12">무료로 시작하고, 필요할 때 업그레이드하세요</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`bg-white rounded-2xl p-6 border-2 ${
                  p.popular ? "border-[#3182F6] shadow-xl shadow-blue-100" : "border-gray-100"
                } relative`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3182F6] text-white text-xs font-medium px-3 py-1 rounded-full">
                    가장 인기
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-bold text-xl mb-2">{p.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{p.price}</span>
                    <span className="text-gray-500 text-sm">{p.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/editor"
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition ${
                    p.popular
                      ? "bg-[#3182F6] text-white hover:bg-[#1B64DA]"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">자주 묻는 질문</h2>
          <p className="text-center text-gray-500 mb-12">궁금한 점이 있으시면 편하게 물어보세요</p>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <span className={`text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3182F6] to-[#1B64DA]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-blue-100 mb-8 text-lg">
            3,000만 토스 유저에게 당신의 앱을 보여주세요.
            <br />
            회원가입 없이 바로 시작할 수 있어요.
          </p>
          <Link
            href="/editor"
            className="inline-block bg-white text-[#3182F6] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-50 transition shadow-lg"
          >
            무료로 시작하기 →
          </Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-blue-100 text-sm">
            <span>✓ 무료</span>
            <span>✓ 회원가입 없음</span>
            <span>✓ 즉시 시작</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-lg font-bold text-[#3182F6]">앱인토스 빌더</span>
              <p className="text-sm text-gray-500 mt-1">토스 미니앱을 쉽게 만드세요</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/templates" className="hover:text-gray-900">템플릿</Link>
              <a href="#pricing" className="hover:text-gray-900">요금제</a>
              <a href="#faq" className="hover:text-gray-900">FAQ</a>
              <Link href="/editor" className="hover:text-gray-900">에디터</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2024 앱인토스 빌더. 토스 미니앱을 쉽게 만드세요.
          </div>
        </div>
      </footer>
    </div>
  );
}
