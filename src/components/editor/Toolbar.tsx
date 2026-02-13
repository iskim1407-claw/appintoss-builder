"use client";

import { useEditor } from "@craftjs/core";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { generateHTML } from "@/lib/htmlGenerator";
import { generateAitProject } from "@/lib/aitExportGenerator";
import { PreviewPanel } from "./PreviewPanel";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Undo2, Redo2, Smartphone, Sun, Moon, FolderOpen, Save, Eye,
  Download, FileCode, Package, ChevronDown, Check, PartyPopper
} from "lucide-react";

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

  useEffect(() => {
    const saved = localStorage.getItem("appintoss-project-name");
    if (saved) setProjectName(saved);
  }, []);

  const handleSave = useCallback(() => {
    const json = query.serialize();
    localStorage.setItem("appintoss-save", json);
    localStorage.setItem("appintoss-project-name", projectName);
    track("project_saved", { projectName });

    const toast = document.createElement("div");
    toast.className = "fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 glass-dark text-white px-4 py-2.5 rounded-2xl text-sm font-medium z-50 animate-fade-in-up flex items-center gap-2";
    toast.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 저장되었습니다`;
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
      toast.className = "fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 glass-dark text-white px-4 py-2.5 rounded-2xl text-sm font-medium z-50 animate-fade-in-up flex items-center gap-2";
      toast.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 불러왔습니다`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } else {
      alert("저장된 데이터가 없습니다.");
    }
  }, [actions]);

  const handleExportHTML = useCallback(async () => {
    const json = query.serialize();
    const html = generateHTML(json, { darkMode, projectName, tossMode });

    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("README.md", `# ${projectName}\n\n이 파일을 앱인토스 콘솔에 업로드하세요.\n\n---\n앱인토스 빌더로 제작됨\n`);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${projectName.replace(/\s+/g, "-").toLowerCase()}.zip`);
    track("export_html", { projectName });
    setLastExportType('html');
    setShowExport(true);
    setShowExportMenu(false);
  }, [query, darkMode, projectName, tossMode]);

  const handleExportSDK = useCallback(async () => {
    const json = query.serialize();
    const files = generateAitProject(json, projectName);

    const zip = new JSZip();
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${projectName.replace(/\s+/g, "-").toLowerCase()}-sdk.zip`);
    track("export_sdk", { projectName });
    setLastExportType('sdk');
    setShowExport(true);
    setShowExportMenu(false);
  }, [query, projectName]);

  const handleExport = useCallback(() => {
    setShowExportMenu(prev => !prev);
  }, []);

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

  const ToolbarButton = ({ onClick, disabled, title, children, className = "" }: {
    onClick?: () => void; disabled?: boolean; title?: string; children: React.ReactNode; className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 disabled:opacity-25 disabled:hover:bg-transparent transition-smooth ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Desktop Toolbar */}
      <div className="hidden md:flex h-12 bg-white/80 backdrop-blur-sm border-b border-gray-100/80 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-base font-bold bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] bg-clip-text text-transparent">
            앱인토스
          </Link>
          <div className="w-px h-4 bg-gray-200" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-sm text-gray-700 font-medium bg-transparent border-none outline-none w-32 hover:bg-gray-50/80 px-2 py-1 rounded-lg focus:bg-gray-100/80 transition-smooth"
            placeholder="프로젝트 이름"
          />
        </div>

        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => actions.history.undo()} disabled={!canUndo} title="실행취소 (⌘Z)">
            <Undo2 size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions.history.redo()} disabled={!canRedo} title="다시실행 (⌘⇧Z)">
            <Redo2 size={16} />
          </ToolbarButton>
          
          <div className="w-px h-5 bg-gray-200/60 mx-1" />
          
          {/* Viewport Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowViewport(!showViewport)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl hover:bg-gray-100/60 text-gray-600 transition-smooth font-medium"
            >
              <Smartphone size={14} />
              {viewportWidth}px
              <ChevronDown size={12} className={`transition-transform ${showViewport ? "rotate-180" : ""}`} />
            </button>
            {showViewport && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100/80 py-1 z-50 min-w-[160px] animate-fade-in">
                {VIEWPORT_SIZES.map((vp) => (
                  <button
                    key={vp.width}
                    onClick={() => { setViewportWidth(vp.width); setShowViewport(false); }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between transition-smooth ${
                      viewportWidth === vp.width ? "text-[#3182F6] font-medium" : "text-gray-600"
                    }`}
                  >
                    <span>{vp.name}</span>
                    <span className="text-xs text-gray-400">{vp.width}px</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <ToolbarButton onClick={() => setDarkMode(!darkMode)} title={darkMode ? "라이트 모드" : "다크 모드"}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </ToolbarButton>
          
          {/* Toss Mode Toggle */}
          <button 
            onClick={() => setTossMode?.(!tossMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl font-medium transition-smooth ${
              tossMode 
                ? "bg-[#3182F6] text-white shadow-sm shadow-blue-200/40" 
                : "text-gray-500 hover:bg-gray-100/60"
            }`}
            title="Toss MiniApp 심사 모드"
          >
            {tossMode && <Check size={12} />}
            토스
          </button>
          
          <div className="w-px h-5 bg-gray-200/60 mx-1" />
          
          <ToolbarButton onClick={handleLoad} title="불러오기">
            <FolderOpen size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleSave} title="저장 (⌘S)">
            <Save size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => { setShowPreview(true); track("preview_opened"); }} title="미리보기">
            <Eye size={16} />
          </ToolbarButton>
          
          <div className="relative">
            <button 
              onClick={handleExport} 
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-xl bg-[#3182F6] text-white hover:bg-[#1B64DA] font-medium transition-smooth shadow-sm shadow-blue-200/40 active:scale-[0.98]"
            >
              <Download size={14} />
              내보내기
            </button>
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100/80 py-1.5 z-50 w-56 animate-fade-in">
                <button
                  onClick={handleExportHTML}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-smooth"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FileCode size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">HTML 내보내기</div>
                    <div className="text-[11px] text-gray-400">미리보기용 · 단일 파일</div>
                  </div>
                </button>
                <button
                  onClick={handleExportSDK}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-smooth"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Package size={16} className="text-[#3182F6]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#3182F6]">앱인토스 SDK</div>
                    <div className="text-[11px] text-gray-400">심사 제출용 · React 프로젝트</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="flex md:hidden h-14 bg-white/90 backdrop-blur-sm border-b border-gray-100/80 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-base font-bold text-[#3182F6]">앱인토스</Link>
          <div className="w-px h-4 bg-gray-200" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-sm text-gray-700 font-medium bg-transparent border-none outline-none w-20 px-1 py-0.5 rounded focus:bg-gray-100"
            placeholder="이름"
          />
          {tossMode && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-[#3182F6] text-white font-semibold">
              토스
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setTossMode?.(!tossMode)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-smooth ${tossMode ? "text-[#3182F6]" : "text-gray-400"} active:bg-gray-100`}
            title="토스 심사 모드"
          >
            {tossMode ? <Check size={18} /> : <span className="text-sm font-bold">T</span>}
          </button>
          <button onClick={handleSave} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-gray-500 active:bg-gray-100 transition-smooth" title="저장">
            <Save size={18} />
          </button>
          <div className="relative">
            <button 
              onClick={handleExport} 
              className="flex items-center gap-1 px-4 py-2.5 text-sm rounded-xl bg-[#3182F6] text-white active:bg-[#1B64DA] font-medium transition-smooth min-h-[44px]"
            >
              <Download size={13} />
              내보내기
            </button>
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100/80 py-1 z-50 w-52 animate-fade-in">
                <button onClick={handleExportHTML} className="w-full px-4 py-3 text-sm text-left active:bg-gray-50 flex items-center gap-3">
                  <FileCode size={16} className="text-orange-500" />
                  <div><div className="font-medium">HTML</div><div className="text-[11px] text-gray-400">미리보기용</div></div>
                </button>
                <button onClick={handleExportSDK} className="w-full px-4 py-3 text-sm text-left active:bg-gray-50 flex items-center gap-3">
                  <Package size={16} className="text-[#3182F6]" />
                  <div><div className="font-medium text-[#3182F6]">앱인토스 SDK</div><div className="text-[11px] text-gray-400">심사 제출용</div></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <PreviewPanel
          serializedJson={query.serialize()}
          darkMode={darkMode}
          viewportWidth={viewportWidth}
          projectName={projectName}
          tossMode={tossMode}
          onClose={() => setShowPreview(false)}
          onToggleDark={() => setDarkMode(!darkMode)}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowExport(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full mx-4 animate-slide-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PartyPopper size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">내보내기 완료!</h3>
              <p className="text-gray-500 text-sm">{lastExportType === 'sdk' ? '앱인토스 SDK 프로젝트가' : 'HTML'} 다운로드되었습니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              {lastExportType === 'sdk' ? (
                <>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Package size={16} className="text-[#3182F6]" />
                    SDK 프로젝트 사용법
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. ZIP 파일 압축 해제</li>
                    <li>2. <code className="bg-gray-200 px-1.5 py-0.5 rounded-md text-xs">npm install</code> 실행</li>
                    <li>3. <code className="bg-gray-200 px-1.5 py-0.5 rounded-md text-xs">npm run dev</code>로 개발 서버 실행</li>
                    <li>4. <code className="bg-gray-200 px-1.5 py-0.5 rounded-md text-xs">npm run build</code>로 빌드</li>
                    <li>5. <a href="https://apps-in-toss.toss.im" className="text-[#3182F6] underline" target="_blank" rel="noopener noreferrer">앱인토스 콘솔</a>에서 심사 제출</li>
                  </ol>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <FileCode size={16} className="text-orange-500" />
                    앱인토스에 업로드하는 방법
                  </h4>
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
            <button onClick={() => setShowExport(false)} className="w-full bg-[#3182F6] text-white py-3 rounded-2xl font-semibold active:bg-[#1B64DA] transition-smooth active:scale-[0.98]">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};
