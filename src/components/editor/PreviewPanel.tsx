"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { generateHTML } from "@/lib/htmlGenerator";

interface PreviewPanelProps {
  serializedJson: string;
  darkMode: boolean;
  viewportWidth: number;
  projectName?: string;
  tossMode?: boolean;
  onClose: () => void;
  onToggleDark: () => void;
}

const DEVICES = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPhone 15 Pro Max", width: 430, height: 932 },
  { name: "Android", width: 360, height: 800 },
] as const;

export function PreviewPanel({
  serializedJson,
  darkMode,
  viewportWidth,
  projectName = "미니앱",
  tossMode = false,
  onClose,
  onToggleDark,
}: PreviewPanelProps) {
  const [previewHtml, setPreviewHtml] = useState("");
  const [device, setDevice] = useState(() =>
    DEVICES.find((d) => d.width === viewportWidth) ?? DEVICES[0]
  );
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isRendering, setIsRendering] = useState(false);

  // Debounced real-time rendering — updates within 150ms of changes
  const regenerate = useCallback(() => {
    setIsRendering(true);
    try {
      const html = generateHTML(serializedJson, {
        darkMode,
        projectName,
        tossMode,
      });
      setPreviewHtml(html);
    } catch {
      setPreviewHtml(
        "<!DOCTYPE html><html><body><p style='padding:24px;font-family:sans-serif;color:#999'>미리보기를 생성할 수 없습니다.</p></body></html>"
      );
    }
    setTimeout(() => setIsRendering(false), 100);
  }, [serializedJson, darkMode, projectName, tossMode]);

  useEffect(() => {
    const timer = setTimeout(regenerate, 150);
    return () => clearTimeout(timer);
  }, [regenerate]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    regenerate();
  };

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 dark:bg-gray-900 rounded-2xl md:rounded-3xl p-3 md:p-6 max-h-[95vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3 md:mb-4 gap-2 flex-wrap">
          <h3 className="font-bold text-sm md:text-base text-gray-800 flex items-center gap-2">
            👁 미리보기
            {isRendering && (
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-500 font-medium">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                렌더링 중
              </span>
            )}
          </h3>

          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            {/* Device Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {device.name}
              </button>
              {showDeviceMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[160px]">
                  {DEVICES.map((d) => (
                    <button
                      key={d.width}
                      onClick={() => {
                        setDevice(d);
                        setShowDeviceMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                        device.width === d.width
                          ? "text-[#3182F6] font-medium"
                          : ""
                      }`}
                    >
                      {d.name}{" "}
                      <span className="text-gray-400 text-xs">
                        {d.width}×{d.height}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <button
              onClick={onToggleDark}
              className={`px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm rounded-lg border transition ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
              title="새로고침"
            >
              🔄
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-500"
              title="닫기 (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Device Frame */}
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div
            className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[5px] border-gray-800 bg-black flex flex-col flex-shrink-0"
            style={{
              width: Math.min(device.width, window.innerWidth - 80),
              height: Math.min(
                device.height,
                window.innerHeight - 200
              ),
            }}
          >
            {/* Status Bar */}
            <div
              className={`h-11 flex items-center justify-between px-6 text-xs flex-shrink-0 ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }`}
            >
              <span className="font-semibold">9:41</span>
              <div className="flex gap-1 text-[10px]">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Toss Nav Bar */}
            <div
              className={`h-11 flex items-center px-4 border-b flex-shrink-0 ${
                darkMode
                  ? "border-gray-800 bg-gray-900 text-white"
                  : "border-gray-100 bg-white text-black"
              }`}
            >
              <span className="text-sm">←</span>
              <span className="flex-1 text-center text-sm font-medium truncate px-2">
                {projectName}
              </span>
              <span className="text-sm">⋯</span>
            </div>

            {/* Content */}
            <iframe
              ref={iframeRef}
              key={refreshKey}
              srcDoc={previewHtml}
              className="flex-1 w-full border-none bg-white"
              title="미리보기"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-gray-400 mt-2 md:mt-3">
          버튼 클릭 · 퀴즈 진행 · 캐러셀 스와이프 등 인터랙션을 테스트할 수
          있습니다
        </p>
      </div>
    </div>
  );
}
