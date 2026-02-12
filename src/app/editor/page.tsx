"use client";

import React, { useEffect, useState } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
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
// TDS 컴포넌트
import { NavigationComponent } from "@/components/user/NavigationComponent";
import { ListRowComponent } from "@/components/user/ListRowComponent";
import { TabComponent } from "@/components/user/TabComponent";
import { TextFieldComponent } from "@/components/user/TextFieldComponent";
import { SwitchComponent } from "@/components/user/SwitchComponent";
import { CheckboxComponent } from "@/components/user/CheckboxComponent";
import { ToastComponent } from "@/components/user/ToastComponent";
import { SkeletonComponent } from "@/components/user/SkeletonComponent";
import { DialogComponent } from "@/components/user/DialogComponent";
import { BottomCTAComponent } from "@/components/user/BottomCTAComponent";
// 핀테크 컴포넌트
import { PaymentComponent } from "@/components/user/PaymentComponent";
import { AccountComponent } from "@/components/user/AccountComponent";
import { CreditScoreComponent } from "@/components/user/CreditScoreComponent";
import { ProductCompareComponent } from "@/components/user/ProductCompareComponent";
import { TransactionListComponent } from "@/components/user/TransactionListComponent";

const LoadTemplate = () => {
  const { actions } = useEditor();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const template = sessionStorage.getItem("appintoss-template");
      if (template) {
        sessionStorage.removeItem("appintoss-template");
        try { actions.deserialize(template); } catch (e) { console.error("Failed to load template", e); }
      }
    }
  }, [actions]);
  return null;
};

const resolver = {
  // TDS 핵심
  NavigationComponent, ButtonComponent, TextComponent, BadgeComponent,
  ListRowComponent, TabComponent, TabBarComponent,
  // TDS 입력
  TextFieldComponent, SwitchComponent, CheckboxComponent,
  // TDS 피드백
  ProgressBarComponent, ToastComponent, SkeletonComponent, DialogComponent,
  // TDS 레이아웃
  BottomCTAComponent, BottomSheetComponent,
  // 기본
  HeaderComponent, ImageComponent, CardComponent, ListComponent,
  DividerComponent, SpacerComponent, CarouselComponent, InputComponent,
  Canvas,
  // 핀테크
  PaymentComponent, AccountComponent, CreditScoreComponent,
  ProductCompareComponent, TransactionListComponent,
};

type MobileTab = "components" | "canvas" | "settings";

