import { create } from 'zustand'

export interface FilterState {
  geographicOrigin: string[]
  musicalStyle: string[]
  language: string[]
  theme: string[]
  targetAudience: string[]
  difficultyLevel: string[]
}

const emptyFilters: FilterState = {
  geographicOrigin: [],
  musicalStyle: [],
  language: [],
  theme: [],
  targetAudience: [],
  difficultyLevel: [],
}

interface FilterStore {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: emptyFilters,
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: emptyFilters }),
}))
