import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  canvasData: string;
  appInfo?: string;
  thumbnail?: string;
  exportCount?: number;
}

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  isOnline: boolean; // DB 연결 상태
  // Actions
  createProject: (name?: string) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<string>;
  renameProject: (id: string, name: string) => Promise<void>;
  saveCurrentProject: (canvasData: string) => Promise<void>;
  loadProject: (id: string) => Project | null;
  getCurrentProject: () => Project | null;
  setCurrentProjectId: (id: string | null) => void;
  exportProject: (id: string) => string | null;
  importProject: (json: string) => Promise<string | null>;
  fetchProjects: () => Promise<void>;
  saveVersion: (description?: string) => Promise<void>;
  recordExport: (type: "html" | "sdk" | "submit") => Promise<void>;
  recordSubmission: (appName: string, notes?: string) => Promise<void>;
}

const generateId = () =>
  `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// Auto-save version timer
let lastVersionTime = 0;
const VERSION_INTERVAL = 5 * 60 * 1000; // 5분

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      isOnline: true,

      fetchProjects: async () => {
        const data = await apiCall<
          Array<{
            id: string;
            name: string;
            canvas_data: string;
            app_info: string | null;
            thumbnail: string | null;
            created_at: string;
            updated_at: string;
            export_count: number;
          }>
        >("/api/projects");

        if (data) {
          const projects: Project[] = data.map((r) => ({
            id: r.id as string,
            name: r.name as string,
            canvasData: (r.canvas_data as string) || "",
            appInfo: (r.app_info as string) || undefined,
            thumbnail: (r.thumbnail as string) || undefined,
            createdAt: new Date(r.created_at as string).getTime(),
            updatedAt: new Date(r.updated_at as string).getTime(),
            exportCount: Number(r.export_count) || 0,
          }));
          set({ projects, isOnline: true });
        } else {
          set({ isOnline: false });
        }
      },

      createProject: async (name = "새 프로젝트") => {
        const id = generateId();
        const now = Date.now();
        const project: Project = {
          id,
          name,
          createdAt: now,
          updatedAt: now,
          canvasData: "",
        };

        // Optimistic local update
        set((s) => ({
          projects: [project, ...s.projects],
          currentProjectId: id,
        }));

        // Sync to DB
        const result = await apiCall("/api/projects", {
          method: "POST",
          body: JSON.stringify({ id, name, canvasData: "" }),
        });
        if (!result) set({ isOnline: false });

        return id;
      },

      deleteProject: async (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          currentProjectId:
            s.currentProjectId === id ? null : s.currentProjectId,
        }));

        const result = await apiCall(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (!result) set({ isOnline: false });
      },

      duplicateProject: async (id) => {
        const { projects } = get();
        const src = projects.find((p) => p.id === id);
        if (!src) return "";
        const newId = generateId();
        const now = Date.now();
        const dup: Project = {
          ...src,
          id: newId,
          name: `${src.name} (복사본)`,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          projects: [dup, ...s.projects],
          currentProjectId: newId,
        }));

        await apiCall("/api/projects", {
          method: "POST",
          body: JSON.stringify({
            id: newId,
            name: dup.name,
            canvasData: dup.canvasData,
          }),
        });

        return newId;
      },

      renameProject: async (id, name) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: Date.now() } : p
          ),
        }));

        await apiCall(`/api/projects/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name }),
        });
      },

      saveCurrentProject: async (canvasData) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;

        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === currentProjectId
              ? { ...p, canvasData, updatedAt: Date.now() }
              : p
          ),
        }));

        const result = await apiCall(`/api/projects/${currentProjectId}`, {
          method: "PUT",
          body: JSON.stringify({ canvasData }),
        });
        if (!result) set({ isOnline: false });
        else set({ isOnline: true });

        // Auto-version every 5 minutes
        const now = Date.now();
        if (now - lastVersionTime > VERSION_INTERVAL) {
          lastVersionTime = now;
          await apiCall(`/api/projects/${currentProjectId}/versions`, {
            method: "POST",
            body: JSON.stringify({
              canvasData,
              description: "자동 저장",
            }),
          });
        }
      },

      saveVersion: async (description?: string) => {
        const { currentProjectId } = get();
        const project = get().getCurrentProject();
        if (!currentProjectId || !project) return;

        lastVersionTime = Date.now();
        await apiCall(`/api/projects/${currentProjectId}/versions`, {
          method: "POST",
          body: JSON.stringify({
            canvasData: project.canvasData,
            description: description || "수동 저장",
          }),
        });
      },

      recordExport: async (type) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;
        await apiCall(`/api/projects/${currentProjectId}/export`, {
          method: "POST",
          body: JSON.stringify({ type }),
        });
      },

      recordSubmission: async (appName, notes) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;
        await apiCall(`/api/projects/${currentProjectId}/submit`, {
          method: "POST",
          body: JSON.stringify({ appName, notes }),
        });
      },

      loadProject: (id) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id) || null;
        if (project) set({ currentProjectId: id });
        return project;
      },

      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.id === currentProjectId) || null;
      },

      setCurrentProjectId: (id) => set({ currentProjectId: id }),

      exportProject: (id) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        if (!project) return null;
        return JSON.stringify(project, null, 2);
      },

      importProject: async (json) => {
        try {
          const data = JSON.parse(json) as Partial<Project>;
          if (!data.canvasData) return null;
          const id = generateId();
          const now = Date.now();
          const project: Project = {
            id,
            name: data.name || "가져온 프로젝트",
            createdAt: now,
            updatedAt: now,
            canvasData: data.canvasData,
          };
          set((s) => ({
            projects: [project, ...s.projects],
            currentProjectId: id,
          }));

          await apiCall("/api/projects", {
            method: "POST",
            body: JSON.stringify({
              id,
              name: project.name,
              canvasData: project.canvasData,
            }),
          });

          return id;
        } catch {
          return null;
        }
      },
    }),
    {
      name: "appintoss-projects",
    }
  )
);
