/**
 * Migration script to upload songs from songs-data folder to Payload CMS via API
 *
 * Usage: npx tsx scripts/migrate-songs-data.ts
 *
 * Prerequisites:
 * - Dev server running (npm run dev)
 * - Lookup tables seeded (POST /api/migrate/seed-lookups)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import { v2 as cloudinary } from 'cloudinary'
import Papa from 'papaparse'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING',
})

const BASE_URL = 'http://localhost:3000/api'
const SONGS_DATA_DIR = path.join(process.cwd(), 'songs-data')
const PROGRESS_FILE = path.join(SONGS_DATA_DIR, 'upload-progress.md')

// ============================================================================
// Type Definitions
// ============================================================================

interface CsvRow {
  Title: string
  'Group audio': string
  'Violin audio': string
  'Singing audio': string
  'Guitar audio': string
  'Percussion audio': string
  'Music score': string
  Lyrics: string
  Translations: string
  History: string
  'Difficulty Level': string
  'Musical style': string
  'Style musical': string
  Themes: string
  'Thèmes': string
  'Country/Geographic origin': string
  'Language of origin': string
  Beneficiaries: string
  'IS A SONG': string
}

interface LookupDoc {
  id: number
  name: string
  code?: string
  slug?: string
}

interface LookupMaps {
  languages: Map<string, number>
  languagesByCode: Map<string, number>
  genres: Map<string, number>
  audiences: Map<string, number>
  themes: Map<string, number>
  trackTypes: Map<string, number>
}

interface SongFolder {
  name: string
  path: string
  normalizedName: string
  audioFiles: string[]
  musicScorePdf: string | null
  historyEnPdf: string | null
  historyFrPdf: string | null
  singingDirs: {
    name: string
    path: string
    language: string
    lyricsPdf: string | null
    translationPdfs: { targetLang: string; sourceLang: string; path: string }[]
    audioFiles: string[]
  }[]
}

interface ExtractedLyrics {
  language: string
  text: string
}

interface ExtractedTranslation {
  language: string
  text: string
}

interface UploadResult {
  publicId: string
  url: string
}

// ============================================================================
// Mappings
// ============================================================================

const LANGUAGE_EN_TO_FR: Record<string, string> = {
  // Common languages
  'English': 'Anglais',
  'French': 'Français',
  'German': 'Allemand',
  'Spanish': 'Espagnol',
  'Italian': 'Italien',
  'Portuguese': 'Portugais',
  'Russian': 'Russe',
  'Arabic': 'Arabe',
  'Turkish': 'Turc',
  'Greek': 'Grec',
  'Polish': 'Polonais',
  'Ukrainian': 'Ukrainien',
  'Romanian': 'Roumain',
  'Bulgarian': 'Bulgare',
  'Hungarian': 'Hongrois',
  'Swedish': 'Suédois',
  // Balkan languages
  'BCMS': 'BCMS',
  'BCMS (Bosnian, Croatian, Montenegrian, Serbian)': 'BCMS',
  'Serbian': 'BCMS',
  'Croatian': 'BCMS',
  'Bosnian': 'BCMS',
  'Slovenian': 'Slovène',
  'Slovenian, BCMS (Bosnian, Croatian, Montenegrian, Serbian)': 'Slovène',
  'Macedonian': 'Macédonien',
  'Albanian': 'Albanais',
  // Celtic/Gaelic
  'Gaelic': 'Gaélique',
  'Irish': 'Gaélique',
  // Regional languages
  'Alsacien': 'Alsacien',
  'Alsatian': 'Alsacien',
  'Gascon': 'Gascon',
  'Catalan': 'Catalan',
  // Other European
  'Dutch': 'Néerlandais',
  'Latvian': 'Letton',
  'Lithuanian': 'Lituanien',
  'Latin': 'Latin',
  // Caucasus
  'Georgian': 'Géorgien',
  'Armenian': 'Arménien',
  'Chechen': 'Chechen',
  // Middle East/Asia
  'Farsi': 'Farsi',
  'Kurdish': 'Kurde',
  // Jewish languages
  'Yiddish': 'Yiddish',
  'Ladino': 'Ladino',
  'Judaeo-Aramaic': 'Judéo-araméen',
  // African languages
  'Swahili': 'Swahili',
  'Wolof': 'Wolof',
  'Lingala': 'Lingala',
  'Zulu': 'Zulu',
  'Bambara': 'Bambara',
  'Kinyarwanda': 'Kinyarwanda',
  'Kinyarwanda, French': 'Kinyarwanda',
  // Indigenous/Other
  'Arapaho': 'Arapaho',
  'Maori': 'Maori',
  'Indigenous brazilian': 'Brésilien indigène',
  'Romani': 'Romani',
  // Creoles
  'Cape Verdean Creole': 'Cap-Verdien',
  'Haitian creole': 'Créole haïtien',
  // Special
  'Plurilingual': 'Plurilingue',
  'NA': '', // Skip
}

const DIFFICULTY_MAP: Record<string, 'Facile' | 'Intermédiaire' | 'Difficile'> = {
  'Easy': 'Facile',
  'Intermediate': 'Intermédiaire',
  'Advanced': 'Difficile',
  'Difficile': 'Difficile',
}

const AUDIENCE_MAP: Record<string, string> = {
  'Children': 'Enfants',
  'Chidren': 'Enfants', // Typo in CSV
  'Teenagers': 'Adolescents',
  'Adults': 'Adultes',
  'Seniors': 'Tous publics',
}

// Map English genre names to French
const GENRE_EN_TO_FR: Record<string, string> = {
  'Anthem': 'Hymne',
  'Ballad': 'Ballade',
  'Blues': 'Blues',
  'Bolero': 'Boléro',
  'Cannon': 'Canon',
  'Capoeira song': 'Chant de capoeira',
  'Celtic music': 'Musique celtique',
  'Chanson': 'Chanson',
  'Chanson francophone': 'Chanson francophone',
  'Children song': 'Chanson pour enfants',
  'Christmas song': 'Chant de Noël',
  'Choir song': 'Chant choral',
  'Coladeira': 'Coladeira',
  'Country': 'Country',
  'Cumbia': 'Cumbia',
  'Disco': 'Disco',
  'Festive song': 'Chanson festive',
  'Film score': 'Musique de film',
  'Flamenco': 'Flamenco',
  'Folk': 'Folk',
  'Folk rock': 'Folk rock',
  'Gipsy song': 'Chanson tzigane',
  'Jazz': 'Jazz',
  'Klezmer': 'Klezmer',
  'Kolo': 'Kolo',
  'Lullaby': 'Berceuse',
  'Medieval song': 'Chanson médiévale',
  'Morna': 'Morna',
  'Musical theatre': 'Comédie musicale',
  'Neapolitan song': 'Chanson napolitaine',
  'Negro spiritual jazz': 'Negro spiritual',
  'Negro spiritual': 'Negro spiritual',
  'Nursery rhyme': 'Comptine',
  'Opera': 'Opéra',
  'Pastoral': 'Pastorale',
  'Pavane': 'Pavane',
  'Polyphonic song': 'Chant polyphonique',
  'Pop': 'Pop',
  'Protest song': 'Chanson engagée',
  'Reggae': 'Reggae',
  'Renaissance song': 'Chanson de la Renaissance',
  'Rock': 'Rock',
  'Rock opera': 'Opéra rock',
  'Romane Chave': 'Romane Chave',
  'Romantic music': 'Musique romantique',
  'Rondeau': 'Rondeau',
  'Rumba flamenca': 'Rumba flamenca',
  'Scottish dance': 'Danse écossaise',
  'Sephardic': 'Séfarade',
  'Sevdalinka': 'Sevdalinka',
  'Singspiegel': 'Singspiegel',
  'Song': 'Chanson',
  'Starogradska': 'Starogradska',
  'Tango': 'Tango',
  'Traditional': 'Traditionnel',
  'Traditional dance': 'Danse traditionnelle',
  'Traditional music': 'Musique traditionnelle',
  'Traditional song': 'Chanson traditionnelle',
  'Tryndytchka': 'Tryndytchka',
  // French genres already in correct form
  'Traditionnel': 'Traditionnel',
  'Classique': 'Classique',
  'Populaire': 'Populaire',
  'Berceuse': 'Berceuse',
  'Comptine': 'Comptine',
  'Chant de travail': 'Chant de travail',
  'Chant religieux': 'Chant religieux',
}

// Map English country names to French (matching data/geography.ts)
const COUNTRY_EN_TO_FR: Record<string, string> = {
  'Afghanistan': 'Afghanistan',
  'Albania': 'Albanie',
  'Algeria': 'Algérie',
  'Argentina': 'Argentine',
  'Armenia': 'Arménie',
  'Australia': 'Australie',
  'Austria': 'Autriche',
  'Belgium': 'Belgique',
  'Bosnia and Herzegovina': 'Bosnie-Herzégovine',
  'Brazil': 'Brésil',
  'Bulgaria': 'Bulgarie',
  'Burkina Faso': 'Burkina Faso',
  'Canada': 'Canada',
  'Cape Verde': 'Cap-Vert',
  'Chile': 'Chili',
  'China': 'Chine',
  'Colombia': 'Colombie',
  'Congo': 'Congo',
  'Croatia': 'Croatie',
  'Cuba': 'Cuba',
  'Cyprus': 'Chypre',
  'Egypt': 'Égypte',
  'France': 'France',
  'Georgia': 'Géorgie',
  'Germany': 'Allemagne',
  'Greece': 'Grèce',
  'Hungary': 'Hongrie',
  'India': 'Inde',
  'Iran': 'Iran',
  'Iraq': 'Irak',
  'Ireland': 'Irlande',
  'Israel': 'Israël',
  'Italy': 'Italie',
  'Japan': 'Japon',
  'Kenya': 'Kenya',
  'Kosovo': 'Kosovo',
  'Latvia': 'Lettonie',
  'Lebanon': 'Liban',
  'Lithuania': 'Lituanie',
  'Macedonia': 'Macédoine du Nord',
  'Macedoine': 'Macédoine du Nord',
  'North Macedonia': 'Macédoine du Nord',
  'Mexico': 'Mexique',
  'Moldova': 'Moldavie',
  'Montenegro': 'Monténégro',
  'Morocco': 'Maroc',
  'Mozambique': 'Mozambique',
  'Netherlands': 'Pays-Bas',
  'New Zealand': 'Nouvelle-Zélande',
  'Panama': 'Panama',
  'Peru': 'Pérou',
  'Poland': 'Pologne',
  'Portugal': 'Portugal',
  'Romania': 'Roumanie',
  'Russia': 'Russie',
  'Senegal': 'Sénégal',
  'Serbia': 'Serbie',
  'Slovakia': 'Slovaquie',
  'Slovenia': 'Slovénie',
  'South Africa': 'Afrique du Sud',
  'Spain': 'Espagne',
  'Sweden': 'Suède',
  'Switzerland': 'Suisse',
  'Tunisia': 'Tunisie',
  'Turkey': 'Turquie',
  'Ukraine': 'Ukraine',
  'United Kingdom': 'Royaume-Uni',
  'United-Kingdom': 'Royaume-Uni',
  'UK': 'Royaume-Uni',
  'United States of America': 'États-Unis',
  'United States': 'États-Unis',
  'USA': 'États-Unis',
  'Venezuela': 'Venezuela',
  // Regional names that don't have direct Payload matches - skip these
  // 'Alsace': null,
  // 'Catalonia': null,
  // 'Caucasia': null,
  // 'Chechnya': null,
  // 'Central Europe': null,
  // 'Middle East': null,
  // 'West Virginia': null,
}

// ============================================================================
// CSV Parsing (using PapaParse for proper handling of multi-line fields)
// ============================================================================

function parseCSV(content: string): CsvRow[] {
  const result = Papa.parse<CsvRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  })

  if (result.errors.length > 0) {
    console.warn('CSV parsing warnings:', result.errors.slice(0, 5))
  }

  console.log(`  Parsed ${result.data.length} rows from CSV`)
  return result.data
}

// ============================================================================
// Folder Scanning
// ============================================================================

function scanSongFolders(): SongFolder[] {
  const folders: SongFolder[] = []
  const items = fs.readdirSync(SONGS_DATA_DIR)

  for (const item of items) {
    const itemPath = path.join(SONGS_DATA_DIR, item)
    const stat = fs.statSync(itemPath)

    if (!stat.isDirectory()) continue
    if (item === 'node_modules' || item.startsWith('.')) continue

    const normalizedName = item.trim().replace(/_/g, ' ').toUpperCase()

    const folder: SongFolder = {
      name: item,
      path: itemPath,
      normalizedName,
      audioFiles: [],
      musicScorePdf: null,
      historyEnPdf: null,
      historyFrPdf: null,
      singingDirs: [],
    }

    // Scan root files
    const rootFiles = fs.readdirSync(itemPath)
    for (const file of rootFiles) {
      const filePath = path.join(itemPath, file)
      const fileStat = fs.statSync(filePath)

      if (fileStat.isDirectory()) {
        // Check if it's a singing directory
        if (file.toUpperCase().includes('SINGING')) {
          const singingDir = scanSingingDirectory(filePath, file)
          folder.singingDirs.push(singingDir)
        }
      } else {
        const upperFile = file.toUpperCase()

        if (upperFile.includes('MUSIC SCORE') && upperFile.endsWith('.PDF')) {
          folder.musicScorePdf = filePath
        } else if (upperFile.includes('HISTORY') && upperFile.endsWith('.PDF')) {
          folder.historyEnPdf = filePath
        } else if (upperFile.includes('HISTOIRE') && upperFile.endsWith('.PDF')) {
          folder.historyFrPdf = filePath
        } else if (upperFile.endsWith('.MP3') || upperFile.endsWith('.WAV')) {
          if (upperFile.includes('_AUDIO')) {
            folder.audioFiles.push(filePath)
          }
        }
      }
    }

    folders.push(folder)
  }

  return folders
}

function scanSingingDirectory(dirPath: string, dirName: string): SongFolder['singingDirs'][0] {
  // Extract language from directory name: "FOGGY DEW_ENGLISH SINGING" -> "ENGLISH"
  const langMatch = dirName.toUpperCase().match(/([A-Z]+)\s+SINGING/)
  const language = langMatch ? langMatch[1] : 'Unknown'

  const singingDir: SongFolder['singingDirs'][0] = {
    name: dirName,
    path: dirPath,
    language,
    lyricsPdf: null,
    translationPdfs: [],
    audioFiles: [],
  }

  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const upperFile = file.toUpperCase()

    if (upperFile.endsWith('.PDF')) {
      // Check for lyrics: "[SONG]_[LANGUAGE] LYRICS.pdf"
      if (upperFile.includes('LYRICS') && !upperFile.includes('TRANSLATION') && !upperFile.includes('TRANSALTION')) {
        singingDir.lyricsPdf = filePath
      }
      // Check for translations: "[SONG]_[TARGET] TRANSLATION OF [SOURCE] LYRICS.pdf"
      else if (upperFile.includes('TRANSLATION') || upperFile.includes('TRANSALTION')) {
        const transMatch = upperFile.match(/([A-Z]+)\s+TRANS[A-Z]*TION\s+OF\s+([A-Z]+)\s+LYRICS/)
        if (transMatch) {
          singingDir.translationPdfs.push({
            targetLang: transMatch[1],
            sourceLang: transMatch[2],
            path: filePath,
          })
        }
      }
    } else if (upperFile.endsWith('.MP3') || upperFile.endsWith('.WAV')) {
      singingDir.audioFiles.push(filePath)
    }
  }

  return singingDir
}

// ============================================================================
// PDF Text Extraction
// ============================================================================

async function extractTextFromPdf(pdfPath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(pdfPath)
    const data = await pdf(dataBuffer)
    return data.text.trim()
  } catch (error) {
    console.error(`Error extracting text from PDF: ${pdfPath}`, error)
    return ''
  }
}

// ============================================================================
// Cloudinary Upload
// ============================================================================

async function uploadToCloudinary(
  filePath: string,
  folder: string,
  resourceType: 'image' | 'video' | 'raw'
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: false,
    access_mode: 'public', // Ensure files are publicly accessible
  })

  return {
    publicId: result.public_id,
    url: result.secure_url,
  }
}

// ============================================================================
// Lookup Resolution
// ============================================================================

async function fetchLookups(): Promise<LookupMaps> {
  const maps: LookupMaps = {
    languages: new Map(),
    languagesByCode: new Map(),
    genres: new Map(),
    audiences: new Map(),
    themes: new Map(),
    trackTypes: new Map(),
  }

  // Use the public lookup API endpoints which return arrays directly
  // Fetch languages
  const langRes = await fetch(`${BASE_URL}/lookup/languages`)
  const langData = await langRes.json()
  console.log('  Languages response:', Array.isArray(langData) ? langData.length : 0, 'items')
  for (const doc of langData || []) {
    maps.languages.set(doc.name, parseInt(doc.id))
    if (doc.code) maps.languagesByCode.set(doc.code, parseInt(doc.id))
  }

  // Fetch genres
  const genreRes = await fetch(`${BASE_URL}/lookup/genres`)
  const genreData = await genreRes.json()
  console.log('  Genres response:', Array.isArray(genreData) ? genreData.length : 0, 'items')
  for (const doc of genreData || []) {
    maps.genres.set(doc.name, parseInt(doc.id))
  }

  // Fetch audiences
  const audRes = await fetch(`${BASE_URL}/lookup/audiences`)
  const audData = await audRes.json()
  console.log('  Audiences response:', Array.isArray(audData) ? audData.length : 0, 'items')
  for (const doc of audData || []) {
    maps.audiences.set(doc.name, parseInt(doc.id))
  }

  // Fetch themes
  const themeRes = await fetch(`${BASE_URL}/lookup/themes`)
  const themeData = await themeRes.json()
  console.log('  Themes response:', Array.isArray(themeData) ? themeData.length : 0, 'items')
  for (const doc of themeData || []) {
    maps.themes.set(doc.name, parseInt(doc.id))
  }

  // Fetch track types
  const trackRes = await fetch(`${BASE_URL}/lookup/track-types`)
  const trackData = await trackRes.json()
  console.log('  Track types response:', Array.isArray(trackData) ? trackData.length : 0, 'items')
  for (const doc of trackData || []) {
    maps.trackTypes.set(doc.slug, parseInt(doc.id))
  }

  return maps
}

function resolveLanguageId(langName: string, maps: LookupMaps): number | null {
  // Normalize to Title Case: "ENGLISH" → "English", "french" → "French"
  const titleCase = langName.charAt(0).toUpperCase() + langName.slice(1).toLowerCase()

  // Try French name mapping first (most common case)
  const frenchName = LANGUAGE_EN_TO_FR[titleCase]
  if (frenchName) {
    const id = maps.languages.get(frenchName)
    if (id) return id
  }

  // Try direct match with original name (for French names like "Français")
  let id = maps.languages.get(langName)
  if (id) return id

  // Try direct match with title case
  id = maps.languages.get(titleCase)
  if (id) return id

  // Try case-insensitive match on English names in the mapping
  const lowerInput = langName.toLowerCase()
  for (const [englishName, frenchLookup] of Object.entries(LANGUAGE_EN_TO_FR)) {
    if (englishName.toLowerCase() === lowerInput) {
      const id = maps.languages.get(frenchLookup)
      if (id) return id
    }
  }

  // Try case-insensitive match on lookup map (French names)
  for (const [name, langId] of maps.languages) {
    if (name.toLowerCase() === lowerInput) {
      return langId
    }
  }

  return null
}

// ============================================================================
// Progress Tracking
// ============================================================================

function updateProgress(
  songName: string,
  updates: {
    status?: string
    csvMatched?: boolean
    lyricsExtracted?: boolean
    translationsExtracted?: boolean
    createdInPayload?: boolean
    errors?: string[]
    uploads?: { type: string; publicId: string }[]
  }
) {
  let content = fs.readFileSync(PROGRESS_FILE, 'utf-8')

  // Find the song section
  const songHeader = `### ${songName}`
  const songIndex = content.indexOf(songHeader)

  if (songIndex === -1) {
    console.warn(`Song ${songName} not found in progress file`)
    return
  }

  // Find the next song section or end
  const nextSongMatch = content.substring(songIndex + songHeader.length).match(/\n### /)
  const endIndex = nextSongMatch
    ? songIndex + songHeader.length + (nextSongMatch.index || 0)
    : content.indexOf('\n## Cloudinary Upload Log')

  let songSection = content.substring(songIndex, endIndex)

  if (updates.status) {
    songSection = songSection.replace(/- \*\*Status\*\*: \w+/, `- **Status**: ${updates.status}`)
  }
  if (updates.csvMatched !== undefined) {
    songSection = songSection.replace(/- \*\*CSV matched\*\*: \w+/, `- **CSV matched**: ${updates.csvMatched ? 'yes' : 'no'}`)
  }
  if (updates.lyricsExtracted !== undefined) {
    songSection = songSection.replace(/- \*\*Lyrics extracted\*\*: [\w\/]+/, `- **Lyrics extracted**: ${updates.lyricsExtracted ? 'yes' : 'no'}`)
  }
  if (updates.translationsExtracted !== undefined) {
    songSection = songSection.replace(/- \*\*Translations extracted\*\*: [\w\/]+/, `- **Translations extracted**: ${updates.translationsExtracted ? 'yes' : 'no'}`)
  }
  if (updates.createdInPayload !== undefined) {
    songSection = songSection.replace(/- \*\*Created in Payload\*\*: \w+/, `- **Created in Payload**: ${updates.createdInPayload ? 'yes' : 'no'}`)
  }
  if (updates.errors && updates.errors.length > 0) {
    songSection = songSection.replace(/- \*\*Errors\*\*: \[\]/, `- **Errors**: ${JSON.stringify(updates.errors)}`)
  }

  content = content.substring(0, songIndex) + songSection + content.substring(endIndex)
  fs.writeFileSync(PROGRESS_FILE, content)
}

function updateSummary(completed: number, failed: number, pending: number) {
  let content = fs.readFileSync(PROGRESS_FILE, 'utf-8')

  content = content.replace(/- Completed: \d+/, `- Completed: ${completed}`)
  content = content.replace(/- Failed: \d+/, `- Failed: ${failed}`)
  content = content.replace(/- Pending: \d+/, `- Pending: ${pending}`)

  fs.writeFileSync(PROGRESS_FILE, content)
}

function logCloudinaryUpload(song: string, fileType: string, localPath: string, publicId: string, status: string) {
  let content = fs.readFileSync(PROGRESS_FILE, 'utf-8')

  const tableEnd = content.indexOf('\n\n## Error Log')
  const newRow = `| ${song} | ${fileType} | ${path.basename(localPath)} | ${publicId} | ${status} |\n`

  content = content.substring(0, tableEnd) + newRow + content.substring(tableEnd)
  fs.writeFileSync(PROGRESS_FILE, content)
}

function logError(song: string, step: string, errorMessage: string) {
  let content = fs.readFileSync(PROGRESS_FILE, 'utf-8')

  const timestamp = new Date().toISOString()
  const newRow = `| ${timestamp} | ${song} | ${step} | ${errorMessage} |\n`

  content = content + newRow
  fs.writeFileSync(PROGRESS_FILE, content)
}

// ============================================================================
// Title Normalization & Slug Generation
// ============================================================================

/**
 * Normalize a title for matching between CSV and folder names
 * Handles: underscores, apostrophes, trailing spaces, multiple spaces
 */
