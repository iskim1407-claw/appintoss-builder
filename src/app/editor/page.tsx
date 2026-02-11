"use client";

import React, { useEffect, useState } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { ComponentPanel } from "@/components/editor/ComponentPanel";
import { SettingsPanelComponent } from "@/components/editor/SettingsPanel";
import { Toolbar } from "@/components/editor/Toolbar";
import { TextComponent } from "@/components/user/TextComponent";
import { ButtonComponent } from "@/components/user/ButtonComponent";
import { ImageComponent } from "@/components/user/ImageComponent";
import { CardComponent } from "@/components/user/CardComponent";
import { ListComponent } from "@/components/user/ListComponent";
import { DividerComponent } from "@/components/user/DividerComponent";
import { HeaderComponent } from "@/components/user/HeaderComponent";
import { InputComponent } from "@/components/user/InputComponent";
import { BottomSheetComponent } from "@/components/user/BottomSheetComponent";
import { TabBarComponent } from "@/components/user/TabBarComponent";
import { BadgeComponent } from "@/components/user/BadgeComponent";
import { CarouselComponent } from "@/components/user/CarouselComponent";
import { ProgressBarComponent } from "@/components/user/ProgressBarComponent";
import { SpacerComponent } from "@/components/user/SpacerComponent";
import { Canvas } from "@/components/user/Container";

const LoadTemplate = () => {
  const { actions } = useEditor();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const template = sessionStorage.getItem("appintoss-template");
      if (template) {
        sessionStorage.removeItem("appintoss-template");
        try {
          actions.deserialize(template);
        } catch (e) {
          console.error("Failed to load template", e);
        }
      }
    }
  }, [actions]);

  return null;
};

// Component resolver
const resolver = {
  TextComponent,
  ButtonComponent,
  ImageComponent,
  CardComponent,
  ListComponent,
  DividerComponent,
  HeaderComponent,
  InputComponent,
  BottomSheetComponent,
  TabBarComponent,
  BadgeComponent,
  CarouselComponent,
  ProgressBarComponent,
  SpacerComponent,
  Canvas,
};

// Mobile tab type
type MobileTab = "components" | "canvas" | "settings";

// Empty canvas indicator component
const EmptyCanvasIndicator = () => {
  const { query } = useEditor();
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const checkEmpty = () => {
      try {
        const rootNode = query.node("ROOT").get();
        const childNodes = rootNode?.data?.nodes || [];
        setIsEmpty(childNodes.length === 0);
      } catch {
        setIsEmpty(true);
      }
    };
    
    checkEmpty();
    const interval = setInterval(checkEmpty, 500);
    return () => clearInterval(interval);
  }, [query]);

  if (!isEmpty) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center p-6 bg-white/80 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-4xl mb-3">👆</div>
        <p className="text-gray-500 font-medium">
          <span className="hidden md:inline">컴포넌트를 드래그해서 여기에 놓으세요</span>
          <span className="md:hidden">컴포넌트 탭에서 추가하세요</span>
        </p>
      </div>
    </div>
  );
};

export default function EditorPage() {
  const [viewportWidth, setViewportWidth] = useState(375);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("canvas");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Editor resolver={resolver}>
        <Toolbar 
          viewportWidth={viewportWidth}
          setViewportWidth={setViewportWidth}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <LoadTemplate />
        
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <ComponentPanel />
          
          {/* Canvas Area */}
          <div className="flex-1 flex items-start justify-center p-8 overflow-y-auto bg-[#f0f2f5]">
            <div style={{ width: viewportWidth }} className="transition-all duration-300">
              {/* Phone Frame */}
              <div className="bg-gray-800 rounded-t-[2rem] pt-2 px-2">
                <div className={`rounded-t-[1.5rem] overflow-hidden transition-colors ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                  {/* Status Bar */}
                  <div className={`h-11 flex items-center justify-between px-6 text-xs ${darkMode ? "text-white" : ""}`}>
                    <span className="font-semibold">9:41</span>
                    <div className="flex gap-1 text-[10px]">📶 🔋</div>
                  </div>
                  {/* Toss Nav */}
                  <div className={`h-11 flex items-center px-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                    <span className={`text-sm ${darkMode ? "text-white" : ""}`}>←</span>
                    <span className={`flex-1 text-center text-sm font-medium ${darkMode ? "text-white" : ""}`}>미니앱</span>
                    <span className={`text-sm ${darkMode ? "text-white" : ""}`}>⋯</span>
                  </div>
                </div>
              </div>
              
              {/* Canvas Content */}
              <div className="bg-gray-800 px-2">
                <div className={`min-h-[500px] transition-colors relative ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
                  <Frame>
                    <Element is={Canvas} canvas>
                      <HeaderComponent text="환영합니다! 👋" level="h2" />
                      <TextComponent text="컴포넌트를 왼쪽에서 드래그해서 여기에 놓으세요." fontSize={14} color="#8B95A1" />
                    </Element>
                  </Frame>
                  <EmptyCanvasIndicator />
                </div>
              </div>
              
              {/* Bottom Home Indicator */}
              <div className="bg-gray-800 rounded-b-[2rem] pb-2 px-2">
                <div className={`rounded-b-[1.5rem] h-8 flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                  <div className={`w-32 h-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"}`} />
                </div>
              </div>
            </div>
          </div>
          
          <SettingsPanelComponent />
        </div>

        {/* Mobile Layout (below md) */}
        <div className="flex md:hidden flex-1 flex-col overflow-hidden">
          {/* Mobile Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Components Tab */}
            {mobileTab === "components" && (
              <ComponentPanel isMobile />
            )}

            {/* Canvas Tab */}
            {mobileTab === "canvas" && (
              <div className={`h-full overflow-y-auto transition-colors ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                <div className="relative min-h-full">
                  <Frame>
                    <Element is={Canvas} canvas>
                      <HeaderComponent text="환영합니다! 👋" level="h2" />
                      <TextComponent text="아래 📦 탭에서 컴포넌트를 추가하세요." fontSize={14} color="#8B95A1" />
                    </Element>
                  </Frame>
                  <EmptyCanvasIndicator />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {mobileTab === "settings" && (
              <SettingsPanelComponent isMobile />
            )}
          </div>

          {/* Mobile Tab Bar */}
          <div className="bg-white border-t border-gray-200 safe-area-bottom">
            <div className="flex">
              <button
                onClick={() => setMobileTab("components")}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                  mobileTab === "components" ? "text-[#3182F6]" : "text-gray-500"
                }`}
              >
                <span className="text-xl">📦</span>
                <span className="text-xs font-medium">컴포넌트</span>
              </button>
              <button
                onClick={() => setMobileTab("canvas")}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                  mobileTab === "canvas" ? "text-[#3182F6]" : "text-gray-500"
                }`}
              >
                <span className="text-xl">🎨</span>
                <span className="text-xs font-medium">캔버스</span>
              </button>
              <button
                onClick={() => setMobileTab("settings")}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                  mobileTab === "settings" ? "text-[#3182F6]" : "text-gray-500"
                }`}
              >
                <span className="text-xl">⚙️</span>
                <span className="text-xs font-medium">설정</span>
              </button>
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
}
