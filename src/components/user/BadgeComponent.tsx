"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface BadgeProps {
  count?: number;
  bgColor?: string;
  maxCount?: number;
  showZero?: boolean;
  text?: string;
}

export const BadgeComponent = ({
  count = 5,
  bgColor = "#FF4757",
  maxCount = 99,
  showZero = false,
  text = "알림",
}: BadgeProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const shouldShow = showZero || count > 0;
  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div className="inline-flex items-center gap-2">
        <span className="text-sm">{text}</span>
        {shouldShow && (
          <span 
            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: bgColor }}
          >
            {displayCount}
          </span>
        )}
      </div>
    </div>
  );
};

const BadgeSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="뱃지">
      <label className="block text-xs text-gray-500 mb-1">텍스트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.text || ""} 
        onChange={(e) => setProp((p: BadgeProps) => (p.text = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">숫자</label>
      <input 
        type="number"
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.count || 0} 
        onChange={(e) => setProp((p: BadgeProps) => (p.count = Number(e.target.value)))} 
      />

      <label className="block text-xs text-gray-500 mb-1">최대 숫자</label>
      <input 
        type="number"
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.maxCount || 99} 
        onChange={(e) => setProp((p: BadgeProps) => (p.maxCount = Number(e.target.value)))} 
      />

      <label className="block text-xs text-gray-500 mb-1">배경 색상</label>
      <input 
        type="color" 
        value={props.bgColor || "#FF4757"} 
        onChange={(e) => setProp((p: BadgeProps) => (p.bgColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="flex items-center gap-2 text-sm">
        <input 
          type="checkbox" 
          checked={props.showZero ?? false} 
          onChange={(e) => setProp((p: BadgeProps) => (p.showZero = e.target.checked))} 
        />
        0일 때도 표시
      </label>
    </SettingsPanel>
  );
};

BadgeComponent.craft = {
  props: { count: 5, bgColor: "#FF4757", maxCount: 99, showZero: false, text: "알림" },
  related: { settings: BadgeSettings },
  displayName: "뱃지",
};
