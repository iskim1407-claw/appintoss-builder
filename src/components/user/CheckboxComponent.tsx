"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

// TDS Checkbox Props
export interface TDSCheckboxProps {
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  variant?: "square" | "circle";
}

export const CheckboxComponent = ({
  label = "체크박스",
  description = "",
  checked = false,
  disabled = false,
  variant = "square",
}: TDSCheckboxProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [isChecked, setIsChecked] = useState(checked);

  const boxRadius = variant === "circle" ? TDS_RADIUS.full : TDS_RADIUS.sm;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-3 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <button
        onClick={() => !disabled && setIsChecked(!isChecked)}
        className={`
          flex items-start gap-3 w-full text-left
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div
          className="w-6 h-6 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5"
          style={{
            borderRadius: boxRadius,
            backgroundColor: isChecked ? TDS_COLORS.blue : TDS_COLORS.white,
            border: isChecked ? "none" : `2px solid ${TDS_COLORS.gray300}`,
          }}
        >
          {isChecked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M11.5 4L5.5 10L2.5 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

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
      </button>
    </div>
  );
};

const CheckboxSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="체크박스">
      <label className="block text-xs text-gray-500 mb-1">라벨</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.label || ""}
        onChange={(e) => setProp((p: TDSCheckboxProps) => (p.label = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">설명 (선택)</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.description || ""}
        placeholder="추가 설명"
        onChange={(e) => setProp((p: TDSCheckboxProps) => (p.description = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">스타일</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSCheckboxProps) => (p.variant = "square"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.variant || "square") === "square" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          □ 사각형
        </button>
        <button
          onClick={() => setProp((p: TDSCheckboxProps) => (p.variant = "circle"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.variant === "circle" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          ○ 원형
        </button>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.checked ?? false}
            onChange={(e) => setProp((p: TDSCheckboxProps) => (p.checked = e.target.checked))}
          />
          기본값 체크됨
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.disabled ?? false}
            onChange={(e) => setProp((p: TDSCheckboxProps) => (p.disabled = e.target.checked))}
          />
          비활성화
        </label>
      </div>
    </SettingsPanel>
  );
};

CheckboxComponent.craft = {
  props: {
    label: "체크박스",
    description: "",
    checked: false,
    disabled: false,
    variant: "square",
  },
  related: { settings: CheckboxSettings },
  displayName: "체크박스",
};
