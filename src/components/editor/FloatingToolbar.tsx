"use client";

import { useEditor } from "@craftjs/core";
import React, { useRef } from "react";
import { ArrowUp, ArrowDown, Copy, Trash2, X } from "lucide-react";

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
      {/* 고정 하단 바 — 글래스모피즘 */}
      <div 
        ref={ref}
        style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}
        className="animate-slide-up"
      >
        <div 
          className="flex items-center gap-0.5 rounded-2xl px-2 py-1.5 glass-dark"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}
        >
          <span className="text-xs font-medium px-2.5 py-1 text-gray-400 max-w-[120px] truncate">
            {selected.name}
          </span>
          
          <div className="w-px h-5 bg-white/10 mx-0.5" />
          
          <button
            onClick={handleMoveUp}
            disabled={index <= 0}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/15 disabled:opacity-25 transition-smooth text-white"
            title="위로"
          >
            <ArrowUp size={15} />
          </button>
          
          <button
            onClick={handleMoveDown}
            disabled={index >= total - 1}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/15 disabled:opacity-25 transition-smooth text-white"
            title="아래로"
          >
            <ArrowDown size={15} />
          </button>
          
          <div className="w-px h-5 bg-white/10 mx-0.5" />
          
          <button
            onClick={handleDuplicate}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/15 transition-smooth text-white"
            title="복제"
          >
            <Copy size={15} />
          </button>
          
          {selected.isDeletable && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl hover:bg-red-500/20 active:bg-red-500/30 transition-smooth text-red-400"
              title="삭제"
            >
              <Trash2 size={15} />
            </button>
          )}
          
          <div className="w-px h-5 bg-white/10 mx-0.5" />
          
          <button
            onClick={(e) => { e.stopPropagation(); actions.selectNode(undefined); }}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/15 transition-smooth text-gray-400"
            title="닫기"
          >
            <X size={15} />
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
