"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface ImageProps {
  src?: string;
  alt?: string;
  borderRadius?: number;
  aspectRatio?: "auto" | "16/9" | "4/3" | "1/1" | "3/4";
  objectFit?: "cover" | "contain" | "fill";
}

export const ImageComponent = ({
  src = "https://placehold.co/600x300/E5E8EB/8B95A1?text=이미지",
  alt = "이미지",
  borderRadius = 12,
  aspectRatio = "auto",
  objectFit = "cover",
}: ImageProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const aspectStyle = aspectRatio !== "auto" ? { aspectRatio } : {};

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full"
        style={{ 
          borderRadius, 
          objectFit,
          ...aspectStyle,
        }} 
      />
    </div>
  );
};

const ImageSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="이미지">
      <label className="block text-xs text-gray-500 mb-1">이미지 URL</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.src || ""} 
        onChange={(e) => setProp((p: ImageProps) => (p.src = e.target.value))} 
        placeholder="https://..."
      />

      <label className="block text-xs text-gray-500 mb-1">대체 텍스트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.alt || ""} 
        onChange={(e) => setProp((p: ImageProps) => (p.alt = e.target.value))} 
        placeholder="이미지 설명"
      />

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={32} 
        value={props.borderRadius || 12}
        onChange={(e) => setProp((p: ImageProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 12}px</span>

      <label className="block text-xs text-gray-500 mb-1 mt-3">비율</label>
      <select 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.aspectRatio || "auto"} 
        onChange={(e) => setProp((p: ImageProps) => (p.aspectRatio = e.target.value as ImageProps["aspectRatio"]))}
      >
        <option value="auto">원본</option>
        <option value="16/9">16:9 (와이드)</option>
        <option value="4/3">4:3</option>
        <option value="1/1">1:1 (정사각형)</option>
        <option value="3/4">3:4 (세로)</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">맞춤</label>
      <select 
        className="w-full border rounded-lg p-2 text-sm" 
        value={props.objectFit || "cover"} 
        onChange={(e) => setProp((p: ImageProps) => (p.objectFit = e.target.value as ImageProps["objectFit"]))}
      >
        <option value="cover">채우기 (cover)</option>
        <option value="contain">맞추기 (contain)</option>
        <option value="fill">늘리기 (fill)</option>
      </select>
    </SettingsPanel>
  );
};

ImageComponent.craft = {
  props: { src: "https://placehold.co/600x300/E5E8EB/8B95A1?text=이미지", alt: "이미지", borderRadius: 12, aspectRatio: "auto", objectFit: "cover" },
  related: { settings: ImageSettings },
  displayName: "이미지",
};
