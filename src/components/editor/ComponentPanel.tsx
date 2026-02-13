"use client";

import { useEditor } from "@craftjs/core";
import { track } from "@vercel/analytics";
import React, { useState, useCallback } from "react";
import {
  Navigation, MousePointerClick, Type, Tag, List, PanelTop, Smartphone,
  TextCursorInput, ToggleLeft, CheckSquare,
  BarChart3, MessageSquare, Bone, MessageCircle,
  ArrowDownToLine, PanelBottom,
  Heading, Image, Square, ListOrdered, Minus, Space, GalleryHorizontal, Inbox, Grid3x3,
  Wallet, Landmark, TrendingUp, Scale, Receipt,
  Target, HelpCircle, Trophy,
  Search,
  type LucideProps
} from "lucide-react";
// TDS Core Components
import { TextComponent } from "../user/TextComponent";
import { ButtonComponent } from "../user/ButtonComponent";
import { BadgeComponent } from "../user/BadgeComponent";
import { NavigationComponent } from "../user/NavigationComponent";
import { ListRowComponent } from "../user/ListRowComponent";
import { TabComponent } from "../user/TabComponent";
import { TabBarComponent } from "../user/TabBarComponent";
// TDS Form Components
import { TextFieldComponent } from "../user/TextFieldComponent";
import { SwitchComponent } from "../user/SwitchComponent";
import { CheckboxComponent } from "../user/CheckboxComponent";
// TDS Feedback Components
import { ProgressBarComponent } from "../user/ProgressBarComponent";
import { ToastComponent } from "../user/ToastComponent";
import { SkeletonComponent } from "../user/SkeletonComponent";
import { DialogComponent } from "../user/DialogComponent";
// TDS Layout Components
import { BottomCTAComponent } from "../user/BottomCTAComponent";
import { BottomSheetComponent } from "../user/BottomSheetComponent";
// Basic Components
import { ImageComponent } from "../user/ImageComponent";
import { CardComponent } from "../user/CardComponent";
import { ListComponent } from "../user/ListComponent";
import { DividerComponent } from "../user/DividerComponent";
import { HeaderComponent } from "../user/HeaderComponent";
import { InputComponent } from "../user/InputComponent";
import { CarouselComponent } from "../user/CarouselComponent";
import { SpacerComponent } from "../user/SpacerComponent";
import { GridComponent } from "../user/GridComponent";
// 핀테크 컴포넌트
import { PaymentComponent } from "../user/PaymentComponent";
import { AccountComponent } from "../user/AccountComponent";
import { CreditScoreComponent } from "../user/CreditScoreComponent";
import { ProductCompareComponent } from "../user/ProductCompareComponent";
import { TransactionListComponent } from "../user/TransactionListComponent";
// 퀴즈/테스트 컴포넌트
import { QuizIntroComponent } from "../user/QuizIntroComponent";
import { QuizQuestionComponent } from "../user/QuizQuestionComponent";
import { QuizResultComponent } from "../user/QuizResultComponent";

// Extended component type with craft config
interface CraftComponent<P = Record<string, unknown>> extends React.FC<P> {
  craft?: {
    props?: Record<string, unknown>;
    displayName?: string;
    related?: {
      settings?: React.ComponentType;
    };
    rules?: Record<string, unknown>;
  };
}

interface ComponentInfo {
  name: string;
  icon: React.FC<LucideProps>;
  component: CraftComponent;
  category: string;
  defaultProps: Record<string, unknown>;
  tds?: boolean;
}

