import { create } from 'zustand';

interface SidebarState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
