"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_BADGE_SIZES, TDS_RADIUS, getBadgeStyles } from "@/lib/tds/tokens";

// TDS Badge Props
export interface TDSBadgeProps {
  text?: string;
  size?: "xsmall" | "small" | "medium" | "large";
  variant?: "fill" | "weak";
  color?: "blue" | "teal" | "green" | "red" | "yellow" | "elephant";
}

export const BadgeComponent = ({
  text = "뱃지",
  size = "small",
  variant = "fill",
  color = "blue",
}: TDSBadgeProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const sizeStyles = TDS_BADGE_SIZES[size];
  const colorStyles = getBadgeStyles(variant, color);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <span
        className="inline-flex items-center justify-center font-semibold"
        style={{
          height: sizeStyles.height,
          paddingLeft: sizeStyles.paddingX,
          paddingRight: sizeStyles.paddingX,
          fontSize: sizeStyles.fontSize,
          backgroundColor: colorStyles.bg,
          color: colorStyles.text,
          borderRadius: TDS_RADIUS.full,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const BadgeSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  const colorOptions = [
    { value: "blue", label: "Blue", bg: "#3182F6" },
    { value: "teal", label: "Teal", bg: "#00A5A5" },
    { value: "green", label: "Green", bg: "#1FC17B" },
    { value: "red", label: "Red", bg: "#F04452" },
    { value: "yellow", label: "Yellow", bg: "#F5C73D" },
    { value: "elephant", label: "Gray", bg: "#454F5D" },
  ] as const;

  return (
    <SettingsPanel title="뱃지">
      <label className="block text-xs text-gray-500 mb-1">텍스트</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.text || ""}
        onChange={(e) => setProp((p: TDSBadgeProps) => (p.text = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">크기</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.size || "small"}
        onChange={(e) => setProp((p: TDSBadgeProps) => (p.size = e.target.value as TDSBadgeProps["size"]))}
      >
        <option value="xsmall">XSmall (18px)</option>
        <option value="small">Small (22px)</option>
        <option value="medium">Medium (26px)</option>
        <option value="large">Large (30px)</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">스타일</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSBadgeProps) => (p.variant = "fill"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.variant === "fill" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          Fill (채움)
        </button>
        <button
          onClick={() => setProp((p: TDSBadgeProps) => (p.variant = "weak"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.variant === "weak" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          Weak (연함)
        </button>
      </div>

      <label className="block text-xs text-gray-500 mb-1">색상</label>
      <div className="grid grid-cols-3 gap-2">
        {colorOptions.map((c) => (
          <button
            key={c.value}
            onClick={() => setProp((p: TDSBadgeProps) => (p.color = c.value))}
            className={`py-2 text-xs rounded-lg border transition flex items-center justify-center gap-1 ${
              props.color === c.value ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c.bg }}
            />
            {c.label}
          </button>
        ))}
      </div>
    </SettingsPanel>
  );
};

BadgeComponent.craft = {
  props: {
    text: "뱃지",
    size: "small",
    variant: "fill",
    color: "blue",
  },
  related: { settings: BadgeSettings },
  displayName: "뱃지",
};
