"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS, TDS_SHADOWS } from "@/lib/tds/tokens";

// TDS Dialog Props
export interface TDSDialogProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showSecondaryButton?: boolean;
  variant?: "alert" | "confirm" | "destructive";
}

export const DialogComponent = ({
  title = "알림",
  description = "이 작업을 진행하시겠습니까?",
  primaryButtonText = "확인",
  secondaryButtonText = "취소",
  showSecondaryButton = true,
  variant = "confirm",
}: TDSDialogProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const getPrimaryButtonColor = () => {
    switch (variant) {
      case "destructive":
        return TDS_COLORS.danger;
      default:
        return TDS_COLORS.blue;
    }
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {/* Dialog preview */}
      <div
        className="p-5"
        style={{
          backgroundColor: TDS_COLORS.white,
          borderRadius: TDS_RADIUS.xl,
          boxShadow: TDS_SHADOWS.xl,
          maxWidth: 300,
          margin: "0 auto",
        }}
      >
        <h3
          className="text-lg font-bold text-center mb-2"
          style={{ color: TDS_COLORS.dark }}
        >
          {title}
        </h3>
        
        {description && (
          <p
            className="text-sm text-center mb-5"
            style={{ color: TDS_COLORS.gray600 }}
          >
            {description}
          </p>
        )}

        <div className={showSecondaryButton ? "flex gap-2" : ""}>
          {showSecondaryButton && (
            <button
              className="flex-1 py-3 text-sm font-semibold transition-colors active:opacity-80"
              style={{
                backgroundColor: TDS_COLORS.gray100,
                color: TDS_COLORS.gray700,
                borderRadius: TDS_RADIUS.md,
              }}
            >
              {secondaryButtonText}
            </button>
          )}
          <button
            className={`py-3 text-sm font-semibold text-white transition-colors active:opacity-80 ${
              showSecondaryButton ? "flex-1" : "w-full"
            }`}
            style={{
              backgroundColor: getPrimaryButtonColor(),
              borderRadius: TDS_RADIUS.md,
            }}
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-400 mt-2">
        (다이얼로그 미리보기)
      </p>
    </div>
  );
};

const DialogSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="다이얼로그">
      <label className="block text-xs text-gray-500 mb-1">타입</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.variant || "confirm"}
        onChange={(e) => setProp((p: TDSDialogProps) => (p.variant = e.target.value as TDSDialogProps["variant"]))}
      >
        <option value="alert">알림 (버튼 1개)</option>
        <option value="confirm">확인 (버튼 2개)</option>
        <option value="destructive">위험 (삭제 등)</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.title || ""}
        onChange={(e) => setProp((p: TDSDialogProps) => (p.title = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">설명</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm mb-3 min-h-[60px]"
        value={props.description || ""}
        onChange={(e) => setProp((p: TDSDialogProps) => (p.description = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">확인 버튼 텍스트</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.primaryButtonText || ""}
        onChange={(e) => setProp((p: TDSDialogProps) => (p.primaryButtonText = e.target.value))}
      />

      <label className="flex items-center gap-2 text-sm mb-2">
        <input
          type="checkbox"
          checked={props.showSecondaryButton ?? true}
          onChange={(e) => setProp((p: TDSDialogProps) => (p.showSecondaryButton = e.target.checked))}
        />
        취소 버튼 표시
      </label>

      {props.showSecondaryButton && (
        <>
          <label className="block text-xs text-gray-500 mb-1">취소 버튼 텍스트</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={props.secondaryButtonText || ""}
            onChange={(e) => setProp((p: TDSDialogProps) => (p.secondaryButtonText = e.target.value))}
          />
        </>
      )}
    </SettingsPanel>
  );
};

DialogComponent.craft = {
  props: {
    title: "알림",
    description: "이 작업을 진행하시겠습니까?",
    primaryButtonText: "확인",
    secondaryButtonText: "취소",
    showSecondaryButton: true,
    variant: "confirm",
  },
  related: { settings: DialogSettings },
  displayName: "다이얼로그",
};
