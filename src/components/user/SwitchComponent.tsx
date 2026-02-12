"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS } from "@/lib/tds/tokens";

// TDS Switch Props
export interface TDSSwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
}

export const SwitchComponent = ({
  label = "스위치",
  description = "",
  checked = false,
  disabled = false,
  size = "medium",
}: TDSSwitchProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [isOn, setIsOn] = useState(checked);

  const sizes = {
    small: { track: "w-10 h-6", thumb: "w-5 h-5", translate: "translate-x-4" },
    medium: { track: "w-12 h-7", thumb: "w-6 h-6", translate: "translate-x-5" },
  };

  const currentSize = sizes[size];

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-3 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <span
            className="text-sm font-medium"
            style={{ color: disabled ? TDS_COLORS.gray400 : TDS_COLORS.dark }}
          >
            {label}
          </span>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: TDS_COLORS.gray500 }}>
              {description}
            </p>
          )}
        </div>

        <button
          onClick={() => !disabled && setIsOn(!isOn)}
          className={`
            ${currentSize.track}
            rounded-full p-0.5 transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          style={{
            backgroundColor: isOn ? TDS_COLORS.blue : TDS_COLORS.gray300,
          }}
        >
          <div
            className={`
              ${currentSize.thumb}
              rounded-full bg-white shadow transition-transform
              ${isOn ? currentSize.translate : ""}
            `}
          />
        </button>
      </div>
    </div>
  );
};

const SwitchSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="스위치">
      <label className="block text-xs text-gray-500 mb-1">라벨</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.label || ""}
        onChange={(e) => setProp((p: TDSSwitchProps) => (p.label = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">설명 (선택)</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.description || ""}
        placeholder="추가 설명"
        onChange={(e) => setProp((p: TDSSwitchProps) => (p.description = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">크기</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSSwitchProps) => (p.size = "small"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.size === "small" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          Small
        </button>
        <button
          onClick={() => setProp((p: TDSSwitchProps) => (p.size = "medium"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.size || "medium") === "medium" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          Medium
        </button>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.checked ?? false}
            onChange={(e) => setProp((p: TDSSwitchProps) => (p.checked = e.target.checked))}
          />
          기본값 켜짐
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.disabled ?? false}
            onChange={(e) => setProp((p: TDSSwitchProps) => (p.disabled = e.target.checked))}
          />
          비활성화
        </label>
      </div>
    </SettingsPanel>
  );
};

SwitchComponent.craft = {
  props: {
    label: "스위치",
    description: "",
    checked: false,
    disabled: false,
    size: "medium",
  },
  related: { settings: SwitchSettings },
  displayName: "스위치",
};
