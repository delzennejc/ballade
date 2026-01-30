// Migration script that uses the Payload REST API
const BASE_URL = 'http://localhost:3000/api'

// Extracted unique values from lib/mockData.ts
const countries = ['France', 'Italie']

const languages = [
  { name: 'Français', code: 'fr' },
  { name: 'English', code: 'en' },
  { name: 'Español', code: 'es' },
  { name: 'Italien', code: 'it' },
  { name: 'Allemand', code: 'de' },
  { name: 'Arabe', code: 'ar' },
  { name: 'Turque', code: 'tr' },
  { name: 'Ukrainien', code: 'uk' },
]

const genres = [
  'Traditionnel',
  'Chant de résistance',
  'Folk',
  'Chanson enfantine',
  'Comptine',
]

const audiences = ['Enfants', 'Ados', 'Adultes', 'Séniors']

const themes = [
  'Nature',
  'Amour',
  'Nostalgie',
  'Résistance',
  'Liberté',
  'Histoire',
  'Enfance',
  'Famille',
  'Éducation',
]

// Songs from mockData
const songs = [
  {
    id: '1',
    slug: 'a-la-claire-fontaine',
    title: 'A LA CLAIRE FONTAINE',
    metadata: {
      countries: ['France'],
      languages: ['Français'],
      genres: ['Traditionnel'],
      audience: ['Enfants', 'Ados', 'Adultes', 'Séniors'],
      difficulty: 'Facile',
      themes: ['Nature', 'Amour', 'Nostalgie'],
    },
    lyrics: [
      {
        language: 'Français',
        languageCode: 'fr',
        text: `À la claire fontaine
M'en allant promener
J'ai trouvé l'eau si belle
Que je m'y suis baigné

Il y a longtemps que je t'aime
Jamais je ne t'oublierai

Sous les feuilles d'un chêne
Je me suis fait sécher
Sur la plus haute branche
Un rossignol chantait

Il y a longtemps que je t'aime
Jamais je ne t'oublierai

Chante, rossignol, chante
Toi qui as le cœur gai
Tu as le cœur à rire
Moi je l'ai à pleurer

Il y a longtemps que je t'aime
Jamais je ne t'oublierai`,
      },
      {
        language: 'English',
        languageCode: 'en',
        text: `At the clear fountain
While I was walking
I found the water so beautiful
That I bathed in it

I have loved you for a long time
I will never forget you

Under the leaves of an oak
I dried myself
On the highest branch
A nightingale was singing

I have loved you for a long time
I will never forget you`,
      },
    ],
    translations: [
      {
        language: 'English',
        languageCode: 'en',
        text: `At the clear fountain
While I was walking
I found the water so beautiful
That I bathed in it

I have loved you for a long time
I will never forget you

Under the leaves of an oak
I dried myself
On the highest branch
A nightingale was singing

I have loved you for a long time
I will never forget you

Sing, nightingale, sing
You who have a cheerful heart
You have a heart for laughter
I have one for crying

I have loved you for a long time
I will never forget you`,
      },
      {
        language: 'Español',
        languageCode: 'es',
        text: `En la fuente clara
Mientras paseaba
Encontré el agua tan bella
Que me bañé en ella

Te he amado por mucho tiempo
Nunca te olvidaré`,
      },
    ],
    scores: [{ language: 'Français', languageCode: 'fr', pdf: '' }],
    history: [{ language: 'Français', languageCode: 'fr' }],
    audioTracks: [
      { track: 'groupe', versions: [{ id: 'groupe-fr', name: 'Français' }] },
      { track: 'violon', versions: [{ id: 'violon-fr', name: 'Français' }] },
      { track: 'chant', versions: [{ id: 'chant-fr', name: 'Français' }] },
      { track: 'guitare', versions: [{ id: 'guitare-fr', name: 'Français' }] },
    ],
  },
  {
    id: '2',
    slug: 'bella-ciao',
    title: 'BELLA CIAO',
    metadata: {
      countries: ['Italie'],
      languages: ['Italien'],
      genres: ['Chant de résistance', 'Folk'],
      audience: ['Ados', 'Adultes', 'Séniors'],
      difficulty: 'Intermédiaire',
      themes: ['Résistance', 'Liberté', 'Histoire'],
    },
    lyrics: [
      {
        language: 'Italien',
        languageCode: 'it',
        text: `Una mattina mi son svegliato
O bella ciao, bella ciao, bella ciao ciao ciao
Una mattina mi son svegliato
E ho trovato l'invasor

O partigiano portami via
O bella ciao, bella ciao, bella ciao ciao ciao
O partigiano portami via
Che mi sento di morir

E se io muoio da partigiano
O bella ciao, bella ciao, bella ciao ciao ciao
E se io muoio da partigiano
Tu mi devi seppellir

Seppellire lassù in montagna
O bella ciao, bella ciao, bella ciao ciao ciao
Seppellire lassù in montagna
Sotto l'ombra di un bel fior`,
      },
      {
        language: 'Français',
        languageCode: 'fr',
        text: `Un beau matin, je me suis réveillé
O bella ciao, bella ciao, bella ciao ciao ciao
Un beau matin, je me suis réveillé
Et j'ai trouvé l'envahisseur

O partisan, emmène-moi
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, emmène-moi
Car je sens que je vais mourir`,
      },
    ],
    translations: [
      {
        language: 'Français',
        languageCode: 'fr',
        text: `Un beau matin, je me suis réveillé
O bella ciao, bella ciao, bella ciao ciao ciao
Un beau matin, je me suis réveillé
Et j'ai trouvé l'envahisseur

O partisan, emmène-moi
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, emmène-moi
Car je sens que je vais mourir

Et si je meurs en partisan
O bella ciao, bella ciao, bella ciao ciao ciao
Et si je meurs en partisan
Tu devras m'enterrer

Enterre-moi là-haut dans la montagne
O bella ciao, bella ciao, bella ciao ciao ciao
Enterre-moi là-haut dans la montagne
Sous l'ombre d'une belle fleur`,
      },
      {
        language: 'English',
        languageCode: 'en',
        text: `One morning I woke up
O bella ciao, bella ciao, bella ciao ciao ciao
One morning I woke up
And I found the invader

O partisan, take me away
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, take me away
Because I feel I'm going to die`,
      },
    ],
    scores: [{ language: 'Français', languageCode: 'fr', pdf: '' }],
    history: [{ language: 'Français', languageCode: 'fr' }],
    audioTracks: [
      { track: 'groupe', versions: [{ id: 'groupe-it', name: 'Italien' }] },
      {
        track: 'violon',
        versions: [
          { id: 'violon-chorus', name: 'Chorus' },
          { id: 'violon-verse', name: 'Verse' },
          { id: 'violon-part1', name: 'Part 1' },
          { id: 'violon-part2', name: 'Part 2' },
        ],
      },
      {
        track: 'chant',
        versions: [
          { id: 'chant-de', name: 'Allemand' },
          { id: 'chant-en', name: 'Anglais' },
          { id: 'chant-ar', name: 'Arabe' },
          { id: 'chant-es', name: 'Espagnol' },
          { id: 'chant-fr', name: 'Français' },
          { id: 'chant-it', name: 'Italien' },
          { id: 'chant-tr', name: 'Turque' },
          { id: 'chant-uk', name: 'Ukrainien' },
        ],
      },
      { track: 'guitare', versions: [{ id: 'guitare-it', name: 'Italien' }] },
      {
        track: 'percussion',
        versions: [{ id: 'percussion-it', name: 'Italien' }],
      },
    ],
  },
  {
    id: '3',
    slug: 'ah-vous-dirai-je-maman',
    title: 'AH VOUS DIRAI-JE MAMAN',
    metadata: {
      countries: ['France'],
      languages: ['Français'],
      genres: ['Chanson enfantine', 'Comptine'],
      audience: ['Enfants', 'Ados', 'Adultes', 'Séniors'],
      difficulty: 'Facile',
      themes: ['Enfance', 'Famille', 'Éducation'],
    },
    lyrics: [
      {
        language: 'Français',
        languageCode: 'fr',
        text: `Ah ! Vous dirai-je, maman,
Ce qui cause mon tourment ?
Papa veut que je raisonne
Comme une grande personne ;
Moi, je dis que les bonbons
Valent mieux que la raison.

Ah ! Vous dirai-je, maman,
Ce qui cause mon tourment ?
Papa veut que je demande
De la soupe et de la viande ;
Moi, je dis que les bonbons
Valent mieux que les mignons.`,
      },
    ],
    translations: [
      {
        language: 'English',
        languageCode: 'en',
        text: `Ah! Let me tell you, mother,
What causes my torment?
Father wants me to reason
Like a grown-up person;
I say that sweets
Are better than reason.

Ah! Let me tell you, mother,
What causes my torment?
Father wants me to ask for
Soup and meat;
I say that sweets
Are better than the little ones.`,
      },
    ],
    scores: [{ language: 'Français', languageCode: 'fr', pdf: '' }],
    history: [{ language: 'Français', languageCode: 'fr' }],
    audioTracks: [
      { track: 'groupe', versions: [{ id: 'groupe-fr', name: 'Français' }] },
      { track: 'chant', versions: [{ id: 'chant-fr', name: 'Français' }] },
      { track: 'violon', versions: [{ id: 'violon-fr', name: 'Français' }] },
    ],
  },
]

