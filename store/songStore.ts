import { create } from 'zustand';
import { ContentTab, AudioTrack } from '@/types/song';

interface SongState {
  // Selected content tabs (multi-select)
  selectedTabs: ContentTab[];
  toggleTab: (tab: ContentTab) => void;
  setSelectedTabs: (tabs: ContentTab[]) => void;

  // Audio state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  selectedTrack: AudioTrack;
  selectedVersionId: string;

  playbackSpeed: number;

  // Audio actions
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setSelectedTrack: (track: AudioTrack) => void;
  setSelectedVersionId: (id: string) => void;
  setSelectedAudio: (track: AudioTrack, versionId: string) => void;

  // Content language preferences
  lyricsLanguage: string;
  translationLanguage: string;
  historyLanguage: string;
  setLyricsLanguage: (language: string) => void;
  setTranslationLanguage: (language: string) => void;
  setHistoryLanguage: (language: string) => void;

  // Reset state for new song
  resetState: () => void;
}

const initialState = {
  selectedTabs: ['paroles'] as ContentTab[],
  isPlaying: false,
  currentTime: 0,
  duration: 180, // 3 minutes default
  volume: 0.8,
  isLooping: false,
  playbackSpeed: 1,
  selectedTrack: 'groupe' as AudioTrack,
  selectedVersionId: '',
  lyricsLanguage: 'fr',
  translationLanguage: 'en',
  historyLanguage: 'fr',
};

export const useSongStore = create<SongState>((set) => ({
  ...initialState,

  toggleTab: (tab) =>
    set((state) => {
      const isSelected = state.selectedTabs.includes(tab);
      if (isSelected) {
        // Don't allow deselecting if it's the only selected tab
        if (state.selectedTabs.length === 1) return state;
        return { selectedTabs: state.selectedTabs.filter((t) => t !== tab) };
      }
      return { selectedTabs: [...state.selectedTabs, tab] };
    }),

  setSelectedTabs: (tabs) => set({ selectedTabs: tabs }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setCurrentTime: (currentTime) => set({ currentTime }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

  setSelectedTrack: (selectedTrack) => set({ selectedTrack }),

  setSelectedVersionId: (selectedVersionId) => set({ selectedVersionId }),

  setSelectedAudio: (selectedTrack, selectedVersionId) =>
    set({ selectedTrack, selectedVersionId }),

  setLyricsLanguage: (lyricsLanguage) => set({ lyricsLanguage }),

  setTranslationLanguage: (translationLanguage) => set({ translationLanguage }),

  setHistoryLanguage: (historyLanguage) => set({ historyLanguage }),

  resetState: () => set(initialState),
}));
