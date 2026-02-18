import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'

async function fixDifficultyColumn() {
  const sql = neon(process.env.DATABASE_URL!)

  console.log('Fixing difficulty column in songs table...')

  // 1. Drop the difficulty_id column (renamed from difficulty, still enum type)
  console.log('Dropping difficulty_id column (old enum type)...')
  await sql`ALTER TABLE songs DROP COLUMN IF EXISTS difficulty_id`

  // 2. Also drop the old column name in case rename didn't happen
  console.log('Dropping difficulty column if it still exists...')
  await sql`ALTER TABLE songs DROP COLUMN IF EXISTS difficulty`

  // 3. Drop the enum type
  console.log('Dropping enum_songs_difficulty type...')
  await sql`DROP TYPE IF EXISTS enum_songs_difficulty`

  console.log('Done! Now restart the dev server — Payload will create difficulty_id as an integer FK.')
}

fixDifficultyColumn().catch((error) => {
  console.error('Fix failed:', error)
  process.exit(1)
})
