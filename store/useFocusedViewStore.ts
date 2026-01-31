import { create } from 'zustand';
import { FocusedViewType } from '@/types/song';

interface FocusedViewState {
  focusedView: FocusedViewType | null;
  setFocusedView: (view: FocusedViewType | null) => void;
  clearFocusedView: () => void;
}

export const useFocusedViewStore = create<FocusedViewState>((set) => ({
  focusedView: null,
  setFocusedView: (view) => set({ focusedView: view }),
  clearFocusedView: () => set({ focusedView: null }),
}));
