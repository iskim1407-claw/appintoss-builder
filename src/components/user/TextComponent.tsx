"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface TextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
}

export const TextComponent = ({
  text = "텍스트를 입력하세요",
  fontSize = 16,
  fontWeight = "normal",
  color = "#191F28",
  textAlign = "left",
}: TextProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({ selected: state.events.selected }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`py-2 px-3 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
      style={{ fontSize, fontWeight, color, textAlign } as React.CSSProperties}
    >
      {text}
    </div>
  );
};

const TextSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }));

  return (
    <SettingsPanel title="텍스트">
      <label className="block text-xs text-gray-500 mb-1">내용</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.text || ""}
        onChange={(e) => setProp((p: TextProps) => (p.text = e.target.value))}
      />
      <label className="block text-xs text-gray-500 mb-1">글자 크기</label>
      <input
        type="range"
        min={12}
        max={48}
        value={props.fontSize || 16}
        onChange={(e) => setProp((p: TextProps) => (p.fontSize = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.fontSize || 16}px</span>
      <label className="block text-xs text-gray-500 mb-1 mt-3">굵기</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.fontWeight || "normal"}
        onChange={(e) => setProp((p: TextProps) => (p.fontWeight = e.target.value))}
      >
        <option value="normal">보통</option>
        <option value="500">중간</option>
        <option value="bold">굵게</option>
      </select>
      <label className="block text-xs text-gray-500 mb-1">색상</label>
      <input
        type="color"
        value={props.color || "#191F28"}
        onChange={(e) => setProp((p: TextProps) => (p.color = e.target.value))}
        className="w-full h-8 mb-3"
      />
      <label className="block text-xs text-gray-500 mb-1">정렬</label>
      <div className="flex gap-2">
        {(["left", "center", "right"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setProp((p: TextProps) => (p.textAlign = a))}
            className={`flex-1 py-1 rounded-lg text-xs border ${props.textAlign === a ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"}`}
          >
            {a === "left" ? "왼쪽" : a === "center" ? "가운데" : "오른쪽"}
          </button>
        ))}
      </div>
    </SettingsPanel>
  );
};

TextComponent.craft = {
  props: { text: "텍스트를 입력하세요", fontSize: 16, fontWeight: "normal", color: "#191F28", textAlign: "left" },
  related: { settings: TextSettings },
  displayName: "텍스트",
};
