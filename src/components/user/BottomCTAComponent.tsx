"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_BUTTON_SIZES, TDS_RADIUS, getButtonStyles } from "@/lib/tds/tokens";

// TDS BottomCTA Props
export interface TDSBottomCTAProps {
  // Primary button
  primaryText?: string;
  primaryVariant?: "fill" | "weak";
  primaryColor?: "primary" | "dark" | "danger";
  
  // Secondary button (optional)
  showSecondary?: boolean;
  secondaryText?: string;
  
  // Layout
  layout?: "single" | "stacked" | "sideBySide";
  
  // Safe area
  withSafeArea?: boolean;
}

export const BottomCTAComponent = ({
  primaryText = "확인",
  primaryVariant = "fill",
  primaryColor = "primary",
  showSecondary = false,
  secondaryText = "취소",
  layout = "single",
  withSafeArea = true,
}: TDSBottomCTAProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const primaryStyles = getButtonStyles(primaryVariant, primaryColor);
  const secondaryStyles = getButtonStyles("weak", "dark");
  const buttonSize = TDS_BUTTON_SIZES.large;

  const renderButtons = () => {
    if (!showSecondary || layout === "single") {
      return (
        <button
          className="w-full font-semibold transition-all active:scale-[0.98]"
          style={{
            height: buttonSize.height,
            fontSize: buttonSize.fontSize,
            backgroundColor: primaryStyles.bg,
            color: primaryStyles.text,
            borderRadius: TDS_RADIUS.md,
          }}
        >
          {primaryText}
        </button>
      );
    }

    if (layout === "stacked") {
      return (
        <div className="space-y-2">
          <button
            className="w-full font-semibold transition-all active:scale-[0.98]"
            style={{
              height: buttonSize.height,
              fontSize: buttonSize.fontSize,
              backgroundColor: primaryStyles.bg,
              color: primaryStyles.text,
              borderRadius: TDS_RADIUS.md,
            }}
          >
            {primaryText}
          </button>
          <button
            className="w-full font-semibold transition-all active:scale-[0.98]"
            style={{
              height: buttonSize.height,
              fontSize: buttonSize.fontSize,
              backgroundColor: secondaryStyles.bg,
              color: secondaryStyles.text,
              borderRadius: TDS_RADIUS.md,
            }}
          >
            {secondaryText}
          </button>
        </div>
      );
    }

    // sideBySide
    return (
      <div className="flex gap-2">
        <button
          className="flex-1 font-semibold transition-all active:scale-[0.98]"
          style={{
            height: buttonSize.height,
            fontSize: buttonSize.fontSize,
            backgroundColor: secondaryStyles.bg,
            color: secondaryStyles.text,
            borderRadius: TDS_RADIUS.md,
          }}
        >
          {secondaryText}
        </button>
        <button
          className="flex-[2] font-semibold transition-all active:scale-[0.98]"
          style={{
            height: buttonSize.height,
            fontSize: buttonSize.fontSize,
            backgroundColor: primaryStyles.bg,
            color: primaryStyles.text,
            borderRadius: TDS_RADIUS.md,
          }}
        >
          {primaryText}
        </button>
      </div>
    );
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        className="px-4 pt-3 border-t"
        style={{
          backgroundColor: TDS_COLORS.white,
          borderColor: TDS_COLORS.gray100,
          paddingBottom: withSafeArea ? "calc(12px + env(safe-area-inset-bottom, 0px))" : 12,
        }}
      >
        {renderButtons()}
      </div>
    </div>
  );
};

const BottomCTASettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="하단 CTA">
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-2">메인 버튼</div>
        
        <label className="block text-xs text-gray-500 mb-1">텍스트</label>
        <input
          className="w-full border rounded-lg p-2 text-sm mb-3"
          value={props.primaryText || ""}
          onChange={(e) => setProp((p: TDSBottomCTAProps) => (p.primaryText = e.target.value))}
        />

        <label className="block text-xs text-gray-500 mb-1">스타일</label>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setProp((p: TDSBottomCTAProps) => (p.primaryVariant = "fill"))}
            className={`flex-1 py-2 text-xs rounded-lg border transition ${
              (props.primaryVariant || "fill") === "fill" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
            }`}
          >
            Fill
          </button>
          <button
            onClick={() => setProp((p: TDSBottomCTAProps) => (p.primaryVariant = "weak"))}
            className={`flex-1 py-2 text-xs rounded-lg border transition ${
              props.primaryVariant === "weak" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
            }`}
          >
            Weak
          </button>
        </div>

        <label className="block text-xs text-gray-500 mb-1">색상</label>
        <div className="grid grid-cols-3 gap-2">
          {(["primary", "dark", "danger"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setProp((p: TDSBottomCTAProps) => (p.primaryColor = c))}
              className={`py-2 text-xs rounded-lg border transition ${
                (props.primaryColor || "primary") === c ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
              }`}
              style={{
                backgroundColor: c === "primary" ? "#3182F6" : c === "dark" ? "#191F28" : "#F04452",
                color: "#FFFFFF",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-100">
        <label className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={props.showSecondary ?? false}
            onChange={(e) => setProp((p: TDSBottomCTAProps) => (p.showSecondary = e.target.checked))}
          />
          보조 버튼 추가
        </label>

        {props.showSecondary && (
          <>
            <label className="block text-xs text-gray-500 mb-1">보조 버튼 텍스트</label>
            <input
              className="w-full border rounded-lg p-2 text-sm mb-3"
              value={props.secondaryText || ""}
              onChange={(e) => setProp((p: TDSBottomCTAProps) => (p.secondaryText = e.target.value))}
            />

            <label className="block text-xs text-gray-500 mb-1">레이아웃</label>
            <select
              className="w-full border rounded-lg p-2 text-sm"
              value={props.layout || "stacked"}
              onChange={(e) => setProp((p: TDSBottomCTAProps) => (p.layout = e.target.value as TDSBottomCTAProps["layout"]))}
            >
              <option value="stacked">세로 배치</option>
              <option value="sideBySide">가로 배치</option>
            </select>
          </>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.withSafeArea ?? true}
          onChange={(e) => setProp((p: TDSBottomCTAProps) => (p.withSafeArea = e.target.checked))}
        />
        Safe Area 적용
      </label>
    </SettingsPanel>
  );
};

BottomCTAComponent.craft = {
  props: {
    primaryText: "확인",
    primaryVariant: "fill",
    primaryColor: "primary",
    showSecondary: false,
    secondaryText: "취소",
    layout: "single",
    withSafeArea: true,
  },
  related: { settings: BottomCTASettings },
  displayName: "하단 CTA",
};
