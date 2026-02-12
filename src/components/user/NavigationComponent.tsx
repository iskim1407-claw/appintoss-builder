"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS } from "@/lib/tds/tokens";

// TDS Navigation Props
export interface TDSNavigationProps {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  backIcon?: "arrow" | "close";
  backgroundColor?: "white" | "transparent";
  titleAlign?: "left" | "center";
}

export const NavigationComponent = ({
  title = "미니앱",
  showBackButton = true,
  showMenuButton = true,
  backIcon = "arrow",
  backgroundColor = "white",
  titleAlign = "center",
}: TDSNavigationProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const bgColor = backgroundColor === "white" ? TDS_COLORS.white : "transparent";

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <nav
        className="h-11 flex items-center px-4 border-b"
        style={{
          backgroundColor: bgColor,
          borderColor: TDS_COLORS.gray100,
        }}
      >
        {/* Left: Back button */}
        <div className="w-10 flex items-center">
          {showBackButton && (
            <button className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-800">
              {backIcon === "arrow" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Center: Title */}
        <div
          className={`flex-1 font-semibold text-sm truncate ${
            titleAlign === "center" ? "text-center" : "text-left"
          }`}
          style={{ color: TDS_COLORS.dark }}
        >
          {title}
        </div>

        {/* Right: Menu button */}
        <div className="w-10 flex items-center justify-end">
          {showMenuButton && (
            <button className="w-8 h-8 flex items-center justify-center -mr-1 text-gray-800">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

const NavigationSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="네비게이션">
      <label className="block text-xs text-gray-500 mb-1">타이틀</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.title || ""}
        onChange={(e) => setProp((p: TDSNavigationProps) => (p.title = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">타이틀 정렬</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSNavigationProps) => (p.titleAlign = "left"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.titleAlign === "left" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          왼쪽
        </button>
        <button
          onClick={() => setProp((p: TDSNavigationProps) => (p.titleAlign = "center"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.titleAlign || "center") === "center" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          가운데
        </button>
      </div>

      <label className="block text-xs text-gray-500 mb-1">배경</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSNavigationProps) => (p.backgroundColor = "white"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.backgroundColor || "white") === "white" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          흰색
        </button>
        <button
          onClick={() => setProp((p: TDSNavigationProps) => (p.backgroundColor = "transparent"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.backgroundColor === "transparent" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          투명
        </button>
      </div>

      <label className="block text-xs text-gray-500 mb-1">뒤로가기 아이콘</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSNavigationProps) => (p.backIcon = "arrow"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.backIcon || "arrow") === "arrow" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          ← 화살표
        </button>
        <button
          onClick={() => setProp((p: TDSNavigationProps) => (p.backIcon = "close"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.backIcon === "close" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          ✕ 닫기
        </button>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.showBackButton ?? true}
            onChange={(e) => setProp((p: TDSNavigationProps) => (p.showBackButton = e.target.checked))}
          />
          뒤로가기 버튼 표시
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.showMenuButton ?? true}
            onChange={(e) => setProp((p: TDSNavigationProps) => (p.showMenuButton = e.target.checked))}
          />
          메뉴 버튼 표시
        </label>
      </div>
    </SettingsPanel>
  );
};

NavigationComponent.craft = {
  props: {
    title: "미니앱",
    showBackButton: true,
    showMenuButton: true,
    backIcon: "arrow",
    backgroundColor: "white",
    titleAlign: "center",
  },
  related: { settings: NavigationSettings },
  displayName: "네비게이션",
};
