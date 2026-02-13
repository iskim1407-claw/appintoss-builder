"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_BUTTON_SIZES, TDS_RADIUS, getButtonStyles } from "@/lib/tds/tokens";

// TDS Button Props
export interface TDSButtonProps {
  text?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "fill" | "weak";
  color?: "primary" | "dark" | "danger" | "light";
  display?: "inline" | "block" | "full";
  loading?: boolean;
  disabled?: boolean;
  // Action props
  action?: "none" | "link" | "pay" | "share" | "toast" | "back" | "navigate" | "bottomSheet";
  actionValue?: string;
}

export const ButtonComponent = ({
  text = "버튼",
  size = "medium",
  variant = "fill",
  color = "primary",
  display = "full",
  loading = false,
  disabled = false,
  action = "none",
  actionValue: _actionValue = "",
}: TDSButtonProps) => {
  void _actionValue;
  
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));

  const sizeStyles = TDS_BUTTON_SIZES[size];
  const colorStyles = getButtonStyles(variant, color);
  const isDisabled = disabled || loading;

  const widthClass = 
    display === "full" ? "w-full" : 
    display === "block" ? "w-auto" : 
    "inline-flex";

  const getActionIcon = () => {
    switch (action) {
      case "link": return "🔗";
      case "pay": return "💳";
      case "share": return "";
      case "toast": return "💬";
      case "back": return "←";
      case "navigate": return "📄";
      case "bottomSheet": return "";
      default: return null;
    }
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <button
        className={`
          ${widthClass}
          flex items-center justify-center gap-2
          font-semibold
          transition-all duration-150
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98]"}
        `}
        style={{
          height: sizeStyles.height,
          paddingLeft: sizeStyles.paddingX,
          paddingRight: sizeStyles.paddingX,
          fontSize: sizeStyles.fontSize,
          backgroundColor: colorStyles.bg,
          color: colorStyles.text,
          borderRadius: TDS_RADIUS.md,
        }}
        disabled={isDisabled}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {getActionIcon() && <span>{getActionIcon()}</span>}
            {text}
          </>
        )}
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
        onChange={(e) => setProp((p: TDSButtonProps) => (p.text = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">크기</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.size || "medium"}
        onChange={(e) => setProp((p: TDSButtonProps) => (p.size = e.target.value as TDSButtonProps["size"]))}
      >
        <option value="small">Small (36px)</option>
        <option value="medium">Medium (44px)</option>
        <option value="large">Large (52px)</option>
        <option value="xlarge">XLarge (60px)</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">스타일</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSButtonProps) => (p.variant = "fill"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.variant === "fill" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          Fill
        </button>
        <button
          onClick={() => setProp((p: TDSButtonProps) => (p.variant = "weak"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.variant === "weak" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          Weak
        </button>
      </div>

      <label className="block text-xs text-gray-500 mb-1">색상</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(["primary", "dark", "danger", "light"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setProp((p: TDSButtonProps) => (p.color = c))}
            className={`py-2 text-xs rounded-lg border transition ${
              props.color === c ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
            }`}
            style={{
              backgroundColor: c === "primary" ? "#3182F6" : c === "dark" ? "#191F28" : c === "danger" ? "#F04452" : "#F2F4F6",
              color: c === "light" ? "#191F28" : "#FFFFFF",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <label className="block text-xs text-gray-500 mb-1">너비</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.display || "full"}
        onChange={(e) => setProp((p: TDSButtonProps) => (p.display = e.target.value as TDSButtonProps["display"]))}
      >
        <option value="inline">Inline (텍스트만큼)</option>
        <option value="block">Block (내용만큼)</option>
        <option value="full">Full (전체 너비)</option>
      </select>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.loading ?? false}
            onChange={(e) => setProp((p: TDSButtonProps) => (p.loading = e.target.checked))}
          />
          로딩
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.disabled ?? false}
            onChange={(e) => setProp((p: TDSButtonProps) => (p.disabled = e.target.checked))}
          />
          비활성화
        </label>
      </div>

      <div className="border-t border-gray-100 pt-3 mt-1">
        <label className="block text-xs text-gray-500 mb-1">🔧 액션 (클릭 시 동작)</label>
        <select
          className="w-full border rounded-lg p-2 text-sm mb-3"
          value={props.action || "none"}
          onChange={(e) => setProp((p: TDSButtonProps) => (p.action = e.target.value as TDSButtonProps["action"]))}
        >
          <option value="none">없음</option>
          <option value="link">🔗 링크 열기</option>
          <option value="pay">💳 토스페이 결제</option>
          <option value="share">공유하기</option>
          <option value="toast">💬 토스트 메시지</option>
          <option value="back">← 뒤로가기</option>
          <option value="navigate">📄 페이지 이동</option>
          <option value="bottomSheet">바텀시트 열기</option>
        </select>

        {props.action === "link" && (
          <>
            <label className="block text-xs text-gray-500 mb-1">링크 URL</label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="https://example.com"
              value={props.actionValue || ""}
              onChange={(e) => setProp((p: TDSButtonProps) => (p.actionValue = e.target.value))}
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
              onChange={(e) => setProp((p: TDSButtonProps) => (p.actionValue = e.target.value))}
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
              onChange={(e) => setProp((p: TDSButtonProps) => (p.actionValue = e.target.value))}
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
              onChange={(e) => setProp((p: TDSButtonProps) => (p.actionValue = e.target.value))}
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
              onChange={(e) => setProp((p: TDSButtonProps) => (p.actionValue = e.target.value))}
            />
          </>
        )}
      </div>
    </SettingsPanel>
  );
};

ButtonComponent.craft = {
  props: {
    text: "버튼",
    size: "medium",
    variant: "fill",
    color: "primary",
    display: "full",
    loading: false,
    disabled: false,
    action: "none",
    actionValue: "",
  },
  related: { settings: ButtonSettings },
  displayName: "버튼",
};
