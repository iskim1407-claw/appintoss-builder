"use client";

import { useNode } from "@craftjs/core";
import React, { useCallback, useRef, useState } from "react";
import { SettingsPanel } from "./shared";

interface ImageProps {
  src?: string;
  alt?: string;
  borderRadius?: number;
  aspectRatio?: "auto" | "16/9" | "4/3" | "1/1" | "3/4";
  objectFit?: "cover" | "contain" | "fill";
}

const MAX_WIDTH = 800;
const QUALITY = 0.8;

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context failed"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      setProp((p: ImageProps) => (p.src = dataUrl));
    } catch (e) {
      console.error("Image resize failed:", e);
    } finally {
      setUploading(false);
    }
  }, [setProp]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <SettingsPanel title="이미지">
      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded-lg">
        <button
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === "url" ? "bg-white shadow-sm font-medium" : "text-gray-500"}`}
          onClick={() => setMode("url")}
        >
          URL 입력
        </button>
        <button
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === "upload" ? "bg-white shadow-sm font-medium" : "text-gray-500"}`}
          onClick={() => setMode("upload")}
        >
          파일 업로드
        </button>
      </div>

      {mode === "url" ? (
        <>
          <label className="block text-xs text-gray-500 mb-1">이미지 URL</label>
          <input 
            className="w-full border rounded-lg p-2 text-sm mb-3" 
            value={props.src || ""} 
            onChange={(e) => setProp((p: ImageProps) => (p.src = e.target.value))} 
            placeholder="https://..."
          />
        </>
      ) : (
        <>
          <label className="block text-xs text-gray-500 mb-1">이미지 파일</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 mb-3 text-center cursor-pointer transition-colors ${
              dragOver ? "border-[#3182F6] bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {uploading ? (
              <div className="text-sm text-gray-500">처리 중...</div>
            ) : (
              <>
                <div className="text-2xl mb-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>
                <div className="text-xs text-gray-500">
                  클릭하거나 이미지를 드래그하세요
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  최대 800px로 리사이즈됩니다
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </>
      )}

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
