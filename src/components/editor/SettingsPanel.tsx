"use client";

import { useEditor } from "@craftjs/core";
import React from "react";

interface SettingsPanelProps {
  isMobile?: boolean;
}

export const SettingsPanelComponent = ({ isMobile = false }: SettingsPanelProps) => {
  const { selected, actions, query } = useEditor((state) => {
    const currentNodeId = state.events.selected ? Array.from(state.events.selected)[0] : undefined;
    let selected;

    if (currentNodeId) {
      const node = state.nodes[currentNodeId];
      if (node) {
        selected = {
          id: currentNodeId,
          name: node.data.displayName || node.data.name || "컴포넌트",
          settings: node.related?.settings,
          isDeletable: node.data.name !== "Canvas",
        };
      }
    }
    return { selected };
  });

  const handleDuplicate = () => {
    if (!selected) return;
    
    try {
      const nodeTree = query.node(selected.id).toNodeTree();
      const parentId = query.node(selected.id).get().data.parent;
      
      if (parentId) {
        // Get the parent node's children to find position
        const parentNode = query.node(parentId).get();
        const siblings = parentNode.data.nodes || [];
        const currentIndex = siblings.indexOf(selected.id);
        
        // Simple duplicate by re-adding the node tree
        actions.addNodeTree(nodeTree, parentId, currentIndex + 1);
      }
    } catch (e) {
      console.error("Failed to duplicate:", e);
    }
  };

  const handleMoveUp = () => {
    if (!selected) return;
    const parentId = query.node(selected.id).get().data.parent;
    if (parentId) {
      const parentNode = query.node(parentId).get();
      const siblings = parentNode.data.nodes || [];
      const currentIndex = siblings.indexOf(selected.id);
      if (currentIndex > 0) {
        actions.move(selected.id, parentId, currentIndex - 1);
      }
    }
  };

  const handleMoveDown = () => {
    if (!selected) return;
    const parentId = query.node(selected.id).get().data.parent;
    if (parentId) {
      const parentNode = query.node(parentId).get();
      const siblings = parentNode.data.nodes || [];
      const currentIndex = siblings.indexOf(selected.id);
      if (currentIndex < siblings.length - 1) {
        actions.move(selected.id, parentId, currentIndex + 2);
      }
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {selected ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-700">{selected.name}</h2>
                <button
                  onClick={() => actions.selectNode(undefined)}
                  className="text-gray-400 active:text-gray-600 text-lg p-1"
                >
                  ✕
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleMoveUp}
                  className="flex-1 py-2.5 text-sm bg-gray-100 active:bg-gray-200 rounded-xl transition"
                  title="위로 이동"
                >
                  ↑ 위로
                </button>
                <button
                  onClick={handleMoveDown}
                  className="flex-1 py-2.5 text-sm bg-gray-100 active:bg-gray-200 rounded-xl transition"
                  title="아래로 이동"
                >
                  ↓ 아래로
                </button>
                <button
                  onClick={handleDuplicate}
                  className="flex-1 py-2.5 text-sm bg-gray-100 active:bg-gray-200 rounded-xl transition"
                  title="복제"
                >
                  📋 복제
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="flex-1 overflow-y-auto p-4">
              {selected.settings && React.createElement(selected.settings)}
            </div>

            {/* Delete Button */}
            {selected.isDeletable && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => actions.delete(selected.id)}
                  className="w-full py-3 text-base text-red-500 border border-red-200 rounded-xl active:bg-red-50 transition font-medium"
                >
                  🗑️ 컴포넌트 삭제
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-4">👆</div>
              <p className="text-base font-medium mb-2">컴포넌트를 선택하세요</p>
              <p className="text-sm">캔버스에서 컴포넌트를 탭하면<br />여기서 편집할 수 있어요</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="w-72 bg-white border-l border-gray-100 flex flex-col overflow-hidden">
      {selected ? (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">{selected.name}</h2>
              <button
                onClick={() => actions.selectNode(undefined)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-1">
              <button
                onClick={handleMoveUp}
                className="flex-1 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                title="위로 이동"
              >
                ↑ 위로
              </button>
              <button
                onClick={handleMoveDown}
                className="flex-1 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                title="아래로 이동"
              >
                ↓ 아래로
              </button>
              <button
                onClick={handleDuplicate}
                className="flex-1 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                title="복제"
              >
                📋 복제
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="flex-1 overflow-y-auto p-4">
            {selected.settings && React.createElement(selected.settings)}
          </div>

          {/* Delete Button */}
          {selected.isDeletable && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => actions.delete(selected.id)}
                className="w-full py-2.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                🗑️ 컴포넌트 삭제
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-3">👆</div>
            <p className="text-sm font-medium mb-1">컴포넌트를 선택하세요</p>
            <p className="text-xs">캔버스에서 컴포넌트를 클릭하면<br />여기서 편집할 수 있어요</p>
          </div>
        </div>
      )}
    </div>
  );
};
