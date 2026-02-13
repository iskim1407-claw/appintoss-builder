"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { SettingsPanel } from "./shared";

export interface GridItem {
  text: string;
  emoji?: string;
  bgColor?: string;
  onClick?: string;
}

export interface GridComponentProps {
  columns?: number;
  gap?: number;
  items?: GridItem[];
  cellHeight?: number;
  cellBorderRadius?: number;
  cellBgColor?: string;
  cellTextColor?: string;
  fontSize?: number;
  selectable?: boolean;
  selectedBgColor?: string;
  selectedTextColor?: string;
}

const defaultItems: GridItem[] = [
  { text: "항목 1", emoji: "⭐" },
  { text: "항목 2", emoji: "🎯" },
  { text: "항목 3", emoji: "💡" },
  { text: "항목 4", emoji: "🔥" },
  { text: "항목 5", emoji: "✨" },
  { text: "항목 6", emoji: "🎨" },
];

export const GridComponent = ({
  columns = 3,
  gap = 8,
  items = defaultItems,
  cellHeight = 80,
  cellBorderRadius = 12,
  cellBgColor = "#F2F4F6",
  cellTextColor = "#191F28",
  fontSize = 14,
  selectable = false,
  selectedBgColor = "#3182F6",
  selectedTextColor = "#FFFFFF",
}: GridComponentProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const handleCellClick = (index: number) => {
    if (!selectable) return;
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`p-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => {
          const isSelected = selectedIndices.has(index);
          const bg = isSelected ? selectedBgColor : item.bgColor || cellBgColor;
          const color = isSelected ? selectedTextColor : cellTextColor;

          return (
            <div
              key={index}
              onClick={() => handleCellClick(index)}
              style={{
                height: `${cellHeight}px`,
                borderRadius: `${cellBorderRadius}px`,
                backgroundColor: bg,
                color: color,
                fontSize: `${fontSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: selectable ? "pointer" : "default",
                transition: "all 0.2s ease",
                userSelect: "none",
                gap: "4px",
              }}
            >
              {item.emoji && <span style={{ fontSize: `${fontSize + 4}px` }}>{item.emoji}</span>}
              <span style={{ fontWeight: 500 }}>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GridSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((n) => ({ props: n.data.props }));

  const items: GridItem[] = props.items || defaultItems;

  return (
    <SettingsPanel title="그리드">
      <label className="block text-xs text-gray-500 mb-1">열 수 ({props.columns || 3})</label>
      <input
        type="range"
        min={2}
        max={6}
        value={props.columns || 3}
        onChange={(e) => setProp((p: GridComponentProps) => (p.columns = Number(e.target.value)))}
        className="w-full mb-3"
      />

      <label className="block text-xs text-gray-500 mb-1">간격 ({props.gap || 8}px)</label>
      <input
        type="range"
        min={0}
        max={24}
        value={props.gap || 8}
        onChange={(e) => setProp((p: GridComponentProps) => (p.gap = Number(e.target.value)))}
        className="w-full mb-3"
      />

      <label className="block text-xs text-gray-500 mb-1">셀 높이 ({props.cellHeight || 80}px)</label>
      <input
        type="range"
        min={40}
        max={160}
        value={props.cellHeight || 80}
        onChange={(e) => setProp((p: GridComponentProps) => (p.cellHeight = Number(e.target.value)))}
        className="w-full mb-3"
      />

      <label className="block text-xs text-gray-500 mb-1">셀 둥글기 ({props.cellBorderRadius || 12}px)</label>
      <input
        type="range"
        min={0}
        max={32}
        value={props.cellBorderRadius || 12}
        onChange={(e) => setProp((p: GridComponentProps) => (p.cellBorderRadius = Number(e.target.value)))}
        className="w-full mb-3"
      />

      <label className="block text-xs text-gray-500 mb-1">글자 크기 ({props.fontSize || 14}px)</label>
      <input
        type="range"
        min={10}
        max={24}
        value={props.fontSize || 14}
        onChange={(e) => setProp((p: GridComponentProps) => (p.fontSize = Number(e.target.value)))}
        className="w-full mb-3"
      />

      <label className="block text-xs text-gray-500 mb-1">셀 배경색</label>
      <input
        type="color"
        value={props.cellBgColor || "#F2F4F6"}
        onChange={(e) => setProp((p: GridComponentProps) => (p.cellBgColor = e.target.value))}
        className="w-full h-8 mb-3 rounded cursor-pointer"
      />

      <label className="block text-xs text-gray-500 mb-1">셀 글자색</label>
      <input
        type="color"
        value={props.cellTextColor || "#191F28"}
        onChange={(e) => setProp((p: GridComponentProps) => (p.cellTextColor = e.target.value))}
        className="w-full h-8 mb-3 rounded cursor-pointer"
      />

      <div className="space-y-2 mb-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.selectable ?? false}
            onChange={(e) => setProp((p: GridComponentProps) => (p.selectable = e.target.checked))}
          />
          선택 가능 (빙고 모드)
        </label>
      </div>

      {props.selectable && (
        <>
          <label className="block text-xs text-gray-500 mb-1">선택 배경색</label>
          <input
            type="color"
            value={props.selectedBgColor || "#3182F6"}
            onChange={(e) => setProp((p: GridComponentProps) => (p.selectedBgColor = e.target.value))}
            className="w-full h-8 mb-3 rounded cursor-pointer"
          />
          <label className="block text-xs text-gray-500 mb-1">선택 글자색</label>
          <input
            type="color"
            value={props.selectedTextColor || "#FFFFFF"}
            onChange={(e) => setProp((p: GridComponentProps) => (p.selectedTextColor = e.target.value))}
            className="w-full h-8 mb-3 rounded cursor-pointer"
          />
        </>
      )}

      <label className="block text-xs text-gray-500 mb-1">항목 ({items.length}개)</label>
      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1 items-center">
            <input
              className="w-10 border rounded p-1 text-sm text-center"
              value={item.emoji || ""}
              placeholder="🔵"
              onChange={(e) =>
                setProp((p: GridComponentProps) => {
                  const newItems = [...(p.items || defaultItems)];
                  newItems[i] = { ...newItems[i], emoji: e.target.value };
                  p.items = newItems;
                })
              }
            />
            <input
              className="flex-1 border rounded p-1 text-sm"
              value={item.text}
              onChange={(e) =>
                setProp((p: GridComponentProps) => {
                  const newItems = [...(p.items || defaultItems)];
                  newItems[i] = { ...newItems[i], text: e.target.value };
                  p.items = newItems;
                })
              }
            />
            <button
              className="text-red-400 text-xs px-1"
              onClick={() =>
                setProp((p: GridComponentProps) => {
                  const newItems = [...(p.items || defaultItems)];
                  newItems.splice(i, 1);
                  p.items = newItems;
                })
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        className="w-full py-1.5 text-xs border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#3182F6] hover:text-[#3182F6]"
        onClick={() =>
          setProp((p: GridComponentProps) => {
            p.items = [...(p.items || defaultItems), { text: `항목 ${(p.items || defaultItems).length + 1}` }];
          })
        }
      >
        + 항목 추가
      </button>
    </SettingsPanel>
  );
};

GridComponent.craft = {
  props: {
    columns: 3,
    gap: 8,
    items: defaultItems,
    cellHeight: 80,
    cellBorderRadius: 12,
    cellBgColor: "#F2F4F6",
    cellTextColor: "#191F28",
    fontSize: 14,
    selectable: false,
    selectedBgColor: "#3182F6",
    selectedTextColor: "#FFFFFF",
  },
  related: { settings: GridSettings },
  displayName: "그리드",
};
