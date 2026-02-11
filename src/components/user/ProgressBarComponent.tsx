"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  barColor?: string;
  bgColor?: string;
  height?: number;
  animated?: boolean;
}

export const ProgressBarComponent = ({
  value = 65,
  max = 100,
  label = "진행률",
  showPercent = true,
  barColor = "#3182F6",
  bgColor = "#E5E8EB",
  height = 8,
  animated = true,
}: ProgressBarProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const percent = Math.round((value / max) * 100);

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-700">{label}</span>
          {showPercent && <span className="text-gray-500 font-medium">{percent}%</span>}
        </div>
      )}
      <div 
        className="rounded-full overflow-hidden"
        style={{ backgroundColor: bgColor, height }}
      >
        <div 
          className={`h-full rounded-full ${animated ? "transition-all duration-500" : ""}`}
          style={{ 
            width: `${percent}%`, 
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};

const ProgressBarSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="진행바">
      <label className="block text-xs text-gray-500 mb-1">라벨</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.label || ""} 
        onChange={(e) => setProp((p: ProgressBarProps) => (p.label = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">현재 값</label>
      <input 
        type="number"
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.value || 0}
        min={0}
        max={props.max || 100}
        onChange={(e) => setProp((p: ProgressBarProps) => (p.value = Number(e.target.value)))} 
      />

      <label className="block text-xs text-gray-500 mb-1">최대 값</label>
      <input 
        type="number"
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.max || 100}
        min={1}
        onChange={(e) => setProp((p: ProgressBarProps) => (p.max = Number(e.target.value)))} 
      />

      <label className="block text-xs text-gray-500 mb-1">바 높이</label>
      <input 
        type="range" 
        min={4} 
        max={20} 
        value={props.height || 8}
        onChange={(e) => setProp((p: ProgressBarProps) => (p.height = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.height || 8}px</span>

      <label className="block text-xs text-gray-500 mb-1 mt-3">바 색상</label>
      <input 
        type="color" 
        value={props.barColor || "#3182F6"} 
        onChange={(e) => setProp((p: ProgressBarProps) => (p.barColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">배경 색상</label>
      <input 
        type="color" 
        value={props.bgColor || "#E5E8EB"} 
        onChange={(e) => setProp((p: ProgressBarProps) => (p.bgColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="flex items-center gap-2 text-sm mb-2">
        <input 
          type="checkbox" 
          checked={props.showPercent ?? true} 
          onChange={(e) => setProp((p: ProgressBarProps) => (p.showPercent = e.target.checked))} 
        />
        퍼센트 표시
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input 
          type="checkbox" 
          checked={props.animated ?? true} 
          onChange={(e) => setProp((p: ProgressBarProps) => (p.animated = e.target.checked))} 
        />
        애니메이션
      </label>
    </SettingsPanel>
  );
};

ProgressBarComponent.craft = {
  props: { value: 65, max: 100, label: "진행률", showPercent: true, barColor: "#3182F6", bgColor: "#E5E8EB", height: 8, animated: true },
  related: { settings: ProgressBarSettings },
  displayName: "진행바",
};
