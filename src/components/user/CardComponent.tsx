"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface CardProps {
  title?: string;
  description?: string;
  bgColor?: string;
  showImage?: boolean;
}

export const CardComponent = ({
  title = "카드 제목",
  description = "카드 설명을 입력하세요.",
  bgColor = "#FFFFFF",
  showImage = true,
}: CardProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}>
      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm" style={{ backgroundColor: bgColor }}>
        {showImage && (
          <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-3xl">📷</div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

const CardSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  return (
    <SettingsPanel title="카드">
      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input className="w-full border rounded-lg p-2 text-sm mb-3" value={props.title || ""} onChange={(e) => setProp((p: CardProps) => (p.title = e.target.value))} />
      <label className="block text-xs text-gray-500 mb-1">설명</label>
      <textarea className="w-full border rounded-lg p-2 text-sm mb-3" value={props.description || ""} onChange={(e) => setProp((p: CardProps) => (p.description = e.target.value))} />
      <label className="block text-xs text-gray-500 mb-1">배경 색상</label>
      <input type="color" value={props.bgColor || "#FFFFFF"} onChange={(e) => setProp((p: CardProps) => (p.bgColor = e.target.value))} className="w-full h-8 mb-3" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={props.showImage ?? true} onChange={(e) => setProp((p: CardProps) => (p.showImage = e.target.checked))} />
        이미지 표시
      </label>
    </SettingsPanel>
  );
};

CardComponent.craft = {
  props: { title: "카드 제목", description: "카드 설명을 입력하세요.", bgColor: "#FFFFFF", showImage: true },
  related: { settings: CardSettings },
  displayName: "카드",
};
