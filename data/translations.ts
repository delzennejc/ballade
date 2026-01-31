import { AppLanguage } from './geography'

export type TranslationKey =
  // Main Content
  | 'welcome'
  | 'searchSong'
  | 'noSongsFound'
  | 'viewSongMap'
  | 'ourSupporters'
  // Sidebar
  | 'songList'
  | 'search'
  | 'filters'
  | 'loading'
  | 'error'
  // Filter Modal
  | 'filterTitle'
  | 'geographicOrigin'
  | 'musicalStyle'
  | 'originalLanguage'
  | 'theme'
  | 'targetAudience'
  | 'difficultyLevel'
  | 'clearAllFilters'
  | 'validateFilters'
  // Map Modal
  | 'songMap'
  | 'close'
  | 'song'
  | 'songs'
  | 'loadingMap'
  // Content Tabs
  | 'lyrics'
  | 'sheets'
  | 'translations'
  | 'history'
  | 'audio'
  // Share Modal
  | 'share'
  | 'linkToShare'
  | 'copyLink'
  | 'linkCopied'
  // Focused View
  | 'backToFullView'
  // Song Page
  | 'songNotFound'
  | 'songNotFoundDescription'
  // Footer
  | 'allRightsReserved'
  | 'legalNotice'
  // Difficulty levels
  | 'easy'
  | 'intermediate'
  | 'difficult'

type Translations = Record<TranslationKey, string>

export const translations: Record<AppLanguage, Translations> = {
  fr: {
    // Main Content
    welcome: 'Bienvenue',
    searchSong: 'Rechercher une chanson',
    noSongsFound: 'Aucune chanson trouvée',
    viewSongMap: 'Voir la carte des chansons',
    ourSupporters: 'Ils nous soutiennent',

    // Sidebar
    songList: 'LISTE DES CHANSONS',
    search: 'Rechercher',
    filters: 'Filtres',
    loading: 'Chargement...',
    error: 'Erreur',

    // Filter Modal
    filterTitle: 'Filtres',
    geographicOrigin: 'Origine géographique',
    musicalStyle: 'Style musical',
    originalLanguage: "Langue d'origine",
    theme: 'Thème',
    targetAudience: 'Bénéficiaires / Public cible',
    difficultyLevel: 'Niveau de difficulté',
    clearAllFilters: 'Supprimer tous les filtres',
    validateFilters: 'Valider les filtres',

    // Map Modal
    songMap: 'Carte des chansons',
    close: 'Fermer',
    song: 'chanson',
    songs: 'chansons',
    loadingMap: 'Chargement de la carte...',

    // Content Tabs
    lyrics: 'Paroles',
    sheets: 'Partitions',
    translations: 'Traductions',
    history: 'Histoire',
    audio: 'Audio',

    // Share Modal
    share: 'Partager',
    linkToShare: 'Lien à partager :',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié !',

    // Focused View
    backToFullView: 'Retour à la vue complète',

    // Song Page
    songNotFound: 'Chanson non trouvée',
    songNotFoundDescription: "La chanson que vous recherchez n'existe pas.",

    // Footer
    allRightsReserved: 'Tous droits réservés',
    legalNotice: 'Mentions légales',

    // Difficulty levels
    easy: 'Facile',
    intermediate: 'Intermédiaire',
    difficult: 'Difficile',
  },
  en: {
    // Main Content
    welcome: 'Welcome',
    searchSong: 'Search for a song',
    noSongsFound: 'No songs found',
    viewSongMap: 'View song map',
    ourSupporters: 'Our supporters',

    // Sidebar
    songList: 'SONG LIST',
    search: 'Search',
    filters: 'Filters',
    loading: 'Loading...',
    error: 'Error',

    // Filter Modal
    filterTitle: 'Filters',
    geographicOrigin: 'Geographic origin',
    musicalStyle: 'Musical style',
    originalLanguage: 'Original language',
    theme: 'Theme',
    targetAudience: 'Target audience',
    difficultyLevel: 'Difficulty level',
    clearAllFilters: 'Clear all filters',
    validateFilters: 'Apply filters',

    // Map Modal
    songMap: 'Song map',
    close: 'Close',
    song: 'song',
    songs: 'songs',
    loadingMap: 'Loading map...',

    // Content Tabs
    lyrics: 'Lyrics',
    sheets: 'Scores',
    translations: 'Translations',
    history: 'History',
    audio: 'Audio',

    // Share Modal
    share: 'Share',
    linkToShare: 'Link to share:',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',

    // Focused View
    backToFullView: 'Back to full view',

    // Song Page
    songNotFound: 'Song not found',
    songNotFoundDescription: 'The song you are looking for does not exist.',

    // Footer
    allRightsReserved: 'All rights reserved',
    legalNotice: 'Legal notice',

    // Difficulty levels
    easy: 'Easy',
    intermediate: 'Intermediate',
    difficult: 'Difficult',
  },
}

// Helper to translate difficulty level
export function translateDifficulty(difficulty: string, language: AppLanguage): string {
  const difficultyMap: Record<string, TranslationKey> = {
    'Facile': 'easy',
    'Intermédiaire': 'intermediate',
    'Difficile': 'difficult',
  }

  const key = difficultyMap[difficulty]
  if (key) {
    return translations[language][key]
  }
  return difficulty
}
