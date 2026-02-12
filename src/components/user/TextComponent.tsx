"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_TYPOGRAPHY, TDS_COLORS } from "@/lib/tds/tokens";

// TDS Typography variants
type TypographyVariant = "t1" | "t2" | "t3" | "t4" | "t5" | "t6" | "caption" | "label" | "custom";

export interface TDSTextProps {
  text?: string;
  variant?: TypographyVariant;
  color?: "primary" | "secondary" | "tertiary" | "disabled" | "danger" | "blue" | "custom";
  customColor?: string;
  customFontSize?: number;
  customFontWeight?: number;
  textAlign?: "left" | "center" | "right";
}

const getColorValue = (color: TDSTextProps["color"], customColor?: string): string => {
  switch (color) {
    case "primary": return TDS_COLORS.dark;
    case "secondary": return TDS_COLORS.gray600;
    case "tertiary": return TDS_COLORS.gray500;
    case "disabled": return TDS_COLORS.gray400;
    case "danger": return TDS_COLORS.danger;
    case "blue": return TDS_COLORS.blue;
    case "custom": return customColor || TDS_COLORS.dark;
    default: return TDS_COLORS.dark;
  }
};

export const TextComponent = ({
  text = "텍스트를 입력하세요",
  variant = "t5",
  color = "primary",
  customColor = "#191F28",
  customFontSize = 14,
  customFontWeight = 400,
  textAlign = "left",
}: TDSTextProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({ selected: state.events.selected }));

  const typography = variant !== "custom" ? TDS_TYPOGRAPHY[variant] : {
    fontSize: customFontSize,
    fontWeight: customFontWeight,
    lineHeight: 1.5,
  };

  const colorValue = getColorValue(color, customColor);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`py-1 px-4 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
      style={{
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        color: colorValue,
        textAlign,
        fontFamily: "'Toss Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {text}
    </div>
  );
};

const TextSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }));

  const variantLabels: Record<TypographyVariant, string> = {
    t1: "T1 (24px Bold)",
    t2: "T2 (20px Bold)",
    t3: "T3 (17px Bold)",
    t4: "T4 (15px Semi)",
    t5: "T5 (14px Medium)",
    t6: "T6 (13px Regular)",
    caption: "Caption (12px)",
    label: "Label (11px)",
    custom: "커스텀",
  };

  return (
    <SettingsPanel title="텍스트">
      <label className="block text-xs text-gray-500 mb-1">내용</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm mb-3 min-h-[80px]"
        value={props.text || ""}
        onChange={(e) => setProp((p: TDSTextProps) => (p.text = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">타이포그래피</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.variant || "t5"}
        onChange={(e) => setProp((p: TDSTextProps) => (p.variant = e.target.value as TypographyVariant))}
      >
        {(Object.keys(variantLabels) as TypographyVariant[]).map((v) => (
          <option key={v} value={v}>{variantLabels[v]}</option>
        ))}
      </select>

      {props.variant === "custom" && (
        <>
          <label className="block text-xs text-gray-500 mb-1">글자 크기</label>
          <input
            type="range"
            min={10}
            max={48}
            value={props.customFontSize || 14}
            onChange={(e) => setProp((p: TDSTextProps) => (p.customFontSize = Number(e.target.value)))}
            className="w-full mb-1"
          />
          <span className="text-xs text-gray-400 block mb-3">{props.customFontSize || 14}px</span>

          <label className="block text-xs text-gray-500 mb-1">굵기</label>
          <select
            className="w-full border rounded-lg p-2 text-sm mb-3"
            value={props.customFontWeight || 400}
            onChange={(e) => setProp((p: TDSTextProps) => (p.customFontWeight = Number(e.target.value)))}
          >
            <option value={300}>Light (300)</option>
            <option value={400}>Regular (400)</option>
            <option value={500}>Medium (500)</option>
            <option value={600}>SemiBold (600)</option>
            <option value={700}>Bold (700)</option>
          </select>
        </>
      )}

      <label className="block text-xs text-gray-500 mb-1">색상</label>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {([
          { value: "primary", label: "기본", color: TDS_COLORS.dark },
          { value: "secondary", label: "보조", color: TDS_COLORS.gray600 },
          { value: "tertiary", label: "3차", color: TDS_COLORS.gray500 },
          { value: "disabled", label: "비활성", color: TDS_COLORS.gray400 },
          { value: "danger", label: "위험", color: TDS_COLORS.danger },
          { value: "blue", label: "블루", color: TDS_COLORS.blue },
        ] as const).map((c) => (
          <button
            key={c.value}
            onClick={() => setProp((p: TDSTextProps) => (p.color = c.value))}
            className={`py-2 text-xs rounded-lg border transition flex items-center justify-center gap-1 ${
              props.color === c.value ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            {c.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setProp((p: TDSTextProps) => (p.color = "custom"))}
        className={`w-full py-2 text-xs rounded-lg border transition mb-2 ${
          props.color === "custom" ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
        }`}
      >
        🎨 커스텀 색상
      </button>

      {props.color === "custom" && (
        <input
          type="color"
          value={props.customColor || "#191F28"}
          onChange={(e) => setProp((p: TDSTextProps) => (p.customColor = e.target.value))}
          className="w-full h-8 mb-3 rounded-lg cursor-pointer"
        />
      )}

      <label className="block text-xs text-gray-500 mb-1 mt-3">정렬</label>
      <div className="flex gap-2">
        {(["left", "center", "right"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setProp((p: TDSTextProps) => (p.textAlign = a))}
            className={`flex-1 py-2 rounded-lg text-xs border ${
              props.textAlign === a
                ? "bg-[#3182F6] text-white border-[#3182F6]"
                : "border-gray-200"
            }`}
          >
            {a === "left" ? "왼쪽" : a === "center" ? "가운데" : "오른쪽"}
          </button>
        ))}
      </div>
    </SettingsPanel>
  );
};

TextComponent.craft = {
  props: {
    text: "텍스트를 입력하세요",
    variant: "t5",
    color: "primary",
    customColor: "#191F28",
    customFontSize: 14,
    customFontWeight: 400,
    textAlign: "left",
  },
  related: { settings: TextSettings },
  displayName: "텍스트",
};
