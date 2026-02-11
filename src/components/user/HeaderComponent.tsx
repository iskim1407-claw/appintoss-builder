"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface HeaderProps {
  text?: string;
  level?: "h1" | "h2" | "h3";
}

export const HeaderComponent = ({
  text = "헤더 텍스트",
  level = "h2",
}: HeaderProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const sizes = { h1: "text-2xl", h2: "text-xl", h3: "text-lg" };

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}>
      <div className={`${sizes[level]} font-bold`}>{text}</div>
    </div>
  );
};

const HeaderSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  return (
    <SettingsPanel title="헤더">
      <label className="block text-xs text-gray-500 mb-1">텍스트</label>
      <input className="w-full border rounded-lg p-2 text-sm mb-3" value={props.text || ""} onChange={(e) => setProp((p: HeaderProps) => (p.text = e.target.value))} />
      <label className="block text-xs text-gray-500 mb-1">크기</label>
      <select className="w-full border rounded-lg p-2 text-sm" value={props.level || "h2"} onChange={(e) => setProp((p: HeaderProps) => (p.level = e.target.value as HeaderProps["level"]))}>
        <option value="h1">H1 (대)</option>
        <option value="h2">H2 (중)</option>
        <option value="h3">H3 (소)</option>
      </select>
    </SettingsPanel>
  );
};

HeaderComponent.craft = {
  props: { text: "헤더 텍스트", level: "h2" },
  related: { settings: HeaderSettings },
  displayName: "헤더",
};
