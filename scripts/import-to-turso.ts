/**
 * Import data into Turso via Payload CMS
 *
 * Reads exported raw SQL table JSON from migration-data/ and imports into Turso.
 * Uses the ID mapping from Cloudinary-to-R2 migration to update object keys.
 *
 * Usage: npx tsx scripts/import-to-turso.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const DATA_DIR = path.join(process.cwd(), 'migration-data')
const MAPPING_FILE = path.join(DATA_DIR, 'id-mapping.json')

interface IdMapping {
  [cloudinaryPublicId: string]: string
}

function loadJson<T = unknown[]>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filename}, skipping...`)
    return [] as unknown as T
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function loadMapping(): IdMapping {
  if (!fs.existsSync(MAPPING_FILE)) {
    console.log('WARNING: No id-mapping.json found. Object keys will not be remapped.')
    return {}
  }
  return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'))
}

function remapObjectKey(publicId: string | null | undefined, mapping: IdMapping): string {
  if (!publicId) return ''
  return mapping[publicId] || publicId
}

async function importData() {
  const { getPayload } = await import('payload')

  console.log('Initializing Payload client (Turso)...')
  const payload = await getPayload({
    config: (await import('../payload.config')).default,
  })

  const mapping = loadMapping()
  // Track old->new ID mappings for each collection
  const idMap: Record<string, Record<number, number>> = {}

  // 1. Import lookup collections first (these are straightforward)
  const lookups: Array<{ slug: string; file: string }> = [
    { slug: 'languages', file: 'languages.json' },
    { slug: 'genres', file: 'genres.json' },
    { slug: 'audiences', file: 'audiences.json' },
    { slug: 'themes', file: 'themes.json' },
    { slug: 'track-types', file: 'track-types.json' },
    { slug: 'difficulty-levels', file: 'difficulty-levels.json' },
  ]

  for (const { slug, file } of lookups) {
    console.log(`\nImporting ${slug}...`)
    const docs = loadJson<Array<Record<string, unknown>>>(file)
    idMap[slug] = {}

    for (const doc of docs) {
      try {
        const oldId = doc.id as number
        // Build data using camelCase field names that Payload expects
        const data: Record<string, unknown> = {
          name: doc.name,
        }
        if (doc.name_en !== undefined) data.nameEn = doc.name_en
        if (doc.code !== undefined) data.code = doc.code
        if (doc.slug !== undefined) data.slug = doc.slug

        const created = await payload.create({
          collection: slug as 'languages',
          data,
        })

        idMap[slug][oldId] = created.id as number
        console.log(`  Created: ${doc.name} (${oldId} -> ${created.id})`)
      } catch (error: any) {
        console.error(`  Failed: ${doc.name}`, error?.message || error)
      }
    }
  }

  // 2. Import songs
  console.log('\nImporting songs...')
  const songs = loadJson<Array<Record<string, unknown>>>('songs.json')
  const songsRels = loadJson<Array<Record<string, unknown>>>('songs_rels.json')
  const songsCountries = loadJson<Array<Record<string, unknown>>>('songs_countries.json')
  const songsLyrics = loadJson<Array<Record<string, unknown>>>('songs_lyrics.json')
  const songsLyricsTranslations = loadJson<Array<Record<string, unknown>>>('songs_lyrics_translations.json')
  const songsScores = loadJson<Array<Record<string, unknown>>>('songs_scores.json')
  const songsHistoryDocs = loadJson<Array<Record<string, unknown>>>('songs_history_documents.json')
  const songsAudioTracks = loadJson<Array<Record<string, unknown>>>('songs_audio_tracks.json')
  const songsAudioVersions = loadJson<Array<Record<string, unknown>>>('songs_audio_tracks_versions.json')

  for (const song of songs) {
    try {
      const oldId = song.id as number

      // Get relationships from songs_rels
      const songRels = songsRels.filter((r) => r.parent_id === oldId)

      // Map relationship IDs
      const languageIds = songRels
        .filter((r) => r.path === 'languages' && r.languages_id)
        .sort((a, b) => (a.order as number) - (b.order as number))
        .map((r) => idMap['languages']?.[r.languages_id as number] || r.languages_id)

      const genreIds = songRels
        .filter((r) => r.path === 'genres' && r.genres_id)
        .sort((a, b) => (a.order as number) - (b.order as number))
        .map((r) => idMap['genres']?.[r.genres_id as number] || r.genres_id)

      const audienceIds = songRels
        .filter((r) => r.path === 'audiences' && r.audiences_id)
        .sort((a, b) => (a.order as number) - (b.order as number))
        .map((r) => idMap['audiences']?.[r.audiences_id as number] || r.audiences_id)

      const themeIds = songRels
        .filter((r) => r.path === 'themes' && r.themes_id)
        .sort((a, b) => (a.order as number) - (b.order as number))
        .map((r) => idMap['themes']?.[r.themes_id as number] || r.themes_id)

      // Get countries (select field with hasMany: true — expects array of string values)
      const countries = songsCountries
        .filter((c) => c.parent_id === oldId)
        .sort((a, b) => (a.order as number) - (b.order as number))
        .map((c) => c.value as string)

      // Get lyrics with translations
      const lyrics = songsLyrics
        .filter((l) => l._parent_id === oldId)
        .sort((a, b) => (a._order as number) - (b._order as number))
        .map((l) => {
          const translations = songsLyricsTranslations
            .filter((t) => t._parent_id === l.id)
            .sort((a, b) => (a._order as number) - (b._order as number))
            .map((t) => ({
              language: idMap['languages']?.[t.language_id as number] || t.language_id,
              text: t.text,
            }))

          return {
            language: idMap['languages']?.[l.language_id as number] || l.language_id,
            text: l.text,
            translations,
          }
        })

      // Get scores
      const scores = songsScores
        .filter((s) => s._parent_id === oldId)
        .sort((a, b) => (a._order as number) - (b._order as number))
        .map((s) => ({
          pdfPublicId: remapObjectKey(s.pdf_public_id as string, mapping),
        }))

      // Get history documents
      const historyDocuments = songsHistoryDocs
        .filter((h) => h._parent_id === oldId)
        .sort((a, b) => (a._order as number) - (b._order as number))
        .map((h) => ({
          language: idMap['languages']?.[h.language_id as number] || h.language_id,
          pdfPublicId: remapObjectKey(h.pdf_public_id as string, mapping),
        }))

      // Get audio tracks with versions
      const audioTracks = songsAudioTracks
        .filter((t) => t._parent_id === oldId)
        .sort((a, b) => (a._order as number) - (b._order as number))
        .map((t) => {
          const versions = songsAudioVersions
            .filter((v) => v._parent_id === t.id)
            .sort((a, b) => (a._order as number) - (b._order as number))
            .map((v) => ({
              versionId: v.version_id,
              name: v.name,
              audioPublicId: remapObjectKey(v.audio_public_id as string, mapping),
            }))

          return {
            trackType: idMap['track-types']?.[t.track_type_id as number] || t.track_type_id,
            versions,
          }
        })

      // Map difficulty
      const difficultyId = song.difficulty_id
        ? idMap['difficulty-levels']?.[song.difficulty_id as number] || song.difficulty_id
        : undefined

      const data = {
        title: song.title,
        slug: song.slug,
        thumbnailPublicId: remapObjectKey(song.thumbnail_public_id as string, mapping),
        countries,
        languages: languageIds,
        genres: genreIds,
        audiences: audienceIds,
        themes: themeIds,
        difficulty: difficultyId,
        lyrics,
        scores,
        historyDocuments,
        audioTracks,
      }

      const created = await payload.create({
        collection: 'songs',
        data: data as Record<string, unknown>,
      })

      console.log(`  Created song: "${song.title}" (${oldId} -> ${created.id})`)
    } catch (error: any) {
      console.error(`  Failed song: "${song.title}"`, error?.message || error)
    }
  }

  // 3. Note about users: the admin user was already created during initial setup.
  // We log the exported users for reference but don't re-import them
  // (user passwords are hashed and can't be migrated — users need to reset passwords)
  console.log('\nUsers:')
  const users = loadJson<Array<Record<string, unknown>>>('users.json')
  for (const user of users) {
    console.log(`  Found exported user: ${user.email} (id: ${user.id})`)
  }
  console.log('  NOTE: Users need to be re-created manually with new passwords.')
  console.log('  An admin user was already created during initial setup.')

  console.log('\nImport complete!')
  process.exit(0)
}

importData().catch((error) => {
  console.error('Import failed:', error)
  process.exit(1)
})
