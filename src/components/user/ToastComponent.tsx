"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

// TDS Toast Props
export interface TDSToastProps {
  message?: string;
  type?: "default" | "success" | "error" | "info";
  position?: "top" | "bottom";
  showIcon?: boolean;
}

export const ToastComponent = ({
  message = "완료되었습니다",
  type = "default",
  position = "bottom",
  showIcon = true,
}: TDSToastProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return { bg: TDS_COLORS.green, icon: "✓" };
      case "error":
        return { bg: TDS_COLORS.danger, icon: "✕" };
      case "info":
        return { bg: TDS_COLORS.blue, icon: "ℹ" };
      default:
        return { bg: TDS_COLORS.gray800, icon: "" };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        className={`
          flex items-center justify-center gap-2
          px-4 py-3 mx-auto max-w-[90%]
        `}
        style={{
          backgroundColor: styles.bg,
          borderRadius: TDS_RADIUS.md,
        }}
      >
        {showIcon && styles.icon && (
          <span className="text-white text-sm font-bold">{styles.icon}</span>
        )}
        <span className="text-white text-sm font-medium">{message}</span>
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">
        위치: {position === "top" ? "상단" : "하단"}
      </p>
    </div>
  );
};

const ToastSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="토스트">
      <label className="block text-xs text-gray-500 mb-1">메시지</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.message || ""}
        onChange={(e) => setProp((p: TDSToastProps) => (p.message = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">타입</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {([
          { value: "default", label: "기본", color: TDS_COLORS.gray800 },
          { value: "success", label: "성공", color: TDS_COLORS.green },
          { value: "error", label: "에러", color: TDS_COLORS.danger },
          { value: "info", label: "정보", color: TDS_COLORS.blue },
        ] as const).map((t) => (
          <button
            key={t.value}
            onClick={() => setProp((p: TDSToastProps) => (p.type = t.value))}
            className={`py-2 text-xs rounded-lg border transition flex items-center justify-center gap-1 ${
              (props.type || "default") === t.value ? "ring-2 ring-[#3182F6] ring-offset-1" : "border-gray-200"
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            {t.label}
          </button>
        ))}
      </div>

      <label className="block text-xs text-gray-500 mb-1">위치</label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setProp((p: TDSToastProps) => (p.position = "top"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.position === "top" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          상단
        </button>
        <button
          onClick={() => setProp((p: TDSToastProps) => (p.position = "bottom"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.position || "bottom") === "bottom" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          하단
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.showIcon ?? true}
          onChange={(e) => setProp((p: TDSToastProps) => (p.showIcon = e.target.checked))}
        />
        아이콘 표시
      </label>
    </SettingsPanel>
  );
};

ToastComponent.craft = {
  props: {
    message: "완료되었습니다",
    type: "default",
    position: "bottom",
    showIcon: true,
  },
  related: { settings: ToastSettings },
  displayName: "토스트",
};
