import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

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

const difficultyLevels = [
  { name: 'Facile', nameEn: 'Easy' },
  { name: 'Intermédiaire', nameEn: 'Intermediate' },
  { name: 'Difficile', nameEn: 'Difficult' },
]

async function seedLookups() {
  console.log('Starting lookup seed...')

  const payload = await getPayload({ config })

  // Seed Countries
  console.log('\nSeeding Countries...')
  for (const name of countries) {
    const existing = await payload.find({
      collection: 'countries',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'countries',
        data: { name },
      })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  // Seed Languages
  console.log('\nSeeding Languages...')
  for (const { name, code } of languages) {
    const existing = await payload.find({
      collection: 'languages',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'languages',
        data: { name, code },
      })
      console.log(`  Created: ${name} (${code})`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  // Seed Genres
  console.log('\nSeeding Genres...')
  for (const name of genres) {
    const existing = await payload.find({
      collection: 'genres',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'genres',
        data: { name },
      })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  // Seed Audiences
  console.log('\nSeeding Audiences...')
  for (const name of audiences) {
    const existing = await payload.find({
      collection: 'audiences',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'audiences',
        data: { name },
      })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  // Seed Themes
  console.log('\nSeeding Themes...')
  for (const name of themes) {
    const existing = await payload.find({
      collection: 'themes',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'themes',
        data: { name },
      })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  // Seed Difficulty Levels
  console.log('\nSeeding Difficulty Levels...')
  for (const { name, nameEn } of difficultyLevels) {
    const existing = await payload.find({
      collection: 'difficulty-levels',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'difficulty-levels',
        data: { name, nameEn },
      })
      console.log(`  Created: ${name} (${nameEn})`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  console.log('\nLookup seed complete!')
  process.exit(0)
}

seedLookups().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
