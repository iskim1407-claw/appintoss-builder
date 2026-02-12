"use client";

import { useEditor } from "@craftjs/core";
import React, { useRef } from "react";

/**
 * 선택된 컴포넌트 위에 인라인 액션바 표시
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

  const ref = useRef<HTMLDivElement>(null);

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

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const parentId = query.node(selected.id).get().data.parent;
      if (parentId && index > 0) {
        actions.move(selected.id, parentId, index - 1);
      }
    } catch (e) { console.error(e); }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const parentId = query.node(selected.id).get().data.parent;
      if (parentId && index < total - 1) {
        actions.move(selected.id, parentId, index + 2);
      }
    } catch (e) { console.error(e); }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nodeTree = query.node(selected.id).toNodeTree();
      const parentId = query.node(selected.id).get().data.parent;
      if (parentId) {
        actions.addNodeTree(nodeTree, parentId, index + 1);
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.isDeletable) {
      actions.delete(selected.id);
    }
  };

  return (
    <>
      {/* 고정 하단 바 — 항상 보임 */}
      <div 
        ref={ref}
        style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}
      >
        <div className="flex items-center gap-1 bg-gray-900 text-white rounded-2xl px-3 py-2 shadow-2xl" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <span className="text-xs font-medium px-2 text-gray-300 max-w-[100px] truncate">
            {selected.name}
          </span>
          
          <div className="w-px h-5 bg-gray-700" />
          
          <button
            onClick={handleMoveUp}
            disabled={index <= 0}
            className="px-3 py-1.5 rounded-xl hover:bg-gray-700 active:bg-gray-600 disabled:opacity-30 transition text-sm font-medium"
          >
            ↑ 위로
          </button>
          
          <button
            onClick={handleMoveDown}
            disabled={index >= total - 1}
            className="px-3 py-1.5 rounded-xl hover:bg-gray-700 active:bg-gray-600 disabled:opacity-30 transition text-sm font-medium"
          >
            ↓ 아래로
          </button>
          
          <div className="w-px h-5 bg-gray-700" />
          
          <button
            onClick={handleDuplicate}
            className="px-2 py-1.5 rounded-xl hover:bg-gray-700 active:bg-gray-600 transition text-sm"
            title="복제"
          >
            📋
          </button>
          
          {selected.isDeletable && (
            <button
              onClick={handleDelete}
              className="px-2 py-1.5 rounded-xl hover:bg-red-600 active:bg-red-500 transition text-sm"
              title="삭제"
            >
              🗑️
            </button>
          )}
          
          <button
            onClick={(e) => { e.stopPropagation(); actions.selectNode(undefined); }}
            className="px-2 py-1.5 rounded-xl hover:bg-gray-700 active:bg-gray-600 transition text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};

/**
 * 각 컴포넌트에 감싸는 wrapper — 선택 시 아웃라인 + 상단 라벨
 * (이건 나중에 각 컴포넌트에 통합 가능)
 */
export const NodeToolbar = () => {
  return null; // placeholder
};
