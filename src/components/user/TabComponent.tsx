"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS } from "@/lib/tds/tokens";

// TDS Tab Props
export interface TDSTabProps {
  tabs?: string[];
  activeIndex?: number;
  variant?: "underline" | "pill" | "segmented";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

export const TabComponent = ({
  tabs = ["탭 1", "탭 2", "탭 3"],
  activeIndex = 0,
  variant = "underline",
  size = "medium",
  fullWidth = true,
}: TDSTabProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [active, setActive] = useState(activeIndex);

  const sizeStyles = {
    small: { height: 36, fontSize: 13 },
    medium: { height: 44, fontSize: 14 },
    large: { height: 52, fontSize: 15 },
  };

  const currentSize = sizeStyles[size];

  const renderTabs = () => {
    switch (variant) {
      case "underline":
        return (
          <div className="flex border-b" style={{ borderColor: TDS_COLORS.gray200 }}>
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`
                  ${fullWidth ? "flex-1" : "px-4"}
                  transition-colors relative
                `}
                style={{
                  height: currentSize.height,
                  fontSize: currentSize.fontSize,
                  color: active === i ? TDS_COLORS.blue : TDS_COLORS.gray500,
                  fontWeight: active === i ? 600 : 400,
                }}
              >
                {tab}
                {active === i && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: TDS_COLORS.blue }}
                  />
                )}
              </button>
            ))}
          </div>
        );

      case "pill":
        return (
          <div
            className={`flex gap-2 p-1 rounded-xl ${fullWidth ? "" : "inline-flex"}`}
            style={{ backgroundColor: TDS_COLORS.gray100 }}
          >
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`
                  ${fullWidth ? "flex-1" : "px-4"}
                  rounded-lg transition-all
                `}
                style={{
                  height: currentSize.height - 8,
                  fontSize: currentSize.fontSize,
                  backgroundColor: active === i ? TDS_COLORS.white : "transparent",
                  color: active === i ? TDS_COLORS.dark : TDS_COLORS.gray500,
                  fontWeight: active === i ? 600 : 400,
                  boxShadow: active === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        );

      case "segmented":
        return (
          <div
            className={`flex border rounded-xl overflow-hidden ${fullWidth ? "" : "inline-flex"}`}
            style={{ borderColor: TDS_COLORS.gray200 }}
          >
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`
                  ${fullWidth ? "flex-1" : "px-4"}
                  transition-colors
                  ${i > 0 ? "border-l" : ""}
                `}
                style={{
                  height: currentSize.height,
                  fontSize: currentSize.fontSize,
                  backgroundColor: active === i ? TDS_COLORS.blue : TDS_COLORS.white,
                  color: active === i ? TDS_COLORS.white : TDS_COLORS.gray600,
                  fontWeight: active === i ? 600 : 400,
                  borderColor: TDS_COLORS.gray200,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {renderTabs()}
    </div>
  );
};

const TabSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  const tabs = (props.tabs as string[]) || ["탭 1", "탭 2", "탭 3"];

  const updateTab = (index: number, value: string) => {
    setProp((p: TDSTabProps) => {
      const newTabs = [...(p.tabs || ["탭 1", "탭 2", "탭 3"])];
      newTabs[index] = value;
      p.tabs = newTabs;
    });
  };

  const addTab = () => {
    setProp((p: TDSTabProps) => {
      const newTabs = [...(p.tabs || [])];
      newTabs.push(`탭 ${newTabs.length + 1}`);
      p.tabs = newTabs;
    });
  };

  const removeTab = (index: number) => {
    setProp((p: TDSTabProps) => {
      const newTabs = [...(p.tabs || [])];
      newTabs.splice(index, 1);
      p.tabs = newTabs;
    });
  };

  return (
    <SettingsPanel title="탭">
      <label className="block text-xs text-gray-500 mb-1">스타일</label>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {(["underline", "pill", "segmented"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setProp((p: TDSTabProps) => (p.variant = v))}
            className={`py-2 text-xs rounded-lg border transition ${
              props.variant === v ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
            }`}
          >
            {v === "underline" ? "밑줄" : v === "pill" ? "알약" : "세그먼트"}
          </button>
        ))}
      </div>

      <label className="block text-xs text-gray-500 mb-1">크기</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.size || "medium"}
        onChange={(e) => setProp((p: TDSTabProps) => (p.size = e.target.value as TDSTabProps["size"]))}
      >
        <option value="small">Small (36px)</option>
        <option value="medium">Medium (44px)</option>
        <option value="large">Large (52px)</option>
      </select>

      <label className="block text-xs text-gray-500 mb-2">탭 항목</label>
      <div className="space-y-2 mb-3">
        {tabs.map((tab, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 border rounded-lg p-2 text-sm"
              value={tab}
              onChange={(e) => updateTab(i, e.target.value)}
            />
            {tabs.length > 2 && (
              <button
                onClick={() => removeTab(i)}
                className="text-red-400 hover:text-red-600 text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {tabs.length < 5 && (
        <button
          onClick={addTab}
          className="w-full py-2 text-sm text-[#3182F6] border border-[#3182F6] rounded-lg hover:bg-blue-50 mb-3"
        >
          + 탭 추가
        </button>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.fullWidth ?? true}
          onChange={(e) => setProp((p: TDSTabProps) => (p.fullWidth = e.target.checked))}
        />
        전체 너비
      </label>
    </SettingsPanel>
  );
};

TabComponent.craft = {
  props: {
    tabs: ["탭 1", "탭 2", "탭 3"],
    activeIndex: 0,
    variant: "underline",
    size: "medium",
    fullWidth: true,
  },
  related: { settings: TabSettings },
  displayName: "탭",
};
