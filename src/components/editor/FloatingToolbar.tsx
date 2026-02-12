"use client";

import { useEditor } from "@craftjs/core";
import React from "react";

/**
 * 선택된 컴포넌트 위에 플로팅 액션바 표시
 * - 위/아래 이동, 복제, 삭제
 * - 데스크탑 & 모바일 모두 동작
 */
export const FloatingToolbar = () => {
  const { selected, actions, query } = useEditor((state) => {
    const nodeId = state.events.selected ? Array.from(state.events.selected)[0] : undefined;
    if (!nodeId || nodeId === "ROOT") return { selected: null };
    
    const node = state.nodes[nodeId];
    if (!node) return { selected: null };
    
    return {
      selected: {
        id: nodeId,
        name: node.data.displayName || node.data.name || "컴포넌트",
        isDeletable: node.data.name !== "Canvas",
      },
    };
  });

  if (!selected) return null;

  const getPosition = () => {
    try {
      const parentId = query.node(selected.id).get().data.parent;
      if (!parentId) return { index: 0, total: 0 };
      const parentNode = query.node(parentId).get();
      const siblings = parentNode.data.nodes || [];
      return { index: siblings.indexOf(selected.id), total: siblings.length };
    } catch {
      return { index: 0, total: 0 };
    }
  };

  const { index, total } = getPosition();

  const handleMoveUp = () => {
    try {
      const parentId = query.node(selected.id).get().data.parent;
      if (parentId && index > 0) {
        actions.move(selected.id, parentId, index - 1);
      }
    } catch (e) { console.error(e); }
  };

  const handleMoveDown = () => {
    try {
      const parentId = query.node(selected.id).get().data.parent;
      if (parentId && index < total - 1) {
        actions.move(selected.id, parentId, index + 2);
      }
    } catch (e) { console.error(e); }
  };

  const handleDuplicate = () => {
    try {
      const nodeTree = query.node(selected.id).toNodeTree();
      const parentId = query.node(selected.id).get().data.parent;
      if (parentId) {
        actions.addNodeTree(nodeTree, parentId, index + 1);
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = () => {
    if (selected.isDeletable) {
      actions.delete(selected.id);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-1 bg-gray-900/95 backdrop-blur-sm text-white rounded-2xl px-2 py-1.5 shadow-xl">
        {/* 컴포넌트 이름 */}
        <span className="text-xs font-medium px-2 text-gray-300 max-w-[80px] truncate">
          {selected.name}
        </span>
        
        <div className="w-px h-5 bg-gray-700" />
        
        {/* 위로 */}
        <button
          onClick={handleMoveUp}
          disabled={index <= 0}
          className="p-2 rounded-xl hover:bg-gray-700 active:bg-gray-600 disabled:opacity-30 transition"
          title="위로 이동"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3L3 8h3v5h4V8h3L8 3z" fill="currentColor"/>
          </svg>
        </button>
        
        {/* 아래로 */}
        <button
          onClick={handleMoveDown}
          disabled={index >= total - 1}
          className="p-2 rounded-xl hover:bg-gray-700 active:bg-gray-600 disabled:opacity-30 transition"
          title="아래로 이동"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 13l5-5h-3V3H6v5H3l5 5z" fill="currentColor"/>
          </svg>
        </button>
        
        <div className="w-px h-5 bg-gray-700" />
        
        {/* 복제 */}
        <button
          onClick={handleDuplicate}
          className="p-2 rounded-xl hover:bg-gray-700 active:bg-gray-600 transition"
          title="복제"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 11V3.5A1.5 1.5 0 014.5 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        {/* 삭제 */}
        {selected.isDeletable && (
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl hover:bg-red-600 active:bg-red-500 transition"
            title="삭제"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V3m-8 0h10m-1 0v9.5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 014 12.5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        
        <div className="w-px h-5 bg-gray-700" />
        
        {/* 선택 해제 */}
        <button
          onClick={() => actions.selectNode(undefined)}
          className="p-2 rounded-xl hover:bg-gray-700 active:bg-gray-600 transition"
          title="선택 해제"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
