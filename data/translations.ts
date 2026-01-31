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
  // Legal Notice
  | 'legalNoticeTitle'
  | 'sitePublisher'
  | 'associationName'
  | 'headquarters'
  | 'publicationDirector'
  | 'webManager'
  | 'registrationInfo'
  | 'identifiers'
  | 'hosting'
  | 'hostedBy'
  | 'personalData'
  | 'personalDataText'
  | 'cookies'
  | 'cookiesText'
  | 'intellectualProperty'
  | 'intellectualPropertyText'
  | 'backToHome'
  // Cookie Consent
  | 'cookieConsentMessage'
  | 'cookieAccept'
  | 'cookieDecline'

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

    // Legal Notice
    legalNoticeTitle: 'Mentions légales',
    sitePublisher: 'Éditeur',
    associationName: 'Association Ballade',
    headquarters: 'Siège social',
    publicationDirector: 'Directeur de la publication',
    webManager: 'Responsable web',
    registrationInfo: "L'association est régie par le droit civil local maintenu en vigueur dans les départements du Bas-Rhin, du Haut-Rhin et de la Moselle. Elle est inscrite au Registre des Associations du Tribunal d'Instance de Strasbourg depuis le 7 décembre 2001, sous le volume 79, folio n°316.",
    identifiers: 'Identifiants',
    hosting: 'Hébergement',
    hostedBy: 'Ce site est hébergé par',
    personalData: 'Données personnelles et RGPD',
    personalDataText: "Vous disposez d'un droit d'accès, de rectification, de mise à jour et de complétude de vos données, ainsi qu'un droit de suppression, de retrait de consentement, de limitation du traitement, de portabilité de vos données et d'opposition au traitement de vos données personnelles. Pour l'exercer, adressez votre demande par écrit à l'adresse du siège social, en joignant une copie d'un document justifiant de votre identité.",
    cookies: 'Cookies',
    cookiesText: "Le site utilise des cookies pour suivre votre navigation. Vous pouvez refuser le dépôt de cookies en configurant votre navigateur. Pour en savoir plus sur les cookies, vous pouvez consulter le site www.cnil.fr.",
    intellectualProperty: 'Propriété intellectuelle',
    intellectualPropertyText: "L'ensemble des éléments de ce site (textes, images, fichiers audio, fichiers vidéo) sont la propriété exclusive de l'Association Ballade et ne peuvent être reproduits, utilisés ou représentés sans l'autorisation expresse de celle-ci, sous peine de poursuites judiciaires conformément aux dispositions du Code de la propriété intellectuelle.",
    backToHome: "Retour à l'accueil",

    // Cookie Consent
    cookieConsentMessage: 'Ce site utilise des cookies pour améliorer votre expérience de navigation.',
    cookieAccept: 'Accepter',
    cookieDecline: 'Refuser',
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

    // Legal Notice
    legalNoticeTitle: 'Legal Notice',
    sitePublisher: 'Publisher',
    associationName: 'Association Ballade',
    headquarters: 'Headquarters',
    publicationDirector: 'Publication Director',
    webManager: 'Web Manager',
    registrationInfo: 'The association is governed by local civil law maintained in force in the departments of Bas-Rhin, Haut-Rhin and Moselle. It has been registered with the Registry of Associations of the District Court of Strasbourg since December 7, 2001, under volume 79, folio no. 316.',
    identifiers: 'Identifiers',
    hosting: 'Hosting',
    hostedBy: 'This site is hosted by',
    personalData: 'Personal Data and GDPR',
    personalDataText: 'You have the right to access, rectify, update and complete your data, as well as the right to delete, withdraw consent, limit processing, data portability and object to the processing of your personal data. To exercise this right, send your request in writing to the headquarters address, enclosing a copy of a document proving your identity.',
    cookies: 'Cookies',
    cookiesText: 'The site uses cookies to track your navigation. You can refuse the deposit of cookies by configuring your browser. To learn more about cookies, you can visit www.cnil.fr.',
    intellectualProperty: 'Intellectual Property',
    intellectualPropertyText: 'All elements of this site (texts, images, audio files, video files) are the exclusive property of Association Ballade and may not be reproduced, used or represented without its express authorization, under penalty of legal action in accordance with the provisions of the Intellectual Property Code.',
    backToHome: 'Back to home',

    // Cookie Consent
    cookieConsentMessage: 'This site uses cookies to improve your browsing experience.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
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
