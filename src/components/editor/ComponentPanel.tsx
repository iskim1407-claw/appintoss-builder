"use client";

import { useEditor } from "@craftjs/core";
import React, { useState, useCallback } from "react";
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
// 핀테크 컴포넌트
import { PaymentComponent } from "../user/PaymentComponent";
import { AccountComponent } from "../user/AccountComponent";
import { CreditScoreComponent } from "../user/CreditScoreComponent";
import { ProductCompareComponent } from "../user/ProductCompareComponent";
import { TransactionListComponent } from "../user/TransactionListComponent";

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
  icon: string;
  component: CraftComponent;
  category: string;
  defaultProps: Record<string, unknown>;
  tds?: boolean; // TDS component flag
}

const components: ComponentInfo[] = [
  // === TDS 핵심 컴포넌트 ===
  { name: "네비게이션", icon: "🧭", component: NavigationComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "버튼", icon: "🔘", component: ButtonComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "텍스트", icon: "✏️", component: TextComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "뱃지", icon: "🏷️", component: BadgeComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "리스트 항목", icon: "📋", component: ListRowComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "탭", icon: "📑", component: TabComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  { name: "탭바", icon: "📱", component: TabBarComponent, category: "TDS 핵심", defaultProps: {}, tds: true },
  
  // === TDS 입력 ===
  { name: "입력 필드", icon: "⌨️", component: TextFieldComponent, category: "TDS 입력", defaultProps: {}, tds: true },
  { name: "스위치", icon: "🔀", component: SwitchComponent, category: "TDS 입력", defaultProps: {}, tds: true },
  { name: "체크박스", icon: "☑️", component: CheckboxComponent, category: "TDS 입력", defaultProps: {}, tds: true },
  
  // === TDS 피드백 ===
  { name: "진행바", icon: "📊", component: ProgressBarComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  { name: "토스트", icon: "💬", component: ToastComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  { name: "스켈레톤", icon: "💀", component: SkeletonComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  { name: "다이얼로그", icon: "🗨️", component: DialogComponent, category: "TDS 피드백", defaultProps: {}, tds: true },
  
  // === TDS 레이아웃 ===
  { name: "하단 CTA", icon: "⬇️", component: BottomCTAComponent, category: "TDS 레이아웃", defaultProps: {}, tds: true },
  { name: "바텀시트", icon: "📄", component: BottomSheetComponent, category: "TDS 레이아웃", defaultProps: {}, tds: true },
  
  // === 기본 ===
  { name: "헤더", icon: "📝", component: HeaderComponent, category: "기본", defaultProps: { text: "헤더 텍스트", level: "h2" } },
  { name: "이미지", icon: "🖼️", component: ImageComponent, category: "기본", defaultProps: {} },
  { name: "카드", icon: "🃏", component: CardComponent, category: "기본", defaultProps: {} },
  { name: "리스트", icon: "📃", component: ListComponent, category: "기본", defaultProps: {} },
  { name: "구분선", icon: "➖", component: DividerComponent, category: "기본", defaultProps: {} },
  { name: "여백", icon: "↕️", component: SpacerComponent, category: "기본", defaultProps: {} },
  { name: "캐러셀", icon: "🎠", component: CarouselComponent, category: "기본", defaultProps: {} },
  { name: "입력 (기본)", icon: "📥", component: InputComponent, category: "기본", defaultProps: {} },
  
  // === 핀테크 ===
  { name: "결제/송금", icon: "💳", component: PaymentComponent, category: "핀테크", defaultProps: {} },
  { name: "계좌 연결", icon: "🏦", component: AccountComponent, category: "핀테크", defaultProps: {} },
  { name: "신용점수", icon: "📈", component: CreditScoreComponent, category: "핀테크", defaultProps: {} },
  { name: "상품 비교", icon: "⚖️", component: ProductCompareComponent, category: "핀테크", defaultProps: {} },
  { name: "거래내역", icon: "📑", component: TransactionListComponent, category: "핀테크", defaultProps: {} },
];

const categories = ["전체", "TDS 핵심", "TDS 입력", "TDS 피드백", "TDS 레이아웃", "기본", "핀테크"];

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
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Click to add component (for mobile)
  const handleAddComponent = useCallback((componentInfo: ComponentInfo) => {
    try {
      const Component = componentInfo.component;
      const craftConfig = Component.craft || {};
      const defaultProps = craftConfig.props || componentInfo.defaultProps || {};
      
      // Create a node tree for the component
      const nodeTree = query.parseReactElement(
        <Component {...defaultProps} />
      ).toNodeTree();
      
      // Add to ROOT canvas
      actions.addNodeTree(nodeTree, "ROOT");
      
      // Show success toast
      const toast = document.createElement("div");
      toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium z-50";
      toast.textContent = `✓ ${componentInfo.name} 추가됨`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1500);
      
      // Auto-switch to canvas on mobile
      if (onComponentAdded) onComponentAdded();
    } catch (e) {
      console.error("Failed to add component:", e);
    }
  }, [actions, query, onComponentAdded]);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-3">컴포넌트</h2>
          
          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#3182F6]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? "bg-[#3182F6] text-white" 
                    : "bg-gray-100 text-gray-600 active:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Components Grid - Click to Add */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3">
            {filteredComponents.map((c) => (
              <button
                key={c.name}
                onClick={() => handleAddComponent(c)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border active:bg-blue-50 active:border-[#3182F6] transition text-center ${
                  c.tds ? "border-blue-100 bg-blue-50/30" : "border-gray-100"
                }`}
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="text-sm text-gray-700 font-medium">{c.name}</span>
                {c.tds && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                    TDS
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              검색 결과가 없습니다
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500 text-center">
            💡 탭하면 캔버스에 추가됩니다
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (with drag support)
  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 mb-3">컴포넌트</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#3182F6]"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-xs rounded-md transition ${
                selectedCategory === cat 
                  ? "bg-[#3182F6] text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2">
          {filteredComponents.map((c) => {
            const Component = c.component;
            const craftConfig = Component.craft || {};
            const defaultProps = craftConfig.props || c.defaultProps || {};
            
            return (
              <div
                key={c.name}
                ref={(ref) => { 
                  if (ref) {
                    connectors.create(ref, <Component {...defaultProps} />);
                  }
                }}
                onClick={() => handleAddComponent(c)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-grab hover:border-[#3182F6] hover:bg-blue-50 hover:shadow-sm transition text-center group active:scale-95 ${
                  c.tds ? "border-blue-100 bg-blue-50/30" : "border-gray-100"
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition">{c.icon}</span>
                <span className="text-xs text-gray-600 font-medium">{c.name}</span>
                {c.tds && (
                  <span className="text-[9px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded font-medium">
                    TDS
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            검색 결과가 없습니다
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-500">
          💡 <span className="font-medium">팁:</span> 드래그 또는 클릭으로 추가
        </div>
      </div>
    </div>
  );
};
