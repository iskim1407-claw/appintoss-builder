"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { usePageStore } from "@/lib/pageStore";
import { Home } from "lucide-react";

/**
 * PageTabs — 에디터 상단 페이지 탭 바
 * 페이지 추가/삭제/이름변경/순서변경/전환 지원
 */
export function PageTabs() {
  const { pages, currentPageId, addPage, deletePage, renamePage, setCurrentPage, updatePageState, reorderPages } = usePageStore();
  const { query, actions } = useEditor();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 현재 캔버스 상태를 저장
  const saveCurrentState = useCallback(() => {
    try {
      const serialized = query.serialize();
      if (serialized && serialized !== "{}") {
        updatePageState(currentPageId, serialized);
      }
    } catch (e) {
      console.warn("Failed to save page state:", e);
    }
  }, [query, currentPageId, updatePageState]);

  // 페이지 전환
  const handleSwitch = useCallback((pageId: string) => {
    if (pageId === currentPageId) return;

    // 1. 현재 상태 저장
    saveCurrentState();

    // 2. 전환
    setCurrentPage(pageId);

    // 3. 새 페이지 상태 로드
    const targetPage = usePageStore.getState().pages.find(p => p.id === pageId);
    if (targetPage?.craftState) {
      try {
        actions.deserialize(targetPage.craftState);
      } catch (e) {
        console.warn("Failed to load page state:", e);
      }
    }
  }, [currentPageId, saveCurrentState, setCurrentPage, actions]);

  // 페이지 추가
  const handleAdd = useCallback(() => {
    saveCurrentState();
    const newId = addPage();
    // 새 페이지로 전환 (빈 캔버스)
    const newPage = usePageStore.getState().pages.find(p => p.id === newId);
    if (newPage?.craftState) {
      try {
        actions.deserialize(newPage.craftState);
      } catch (e) {
        console.warn("Failed to init new page:", e);
      }
    }
    // 스크롤 끝으로
    setTimeout(() => {
      scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
    }, 50);
  }, [saveCurrentState, addPage, actions]);

  // 페이지 삭제
  const handleDelete = useCallback((e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    if (pages.length <= 1) return;
    const page = pages.find(p => p.id === pageId);
    if (page?.isHome) return;

    const wasActive = pageId === currentPageId;
    deletePage(pageId);

    if (wasActive) {
      const remaining = usePageStore.getState().pages;
      const first = remaining[0];
      if (first?.craftState) {
        try { actions.deserialize(first.craftState); } catch {}
      }
    }
  }, [pages, currentPageId, deletePage, actions]);

  // 더블클릭 → 이름 변경
  const startRename = useCallback((pageId: string, name: string) => {
    setEditingId(pageId);
    setEditName(name);
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  const commitRename = useCallback(() => {
    if (editingId && editName.trim()) {
      renamePage(editingId, editName.trim());
    }
    setEditingId(null);
  }, [editingId, editName, renamePage]);

  // 드래그 정렬
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDropIdx(idx);
  };
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) {
      reorderPages(dragIdx, idx);
    }
    setDragIdx(null);
    setDropIdx(null);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
    setDropIdx(null);
  };

  // 주기적으로 현재 페이지 상태 자동 저장 (3초마다)
  useEffect(() => {
    const timer = setInterval(saveCurrentState, 3000);
    return () => clearInterval(timer);
  }, [saveCurrentState]);

  return (
    <div className="flex items-center bg-white border-b border-gray-100 px-2 h-9 gap-1 overflow-hidden">
      {/* 탭 스크롤 영역 */}
      <div ref={scrollRef} className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-1 min-w-0">
        {pages.map((page, idx) => {
          const isActive = page.id === currentPageId;
          const isDragging = dragIdx === idx;
          const isDropTarget = dropIdx === idx && dragIdx !== idx;

          return (
            <div
              key={page.id}
              draggable={editingId !== page.id}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onClick={() => handleSwitch(page.id)}
              onDoubleClick={() => startRename(page.id, page.name)}
              className={`
                group flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer
                whitespace-nowrap select-none transition-all shrink-0
                ${isActive
                  ? "bg-[#3182F6] text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }
                ${isDragging ? "opacity-40" : ""}
                ${isDropTarget ? "ring-2 ring-[#3182F6]/50" : ""}
              `}
            >
              {page.isHome && <Home size={10} />}

              {editingId === page.id ? (
                <input
                  ref={inputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/20 text-inherit outline-none w-16 px-1 rounded text-xs"
                  autoFocus
                />
              ) : (
                <span className="max-w-[80px] truncate">{page.name}</span>
              )}

              {/* 삭제 버튼 (홈 제외, 페이지 2개 이상) */}
              {!page.isHome && pages.length > 1 && (
                <button
                  onClick={(e) => handleDelete(e, page.id)}
                  className={`
                    ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px]
                    opacity-0 group-hover:opacity-100 transition-opacity
                    ${isActive ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-gray-400"}
                  `}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 페이지 추가 버튼 */}
      <button
        onClick={handleAdd}
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition text-sm"
        title="페이지 추가"
      >
        +
      </button>
    </div>
  );
}
