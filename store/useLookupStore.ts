import { create } from 'zustand'
import { AppLanguage } from '@/data/geography'

interface LookupItem {
  id: string
  name: string
  nameEn?: string
}

interface LookupState {
  genres: LookupItem[]
  themes: LookupItem[]
  audiences: LookupItem[]
  languages: LookupItem[]
  trackTypes: LookupItem[]
  difficultyLevels: LookupItem[]
  isLoaded: boolean
  isLoading: boolean
  error: string | null
  fetchLookups: () => Promise<void>
  translateLookup: (frenchValue: string, type: 'genres' | 'themes' | 'audiences' | 'languages' | 'trackTypes' | 'difficultyLevels', language: AppLanguage) => string
}

export const useLookupStore = create<LookupState>((set, get) => ({
  genres: [],
  themes: [],
  audiences: [],
  languages: [],
  trackTypes: [],
  difficultyLevels: [],
  isLoaded: false,
  isLoading: false,
  error: null,

  fetchLookups: async () => {
    const { isLoaded, isLoading } = get()
    if (isLoaded || isLoading) return

    set({ isLoading: true, error: null })

    try {
      const [genresRes, themesRes, audiencesRes, languagesRes, trackTypesRes, difficultyLevelsRes] = await Promise.all([
        fetch('/api/lookup/genres'),
        fetch('/api/lookup/themes'),
        fetch('/api/lookup/audiences'),
        fetch('/api/lookup/languages'),
        fetch('/api/lookup/track-types'),
        fetch('/api/lookup/difficulty-levels'),
      ])

      if (!genresRes.ok || !themesRes.ok || !audiencesRes.ok || !languagesRes.ok || !trackTypesRes.ok || !difficultyLevelsRes.ok) {
        throw new Error('Failed to fetch some lookups')
      }

      const [genres, themes, audiences, languages, trackTypes, difficultyLevels] = await Promise.all([
        genresRes.json(),
        themesRes.json(),
        audiencesRes.json(),
        languagesRes.json(),
        trackTypesRes.json(),
        difficultyLevelsRes.json(),
      ])

      set({
        genres,
        themes,
        audiences,
        languages,
        trackTypes,
        difficultyLevels,
        isLoaded: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch lookups',
        isLoading: false,
      })
    }
  },

  translateLookup: (frenchValue: string, type: 'genres' | 'themes' | 'audiences' | 'languages' | 'trackTypes' | 'difficultyLevels', language: AppLanguage) => {
    if (language === 'fr') return frenchValue

    const lookups = get()[type]
    const found = lookups.find((item) => item.name === frenchValue)

    return found?.nameEn || frenchValue
  },
}))
