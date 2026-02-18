import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'

async function seedDifficultyLevels() {
  const sql = neon(process.env.DATABASE_URL!)

  console.log('Seeding difficulty levels...')

  // Check if table exists (Payload may not have created it yet)
  const tableExists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'difficulty_levels'
    )
  `

  if (!tableExists[0].exists) {
    console.log('Table difficulty_levels does not exist yet. Start the dev server first so Payload creates it, then re-run this script.')
    process.exit(1)
  }

  const levels = [
    { name: 'Facile', nameEn: 'Easy' },
    { name: 'Intermédiaire', nameEn: 'Intermediate' },
    { name: 'Difficile', nameEn: 'Difficult' },
  ]

  for (const { name, nameEn } of levels) {
    const existing = await sql`SELECT id FROM difficulty_levels WHERE name = ${name}`
    if (existing.length === 0) {
      await sql`INSERT INTO difficulty_levels (name, name_en, updated_at, created_at) VALUES (${name}, ${nameEn}, NOW(), NOW())`
      console.log(`  Created: ${name} (${nameEn})`)
    } else {
      console.log(`  Skipped (exists): ${name}`)
    }
  }

  console.log('Done!')
}

seedDifficultyLevels().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
