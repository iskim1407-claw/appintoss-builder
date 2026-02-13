"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { useProjectStore, Project } from "@/stores/projectStore";
import { Copy, Download, Trash2 } from "lucide-react";

// Auto-save hook: call inside <Editor>
export function useAutoSave() {
  const { query } = useEditor();
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDataRef = useRef<string>("");

  useEffect(() => {
    if (!currentProjectId) return;
    const interval = setInterval(() => {
      try {
        const data = query.serialize();
        if (data && data !== "{}" && data !== lastDataRef.current) {
          lastDataRef.current = data;
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            saveCurrentProject(data);
          }, 2000);
        }
      } catch {}
    }, 3000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, saveCurrentProject, currentProjectId]);
}

// Toast helper
function showToast(msg: string) {
  const el = document.createElement("div");
  el.className =
    "fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium z-[9999] transition-opacity";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 1800);
}

// --- ProjectManager Toolbar Component ---
export function ProjectManager() {
  const { query, actions } = useEditor();
  const {
    projects,
    currentProjectId,
    createProject,
    saveCurrentProject,
    loadProject,
    renameProject,
    deleteProject,
    duplicateProject,
    exportProject,
    importProject,
    getCurrentProject,
  } = useProjectStore();

  const [showList, setShowList] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const current = getCurrentProject();
  const projectName = current?.name || "새 프로젝트";

  // Init: if no current project, create one and save canvas data into it
  useEffect(() => {
    if (!currentProjectId) {
      void createProject("내 미니앱");
      // Defer save so Craft.js has initialized
      setTimeout(() => {
        try {
          const data = query.serialize();
          if (data && data !== "{}") {
            void saveCurrentProject(data);
          }
        } catch {}
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const data = query.serialize();
      await saveCurrentProject(data);
      setSaved(true);
      showToast("✓ 저장됨");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      showToast("⚠ 저장 실패");
    }
  }, [query, saveCurrentProject]);

  const handleLoad = useCallback(
    (project: Project) => {
      if (project.canvasData) {
        try {
          actions.deserialize(project.canvasData);
        } catch {
          showToast("⚠ 불러오기 실패");
          return;
        }
      }
      loadProject(project.id);
      setShowList(false);
      showToast(`✓ "${project.name}" 불러옴`);
    },
    [actions, loadProject]
  );

  const handleNew = useCallback(async () => {
    // Save current first
    try {
      await saveCurrentProject(query.serialize());
    } catch {}
    await createProject();
    // Reset canvas
    try {
      actions.deserialize(
        '{"ROOT":{"type":{"resolvedName":"Canvas"},"isCanvas":true,"props":{},"displayName":"Canvas","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}'
      );
    } catch {}
    setShowList(false);
    showToast("✓ 새 프로젝트 생성");
  }, [actions, query, createProject, saveCurrentProject]);

  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirm("이 프로젝트를 삭제할까요?")) return;
      await deleteProject(id);
      showToast("삭제됨");
    },
    [deleteProject]
  );

  const handleDuplicate = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      // Save current canvas first
      try {
        await saveCurrentProject(query.serialize());
      } catch {}
      const newId = await duplicateProject(id);
      if (newId) {
        const proj = useProjectStore.getState().projects.find((p) => p.id === newId);
        if (proj?.canvasData) {
          try {
            actions.deserialize(proj.canvasData);
          } catch {}
        }
        showToast("복제됨");
      }
    },
    [duplicateProject, saveCurrentProject, query, actions]
  );

  const handleExport = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const json = exportProject(id);
      if (!json) return;
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const proj = projects.find((p) => p.id === id);
      a.download = `${proj?.name || "project"}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("📥 내보내기 완료");
    },
    [exportProject, projects]
  );

  const handleImport = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const text = reader.result as string;
        const id: string | null = await importProject(text);
        if (id) {
          const proj = useProjectStore.getState().projects.find((p: { id: string }) => p.id === id);
          if (proj?.canvasData) {
            try {
              actions.deserialize(proj.canvasData);
            } catch {}
          }
          showToast("📂 가져오기 완료");
          setShowList(false);
        } else {
          showToast("⚠ 잘못된 파일");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [importProject, actions]
  );

  const handleRename = useCallback(() => {
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 50);
  }, []);

  const commitRename = useCallback(
    (val: string) => {
      setEditing(false);
      if (currentProjectId && val.trim()) {
        renameProject(currentProjectId, val.trim());
      }
    },
    [currentProjectId, renameProject]
  );

  const fmt = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Project name (editable) */}
        {editing ? (
          <input
            ref={inputRef}
            defaultValue={projectName}
            className="bg-white border border-[#3182F6] rounded-lg px-2 py-1 text-sm font-medium outline-none w-32"
            onBlur={(e) => commitRename(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename((e.target as HTMLInputElement).value);
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <button
            onClick={handleRename}
            className="text-sm font-medium text-gray-700 hover:text-[#3182F6] transition truncate max-w-[120px]"
            title="클릭하여 이름 변경"
          >
            {projectName}
          </button>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
            saved
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
          title="저장 (Ctrl+S)"
        >
          {saved ? "✓ 저장됨" : "💾"}
        </button>

        {/* Projects list button */}
        <button
          onClick={() => setShowList(true)}
          className="px-2 py-1 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
          title="프로젝트 목록"
        >
          📂
        </button>
      </div>

      {/* Hidden file input for import */}
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      {/* Projects list modal */}
      {showList && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowList(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">내 프로젝트</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleImport}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  📥 가져오기
                </button>
                <button
                  onClick={handleNew}
                  className="text-xs px-3 py-1.5 bg-[#3182F6] text-white rounded-lg hover:bg-[#1B64DA] transition"
                >
                  + 새 프로젝트
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm">프로젝트가 없습니다</p>
                </div>
              ) : (
                projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleLoad(p)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                      p.id === currentProjectId ? "bg-blue-50 border border-[#3182F6]/20" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {p.name}
                        {p.id === currentProjectId && (
                          <span className="ml-2 text-[10px] text-[#3182F6] font-normal">현재</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        수정 {fmt(p.updatedAt)} · 생성 {fmt(p.createdAt)}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => handleDuplicate(p.id, e)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-xs"
                        title="복제"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={(e) => handleExport(p.id, e)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-xs"
                        title="내보내기"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(p.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-xs"
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t text-center">
              <button
                onClick={() => setShowList(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