// Map language names to codes for lookup
const languageNameToCode: Record<string, string> = {
  Français: 'fr',
  English: 'en',
  Español: 'es',
  Italien: 'it',
  Allemand: 'de',
  Arabe: 'ar',
  Turque: 'tr',
  Ukrainien: 'uk',
}

interface LookupDoc {
  id: number | string
  name: string
  code?: string
}

async function fetchExisting(collection: string): Promise<LookupDoc[]> {
  const res = await fetch(`${BASE_URL}/${collection}?limit=100`)
  const data = await res.json()
  return data.docs || []
}

async function createEntry(
  collection: string,
  data: Record<string, unknown>
): Promise<LookupDoc | null> {
  const res = await fetch(`${BASE_URL}/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (result.doc) {
    return result.doc
  }
  if (result.errors) {
    console.error(`  Error creating in ${collection}:`, result.errors)
  }
  return null
}

async function seedLookups() {
  console.log('Seeding lookup tables via API...\n')

  // Maps to store IDs
  const countriesMap = new Map<string, number | string>()
  const languagesMap = new Map<string, number | string>()
  const languagesByCodeMap = new Map<string, number | string>()
  const genresMap = new Map<string, number | string>()
  const audiencesMap = new Map<string, number | string>()
  const themesMap = new Map<string, number | string>()

  // Seed Countries
  console.log('Seeding Countries...')
  const existingCountries = await fetchExisting('countries')
  existingCountries.forEach((c) => countriesMap.set(c.name, c.id))

  for (const name of countries) {
    if (countriesMap.has(name)) {
      console.log(`  Skipped (exists): ${name}`)
      continue
    }
    const doc = await createEntry('countries', { name })
    if (doc) {
      countriesMap.set(name, doc.id)
      console.log(`  Created: ${name}`)
    }
  }

  // Seed Languages
  console.log('\nSeeding Languages...')
  const existingLanguages = await fetchExisting('languages')
  existingLanguages.forEach((l) => {
    languagesMap.set(l.name, l.id)
    if (l.code) languagesByCodeMap.set(l.code, l.id)
  })

  for (const { name, code } of languages) {
    if (languagesMap.has(name)) {
      console.log(`  Skipped (exists): ${name}`)
      continue
    }
    const doc = await createEntry('languages', { name, code })
    if (doc) {
      languagesMap.set(name, doc.id)
      languagesByCodeMap.set(code, doc.id)
      console.log(`  Created: ${name} (${code})`)
    }
  }

  // Seed Genres
  console.log('\nSeeding Genres...')
  const existingGenres = await fetchExisting('genres')
  existingGenres.forEach((g) => genresMap.set(g.name, g.id))

  for (const name of genres) {
    if (genresMap.has(name)) {
      console.log(`  Skipped (exists): ${name}`)
      continue
    }
    const doc = await createEntry('genres', { name })
    if (doc) {
      genresMap.set(name, doc.id)
      console.log(`  Created: ${name}`)
    }
  }

  // Seed Audiences
  console.log('\nSeeding Audiences...')
  const existingAudiences = await fetchExisting('audiences')
  existingAudiences.forEach((a) => audiencesMap.set(a.name, a.id))

  for (const name of audiences) {
    if (audiencesMap.has(name)) {
      console.log(`  Skipped (exists): ${name}`)
      continue
    }
    const doc = await createEntry('audiences', { name })
    if (doc) {
      audiencesMap.set(name, doc.id)
      console.log(`  Created: ${name}`)
    }
  }

  // Seed Themes
  console.log('\nSeeding Themes...')
  const existingThemes = await fetchExisting('themes')
  existingThemes.forEach((t) => themesMap.set(t.name, t.id))

  for (const name of themes) {
    if (themesMap.has(name)) {
      console.log(`  Skipped (exists): ${name}`)
      continue
    }
    const doc = await createEntry('themes', { name })
    if (doc) {
      themesMap.set(name, doc.id)
      console.log(`  Created: ${name}`)
    }
  }

  console.log('\nLookup seeding complete!')
  console.log(`  Countries: ${countriesMap.size}`)
  console.log(`  Languages: ${languagesMap.size}`)
  console.log(`  Genres: ${genresMap.size}`)
  console.log(`  Audiences: ${audiencesMap.size}`)
  console.log(`  Themes: ${themesMap.size}`)

  return {
    countriesMap,
    languagesMap,
    languagesByCodeMap,
    genresMap,
    audiencesMap,
    themesMap,
  }
}

async function migrateSongs(lookups: {
  countriesMap: Map<string, number | string>
  languagesMap: Map<string, number | string>
  languagesByCodeMap: Map<string, number | string>
  genresMap: Map<string, number | string>
  audiencesMap: Map<string, number | string>
  themesMap: Map<string, number | string>
}) {
  console.log('\n\nMigrating songs...\n')

  const {
    countriesMap,
    languagesMap,
    languagesByCodeMap,
    genresMap,
    audiencesMap,
    themesMap,
  } = lookups

  // Helper function to get language ID by name or code
  const getLanguageId = (
    name: string,
    code?: string
  ): number | string | undefined => {
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

  // Check existing songs
  const existingSongs = await fetchExisting('songs')
  const existingSlugs = new Set(existingSongs.map((s: any) => s.slug))

  for (const song of songs) {
    if (existingSlugs.has(song.slug)) {
      console.log(`Skipped (exists): ${song.title}`)
      continue
    }

    // Build country IDs
    const countryIds = song.metadata.countries
      .map((name) => countriesMap.get(name))
      .filter((id): id is number | string => id !== undefined)

    // Build language IDs
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
          console.warn(
            `    Warning: Language not found for lyric: ${lyric.language}`
          )
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
        const langId = getLanguageId(
          translation.language,
          translation.languageCode
        )
        if (!langId) {
          console.warn(
            `    Warning: Language not found for translation: ${translation.language}`
          )
          return null
        }
        return {
          language: langId,
          text: translation.text,
        }
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)

    // Build scores array with placeholder public IDs
    const scores = song.scores
      .map((score: { language: string; languageCode: string; pdf: string }) => {
        const langId = getLanguageId(score.language, score.languageCode)
        if (!langId) {
          console.warn(
            `    Warning: Language not found for score: ${score.language}`
          )
          return null
        }
        return {
          language: langId,
          pdfPublicId: `songs/${song.slug}/scores/score`,
        }
      })
      .filter((s: unknown): s is NonNullable<typeof s> => s !== null)

    // Build history documents array with placeholder public IDs
    const historyDocuments = song.history
      .map((history) => {
        const langId = getLanguageId(history.language, history.languageCode)
        if (!langId) {
          console.warn(
            `    Warning: Language not found for history: ${history.language}`
          )
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
      trackType: track.track as
        | 'groupe'
        | 'violon'
        | 'chant'
        | 'guitare'
        | 'percussion',
      versions: track.versions.map((version) => ({
        versionId: version.id,
        name: version.name,
        audioPublicId: `songs/${song.slug}/audio/${track.track}/${version.id}`,
      })),
    }))

    // Create the song
    const songData = {
      title: song.title,
      slug: song.slug,
      thumbnailPublicId: `songs/${song.slug}/thumbnails/thumbnail`,
      difficulty: song.metadata.difficulty as
        | 'Facile'
        | 'Intermédiaire'
        | 'Difficile',
      countries: countryIds,
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

    const res = await fetch(`${BASE_URL}/migrate/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    })

    const result = await res.json()
    if (result.doc) {
      console.log(`Created: ${song.title}`)
    } else {
      console.error(`Failed to create: ${song.title}`, result.error, result.details)
    }
  }

  console.log('\nSong migration complete!')
}

async function main() {
  try {
    const lookups = await seedLookups()
    await migrateSongs(lookups)
    console.log('\n=== Migration via API complete! ===')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main()
