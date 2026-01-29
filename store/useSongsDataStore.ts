import { create } from 'zustand';
import { Song, AudioTrack } from '@/types/song';

interface SongFilters {
  country?: string;
  language?: string;
  genre?: string;
  audience?: string;
  theme?: string;
  difficulty?: string;
}

interface SongsDataState {
  // State
  songs: Song[];
  currentSong: Song | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSongs: (filters?: SongFilters) => Promise<void>;
  fetchSongBySlug: (slug: string) => Promise<void>;
  getAudioUrl: (slug: string, trackType: AudioTrack, versionId: string) => Promise<string | null>;
  clearError: () => void;
  clearCurrentSong: () => void;
}

export const useSongsDataStore = create<SongsDataState>((set, get) => ({
  // Initial state
  songs: [],
  currentSong: null,
  isLoading: false,
  error: null,

  // Fetch all songs with optional filters
  fetchSongs: async (filters?: SongFilters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
      }
      const queryString = params.toString();
      const url = queryString ? `/api/public/songs?${queryString}` : '/api/public/songs';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.statusText}`);
      }
      const songs: Song[] = await response.json();
      set({ songs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch songs',
        isLoading: false
      });
    }
  },

  // Fetch a single song by slug
  fetchSongBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/public/songs/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Song not found');
        }
        throw new Error(`Failed to fetch song: ${response.statusText}`);
      }
      const song: Song = await response.json();
      set({ currentSong: song, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch song',
        isLoading: false
      });
    }
  },

  // Get audio URL for a specific track version
  getAudioUrl: async (slug: string, trackType: AudioTrack, versionId: string) => {
    try {
      const response = await fetch(`/api/public/songs/${slug}/audio/${trackType}/${versionId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get audio URL: ${response.statusText}`);
      }
      const data: { url: string } = await response.json();
      return data.url;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get audio URL'
      });
      return null;
    }
  },

  // Clear error state
  clearError: () => set({ error: null }),

  // Clear current song
  clearCurrentSong: () => set({ currentSong: null }),
}));