function normalizeTitle(title: string): string {
  return title
    .toUpperCase()
    .trim()
    .replace(/[_'`'"]/g, ' ')  // Replace underscores and apostrophes with spaces
    .replace(/\s+/g, ' ')       // Collapse multiple spaces
    .trim()
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ============================================================================
// Main Migration
// ============================================================================

async function migrateSong(
  folder: SongFolder,
  csvRow: CsvRow | null,
  maps: LookupMaps
): Promise<boolean> {
  const songName = folder.normalizedName.replace(/_/g, ' ').trim()
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Processing: ${songName}`)
  console.log(`${'='.repeat(60)}`)

  updateProgress(songName, { status: 'in_progress' })

  const errors: string[] = []
  const slug = generateSlug(songName)

  try {
    // 1. Check if song already exists via public API
    const existingRes = await fetch(`${BASE_URL}/public/songs?limit=200`)
    const existingData = await existingRes.json()
    const existingSong = existingData?.find?.((s: any) => s.slug === slug)

    if (existingSong) {
      console.log(`  Song already exists (ID: ${existingSong.id})`)
      console.log(`  Please delete from Payload Admin first, then re-run migration`)
      errors.push(`Song already exists - delete from admin panel first`)
      updateProgress(songName, { status: 'failed', errors })
      return false
    }

    // 2. Extract metadata from CSV or use defaults
    let difficulty: 'Facile' | 'Intermédiaire' | 'Difficile' = 'Intermédiaire'
    let countries: string[] = []
    let languageIds: number[] = []
    let genreIds: number[] = []
    let audienceIds: number[] = []
    let themeIds: number[] = []

    if (csvRow) {
      updateProgress(songName, { csvMatched: true })
      console.log(`  CSV data found`)

      // Difficulty
      if (csvRow['Difficulty Level']) {
        difficulty = DIFFICULTY_MAP[csvRow['Difficulty Level']] || 'Intermédiaire'
      }

      // Countries - extract first value and translate to French
      if (csvRow['Country/Geographic origin']) {
        const countryParts = csvRow['Country/Geographic origin'].split(',').map(s => s.trim())
        const firstCountry = countryParts[0]
        const frenchCountry = COUNTRY_EN_TO_FR[firstCountry]
        if (frenchCountry) {
          countries = [frenchCountry]
          console.log(`    Country: ${firstCountry} → ${frenchCountry}`)
        } else {
          console.log(`    Country not mapped: ${firstCountry} (skipping)`)
          // Don't add unmapped countries - they'll cause validation errors
        }
      }

      // Languages
      if (csvRow['Language of origin']) {
        const langId = resolveLanguageId(csvRow['Language of origin'], maps)
        if (langId) languageIds.push(langId)
      }

      // Genres (use French 'Style musical' column)
      if (csvRow['Style musical']) {
        const genreNames = csvRow['Style musical'].split(',').map(s => s.trim())
        for (const name of genreNames) {
          // Try direct match first, then English mapping as fallback
          const id = maps.genres.get(name) || maps.genres.get(GENRE_EN_TO_FR[name] || name)
          if (id) {
            genreIds.push(id)
          } else {
            console.log(`    Genre not found: ${name}`)
          }
        }
      }

      // Audiences
      if (csvRow.Beneficiaries) {
        const audNames = csvRow.Beneficiaries.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
        for (const name of audNames) {
          const mappedName = AUDIENCE_MAP[name] || name
          const id = maps.audiences.get(mappedName)
          if (id) audienceIds.push(id)
        }
      }

      // Themes (use French 'Thèmes' column)
      if (csvRow['Thèmes']) {
        const themeNames = csvRow['Thèmes'].split(',').map(s => s.trim())
        for (const name of themeNames) {
          // Normalize: capitalize first letter
          const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
          const id = maps.themes.get(normalized) || maps.themes.get(name)
          if (id) {
            themeIds.push(id)
          } else {
            console.log(`    Theme not found: ${name} (normalized: ${normalized})`)
          }
        }
      }
    }

    // 3. Extract lyrics from PDFs
    const lyrics: { language: number; text: string }[] = []
    const translations: { language: number; text: string }[] = []

    for (const singingDir of folder.singingDirs) {
      // Extract lyrics
      if (singingDir.lyricsPdf) {
        console.log(`  Extracting lyrics from: ${path.basename(singingDir.lyricsPdf)}`)
        const text = await extractTextFromPdf(singingDir.lyricsPdf)
        if (text) {
          const langId = resolveLanguageId(singingDir.language, maps)
          if (langId) {
            lyrics.push({ language: langId, text })
            console.log(`    Lyrics extracted (${text.length} chars)`)
          } else {
            errors.push(`Could not resolve language: ${singingDir.language}`)
          }
        }
      }

      // Extract translations
      for (const transPdf of singingDir.translationPdfs) {
        console.log(`  Extracting translation from: ${path.basename(transPdf.path)}`)
        const text = await extractTextFromPdf(transPdf.path)
        if (text) {
          const langId = resolveLanguageId(transPdf.targetLang, maps)
          if (langId) {
            translations.push({ language: langId, text })
            console.log(`    Translation extracted (${text.length} chars)`)
          } else {
            errors.push(`Could not resolve language: ${transPdf.targetLang}`)
          }
        }
      }
    }

    updateProgress(songName, {
      lyricsExtracted: lyrics.length > 0,
      translationsExtracted: translations.length > 0
    })

    // 4. Upload PDFs to Cloudinary
    const scores: { language: number; pdfPublicId: string }[] = []
    const historyDocuments: { language: number; pdfPublicId: string }[] = []

    // Score
    if (folder.musicScorePdf) {
      console.log(`  Uploading score...`)
      try {
        const result = await uploadToCloudinary(
          folder.musicScorePdf,
          `songs/${slug}/scores`,
          'raw'
        )
        // Use French as default language for scores
        const frId = resolveLanguageId('French', maps)
        if (frId) {
          scores.push({ language: frId, pdfPublicId: result.publicId })
          logCloudinaryUpload(songName, 'Score', folder.musicScorePdf, result.publicId, 'success')
          console.log(`    Uploaded: ${result.publicId}`)
        }
      } catch (error: any) {
        errors.push(`Score upload failed: ${error.message}`)
        logError(songName, 'Score Upload', error.message)
      }
    }

    // History EN
    if (folder.historyEnPdf) {
      console.log(`  Uploading history (EN)...`)
      try {
        const result = await uploadToCloudinary(
          folder.historyEnPdf,
          `songs/${slug}/history`,
          'raw'
        )
        const enId = resolveLanguageId('English', maps)
        if (enId) {
          historyDocuments.push({ language: enId, pdfPublicId: result.publicId })
          logCloudinaryUpload(songName, 'History EN', folder.historyEnPdf, result.publicId, 'success')
          console.log(`    Uploaded: ${result.publicId}`)
        }
      } catch (error: any) {
        errors.push(`History EN upload failed: ${error.message}`)
        logError(songName, 'History EN Upload', error.message)
      }
    }

    // History FR
    if (folder.historyFrPdf) {
      console.log(`  Uploading history (FR)...`)
      try {
        const result = await uploadToCloudinary(
          folder.historyFrPdf,
          `songs/${slug}/history`,
          'raw'
        )
        const frId = resolveLanguageId('French', maps)
        if (frId) {
          historyDocuments.push({ language: frId, pdfPublicId: result.publicId })
          logCloudinaryUpload(songName, 'History FR', folder.historyFrPdf, result.publicId, 'success')
          console.log(`    Uploaded: ${result.publicId}`)
        }
      } catch (error: any) {
        errors.push(`History FR upload failed: ${error.message}`)
        logError(songName, 'History FR Upload', error.message)
      }
    }

    // 5. Upload audio files to Cloudinary
    const audioTracks: { trackType: number; versions: { versionId: string; name: string; audioPublicId: string }[] }[] = []

    // Main audio (groupe track)
    if (folder.audioFiles.length > 0) {
      const groupeId = maps.trackTypes.get('groupe')
      if (groupeId) {
        const versions: { versionId: string; name: string; audioPublicId: string }[] = []

        for (const audioFile of folder.audioFiles) {
          console.log(`  Uploading audio: ${path.basename(audioFile)}`)
          try {
            const result = await uploadToCloudinary(
              audioFile,
              `songs/${slug}/audio/groupe`,
              'video'
            )
            versions.push({
              versionId: 'default',
              name: 'Default',
              audioPublicId: result.publicId,
            })
            logCloudinaryUpload(songName, 'Audio (groupe)', audioFile, result.publicId, 'success')
            console.log(`    Uploaded: ${result.publicId}`)
          } catch (error: any) {
            errors.push(`Audio upload failed: ${error.message}`)
            logError(songName, 'Audio Upload', error.message)
          }
        }

        if (versions.length > 0) {
          audioTracks.push({ trackType: groupeId, versions })
        }
      }
    }

    // Singing audio (chant track)
    for (const singingDir of folder.singingDirs) {
      if (singingDir.audioFiles.length > 0) {
        const chantId = maps.trackTypes.get('chant')
        if (chantId) {
          const versions: { versionId: string; name: string; audioPublicId: string }[] = []

          for (let i = 0; i < singingDir.audioFiles.length; i++) {
            const audioFile = singingDir.audioFiles[i]
            const fileName = path.basename(audioFile, path.extname(audioFile))
            console.log(`  Uploading singing audio: ${path.basename(audioFile)}`)

            try {
              const result = await uploadToCloudinary(
                audioFile,
                `songs/${slug}/audio/chant`,
                'video'
              )
              versions.push({
                versionId: `${singingDir.language.toLowerCase()}-${i + 1}`,
                name: `${singingDir.language} - ${fileName}`,
                audioPublicId: result.publicId,
              })
              logCloudinaryUpload(songName, `Audio (chant/${singingDir.language})`, audioFile, result.publicId, 'success')
              console.log(`    Uploaded: ${result.publicId}`)
            } catch (error: any) {
              errors.push(`Singing audio upload failed: ${error.message}`)
              logError(songName, 'Singing Audio Upload', error.message)
            }
          }

          if (versions.length > 0) {
            // Check if we already have a chant track, if so merge versions
            const existingChant = audioTracks.find(t => t.trackType === chantId)
            if (existingChant) {
              existingChant.versions.push(...versions)
            } else {
              audioTracks.push({ trackType: chantId, versions })
            }
          }
        }
      }
    }

    // 6. Create song in Payload
    const songData = {
      title: songName,
      difficulty,
      countries,
      languages: languageIds,
      genres: genreIds,
      audiences: audienceIds,
      themes: themeIds,
      lyrics,
      translations,
      scores,
      historyDocuments,
      audioTracks,
    }

    console.log(`\n  Creating song in Payload...`)
    console.log(`    Title: ${songData.title}`)
    console.log(`    Difficulty: ${songData.difficulty}`)
    console.log(`    Lyrics: ${songData.lyrics.length}`)
    console.log(`    Translations: ${songData.translations.length}`)
    console.log(`    Scores: ${songData.scores.length}`)
    console.log(`    History Docs: ${songData.historyDocuments.length}`)
    console.log(`    Audio Tracks: ${songData.audioTracks.length}`)

    const res = await fetch(`${BASE_URL}/migrate/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    })

    const result = await res.json()

    if (result.doc) {
      console.log(`  SUCCESS: Song created with ID ${result.doc.id}`)
      updateProgress(songName, {
        status: 'completed',
        createdInPayload: true,
        errors: errors.length > 0 ? errors : undefined
      })
      return true
    } else {
      console.error(`  FAILED:`, result.error, result.details)
      errors.push(result.details || result.error || 'Unknown error')
      updateProgress(songName, { status: 'failed', errors })
      logError(songName, 'Create Song', result.details || result.error)
      return false
    }

  } catch (error: any) {
    console.error(`  ERROR: ${error.message}`)
    errors.push(error.message)
    updateProgress(songName, { status: 'failed', errors })
    logError(songName, 'Migration', error.message)
    return false
  }
}

