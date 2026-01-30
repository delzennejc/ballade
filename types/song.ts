export type ContentTab = 'paroles' | 'scores' | 'traductions' | 'histoire';

export type AudioTrack = string;

export interface LyricsVersion {
  language: string;
  languageCode: string;
  text: string;
  translations: TranslationVersion[];
}

export interface TranslationVersion {
  language: string;
  languageCode: string;
  text: string;
}

export interface HistoryVersion {
  language: string;
  languageCode: string;
  pdf: string;
}

export interface ScoreVersion {
  language: string;
  languageCode: string;
  pdf: string;
}

export interface AudioTrackVersion {
  id: string;
  name: string;
}

export interface AudioTrackData {
  track: AudioTrack;
  trackName: string;
  versions: AudioTrackVersion[];
}

export interface SongMetadata {
  countries: string[];
  languages: string[];
  genres: string[];
  audience: string[];
  difficulty: 'Facile' | 'Intermédiaire' | 'Difficile';
  themes: string[];
}

export interface Song {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  metadata: SongMetadata;
  lyrics: LyricsVersion[];
  scores: ScoreVersion[];
  history: HistoryVersion[];
  audioTracks: AudioTrackData[];
}