// 에러 바운더리 — 클라이언트 크래시 방지
class EditorErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">에디터 오류 발생</h2>
            <p className="text-gray-500 mb-4 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-6 py-3 bg-[#3182F6] text-white rounded-xl font-medium"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function EditorPage() {
  const [viewportWidth, setViewportWidth] = useState(375);
  const [darkMode, setDarkMode] = useState(false);
  const [tossMode, setTossMode] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("canvas");

  // 모바일 터치 드래그 폴리필
  useEffect(() => {
    polyfill({
      dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
      holdToDrag: 200, // 200ms 홀드 후 드래그 시작
    });
    // iOS에서 dragenter 이벤트 핸들링
    window.addEventListener("touchmove", () => {}, { passive: false });
  }, []);

  return (
    <EditorErrorBoundary>
    <div className="h-screen flex flex-col bg-gray-50">
      <Editor resolver={resolver}>
        <Toolbar viewportWidth={viewportWidth} setViewportWidth={setViewportWidth} darkMode={darkMode} setDarkMode={setDarkMode} tossMode={tossMode} setTossMode={setTossMode} />
        <LoadTemplate />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Desktop always visible, Mobile only when tab selected */}
          <div className={`
            md:block md:w-64 md:relative md:z-auto
            ${mobileTab === "components" ? "block absolute inset-0 z-20 w-full" : "hidden"}
          `}>
            <ComponentPanel isMobile={mobileTab === "components"} onComponentAdded={() => setMobileTab("canvas")} />
          </div>

          {/* Center: Canvas with Frame (always rendered, single instance) */}
          <div className={`
            flex-1 overflow-y-auto
            md:flex md:items-start md:justify-center md:p-8 md:bg-[#f0f2f5]
            ${mobileTab !== "canvas" ? "hidden md:flex" : "flex flex-col"}
          `}>
            {/* Desktop phone frame wrapper */}
            <div className="hidden md:block transition-all duration-300" style={{ width: viewportWidth }}>
              <div className="bg-gray-800 rounded-t-[2rem] pt-2 px-2">
                <div className={`rounded-t-[1.5rem] overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                  <div className={`h-11 flex items-center justify-between px-6 text-xs ${darkMode ? "text-white" : ""}`}>
                    <span className="font-semibold">9:41</span>
                    <div className="flex gap-1 text-[10px]">📶 🔋</div>
                  </div>
                  <div className={`h-11 flex items-center px-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                    <span className={`text-sm ${darkMode ? "text-white" : ""}`}>←</span>
                    <span className={`flex-1 text-center text-sm font-medium ${darkMode ? "text-white" : ""}`}>미니앱</span>
                    <span className={`text-sm ${darkMode ? "text-white" : ""}`}>⋯</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 px-2">
                <div className={`min-h-[500px] ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
                  <Frame>
                    <Element is={Canvas} canvas>
                      <HeaderComponent text="환영합니다! 👋" level="h2" />
                      <TextComponent text="컴포넌트를 드래그하거나 클릭해서 추가하세요." variant="t6" color="secondary" />
                    </Element>
                  </Frame>
                </div>
              </div>
              <div className="bg-gray-800 rounded-b-[2rem] pb-2 px-2">
                <div className={`rounded-b-[1.5rem] h-8 flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                  <div className={`w-32 h-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"}`} />
                </div>
              </div>
            </div>

            {/* Mobile canvas (no phone frame, full width) */}
            <div className={`md:hidden flex-1 p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
              {/* Frame is only rendered once — on desktop it's in the phone frame above */}
              {/* On mobile we use a MobileCanvas that references the same editor state */}
              <MobileCanvasView />
            </div>
          </div>

          {/* Right Panel: Settings */}
          <div className={`
            md:block md:w-72 md:relative md:z-auto
            ${mobileTab === "settings" ? "block absolute inset-0 z-20 w-full" : "hidden"}
          `}>
            <SettingsPanelComponent isMobile={mobileTab === "settings"} />
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex pb-[env(safe-area-inset-bottom)]">
            {(["components", "canvas", "settings"] as MobileTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                  mobileTab === tab ? "text-[#3182F6]" : "text-gray-500"
                }`}
              >
                <span className="text-xl">{tab === "components" ? "📦" : tab === "canvas" ? "🎨" : "⚙️"}</span>
                <span className="text-xs font-medium">{tab === "components" ? "컴포넌트" : tab === "canvas" ? "캔버스" : "설정"}</span>
              </button>
            ))}
          </div>
        </div>
      </Editor>
    </div>
    </EditorErrorBoundary>
  );
}

// Mobile canvas view — reads editor state and renders a simple preview
function MobileCanvasView() {
  const { query } = useEditor();
  const [nodes, setNodes] = useState<string>("{}");

  useEffect(() => {
    // Subscribe to editor changes
    const interval = setInterval(() => {
      try {
        const s = query.serialize();
        if (s && s !== "{}") setNodes(s);
      } catch (e) { console.warn("serialize error:", e); }
    }, 1000);
    return () => clearInterval(interval);
  }, [query]);

  const parsed = (() => {
    try { return JSON.parse(nodes); } catch { return {}; }
  })();

  const rootNode = parsed["ROOT"];
  if (!rootNode || !rootNode.nodes?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">👆</div>
          <p className="text-sm">📦 컴포넌트 탭에서 추가하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rootNode.nodes.map((nodeId: string) => (
        <MobileNodeRenderer key={nodeId} nodeId={nodeId} nodes={parsed} />
      ))}
    </div>
  );
}