async function main() {
  console.log('Starting songs migration...\n')

  // 1. Seed lookups first
  console.log('Seeding lookup tables...')
  try {
    const seedRes = await fetch(`${BASE_URL}/migrate/seed-lookups`, { method: 'POST' })
    const seedResult = await seedRes.json()
    console.log('Lookups seeded:', seedResult.summary)
  } catch (error) {
    console.error('Failed to seed lookups, continuing anyway...')
  }

  // 2. Fetch lookup maps
  console.log('\nFetching lookup data...')
  const maps = await fetchLookups()
  console.log(`  Languages: ${maps.languages.size}`)
  console.log(`  Genres: ${maps.genres.size}`)
  console.log(`  Audiences: ${maps.audiences.size}`)
  console.log(`  Themes: ${maps.themes.size}`)
  console.log(`  Track Types: ${maps.trackTypes.size}`)

  // 3. Parse CSV
  console.log('\nParsing CSV...')
  const csvPath = path.join(SONGS_DATA_DIR, 'songs-data.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const csvRows = parseCSV(csvContent)
  console.log(`  Found ${csvRows.length} songs in CSV`)

  // Build CSV lookup by normalized title
  const csvByTitle = new Map<string, CsvRow>()
  for (const row of csvRows) {
    if (row['IS A SONG'] === 'TRUE' && row.Title) {
      const normalized = normalizeTitle(row.Title)
      csvByTitle.set(normalized, row)
      console.log(`  CSV: "${row.Title}" → "${normalized}"`)
    }
  }

  // 4. Scan song folders
  console.log('\nScanning song folders...')
  const folders = scanSongFolders()
  console.log(`  Found ${folders.length} song folders`)

  // 5. Process each folder
  let completed = 0
  let failed = 0

  for (const folder of folders) {
    // Try to match with CSV using normalized title
    const normalizedFolderName = normalizeTitle(folder.normalizedName)
    const csvRow = csvByTitle.get(normalizedFolderName) || null
    console.log(`\nMatching folder: "${folder.name}" → "${normalizedFolderName}" → CSV match: ${csvRow ? 'YES' : 'NO'}`)

    const success = await migrateSong(folder, csvRow, maps)

    if (success) {
      completed++
    } else {
      failed++
    }
  }

  // 6. Update summary
  updateSummary(completed, failed, 0)

  console.log('\n' + '='.repeat(60))
  console.log('Migration Complete!')
  console.log(`  Completed: ${completed}`)
  console.log(`  Failed: ${failed}`)
  console.log('='.repeat(60))
}

main().catch(console.error)