const components: ComponentInfo[] = [
  // === TDS 핵심 컴포넌트 ===
  { name: "네비게이션", icon: Navigation, component: NavigationComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "버튼", icon: MousePointerClick, component: ButtonComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "텍스트", icon: Type, component: TextComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "뱃지", icon: Tag, component: BadgeComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "리스트 항목", icon: List, component: ListRowComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "탭", icon: PanelTop, component: TabComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "탭바", icon: Smartphone, component: TabBarComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  
  // === TDS 입력 ===
  { name: "입력 필드", icon: TextCursorInput, component: TextFieldComponent, category: "TDS 입력", defaultProps: {}, tds: true },
  { name: "스위치", icon: ToggleLeft, component: SwitchComponent, category: "TDS 입력", defaultProps: {}, tds: true },
  { name: "체크박스", icon: CheckSquare, component: CheckboxComponent, category: "TDS 입력", defaultProps: {}, tds: true },
  
  // === TDS 피드백 ===
  { name: "진행바", icon: BarChart3, component: ProgressBarComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  { name: "토스트", icon: MessageSquare, component: ToastComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  { name: "스켈레톤", icon: Bone, component: SkeletonComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  { name: "다이얼로그", icon: MessageCircle, component: DialogComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  
  // === TDS 레이아웃 ===
  { name: "하단 CTA", icon: ArrowDownToLine, component: BottomCTAComponent, category: "TDS 레이아웃", defaultProps: {}, tds: true },
  { name: "바텀시트", icon: PanelBottom, component: BottomSheetComponent, category: "TDS 레이아웃", defaultProps: {}, tds: true },
  
  // === 기본 ===
  { name: "헤더", icon: Heading, component: HeaderComponent, category: "기본", defaultProps: { text: "헤더 텍스트", level: "h2" } },
  { name: "이미지", icon: Image, component: ImageComponent, category: "기본", defaultProps: {} },
  { name: "카드", icon: Square, component: CardComponent, category: "기본", defaultProps: {} },
  { name: "리스트", icon: ListOrdered, component: ListComponent, category: "기본", defaultProps: {} },
  { name: "구분선", icon: Minus, component: DividerComponent, category: "기본", defaultProps: {} },
  { name: "여백", icon: Space, component: SpacerComponent, category: "기본", defaultProps: {} },
  { name: "캐러셀", icon: GalleryHorizontal, component: CarouselComponent, category: "기본", defaultProps: {} },
  { name: "입력 (기본)", icon: Inbox, component: InputComponent, category: "기본", defaultProps: {} },
  { name: "그리드", icon: Grid3x3, component: GridComponent, category: "기본", defaultProps: {} },
  
  // === 핀테크 ===
  { name: "결제/송금", icon: Wallet, component: PaymentComponent, category: "핀테크", defaultProps: {} },
  { name: "계좌 연결", icon: Landmark, component: AccountComponent, category: "핀테크", defaultProps: {} },
  { name: "신용점수", icon: TrendingUp, component: CreditScoreComponent, category: "핀테크", defaultProps: {} },
  { name: "상품 비교", icon: Scale, component: ProductCompareComponent, category: "핀테크", defaultProps: {} },
  { name: "거래내역", icon: Receipt, component: TransactionListComponent, category: "핀테크", defaultProps: {} },
  
  // === 퀴즈/테스트 ===
  { name: "퀴즈 인트로", icon: Target, component: QuizIntroComponent, category: "퀴즈/테스트", defaultProps: {} },
  { name: "퀴즈 질문", icon: HelpCircle, component: QuizQuestionComponent, category: "퀴즈/테스트", defaultProps: {} },
  { name: "퀴즈 결과", icon: Trophy, component: QuizResultComponent, category: "퀴즈/테스트", defaultProps: {} },
];

const categories = ["전체", "TDS 핵심", "TDS 입력", "TDS 피드백", "TDS 레이아웃", "기본", "핀테크", "퀴즈/테스트"];

// 한글 초성 검색 유틸
const CHOSUNG_LIST = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

function getChosung(str: string): string {
  return Array.from(str).map((ch) => {
    const code = ch.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return ch;
    return CHOSUNG_LIST[Math.floor(code / 588)];
  }).join("");
}

function isChosungOnly(str: string): boolean {
  return Array.from(str).every((ch) => CHOSUNG_LIST.includes(ch));
}

function matchesKoreanSearch(name: string, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (name.toLowerCase().includes(q)) return true;
  if (isChosungOnly(q)) {
    const chosung = getChosung(name);
    return chosung.includes(q);
  }
  return false;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) {
    if (isChosungOnly(q)) {
      const chosung = getChosung(text);
      const cIdx = chosung.indexOf(q);
      if (cIdx !== -1) {
        return (
          <>
            {text.slice(0, cIdx)}
            <span className="text-[#3182F6] font-bold">{text.slice(cIdx, cIdx + q.length)}</span>
            {text.slice(cIdx + q.length)}
          </>
        );
      }
    }
    return <>{text}</>;
  }
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[#3182F6] font-bold">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

interface ComponentPanelProps {
  isMobile?: boolean;
  onComponentAdded?: () => void;
}

export const ComponentPanel = ({ isMobile = false, onComponentAdded }: ComponentPanelProps) => {
  const { connectors, actions, query } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = components.filter((c) => {
    const matchesCategory = selectedCategory === "전체" || c.category === selectedCategory;
    const matchesSearch = matchesKoreanSearch(c.name, searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleAddComponent = useCallback((componentInfo: ComponentInfo) => {
    try {
      const Component = componentInfo.component;
      const craftConfig = Component.craft || {};
      const defaultProps = craftConfig.props || componentInfo.defaultProps || {};
      
      const nodeTree = query.parseReactElement(
        <Component {...defaultProps} />
      ).toNodeTree();
      
      actions.addNodeTree(nodeTree, "ROOT");
      
      const toast = document.createElement("div");
      toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 glass-dark text-white px-4 py-2.5 rounded-2xl text-sm font-medium z-50 animate-fade-in-up flex items-center gap-2";
      toast.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${componentInfo.name} 추가됨`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1500);
      
      track("component_added", { component: componentInfo.name, category: componentInfo.category });
      if (onComponentAdded) onComponentAdded();
    } catch (e) {
      console.error("Failed to add component:", e);
    }
  }, [actions, query, onComponentAdded]);

  // Grouped by category for list view
  const groupedComponents = categories.slice(1).reduce((acc, cat) => {
    const items = filteredComponents.filter(c => c.category === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, [] as { category: string; items: ComponentInfo[] }[]);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100/80">
          <h2 className="text-lg font-bold text-gray-900 mb-3">컴포넌트</h2>
          
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="컴포넌트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20 focus:bg-white transition-smooth"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 min-h-[44px] text-sm rounded-full whitespace-nowrap transition-smooth font-medium ${
                  selectedCategory === cat 
                    ? "bg-[#3182F6] text-white shadow-sm shadow-blue-200/50" 
                    : "bg-gray-100 text-gray-500 active:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredComponents.map((c) => (
              <button
                key={c.name}
                onClick={() => handleAddComponent(c)}
                className={`group flex items-center gap-3 p-4 min-h-[56px] rounded-2xl border active:scale-[0.97] transition-smooth text-left ${
                  c.tds 
                    ? "border-blue-100/60 bg-blue-50/20 active:bg-blue-50" 
                    : "border-gray-100/60 bg-white active:bg-gray-50"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-smooth ${
                  c.tds ? "bg-blue-50 group-active:bg-blue-100" : "bg-gray-50 group-active:bg-gray-100"
                }`}>
                  <c.icon size={22} strokeWidth={1.5} className={`transition-smooth ${
                    c.tds ? "text-[#3182F6]" : "text-gray-500"
                  }`} />
                </div>
                <span className="text-sm text-gray-700 font-medium leading-tight">
                  <HighlightText text={c.name} query={searchQuery} />
                </span>
              </button>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-12">
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              검색 결과가 없습니다
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-100/80 bg-gray-50/50">
          <p className="text-xs text-gray-400 text-center font-medium">탭하면 캔버스에 추가됩니다</p>
        </div>
      </div>
    );
  }

  // Desktop layout — list style grouped by category
  return (
    <div className="w-64 h-full bg-white/80 backdrop-blur-sm border-r border-gray-100/80 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-100/80">
        <div className="relative mb-2.5">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50/80 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20 focus:bg-white transition-smooth"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-[11px] rounded-lg transition-smooth font-medium ${
                selectedCategory === cat 
                  ? "bg-[#3182F6] text-white shadow-sm shadow-blue-200/40" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedCategory === "전체" ? (
          // Grouped view
          groupedComponents.map(({ category, items }) => (
            <div key={category}>
              <div className="px-3 pt-3 pb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{category}</span>
              </div>
              <div className="px-2 pb-1">
                {items.map((c) => {
                  const Component = c.component;
                  const craftConfig = Component.craft || {};
                  const defaultProps = craftConfig.props || c.defaultProps || {};
                  
                  return (
                    <div
                      key={c.name}
                      ref={(ref) => { 
                        if (ref) connectors.create(ref, <Component {...defaultProps} />);
                      }}
                      onClick={() => handleAddComponent(c)}
                      className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-grab hover:bg-gray-50/80 active:scale-[0.98] transition-smooth"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-smooth ${
                        c.tds 
                          ? "bg-blue-50/80 group-hover:bg-blue-100/60" 
                          : "bg-gray-50 group-hover:bg-gray-100/60"
                      }`}>
                        <c.icon size={16} strokeWidth={1.5} className={`transition-smooth ${
                          c.tds ? "text-[#3182F6]" : "text-gray-500 group-hover:text-gray-700"
                        }`} />
                      </div>
                      <span className="text-[13px] text-gray-700 font-medium flex-1 truncate">
                        <HighlightText text={c.name} query={searchQuery} />
                      </span>
                      {c.tds && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-[#3182F6] rounded-md font-semibold flex-shrink-0">
                          TDS
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          // Flat filtered view
          <div className="p-2">
            {filteredComponents.map((c) => {
              const Component = c.component;
              const craftConfig = Component.craft || {};
              const defaultProps = craftConfig.props || c.defaultProps || {};
              
              return (
                <div
                  key={c.name}
                  ref={(ref) => { 
                    if (ref) connectors.create(ref, <Component {...defaultProps} />);
                  }}
                  onClick={() => handleAddComponent(c)}
                  className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-grab hover:bg-gray-50/80 active:scale-[0.98] transition-smooth"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-smooth ${
                    c.tds 
                      ? "bg-blue-50/80 group-hover:bg-blue-100/60" 
                      : "bg-gray-50 group-hover:bg-gray-100/60"
                  }`}>
                    <c.icon size={16} strokeWidth={1.5} className={`transition-smooth ${
                      c.tds ? "text-[#3182F6]" : "text-gray-500 group-hover:text-gray-700"
                    }`} />
                  </div>
                  <span className="text-[13px] text-gray-700 font-medium flex-1 truncate">
                    <HighlightText text={c.name} query={searchQuery} />
                  </span>
                  {c.tds && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-[#3182F6] rounded-md font-semibold flex-shrink-0">
                      TDS
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {filteredComponents.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-12">
            <Search size={24} className="mx-auto mb-2 text-gray-300" />
            검색 결과가 없습니다
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100/60">
        <p className="text-[11px] text-gray-400 font-medium">
          드래그 또는 클릭으로 추가
        </p>
      </div>
    </div>
  );
};
