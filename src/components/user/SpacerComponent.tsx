"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface SpacerProps {
  height?: number;
}

export const SpacerComponent = ({
  height = 24,
}: SpacerProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`${selected ? "outline outline-2 outline-[#3182F6] outline-dashed bg-blue-50/50" : ""}`}
      style={{ height }}
    >
      {selected && (
        <div className="h-full flex items-center justify-center text-xs text-gray-400">
          {height}px
        </div>
      )}
    </div>
  );
};

const SpacerSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="여백">
      <label className="block text-xs text-gray-500 mb-1">높이</label>
      <input 
        type="range" 
        min={8} 
        max={100} 
        value={props.height || 24}
        onChange={(e) => setProp((p: SpacerProps) => (p.height = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.height || 24}px</span>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {[8, 16, 24, 32, 48, 64, 80, 100].map((h) => (
          <button
            key={h}
            onClick={() => setProp((p: SpacerProps) => (p.height = h))}
            className={`py-1.5 text-xs rounded border ${
              props.height === h 
                ? "bg-[#3182F6] text-white border-[#3182F6]" 
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            {h}px
          </button>
        ))}
      </div>
    </SettingsPanel>
  );
};

SpacerComponent.craft = {
  props: { height: 24 },
  related: { settings: SpacerSettings },
  displayName: "여백",
};
