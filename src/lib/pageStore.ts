/**
 * Multi-page system for Appintoss Builder
 * Manages multiple pages with independent Craft.js canvas states
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Page {
  id: string;
  name: string;
  craftState: string; // Serialized Craft.js state
  isHome?: boolean;
}

interface PageStore {
  pages: Page[];
  currentPageId: string;
  
  // Actions
  addPage: (name?: string) => string;
  deletePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  setCurrentPage: (id: string) => void;
  updatePageState: (id: string, craftState: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  getCurrentPage: () => Page | undefined;
  setHomePage: (id: string) => void;
  reset: () => void;
}

const DEFAULT_PAGE_STATE = JSON.stringify({
  ROOT: {
    type: { resolvedName: "Canvas" },
    isCanvas: true,
    props: {},
    displayName: "캔버스",
    custom: {},
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
});

const createDefaultPage = (): Page => ({
  id: "page_home",
  name: "홈",
  craftState: DEFAULT_PAGE_STATE,
  isHome: true,
});

export const usePageStore = create<PageStore>()(
  persist(
    (set, get) => ({
      pages: [createDefaultPage()],
      currentPageId: "page_home",

      addPage: (name?: string) => {
        const { pages } = get();
        const newId = `page_${Date.now()}`;
        const pageName = name || `페이지 ${pages.length + 1}`;
        
        const newPage: Page = {
          id: newId,
          name: pageName,
          craftState: DEFAULT_PAGE_STATE,
        };
        
        set((state) => ({
          pages: [...state.pages, newPage],
          currentPageId: newId,
        }));
        
        return newId;
      },

      deletePage: (id: string) => {
        const { pages, currentPageId } = get();
        
        // Can't delete last page
        if (pages.length <= 1) return;
        
        // Can't delete home page
        const page = pages.find((p) => p.id === id);
        if (page?.isHome) return;
        
        const newPages = pages.filter((p) => p.id !== id);
        const newCurrentId = currentPageId === id ? newPages[0].id : currentPageId;
        
        set({
          pages: newPages,
          currentPageId: newCurrentId,
        });
      },

      renamePage: (id: string, name: string) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        }));
      },

      setCurrentPage: (id: string) => {
        set({ currentPageId: id });
      },

      updatePageState: (id: string, craftState: string) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, craftState } : p
          ),
        }));
      },

      reorderPages: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newPages = [...state.pages];
          const [removed] = newPages.splice(fromIndex, 1);
          newPages.splice(toIndex, 0, removed);
          return { pages: newPages };
        });
      },

      getCurrentPage: () => {
        const { pages, currentPageId } = get();
        return pages.find((p) => p.id === currentPageId);
      },

      setHomePage: (id: string) => {
        set((state) => ({
          pages: state.pages.map((p) => ({
            ...p,
            isHome: p.id === id,
          })),
        }));
      },

      reset: () => {
        set({
          pages: [createDefaultPage()],
          currentPageId: "page_home",
        });
      },
    }),
    {
      name: "appintoss-pages",
      version: 1,
    }
  )
);

// Helper to generate page navigation options for button actions
export const getPageOptions = (): { id: string; name: string }[] => {
  const { pages } = usePageStore.getState();
  return pages.map((p) => ({ id: p.id, name: p.name }));
};
