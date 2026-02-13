"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useCallback } from "react";

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onPreviewToggle?: () => void;
}

export function useKeyboardShortcuts(options?: KeyboardShortcutsOptions) {
  const { actions, query, selected, canUndo, canRedo } = useEditor((state, query) => {
    const selectedNodeIds = Array.from(state.events.selected);
    return {
      selected: selectedNodeIds.length > 0 ? selectedNodeIds[0] : null,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    };
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) {
        // Still allow Escape in inputs
        if (e.key !== "Escape") return;
      }

      const mod = e.metaKey || e.ctrlKey;

      // Ctrl+Z / Ctrl+Shift+Z — undo/redo
      if (mod && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) actions.history.redo();
        } else {
          if (canUndo) actions.history.undo();
        }
        return;
      }

      // Ctrl+S — save
      if (mod && e.key === "s") {
        e.preventDefault();
        options?.onSave?.();
        return;
      }

      // Ctrl+P — preview toggle
      if (mod && e.key === "p") {
        e.preventDefault();
        options?.onPreviewToggle?.();
        return;
      }

      // Delete / Backspace — delete selected component
      if ((e.key === "Delete" || e.key === "Backspace") && selected) {
        e.preventDefault();
        try {
          // Don't delete ROOT
          const node = query.node(selected).get();
          if (node && selected !== "ROOT") {
            actions.delete(selected);
          }
        } catch (err) {
          console.warn("Delete failed:", err);
        }
        return;
      }

      // Escape — deselect
      if (e.key === "Escape") {
        actions.selectNode(undefined as unknown as string);
        return;
      }
    },
    [actions, query, selected, canUndo, canRedo, options]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
