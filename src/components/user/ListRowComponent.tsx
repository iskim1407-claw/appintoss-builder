"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS } from "@/lib/tds/tokens";

// TDS ListRow Props - 3 area structure: left | contents | right
export interface TDSListRowProps {
  // Left area
  leftType?: "none" | "icon" | "image" | "text";
  leftIcon?: string;
  leftImageUrl?: string;
  leftText?: string;
  leftIconBgColor?: string;

  // Contents area
  title?: string;
  description?: string;

  // Right area
  rightType?: "none" | "arrow" | "text" | "badge" | "switch";
  rightText?: string;
  rightBadge?: string;
  rightSwitchOn?: boolean;

  // Interaction
  withPress?: boolean;
  disabled?: boolean;
}

export const ListRowComponent = ({
  leftType = "icon",
  leftIcon = "📌",
  leftImageUrl = "",
  leftText = "",
  leftIconBgColor = "#E8F3FF",

  title = "리스트 항목",
  description = "",

  rightType = "arrow",
  rightText = "",
  rightBadge = "",
  rightSwitchOn = false,

  withPress = true,
  disabled = false,
}: TDSListRowProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const renderLeft = () => {
    switch (leftType) {
      case "icon":
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: leftIconBgColor }}
          >
            {leftIcon}
          </div>
        );
      case "image":
        return leftImageUrl ? (
          <img
            src={leftImageUrl}
            alt=""
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
            🖼️
          </div>
        );
      case "text":
        return (
          <span className="text-lg font-semibold" style={{ color: TDS_COLORS.blue }}>
            {leftText}
          </span>
        );
      default:
        return null;
    }
  };

  const renderRight = () => {
    switch (rightType) {
      case "arrow":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 15l5-5-5-5"
              stroke={TDS_COLORS.gray400}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "text":
        return (
          <span className="text-sm" style={{ color: TDS_COLORS.gray500 }}>
            {rightText}
          </span>
        );
      case "badge":
        return (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: TDS_COLORS.blue, color: TDS_COLORS.white }}
          >
            {rightBadge || "N"}
          </span>
        );
      case "switch":
        return (
          <div
            className={`w-12 h-7 rounded-full p-0.5 transition-colors ${
              rightSwitchOn ? "bg-[#3182F6]" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                rightSwitchOn ? "translate-x-5" : ""
              }`}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3
          ${withPress && !disabled ? "active:bg-gray-50 cursor-pointer" : ""}
          ${disabled ? "opacity-50" : ""}
        `}
        style={{ minHeight: 56 }}
      >
        {/* Left Area */}
        {leftType !== "none" && renderLeft()}

        {/* Contents Area */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-sm truncate"
            style={{ color: disabled ? TDS_COLORS.gray400 : TDS_COLORS.dark }}
          >
            {title}
          </div>
          {description && (
            <div
              className="text-xs mt-0.5 truncate"
              style={{ color: TDS_COLORS.gray500 }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Right Area */}
        {rightType !== "none" && renderRight()}
      </div>
    </div>
  );
};

const ListRowSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="리스트 항목">
      {/* Contents */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-2">📝 콘텐츠</div>
        
        <label className="block text-xs text-gray-500 mb-1">제목</label>
        <input
          className="w-full border rounded-lg p-2 text-sm mb-2"
          value={props.title || ""}
          onChange={(e) => setProp((p: TDSListRowProps) => (p.title = e.target.value))}
        />

        <label className="block text-xs text-gray-500 mb-1">설명 (선택)</label>
        <input
          className="w-full border rounded-lg p-2 text-sm"
          value={props.description || ""}
          placeholder="추가 설명 텍스트"
          onChange={(e) => setProp((p: TDSListRowProps) => (p.description = e.target.value))}
        />
      </div>

      {/* Left Area */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-2">⬅️ 왼쪽 영역</div>
        
        <select
          className="w-full border rounded-lg p-2 text-sm mb-2"
          value={props.leftType || "icon"}
          onChange={(e) => setProp((p: TDSListRowProps) => (p.leftType = e.target.value as TDSListRowProps["leftType"]))}
        >
          <option value="none">없음</option>
          <option value="icon">아이콘</option>
          <option value="image">이미지</option>
          <option value="text">텍스트</option>
        </select>

        {props.leftType === "icon" && (
          <>
            <input
              className="w-full border rounded-lg p-2 text-sm mb-2"
              value={props.leftIcon || "📌"}
              placeholder="이모지 또는 텍스트"
              onChange={(e) => setProp((p: TDSListRowProps) => (p.leftIcon = e.target.value))}
            />
            <label className="block text-xs text-gray-500 mb-1">배경색</label>
            <input
              type="color"
              value={props.leftIconBgColor || "#E8F3FF"}
              onChange={(e) => setProp((p: TDSListRowProps) => (p.leftIconBgColor = e.target.value))}
              className="w-full h-8 rounded-lg cursor-pointer"
            />
          </>
        )}

        {props.leftType === "image" && (
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={props.leftImageUrl || ""}
            placeholder="이미지 URL"
            onChange={(e) => setProp((p: TDSListRowProps) => (p.leftImageUrl = e.target.value))}
          />
        )}

        {props.leftType === "text" && (
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={props.leftText || ""}
            placeholder="텍스트"
            onChange={(e) => setProp((p: TDSListRowProps) => (p.leftText = e.target.value))}
          />
        )}
      </div>

      {/* Right Area */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-2">➡️ 오른쪽 영역</div>
        
        <select
          className="w-full border rounded-lg p-2 text-sm mb-2"
          value={props.rightType || "arrow"}
          onChange={(e) => setProp((p: TDSListRowProps) => (p.rightType = e.target.value as TDSListRowProps["rightType"]))}
        >
          <option value="none">없음</option>
          <option value="arrow">화살표</option>
          <option value="text">텍스트</option>
          <option value="badge">뱃지</option>
          <option value="switch">스위치</option>
        </select>

        {props.rightType === "text" && (
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={props.rightText || ""}
            placeholder="오른쪽 텍스트"
            onChange={(e) => setProp((p: TDSListRowProps) => (p.rightText = e.target.value))}
          />
        )}

        {props.rightType === "badge" && (
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={props.rightBadge || ""}
            placeholder="뱃지 텍스트"
            onChange={(e) => setProp((p: TDSListRowProps) => (p.rightBadge = e.target.value))}
          />
        )}

        {props.rightType === "switch" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={props.rightSwitchOn ?? false}
              onChange={(e) => setProp((p: TDSListRowProps) => (p.rightSwitchOn = e.target.checked))}
            />
            스위치 켜짐
          </label>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.withPress ?? true}
            onChange={(e) => setProp((p: TDSListRowProps) => (p.withPress = e.target.checked))}
          />
          터치 효과
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.disabled ?? false}
            onChange={(e) => setProp((p: TDSListRowProps) => (p.disabled = e.target.checked))}
          />
          비활성화
        </label>
      </div>
    </SettingsPanel>
  );
};

ListRowComponent.craft = {
  props: {
    leftType: "icon",
    leftIcon: "📌",
    leftImageUrl: "",
    leftText: "",
    leftIconBgColor: "#E8F3FF",
    title: "리스트 항목",
    description: "",
    rightType: "arrow",
    rightText: "",
    rightBadge: "",
    rightSwitchOn: false,
    withPress: true,
    disabled: false,
  },
  related: { settings: ListRowSettings },
  displayName: "리스트 항목",
};
