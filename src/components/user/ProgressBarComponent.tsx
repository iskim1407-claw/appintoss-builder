"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

// TDS ProgressBar Props
export interface TDSProgressBarProps {
  value?: number; // 0-100
  color?: "blue" | "green" | "red" | "teal";
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  labelPosition?: "top" | "right";
  animated?: boolean;
}

export const ProgressBarComponent = ({
  value = 50,
  color = "blue",
  size = "medium",
  showLabel = false,
  labelPosition = "right",
  animated = true,
}: TDSProgressBarProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const colorMap = {
    blue: TDS_COLORS.blue,
    green: TDS_COLORS.green,
    red: TDS_COLORS.danger,
    teal: TDS_COLORS.teal,
  };

  const sizeMap = {
    small: 4,
    medium: 8,
    large: 12,
  };

  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor = colorMap[color];
  const barHeight = sizeMap[size];

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-3 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {showLabel && labelPosition === "top" && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium" style={{ color: TDS_COLORS.gray600 }}>
            진행률
          </span>
          <span className="text-xs font-semibold" style={{ color: barColor }}>
            {clampedValue}%
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex-1 overflow-hidden"
          style={{
            backgroundColor: TDS_COLORS.gray100,
            borderRadius: TDS_RADIUS.full,
            height: barHeight,
          }}
        >
          <div
            className={animated ? "transition-all duration-500 ease-out" : ""}
            style={{
              width: `${clampedValue}%`,
              height: "100%",
              backgroundColor: barColor,
              borderRadius: TDS_RADIUS.full,
            }}
          />
        </div>

        {showLabel && labelPosition === "right" && (
          <span
            className="text-sm font-semibold min-w-[40px] text-right"
            style={{ color: barColor }}
          >
            {clampedValue}%
          </span>
        )}
      </div>
    </div>
  );
};

const ProgressBarSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="진행바">
      <label className="block text-xs text-gray-500 mb-1">진행률 ({props.value || 50}%)</label>
      <input
        type="range"
        min={0}
        max={100}
        value={props.value || 50}
        onChange={(e) => setProp((p: TDSProgressBarProps) => (p.value = Number(e.target.value)))}
        className="w-full mb-3"
      />

      <label className="block text-xs text-gray-500 mb-1">색상</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {([
          { value: "blue", label: "Blue", bg: TDS_COLORS.blue },
          { value: "green", label: "Green", bg: TDS_COLORS.green },
          { value: "red", label: "Red", bg: TDS_COLORS.danger },
          { value: "teal", label: "Teal", bg: TDS_COLORS.teal },
        ] as const).map((c) => (
          <button
            key={c.value}
            onClick={() => setProp((p: TDSProgressBarProps) => (p.color = c.value))}
            className={`py-2 text-xs rounded-lg border transition flex items-center justify-center gap-1 ${
              (props.color || "blue") === c.value ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
            }`}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.bg }} />
            {c.label}
          </button>
        ))}
      </div>

      <label className="block text-xs text-gray-500 mb-1">크기</label>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {(["small", "medium", "large"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setProp((p: TDSProgressBarProps) => (p.size = s))}
            className={`py-2 text-xs rounded-lg border transition ${
              (props.size || "medium") === s ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
            }`}
          >
            {s === "small" ? "Small" : s === "medium" ? "Medium" : "Large"}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm mb-2">
        <input
          type="checkbox"
          checked={props.showLabel ?? false}
          onChange={(e) => setProp((p: TDSProgressBarProps) => (p.showLabel = e.target.checked))}
        />
        퍼센트 표시
      </label>

      {props.showLabel && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setProp((p: TDSProgressBarProps) => (p.labelPosition = "top"))}
            className={`flex-1 py-2 text-xs rounded-lg border transition ${
              props.labelPosition === "top" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
            }`}
          >
            상단
          </button>
          <button
            onClick={() => setProp((p: TDSProgressBarProps) => (p.labelPosition = "right"))}
            className={`flex-1 py-2 text-xs rounded-lg border transition ${
              (props.labelPosition || "right") === "right" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
            }`}
          >
            우측
          </button>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.animated ?? true}
          onChange={(e) => setProp((p: TDSProgressBarProps) => (p.animated = e.target.checked))}
        />
        애니메이션
      </label>
    </SettingsPanel>
  );
};

ProgressBarComponent.craft = {
  props: {
    value: 50,
    color: "blue",
    size: "medium",
    showLabel: false,
    labelPosition: "right",
    animated: true,
  },
  related: { settings: ProgressBarSettings },
  displayName: "진행바",
};
