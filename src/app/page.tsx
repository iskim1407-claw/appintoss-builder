"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Palette, Smartphone, CreditCard, FileText, Eye, Save, Rocket, Moon, ClipboardList,
  Heading, Type, MousePointerClick, Image, Square, List, GalleryHorizontal, TextCursorInput,
  PanelBottom, Smartphone as SmartphoneIcon, Tag, BarChart3, Minus, Space, ToggleLeft,
  CheckSquare, CircleDot, PanelTop, ChevronsUpDown, Bell, MessageSquare, PanelRight,
  User, Bookmark, Grid3x3, Star, Navigation, Bone, SlidersHorizontal, ListOrdered,
  Table2, Timer, Video, Search, Zap, ChevronDown, ArrowRight, Check,
  Lock, FileCode, Target, Sparkles, DollarSign, ShoppingBag, Menu, X,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "드래그 앤 드롭",
    desc: "코드 한 줄 없이 컴포넌트를 끌어다 놓으면 끝. 개발자가 아니어도 10분 만에 앱을 만들 수 있어요.",
  },
  {
    icon: Smartphone,
    title: "토스 네이티브 스타일",
    desc: "토스 디자인 시스템을 따르는 33종 컴포넌트로 토스 앱처럼 자연스러운 UI를 구현합니다.",
  },
  {
    icon: CreditCard,
    title: "토스페이 연동",
    desc: "버튼 클릭 한 번으로 토스페이 결제를 붙일 수 있어요. 복잡한 결제 연동은 이제 잊으세요.",
  },
  {
    icon: FileText,
    title: "멀티페이지",
    desc: "여러 페이지로 구성된 앱을 손쉽게 만들 수 있어요. 페이지 간 네비게이션도 자동으로 연결됩니다.",
  },
  {
    icon: Eye,
    title: "실시간 미리보기",
    desc: "편집하면서 바로바로 결과를 확인하세요. 토스 앱 안에서 어떻게 보일지 실시간으로 미리볼 수 있어요.",
  },
  {
    icon: Save,
    title: "프로젝트 저장",
    desc: "작업 중인 프로젝트를 언제든 저장하고 이어서 편집하세요. 브라우저를 닫아도 안전합니다.",
  },
  {
    icon: Rocket,
    title: "원클릭 심사 제출",
    desc: "심사 자동 체크 + ZIP 다운로드 + 제출 가이드까지. 버튼 하나로 심사 준비 끝.",
  },
  {
    icon: Moon,
    title: "다크모드 지원",
    desc: "라이트/다크 모드 모두 지원하는 앱을 만들 수 있어요. 실시간 미리보기도 가능합니다.",
  },
  {
    icon: ClipboardList,
    title: "템플릿 제공",
    desc: "쇼핑몰, 예약, 이벤트 등 검증된 템플릿으로 5분 만에 시작하세요.",
  },
];

const components = [
  { name: "헤더", icon: Heading },
  { name: "텍스트", icon: Type },
  { name: "버튼", icon: MousePointerClick },
  { name: "이미지", icon: Image },
  { name: "카드", icon: Square },
  { name: "리스트", icon: List },
  { name: "캐러셀", icon: GalleryHorizontal },
  { name: "입력필드", icon: TextCursorInput },
  { name: "바텀시트", icon: PanelBottom },
  { name: "탭바", icon: SmartphoneIcon },
  { name: "뱃지", icon: Tag },
  { name: "진행바", icon: BarChart3 },
  { name: "구분선", icon: Minus },
  { name: "여백", icon: Space },
  { name: "토글", icon: ToggleLeft },
  { name: "체크박스", icon: CheckSquare },
  { name: "라디오", icon: CircleDot },
  { name: "셀렉트", icon: PanelTop },
  { name: "아코디언", icon: ChevronsUpDown },
  { name: "알림", icon: Bell },
  { name: "토스트", icon: MessageSquare },
  { name: "모달", icon: PanelRight },
  { name: "아바타", icon: User },
  { name: "칩", icon: Bookmark },
  { name: "그리드", icon: Grid3x3 },
  { name: "아이콘", icon: Star },
  { name: "네비게이션", icon: Navigation },
  { name: "스켈레톤", icon: Bone },
  { name: "슬라이더", icon: SlidersHorizontal },
  { name: "스텝퍼", icon: ListOrdered },
  { name: "테이블", icon: Table2 },
  { name: "타이머", icon: Timer },
  { name: "비디오", icon: Video },
];

