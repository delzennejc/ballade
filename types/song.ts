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

export interface AudioTrackVersion {
  id: string;
  name: string;
}

export interface AudioTrackData {
  track: AudioTrack;
  versions: AudioTrackVersion[];
}

export interface SongMetadata {
  country: string;
  language: string;
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
  sheetMusic: string; // ABC notation
  history: string;
  audioTracks: AudioTrackData[];
}
