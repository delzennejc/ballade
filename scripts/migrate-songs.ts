import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { songs } from '../lib/mockData'

// Map language names to codes for lookup
const languageNameToCode: Record<string, string> = {
  'Français': 'fr',
  'English': 'en',
  'Español': 'es',
  'Italien': 'it',
  'Allemand': 'de',
  'Arabe': 'ar',
  'Turque': 'tr',
  'Ukrainien': 'uk',
}

async function migrateSongs() {
  console.log('Starting song migration...')

  const payload = await getPayload({ config })

  // Pre-fetch all lookup tables to build ID maps
  console.log('\nFetching lookup tables...')

  const countriesResult = await payload.find({
    collection: 'countries',
    limit: 100,
  })
  const countriesMap = new Map(
    countriesResult.docs.map((doc) => [doc.name, doc.id])
  )

  const languagesResult = await payload.find({
    collection: 'languages',
    limit: 100,
  })
  const languagesMap = new Map(
    languagesResult.docs.map((doc) => [doc.name, doc.id])
  )
  const languagesByCodeMap = new Map(
    languagesResult.docs.map((doc) => [doc.code, doc.id])
  )

  const genresResult = await payload.find({
    collection: 'genres',
    limit: 100,
  })
  const genresMap = new Map(genresResult.docs.map((doc) => [doc.name, doc.id]))

  const audiencesResult = await payload.find({
    collection: 'audiences',
    limit: 100,
  })
  const audiencesMap = new Map(
    audiencesResult.docs.map((doc) => [doc.name, doc.id])
  )

  const themesResult = await payload.find({
    collection: 'themes',
    limit: 100,
  })
  const themesMap = new Map(themesResult.docs.map((doc) => [doc.name, doc.id]))

  console.log(`  Countries: ${countriesMap.size}`)
  console.log(`  Languages: ${languagesMap.size}`)
  console.log(`  Genres: ${genresMap.size}`)
  console.log(`  Audiences: ${audiencesMap.size}`)
  console.log(`  Themes: ${themesMap.size}`)

  // Helper function to get language ID by name or code
  const getLanguageId = (name: string, code?: string): number | string | undefined => {
    let id = languagesMap.get(name)
    if (!id && code) {
      id = languagesByCodeMap.get(code)
    }
    // Try mapping language name to code
    if (!id) {
      const mappedCode = languageNameToCode[name]
      if (mappedCode) {
        id = languagesByCodeMap.get(mappedCode)
      }
    }
    return id
  }

  // Migrate each song
  console.log('\nMigrating songs...')
  for (const song of songs) {
    // Check if song already exists
    const existing = await payload.find({
      collection: 'songs',
      where: { slug: { equals: song.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  Skipped (exists): ${song.title}`)
      continue
    }

    // Build country IDs
    const countryIds = song.metadata.countries
      .map((name) => countriesMap.get(name))
      .filter((id): id is number | string => id !== undefined)

    // Build language IDs (from metadata.languages)
    const languageIds = song.metadata.languages
      .map((name) => languagesMap.get(name))
      .filter((id): id is number | string => id !== undefined)

    // Build genre IDs
    const genreIds = song.metadata.genres
      .map((name) => genresMap.get(name))
      .filter((id): id is number | string => id !== undefined)

    // Build audience IDs
    const audienceIds = song.metadata.audience
      .map((name) => audiencesMap.get(name))
      .filter((id): id is number | string => id !== undefined)

    // Build theme IDs
    const themeIds = song.metadata.themes
      .map((name) => themesMap.get(name))
      .filter((id): id is number | string => id !== undefined)

    // Build lyrics array with language relationships
    const lyrics = song.lyrics
      .map((lyric) => {
        const langId = getLanguageId(lyric.language, lyric.languageCode)
        if (!langId) {
          console.warn(`    Warning: Language not found for lyric: ${lyric.language}`)
          return null
        }
        return {
          language: langId,
          text: lyric.text,
        }
      })
      .filter((l): l is NonNullable<typeof l> => l !== null)

    // Build translations array with language relationships
    const translations = song.translations
      .map((translation) => {
        const langId = getLanguageId(translation.language, translation.languageCode)
        if (!langId) {
          console.warn(`    Warning: Language not found for translation: ${translation.language}`)
          return null
        }
        return {
          language: langId,
          text: translation.text,
        }
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)

    // Build music sheets array with placeholder public IDs
    const musicSheets = song.musicSheet
      .map((sheet) => {
        const langId = getLanguageId(sheet.language, sheet.languageCode)
        if (!langId) {
          console.warn(`    Warning: Language not found for music sheet: ${sheet.language}`)
          return null
        }
        return {
          language: langId,
          pdfPublicId: `songs/${song.slug}/sheets/score`,
        }
      })
      .filter((s): s is NonNullable<typeof s> => s !== null)

    // Build history documents array with placeholder public IDs
    const historyDocuments = song.history
      .map((history) => {
        const langId = getLanguageId(history.language, history.languageCode)
        if (!langId) {
          console.warn(`    Warning: Language not found for history: ${history.language}`)
          return null
        }
        return {
          language: langId,
          pdfPublicId: `songs/${song.slug}/history/history`,
        }
      })
      .filter((h): h is NonNullable<typeof h> => h !== null)

    // Build audio tracks array with versions and placeholder public IDs
    const audioTracks = song.audioTracks.map((track) => ({
      trackType: track.track as 'groupe' | 'violon' | 'chant' | 'guitare' | 'percussion',
      versions: track.versions.map((version) => ({
        versionId: version.id,
        name: version.name,
        audioPublicId: `songs/${song.slug}/audio/${track.track}/${version.id}`,
      })),
    }))

    // Create the song
    await payload.create({
      collection: 'songs',
      data: {
        title: song.title,
        slug: song.slug,
        thumbnailPublicId: `songs/${song.slug}/thumbnails/thumbnail`,
        difficulty: song.metadata.difficulty as 'Facile' | 'Intermédiaire' | 'Difficile',
        countries: countryIds,
        languages: languageIds,
        genres: genreIds,
        audiences: audienceIds,
        themes: themeIds,
        lyrics,
        translations,
        musicSheets,
        historyDocuments,
        audioTracks,
      },
    })

    console.log(`  Created: ${song.title}`)
  }

  console.log('\nSong migration complete!')
  process.exit(0)
}

migrateSongs().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