function MobileNodeRenderer({ nodeId, nodes }: { nodeId: string; nodes: Record<string, { type: { resolvedName: string }; props: Record<string, unknown>; nodes?: string[] }> }) {
  const node = nodes[nodeId];
  if (!node) return null;

  const { resolvedName } = node.type || {};
  const props = node.props || {};

  switch (resolvedName) {
    case "HeaderComponent":
      return <div className="font-bold text-xl px-2 py-2">{String(props.text || "헤더")}</div>;
    case "TextComponent":
      return <div className="px-2 py-1" style={{ fontSize: Number(props.fontSize) || 16, color: String(props.color || "#191F28") }}>{String(props.text || "텍스트")}</div>;
    case "ButtonComponent":
      return <div className="px-2 py-2"><button className="w-full py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: String(props.bgColor || "#3182F6") }}>{String(props.text || "버튼")}</button></div>;
    case "ImageComponent":
      return <div className="px-2 py-2"><div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🖼️</div></div>;
    case "CardComponent":
      return <div className="px-2 py-2"><div className="rounded-2xl border border-gray-200 p-4"><h3 className="font-bold">{String(props.title || "카드")}</h3><p className="text-sm text-gray-500 mt-1">{String(props.description || "설명")}</p></div></div>;
    case "ListComponent":
      return <div className="px-2 py-2"><div className="divide-y divide-gray-100">{((props.items as string[]) || ["항목 1", "항목 2"]).map((item: string, i: number) => <div key={i} className="py-3 px-2 text-sm flex items-center">{item}<span className="ml-auto text-gray-300">›</span></div>)}</div></div>;
    case "DividerComponent":
      return <hr className="border-gray-100 my-2" />;
    case "SpacerComponent":
      return <div style={{ height: Number(props.height) || 24 }} />;
    case "InputComponent":
      return <div className="px-2 py-2"><input className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm bg-gray-50" placeholder={String(props.placeholder || "입력")} readOnly /></div>;
    case "BadgeComponent":
      return <div className="px-2 py-2"><span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: String(props.color || "#3182F6") }}>{String(props.text || "뱃지")}</span></div>;
    case "ProgressBarComponent":
      return <div className="px-2 py-2"><div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Number(props.value) || 50}%` }} /></div></div>;
    case "TabBarComponent": {
      const tabs = (props.tabs as Array<{icon?: string; label?: string}>) || [{icon: "🏠", label: "홈"}, {icon: "🔍", label: "검색"}, {icon: "👤", label: "마이"}];
      return <div className="px-2 py-2 flex border rounded-xl overflow-hidden">{tabs.map((tab, i: number) => <div key={i} className={`flex-1 text-center py-2 text-sm ${i === 0 ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500"}`}>{typeof tab === "string" ? tab : `${tab.icon || ""} ${tab.label || ""}`}</div>)}</div>;
    }
    case "CarouselComponent":
      return <div className="px-2 py-2"><div className="h-40 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-gray-400">🎠 캐러셀</div></div>;
    case "BottomSheetComponent":
      return <div className="px-2 py-2"><div className="border rounded-t-2xl p-4"><div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" /><p className="text-sm text-gray-500">{String(props.title || "바텀시트")}</p></div></div>;
    // 핀테크 컴포넌트
    case "PaymentComponent":
      return <div className="px-2 py-2"><div className="bg-white rounded-2xl p-4 border"><h3 className="font-bold mb-2">{String(props.title || "송금하기")}</h3><div className="text-2xl font-bold text-right text-[#3182F6]">100,000원</div><button className="w-full mt-3 py-3 bg-[#3182F6] text-white rounded-xl font-bold">{String(props.buttonText || "송금하기")}</button></div></div>;
    case "AccountComponent":
      return <div className="px-2 py-2"><div className="bg-white rounded-2xl overflow-hidden border"><div className="bg-[#3182F6] p-4 text-white font-bold">{String(props.title || "계좌 연결")}</div><div className="p-4"><div className="grid grid-cols-4 gap-2 mb-3">{["토스", "신한", "국민", "우리"].map((b, i) => <div key={i} className="text-center text-xs py-2 bg-gray-50 rounded-lg">{b}</div>)}</div><button className="w-full py-3 bg-[#3182F6] text-white rounded-xl font-bold">연결하기</button></div></div></div>;
    case "CreditScoreComponent":
      return <div className="px-2 py-2"><div className="bg-white rounded-2xl p-6 border text-center"><div className="text-5xl font-bold text-[#3182F6] mb-2">{String(props.score || 850)}</div><div className="inline-block px-3 py-1 bg-[#3182F6] text-white text-sm rounded-full font-bold">1등급</div></div></div>;
    case "ProductCompareComponent":
      return <div className="px-2 py-2"><div className="bg-white rounded-2xl p-4 border"><h3 className="font-bold mb-3">{String(props.title || "금융상품 비교")}</h3><div className="space-y-2">{[{name: "적금 플러스", rate: "4.5%"}, {name: "정기예금", rate: "3.8%"}].map((p, i) => <div key={i} className="p-3 border rounded-xl"><div className="font-medium">{p.name}</div><div className="text-[#3182F6] font-bold">연 {p.rate}</div></div>)}</div></div></div>;
    case "TransactionListComponent":
      return <div className="px-2 py-2"><div className="bg-white rounded-2xl border"><div className="p-4 border-b font-bold">{String(props.title || "거래내역")}</div><div className="divide-y">{[{t: "토스페이 충전", a: "+500,000"}, {t: "스타벅스", a: "-6,500"}].map((tx, i) => <div key={i} className="p-4 flex justify-between"><span>{tx.t}</span><span className={tx.a.startsWith("+") ? "text-[#3182F6]" : ""}>{tx.a}원</span></div>)}</div></div></div>;
    // TDS 컴포넌트
    case "NavigationComponent":
      return <div className="h-11 flex items-center px-4 border-b border-gray-100"><span className="text-sm">←</span><span className="flex-1 text-center text-sm font-medium">{String(props.title || "미니앱")}</span><span className="text-sm">⋯</span></div>;
    case "ListRowComponent":
      return <div className="px-4 py-3 flex items-center border-b border-gray-50"><div className="flex-1"><div className="font-medium text-sm">{String(props.title || "항목")}</div><div className="text-xs text-gray-400 mt-0.5">{String(props.description || "")}</div></div><span className="text-gray-300">›</span></div>;
    case "TabComponent":
      return <div className="flex border-b border-gray-100">{((props.tabs as string[]) || ["탭1", "탭2"]).map((t: string, i: number) => <div key={i} className={`flex-1 text-center py-3 text-sm ${i === 0 ? "text-[#3182F6] font-bold border-b-2 border-[#3182F6]" : "text-gray-400"}`}>{t}</div>)}</div>;
    case "TextFieldComponent":
      return <div className="px-3 py-2"><label className="block text-xs text-gray-500 mb-1">{String(props.label || "라벨")}</label><input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder={String(props.placeholder || "입력")} readOnly /></div>;
    case "DialogComponent":
      return <div className="px-3 py-2"><div className="bg-white rounded-2xl shadow-lg p-6 border text-center"><h3 className="font-bold mb-2">{String(props.title || "알림")}</h3><p className="text-sm text-gray-500 mb-4">{String(props.message || "내용")}</p><button className="px-6 py-2 bg-[#3182F6] text-white rounded-xl text-sm font-medium">{String(props.confirmText || "확인")}</button></div></div>;
    case "BottomCTAComponent":
      return <div className="p-3 bg-white border-t"><button className="w-full py-4 bg-[#3182F6] text-white rounded-2xl font-bold">{String(props.text || "다음")}</button></div>;
    case "SwitchComponent":
      return <div className="px-3 py-3 flex items-center justify-between"><span className="text-sm">{String(props.label || "설정")}</span><div className="w-12 h-7 bg-[#3182F6] rounded-full flex items-center justify-end px-1"><div className="w-5 h-5 bg-white rounded-full shadow" /></div></div>;
    case "CheckboxComponent":
      return <div className="px-3 py-2 flex items-center gap-3"><div className="w-5 h-5 border-2 border-[#3182F6] rounded bg-[#3182F6] flex items-center justify-center text-white text-xs">✓</div><span className="text-sm">{String(props.label || "동의합니다")}</span></div>;
    case "SkeletonComponent":
      return <div className="px-3 py-2 space-y-2"><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" /><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" /><div className="h-20 bg-gray-200 rounded animate-pulse" /></div>;
    case "ToastComponent":
      return <div className="px-3 py-2"><div className="bg-gray-800 text-white text-sm px-4 py-3 rounded-xl text-center">{String(props.message || "완료되었습니다")}</div></div>;
    default:
      return <div className="px-2 py-1 text-gray-400 text-sm">[{resolvedName}]</div>;
  }
}
