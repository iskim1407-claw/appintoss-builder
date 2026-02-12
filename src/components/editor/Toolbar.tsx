"use client";

import { useEditor } from "@craftjs/core";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { generateHTML } from "@/lib/htmlGenerator";
import { generateAitProject } from "@/lib/aitExportGenerator";

interface ViewportSize {
  name: string;
  width: number;
}

const VIEWPORT_SIZES: ViewportSize[] = [
  { name: "iPhone SE", width: 375 },
  { name: "Android", width: 360 },
  { name: "iPhone Plus", width: 414 },
  { name: "iPhone Pro Max", width: 430 },
];

interface ToolbarProps {
  viewportWidth: number;
  setViewportWidth: (width: number) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  tossMode?: boolean;
  setTossMode?: (mode: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Toolbar = ({ viewportWidth, setViewportWidth, darkMode, setDarkMode, tossMode = false, setTossMode }: ToolbarProps) => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showViewport, setShowViewport] = useState(false);
  const [projectName, setProjectName] = useState("내 미니앱");
  const [lastExportType, setLastExportType] = useState<'html' | 'sdk'>('html');

  // Load project name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appintoss-project-name");
    if (saved) setProjectName(saved);
  }, []);

  const handleSave = useCallback(() => {
    const json = query.serialize();
    localStorage.setItem("appintoss-save", json);
    localStorage.setItem("appintoss-project-name", projectName);
    
    // Show toast notification
    const toast = document.createElement("div");
    toast.className = "fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium z-50 animate-fade-in";
    toast.textContent = "✓ 저장되었습니다";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }, [query, projectName]);

  const handleLoad = useCallback(() => {
    const data = localStorage.getItem("appintoss-save");
    if (data) {
      actions.deserialize(data);
      const savedName = localStorage.getItem("appintoss-project-name");
      if (savedName) setProjectName(savedName);
      
      const toast = document.createElement("div");
      toast.className = "fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium z-50";
      toast.textContent = "✓ 불러왔습니다";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } else {
      alert("저장된 데이터가 없습니다.");
    }
  }, [actions]);

  const handleExportHTML = useCallback(async () => {
    const json = query.serialize();
    const html = generateHTML(json, { darkMode, projectName, tossMode });

    const JSZip = (await import("jszip")).default;
    const { saveAs } = await import("file-saver");

    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("README.md", `# ${projectName}\n\n이 파일을 앱인토스 콘솔에 업로드하세요.\n\n---\n앱인토스 빌더로 제작됨\n`);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${projectName.replace(/\s+/g, "-").toLowerCase()}.zip`);
    setLastExportType('html');
    setShowExport(true);
    setShowExportMenu(false);
  }, [query, darkMode, projectName, tossMode]);

  const handleExportSDK = useCallback(async () => {
    const json = query.serialize();
    const files = generateAitProject(json, projectName);

    const JSZip = (await import("jszip")).default;
    const { saveAs } = await import("file-saver");

    const zip = new JSZip();
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${projectName.replace(/\s+/g, "-").toLowerCase()}-sdk.zip`);
    setLastExportType('sdk');
    setShowExport(true);
    setShowExportMenu(false);
  }, [query, projectName]);

  const handleExport = useCallback(() => {
    setShowExportMenu(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) actions.history.redo();
        } else {
          if (canUndo) actions.history.undo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, actions, canUndo, canRedo]);

  return (
    <>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0); }
      `}</style>

      {/* Desktop Toolbar */}
      <div className="hidden md:flex h-14 bg-white border-b border-gray-100 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold text-[#3182F6]">앱인토스</Link>
          <span className="text-gray-300">|</span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-sm text-gray-700 font-medium bg-transparent border-none outline-none w-32 hover:bg-gray-50 px-2 py-1 rounded-lg focus:bg-gray-100"
            placeholder="프로젝트 이름"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Undo/Redo */}
          <button 
            onClick={() => actions.history.undo()} 
            disabled={!canUndo} 
            className="p-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
            title="실행취소 (⌘Z)"
          >
            ↩
          </button>
          <button 
            onClick={() => actions.history.redo()} 
            disabled={!canRedo} 
            className="p-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
            title="다시실행 (⌘⇧Z)"
          >
            ↪
          </button>
          
          <div className="w-px h-6 bg-gray-200 mx-1" />
          
          {/* Viewport Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowViewport(!showViewport)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5"
            >
              📱 {viewportWidth}px
            </button>
            {showViewport && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                {VIEWPORT_SIZES.map((vp) => (
                  <button
                    key={vp.width}
                    onClick={() => { setViewportWidth(vp.width); setShowViewport(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${viewportWidth === vp.width ? "text-[#3182F6] font-medium" : ""}`}
                  >
                    {vp.name} ({vp.width}px)
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition ${darkMode ? "bg-gray-800 text-white border-gray-700" : "border-gray-200 hover:bg-gray-50"}`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          
          {/* Toss Mode Toggle */}
          <button 
            onClick={() => setTossMode?.(!tossMode)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition flex items-center gap-1 ${tossMode ? "bg-[#0064FF] text-white border-[#0064FF]" : "border-gray-200 hover:bg-gray-50"}`}
            title="Toss MiniApp 심사 모드"
          >
            {tossMode ? "✓" : ""} 토스
          </button>
          
          <div className="w-px h-6 bg-gray-200 mx-1" />
          
          {/* File Operations */}
          <button 
            onClick={handleLoad} 
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            📂
          </button>
          <button 
            onClick={handleSave} 
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
            title="저장 (⌘S)"
          >
            💾
          </button>
          <button 
            onClick={() => setShowPreview(true)} 
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            👁
          </button>
          <div className="relative">
            <button 
              onClick={handleExport} 
              className="px-4 py-1.5 text-sm rounded-lg bg-[#3182F6] text-white hover:bg-[#1B64DA] font-medium"
            >
              📦 내보내기
            </button>
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 w-56">
                <button
                  onClick={handleExportHTML}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <span>📄</span>
                  <div>
                    <div className="font-medium">HTML 내보내기</div>
                    <div className="text-xs text-gray-400">미리보기용 · 단일 파일</div>
                  </div>
                </button>
                <button
                  onClick={handleExportSDK}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <span>📦</span>
                  <div>
                    <div className="font-medium text-[#3182F6]">앱인토스 SDK</div>
                    <div className="text-xs text-gray-400">심사 제출용 · React 프로젝트</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="flex md:hidden h-12 bg-white border-b border-gray-100 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-base font-bold text-[#3182F6]">앱인토스</Link>
          <span className="text-gray-300">|</span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-sm text-gray-700 font-medium bg-transparent border-none outline-none w-20 px-1 py-0.5 rounded focus:bg-gray-100"
            placeholder="이름"
          />
          {tossMode && (
            <span className="px-1.5 py-0.5 text-xs rounded bg-[#0064FF] text-white font-medium">
              토스
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toss Mode Toggle (Mobile) */}
          <button 
            onClick={() => setTossMode?.(!tossMode)}
            className={`p-2 text-base rounded-lg ${tossMode ? "text-[#0064FF]" : "text-gray-400"} active:bg-gray-100`}
            title="토스 심사 모드"
          >
            {tossMode ? "✓T" : "T"}
          </button>
          <button 
            onClick={handleSave} 
            className="p-2 text-base rounded-lg active:bg-gray-100"
            title="저장"
          >
            💾
          </button>
          <div className="relative">
            <button 
              onClick={handleExport} 
              className="px-3 py-1.5 text-sm rounded-lg bg-[#3182F6] text-white active:bg-[#1B64DA] font-medium"
            >
              📦 내보내기
            </button>
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 w-52">
                <button onClick={handleExportHTML} className="w-full px-4 py-3 text-sm text-left active:bg-gray-50 flex items-center gap-2">
                  <span>📄</span><div><div className="font-medium">HTML</div><div className="text-xs text-gray-400">미리보기용</div></div>
                </button>
                <button onClick={handleExportSDK} className="w-full px-4 py-3 text-sm text-left active:bg-gray-50 flex items-center gap-2">
                  <span>📦</span><div><div className="font-medium text-[#3182F6]">앱인토스 SDK</div><div className="text-xs text-gray-400">심사 제출용</div></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          query={query}
          darkMode={darkMode}
          viewportWidth={viewportWidth}
          onClose={() => setShowPreview(false)}
          onToggleDark={() => setDarkMode(!darkMode)}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowExport(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-bold mb-2">내보내기 완료!</h3>
              <p className="text-gray-500 text-sm">{lastExportType === 'sdk' ? '앱인토스 SDK 프로젝트가' : 'HTML'} 다운로드되었습니다.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              {lastExportType === 'sdk' ? (
                <>
                  <h4 className="font-bold text-sm mb-3">📋 SDK 프로젝트 사용법</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. ZIP 파일 압축 해제</li>
                    <li>2. <code className="bg-gray-200 px-1 rounded">npm install</code> 실행</li>
                    <li>3. <code className="bg-gray-200 px-1 rounded">npm run dev</code>로 개발 서버 실행</li>
                    <li>4. <code className="bg-gray-200 px-1 rounded">npm run build</code>로 빌드</li>
                    <li>5. <a href="https://apps-in-toss.toss.im" className="text-[#3182F6] underline" target="_blank" rel="noopener noreferrer">앱인토스 콘솔</a>에서 심사 제출</li>
                  </ol>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm mb-3">📋 앱인토스에 업로드하는 방법</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. <a href="https://apps-in-toss.toss.im" className="text-[#3182F6] underline" target="_blank" rel="noopener noreferrer">앱인토스 콘솔</a> 접속</li>
                    <li>2. &apos;새 앱 만들기&apos; 클릭</li>
                    <li>3. &apos;파일 업로드&apos; 선택</li>
                    <li>4. 다운로드한 ZIP 파일 업로드</li>
                    <li>5. 앱 정보 입력 후 심사 제출</li>
                  </ol>
                </>
              )}
            </div>
            <button onClick={() => setShowExport(false)} className="w-full bg-[#3182F6] text-white py-3 rounded-xl font-semibold active:bg-[#1B64DA]">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Preview Modal Component
interface PreviewModalProps {
  query: ReturnType<typeof useEditor>["query"];
  darkMode: boolean;
  viewportWidth: number;
  onClose: () => void;
  onToggleDark: () => void;
}

function PreviewModal({ query, darkMode, viewportWidth, onClose, onToggleDark }: PreviewModalProps) {
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    const json = query.serialize();
    const html = generateHTML(json, { darkMode });
    setPreviewHtml(html);
  }, [query, darkMode]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-3xl p-4 md:p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">미리보기</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleDark} 
              className={`text-sm px-3 py-1 rounded-lg border ${darkMode ? "bg-gray-800 text-white border-gray-700" : "border-gray-300"}`}
            >
              {darkMode ? "☀️ 라이트" : "🌙 다크"}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        <div 
          className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-800"
          style={{ width: Math.min(viewportWidth, 375), height: 700 }}
        >
          {/* Toss Status Bar */}
          <div className={`h-11 flex items-center justify-between px-6 text-xs ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <span className="font-semibold">9:41</span>
            <div className="flex gap-1">
              <span>📶</span><span>🔋</span>
            </div>
          </div>
          {/* Toss Nav */}
          <div className={`h-11 flex items-center px-4 border-b ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
            <span className={`text-sm ${darkMode ? "text-white" : ""}`}>←</span>
            <span className={`flex-1 text-center text-sm font-medium ${darkMode ? "text-white" : ""}`}>미니앱</span>
            <span className="text-sm">⋯</span>
          </div>
          {/* Content via iframe */}
          <iframe
            srcDoc={previewHtml}
            className="w-full h-[calc(100%-88px)] border-none"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
