"use client";

import { useEditor } from "@craftjs/core";
import React, { useState, useCallback } from "react";
import { TextComponent } from "../user/TextComponent";
import { ButtonComponent } from "../user/ButtonComponent";
import { ImageComponent } from "../user/ImageComponent";
import { CardComponent } from "../user/CardComponent";
import { ListComponent } from "../user/ListComponent";
import { DividerComponent } from "../user/DividerComponent";
import { HeaderComponent } from "../user/HeaderComponent";
import { InputComponent } from "../user/InputComponent";
import { BottomSheetComponent } from "../user/BottomSheetComponent";
import { TabBarComponent } from "../user/TabBarComponent";
import { BadgeComponent } from "../user/BadgeComponent";
import { CarouselComponent } from "../user/CarouselComponent";
import { ProgressBarComponent } from "../user/ProgressBarComponent";
import { SpacerComponent } from "../user/SpacerComponent";

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
}

const components: ComponentInfo[] = [
  // 기본
  { name: "헤더", icon: "📝", component: HeaderComponent, category: "기본", defaultProps: { text: "헤더 텍스트", level: "h2" } },
  { name: "텍스트", icon: "✏️", component: TextComponent, category: "기본", defaultProps: { text: "텍스트를 입력하세요", fontSize: 16, fontWeight: "normal", color: "#191F28", textAlign: "left" } },
  { name: "버튼", icon: "🔘", component: ButtonComponent, category: "기본", defaultProps: { text: "버튼", bgColor: "#3182F6", textColor: "#FFFFFF", size: "md", fullWidth: true, action: "none", actionValue: "", borderRadius: 12 } },
  { name: "이미지", icon: "🖼️", component: ImageComponent, category: "기본", defaultProps: {} },
  { name: "구분선", icon: "➖", component: DividerComponent, category: "기본", defaultProps: {} },
  { name: "여백", icon: "↕️", component: SpacerComponent, category: "기본", defaultProps: {} },
  
  // 레이아웃
  { name: "카드", icon: "🃏", component: CardComponent, category: "레이아웃", defaultProps: {} },
  { name: "리스트", icon: "📋", component: ListComponent, category: "레이아웃", defaultProps: {} },
  { name: "캐러셀", icon: "🎠", component: CarouselComponent, category: "레이아웃", defaultProps: {} },
  
  // 입력
  { name: "입력 필드", icon: "⌨️", component: InputComponent, category: "입력", defaultProps: {} },
  
  // 네비게이션
  { name: "탭바", icon: "📱", component: TabBarComponent, category: "네비게이션", defaultProps: {} },
  { name: "바텀시트", icon: "📄", component: BottomSheetComponent, category: "네비게이션", defaultProps: {} },
  
  // 피드백
  { name: "뱃지", icon: "🔴", component: BadgeComponent, category: "피드백", defaultProps: {} },
  { name: "진행바", icon: "📊", component: ProgressBarComponent, category: "피드백", defaultProps: {} },
];

const categories = ["전체", "기본", "레이아웃", "입력", "네비게이션", "피드백"];

interface ComponentPanelProps {
  isMobile?: boolean;
}

export const ComponentPanel = ({ isMobile = false }: ComponentPanelProps) => {
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
    } catch (e) {
      console.error("Failed to add component:", e);
    }
  }, [actions, query]);

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
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 active:bg-blue-50 active:border-[#3182F6] transition text-center"
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="text-sm text-gray-700 font-medium">{c.name}</span>
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
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 cursor-grab hover:border-[#3182F6] hover:bg-blue-50 hover:shadow-sm transition text-center group active:scale-95"
              >
                <span className="text-2xl group-hover:scale-110 transition">{c.icon}</span>
                <span className="text-xs text-gray-600 font-medium">{c.name}</span>
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
