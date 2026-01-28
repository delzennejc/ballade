export type ContentTab = 'paroles' | 'partitions' | 'traductions' | 'histoire';

export type AudioTrack = 'groupe' | 'violon' | 'chant' | 'guitare' | 'percussion';

export interface LyricsVersion {
  language: string;
  languageCode: string;
  text: string;
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

export interface MusicSheetVersion {
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
  translations: TranslationVersion[];
  musicSheet: MusicSheetVersion[];
  history: HistoryVersion[];
  audioTracks: AudioTrackData[];
}