const stepIcons = [ClipboardList, Target, SlidersHorizontal, Rocket] as const;

const steps = [
  { num: "1", title: "템플릿 선택", desc: "원하는 템플릿을 고르거나\n빈 캔버스에서 시작", iconIdx: 0 },
  { num: "2", title: "컴포넌트 배치", desc: "드래그앤드롭으로\n원하는 화면 구성", iconIdx: 1 },
  { num: "3", title: "스타일 편집", desc: "텍스트, 색상, 크기를\n클릭해서 자유롭게 조정", iconIdx: 2 },
  { num: "4", title: "심사 제출", desc: "자동 체크 후 ZIP 다운로드\n가이드 따라 제출하면 끝", iconIdx: 3 },
];

const plans = [
  {
    name: "무료",
    price: "₩0",
    period: "영구 무료",
    desc: "개인 프로젝트에 딱!",
    features: [
      "33종 컴포넌트 사용",
      "무제한 프로젝트",
      "ZIP 내보내기",
      "토스 bridge API 지원",
      "기본 템플릿 5종",
      "심사 자동 체크",
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
    a: "네! 앱인토스 빌더로 내보낸 ZIP 파일은 앱인토스 콘솔에 바로 업로드할 수 있습니다. 실제로 월급루팡 계산기, 소비 성향 테스트 등이 빌더로 만들어져 심사를 통과했어요.",
  },
  {
    q: "코딩을 전혀 몰라도 사용할 수 있나요?",
    a: "물론이죠! 앱인토스 빌더는 비개발자를 위해 만들어졌어요. 마우스로 드래그앤드롭만 하면 됩니다. 코드는 저희가 자동으로 생성해드려요.",
  },
  {
    q: "심사 제출은 어떻게 하나요?",
    a: "빌더에서 '심사 제출' 버튼을 누르면 자동으로 심사 항목을 체크하고, 통과하면 ZIP 파일을 다운로드할 수 있어요. 제출 가이드도 함께 제공되니 처음이어도 걱정 없어요!",
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
    a: "무료 플랜으로도 33종 컴포넌트와 모든 기능을 사용할 수 있어요. 프로 플랜은 프리미엄 템플릿, 커스텀 폰트 등 추가 기능을 제공합니다.",
  },
];

const testimonials = [
  {
    text: "개발자 없이 3일 만에 토스 미니앱을 런칭했어요. 믿기 힘들겠지만 사실입니다!",
    author: "김민수",
    role: "1인 쇼핑몰 운영자",
    initials: "김",
  },
  {
    text: "외주 맡기면 500만원, 앱인토스 빌더로 직접 만들면 0원. 선택은 뻔하죠.",
    author: "이지연",
    role: "스타트업 대표",
    initials: "이",
  },
  {
    text: "디자이너인데 개발 몰라서 항상 아이디어만 갖고 있었어요. 이제 직접 만들 수 있게 됐네요!",
    author: "박서준",
    role: "UI/UX 디자이너",
    initials: "박",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full glass z-50 border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] bg-clip-text text-transparent">앱인토스 빌더</span>
          {/* Desktop links */}
          <div className="hidden md:flex gap-5 items-center">
            <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium">
              템플릿
            </Link>
            <Link href="/security" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium flex items-center gap-1">
              <Lock size={13} /> 보안점검
            </Link>
            <Link href="/documents" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium flex items-center gap-1">
              <FileCode size={13} /> 문서
            </Link>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium">
              요금제
            </a>
            <a href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium">
              FAQ
            </a>
            <Link
              href="/editor"
              className="text-sm bg-[#3182F6] text-white px-4 py-2.5 min-h-[44px] flex items-center rounded-xl hover:bg-[#1B64DA] transition-smooth shadow-sm shadow-blue-200/40 active:scale-[0.98]"
            >
              에디터 열기
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl active:bg-gray-100 transition-smooth"
            aria-label="메뉴"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100/60 bg-white/95 backdrop-blur-md animate-fade-in-up">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              <Link href="/templates" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth">
                템플릿
              </Link>
              <Link href="/security" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth">
                <Lock size={16} /> 보안점검
              </Link>
              <Link href="/documents" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth">
                <FileCode size={16} /> 문서
              </Link>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth">
                요금제
              </a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50 transition-smooth">
                FAQ
              </a>
              <div className="pt-2 pb-1">
                <Link
                  href="/editor"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#3182F6] text-white px-4 py-3.5 min-h-[52px] rounded-xl text-sm font-semibold hover:bg-[#1B64DA] transition-smooth shadow-sm shadow-blue-200/40 active:scale-[0.98]"
                >
                  에디터 열기
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-14 md:pb-20 px-5 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#3182F6] text-sm font-medium px-4 py-1.5 rounded-full mb-5 md:mb-6">
            <Sparkles size={14} /> 3,000만 토스 유저에게 노출하세요
          </div>
          <h1 className="text-[1.65rem] sm:text-3xl md:text-6xl font-bold leading-tight mb-5 md:mb-6">
            코딩 없이{" "}
            <span className="text-[#3182F6]">토스 미니앱</span>
            <br className="hidden sm:block" />
            {" "}만들고, 심사까지
          </h1>
          <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-10 max-w-2xl mx-auto">
            드래그앤드롭으로 누구나 쉽게 앱인토스 미니앱을 만들 수 있습니다.
            <br className="hidden md:block" />
            <span className="font-medium text-gray-700">만들고 → 체크하고 → 제출까지 한 번에.</span>
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
            <Link
              href="/editor"
              className="group bg-[#3182F6] text-white px-6 md:px-8 py-4 min-h-[52px] rounded-2xl text-base md:text-lg font-semibold hover:bg-[#1B64DA] transition-smooth shadow-lg shadow-blue-200/50 active:scale-[0.98] flex items-center gap-2"
            >
              무료로 시작하기
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/submit"
              className="border border-gray-200 text-gray-700 px-6 md:px-8 py-4 min-h-[52px] rounded-2xl text-base md:text-lg font-semibold hover:bg-gray-50 transition-smooth flex items-center gap-2"
            >
              <ClipboardList size={18} /> <span className="hidden sm:inline">제출 가이드 보기</span><span className="sm:hidden">제출 가이드</span>
            </Link>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
            <span className="flex items-center gap-1"><Check size={13} /> 회원가입 없이 바로 시작</span>
            <span className="flex items-center gap-1"><Check size={13} /> 무료로 모든 기능 사용</span>
          </div>
        </div>
      </section>

      {/* Editor Preview */}
      <section className="hidden md:block pb-20 px-6">
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
                    <Lock size={10} /> appintoss-builder.com/editor
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
                        <c.icon size={18} strokeWidth={1.5} className="text-gray-500" />
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
                        <span className="text-gray-400">···</span>
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-bold mb-1">환영합니다!</div>
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
                      <div className="bg-gray-50 rounded-lg p-2 text-xs flex items-center gap-1"><CreditCard size={10} /> 토스페이 결제</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* One-Click Submit Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Zap size={14} /> 핵심 기능
            </div>
            <h2 className="text-3xl font-bold mb-4">원클릭 심사 제출</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              만들기만 하면 뭐해요? 심사까지 통과해야죠.<br />
              빌더가 심사 항목을 자동으로 체크하고, 제출 준비를 도와드려요.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4"><Search size={24} className="text-green-600" /></div>
              <h3 className="font-bold text-lg mb-2">자동 심사 체크</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                필수 항목 누락, 보안 이슈, 디자인 가이드라인 등을 자동으로 검사해서 심사 탈락을 미리 방지합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4"><FileCode size={24} className="text-green-600" /></div>
              <h3 className="font-bold text-lg mb-2">ZIP 다운로드</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                체크 통과 후 버튼 하나로 심사용 ZIP 파일을 다운로드. 앱인토스 콘솔에 바로 업로드할 수 있어요.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4"><FileText size={24} className="text-green-600" /></div>
              <h3 className="font-bold text-lg mb-2">제출 가이드</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                처음 제출하는 분도 걱정 없도록 단계별 가이드를 제공합니다. 스크린샷과 함께 따라하기만 하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Real Apps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">실제 토스에서 돌아가는 앱들</h2>
          <p className="text-gray-500 mb-12">앱인토스 빌더로 만들어서 심사를 통과한 진짜 앱들이에요</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><DollarSign size={24} className="text-[#3182F6]" /></div>
                <div>
                  <h3 className="font-bold">월급루팡 계산기</h3>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium"><Check size={10} /> 심사 통과</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">월급 대비 실제 근무 시간을 재미있게 계산해주는 미니앱</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><ShoppingBag size={24} className="text-purple-500" /></div>
                <div>
                  <h3 className="font-bold">소비 성향 테스트</h3>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium"><Check size={10} /> 심사 통과</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">나의 소비 패턴을 분석해주는 재미있는 성향 테스트 미니앱</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400">당신의 앱이 다음 성공 사례가 될 수 있어요</p>
        </div>
      </section>

      {/* Components Showcase */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">33종 컴포넌트로 무엇이든</h2>
          <p className="text-center text-gray-500 mb-10">토스 디자인 시스템을 따르는 컴포넌트로 자연스러운 앱을 만드세요</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {components.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-1.5 md:gap-2 bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3182F6] transition cursor-default"
              >
                <c.icon size={16} strokeWidth={1.5} className="text-gray-500 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">{c.name}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-[#3182F6]/30 hover-lift">
                <f.icon size={32} strokeWidth={1.5} className="text-[#3182F6] mb-4" />
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
            {steps.map((s) => {
              const StepIcon = stepIcons[s.iconIdx];
              return (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 bg-white/15 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <StepIcon size={28} />
                </div>
                <div className="text-blue-100 text-sm mb-1">Step {s.num}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-blue-100 whitespace-pre-line">{s.desc}</p>
              </div>
              );
            })}
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
              <div key={i} className="bg-gray-50/80 rounded-2xl p-6 hover-lift border border-gray-100/50">
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3182F6] to-[#6C5CE7] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.initials}
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
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/editor"
                  className={`block w-full py-3.5 min-h-[48px] flex items-center justify-center rounded-xl text-center font-semibold transition ${
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
                  className="w-full flex items-center justify-between p-4 md:p-5 min-h-[56px] text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
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
            만들고, 체크하고, 제출까지 — 한 번에 끝.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-2 bg-white text-[#3182F6] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-50 transition-smooth shadow-lg active:scale-[0.98]"
            >
              무료로 시작하기
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-smooth"
            >
              <ClipboardList size={18} /> 제출 가이드 보기
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-blue-100 text-sm">
            <span className="flex items-center gap-1"><Check size={13} /> 무료</span>
            <span className="flex items-center gap-1"><Check size={13} /> 회원가입 없음</span>
            <span className="flex items-center gap-1"><Check size={13} /> 즉시 시작</span>
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
              <Link href="/security" className="hover:text-gray-900">보안점검</Link>
              <Link href="/documents" className="hover:text-gray-900">문서</Link>
              <Link href="/submit" className="hover:text-gray-900">제출 가이드</Link>
              <a href="#pricing" className="hover:text-gray-900">요금제</a>
              <a href="#faq" className="hover:text-gray-900">FAQ</a>
              <Link href="/editor" className="hover:text-gray-900">에디터</Link>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              앱인토스 빌더로 만든 앱에는 &quot;Powered by 앱인토스 빌더&quot; 뱃지가 포함됩니다.
              <br />
              프로 플랜에서 워터마크를 제거할 수 있어요.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2024 앱인토스 빌더. 토스 미니앱을 쉽게 만드세요.
          </div>
        </div>
      </footer>
    </div>
  );
}
