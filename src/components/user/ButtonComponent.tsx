"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface ButtonProps {
  text?: string;
  bgColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  action?: "none" | "link" | "pay" | "share" | "toast" | "back" | "navigate" | "bottomSheet";
  actionValue?: string;
  borderRadius?: number;
}

export const ButtonComponent = ({
  text = "버튼",
  bgColor = "#3182F6",
  textColor = "#FFFFFF",
  size = "md",
  fullWidth = true,
  action = "none",
  actionValue: _actionValue = "",
  borderRadius = 12,
}: ButtonProps) => {
  void _actionValue; // Used in export, not in editor preview
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));

  const sizeClass = size === "sm" ? "py-2 px-4 text-sm" : size === "lg" ? "py-4 px-6 text-lg" : "py-3 px-5 text-base";

  const getActionIcon = () => {
    switch (action) {
      case "link": return "🔗";
      case "pay": return "💳";
      case "share": return "📤";
      case "toast": return "💬";
      case "back": return "←";
      case "navigate": return "📄";
      case "bottomSheet": return "📋";
      default: return null;
    }
  };

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}>
      <button
        className={`${sizeClass} ${fullWidth ? "w-full" : ""} font-semibold transition active:scale-[0.98]`}
        style={{ backgroundColor: bgColor, color: textColor, borderRadius }}
      >
        {getActionIcon() && <span className="mr-1">{getActionIcon()}</span>}
        {text}
      </button>
    </div>
  );
};

const ButtonSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="버튼">
      <label className="block text-xs text-gray-500 mb-1">텍스트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.text || ""} 
        onChange={(e) => setProp((p: ButtonProps) => (p.text = e.target.value))} 
      />
      
      <label className="block text-xs text-gray-500 mb-1">배경 색상</label>
      <input 
        type="color" 
        value={props.bgColor || "#3182F6"} 
        onChange={(e) => setProp((p: ButtonProps) => (p.bgColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />
      
      <label className="block text-xs text-gray-500 mb-1">텍스트 색상</label>
      <input 
        type="color" 
        value={props.textColor || "#FFFFFF"} 
        onChange={(e) => setProp((p: ButtonProps) => (p.textColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={24} 
        value={props.borderRadius || 12}
        onChange={(e) => setProp((p: ButtonProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 12}px</span>
      
      <label className="block text-xs text-gray-500 mb-1 mt-3">크기</label>
      <select 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.size || "md"} 
        onChange={(e) => setProp((p: ButtonProps) => (p.size = e.target.value as ButtonProps["size"]))}
      >
        <option value="sm">작게</option>
        <option value="md">보통</option>
        <option value="lg">크게</option>
      </select>

      <label className="flex items-center gap-2 text-sm mb-4">
        <input 
          type="checkbox" 
          checked={props.fullWidth ?? true} 
          onChange={(e) => setProp((p: ButtonProps) => (p.fullWidth = e.target.checked))} 
        />
        전체 너비
      </label>

      <div className="border-t border-gray-100 pt-3 mt-1">
        <label className="block text-xs text-gray-500 mb-1">🔧 액션 (클릭 시 동작)</label>
        <select 
          className="w-full border rounded-lg p-2 text-sm mb-3" 
          value={props.action || "none"} 
          onChange={(e) => setProp((p: ButtonProps) => (p.action = e.target.value as ButtonProps["action"]))}
        >
          <option value="none">없음</option>
          <option value="link">🔗 링크 열기</option>
          <option value="pay">💳 토스페이 결제</option>
          <option value="share">📤 공유하기</option>
          <option value="toast">💬 토스트 메시지</option>
          <option value="back">← 뒤로가기</option>
          <option value="navigate">📄 페이지 이동</option>
          <option value="bottomSheet">📋 바텀시트 열기</option>
        </select>

        {props.action === "link" && (
          <>
            <label className="block text-xs text-gray-500 mb-1">링크 URL</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm" 
              placeholder="https://example.com"
              value={props.actionValue || ""} 
              onChange={(e) => setProp((p: ButtonProps) => (p.actionValue = e.target.value))} 
            />
          </>
        )}

        {props.action === "pay" && (
          <>
            <label className="block text-xs text-gray-500 mb-1">결제 금액 (원)</label>
            <input 
              type="number"
              className="w-full border rounded-lg p-2 text-sm" 
              placeholder="10000"
              value={props.actionValue || ""} 
              onChange={(e) => setProp((p: ButtonProps) => (p.actionValue = e.target.value))} 
            />
          </>
        )}

        {props.action === "toast" && (
          <>
            <label className="block text-xs text-gray-500 mb-1">메시지</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm" 
              placeholder="완료되었습니다!"
              value={props.actionValue || ""} 
              onChange={(e) => setProp((p: ButtonProps) => (p.actionValue = e.target.value))} 
            />
          </>
        )}

        {props.action === "navigate" && (
          <>
            <label className="block text-xs text-gray-500 mb-1">페이지 ID</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm" 
              placeholder="page_2"
              value={props.actionValue || ""} 
              onChange={(e) => setProp((p: ButtonProps) => (p.actionValue = e.target.value))} 
            />
          </>
        )}

        {props.action === "bottomSheet" && (
          <>
            <label className="block text-xs text-gray-500 mb-1">바텀시트 ID</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm" 
              placeholder="sheet_1"
              value={props.actionValue || ""} 
              onChange={(e) => setProp((p: ButtonProps) => (p.actionValue = e.target.value))} 
            />
          </>
        )}
      </div>
    </SettingsPanel>
  );
};

ButtonComponent.craft = {
  props: { text: "버튼", bgColor: "#3182F6", textColor: "#FFFFFF", size: "md", fullWidth: true, action: "none", actionValue: "", borderRadius: 12 },
  related: { settings: ButtonSettings },
  displayName: "버튼",
};
