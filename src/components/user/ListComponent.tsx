"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface ListProps {
  items?: string[];
  showIcon?: boolean;
  icon?: string;
  showArrow?: boolean;
}

export const ListComponent = ({
  items = ["항목 1", "항목 2", "항목 3"],
  showIcon = true,
  icon = "📌",
  showArrow = true,
}: ListProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-3 px-1">
            {showIcon && (
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <span className="flex-1 text-sm">{item}</span>
            {showArrow && <span className="text-gray-300">›</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const ListSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  const items = (props.items as string[]) || ["항목 1", "항목 2", "항목 3"];

  const updateItem = (index: number, value: string) => {
    setProp((p: ListProps) => {
      const newItems = [...(p.items || ["항목 1", "항목 2", "항목 3"])];
      newItems[index] = value;
      p.items = newItems;
    });
  };

  const addItem = () => {
    setProp((p: ListProps) => {
      const newItems = [...(p.items || [])];
      newItems.push(`항목 ${newItems.length + 1}`);
      p.items = newItems;
    });
  };

  const removeItem = (index: number) => {
    setProp((p: ListProps) => {
      const newItems = [...(p.items || [])];
      newItems.splice(index, 1);
      p.items = newItems;
    });
  };

  return (
    <SettingsPanel title="리스트">
      <label className="block text-xs text-gray-500 mb-2">항목</label>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input 
              className="flex-1 border rounded-lg p-2 text-sm" 
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
            />
            {items.length > 1 && (
              <button 
                onClick={() => removeItem(i)}
                className="text-red-400 hover:text-red-600 text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button 
        onClick={addItem}
        className="w-full py-2 text-sm text-[#3182F6] border border-[#3182F6] rounded-lg hover:bg-blue-50 mb-4"
      >
        + 항목 추가
      </button>

      <label className="flex items-center gap-2 text-sm mb-2">
        <input 
          type="checkbox" 
          checked={props.showIcon ?? true} 
          onChange={(e) => setProp((p: ListProps) => (p.showIcon = e.target.checked))} 
        />
        아이콘 표시
      </label>

      {props.showIcon && (
        <>
          <label className="block text-xs text-gray-500 mb-1">아이콘</label>
          <input 
            className="w-full border rounded-lg p-2 text-sm mb-3" 
            value={props.icon || "📌"} 
            onChange={(e) => setProp((p: ListProps) => (p.icon = e.target.value))} 
          />
        </>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input 
          type="checkbox" 
          checked={props.showArrow ?? true} 
          onChange={(e) => setProp((p: ListProps) => (p.showArrow = e.target.checked))} 
        />
        화살표 표시
      </label>
    </SettingsPanel>
  );
};

ListComponent.craft = {
  props: { items: ["항목 1", "항목 2", "항목 3"], showIcon: true, icon: "📌", showArrow: true },
  related: { settings: ListSettings },
  displayName: "리스트",
};
