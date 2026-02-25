/**
 * Export data from Neon PostgreSQL directly via SQL
 *
 * This script connects directly to Neon (bypassing Payload)
 * and exports all collection data as JSON files to migration-data/.
 *
 * Usage: npx tsx scripts/export-data.ts
 *
 * Required env vars (from .env.local):
 *   DATABASE_URL - Neon connection string
 */

import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const OUTPUT_DIR = path.join(process.cwd(), 'migration-data')

async function query(sql: string) {
  // Use pg since neon serverless was removed — install pg temporarily or use fetch-based approach
  // Actually, we can use the Neon serverless HTTP API directly
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is required')

  // Parse the connection string to use Neon's HTTP API
  const url = new URL(databaseUrl)
  const host = url.hostname
  const httpUrl = `https://${host}/sql`

  const response = await fetch(httpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': databaseUrl,
    },
    body: JSON.stringify({ query: sql, params: [] }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Query failed: ${response.status} ${text}`)
  }

  const result = await response.json() as { rows: Record<string, unknown>[] }
  return result.rows
}

async function exportData() {
  console.log('Connecting to Neon PostgreSQL...\n')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Export lookup tables
  const lookupTables = [
    { name: 'languages', table: 'languages' },
    { name: 'genres', table: 'genres' },
    { name: 'audiences', table: 'audiences' },
    { name: 'themes', table: 'themes' },
    { name: 'track-types', table: 'track_types' },
    { name: 'difficulty-levels', table: 'difficulty_levels' },
  ]

  for (const { name, table } of lookupTables) {
    console.log(`Exporting ${name}...`)
    try {
      const rows = await query(`SELECT * FROM ${table} ORDER BY id`)
      const outputPath = path.join(OUTPUT_DIR, `${name}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2))
      console.log(`  Exported ${rows.length} rows to ${name}.json`)
    } catch (error) {
      console.error(`  Failed to export ${name}:`, error)
    }
  }

  // Export users
  console.log('Exporting users...')
  try {
    const users = await query('SELECT * FROM users ORDER BY id')
    fs.writeFileSync(path.join(OUTPUT_DIR, 'users.json'), JSON.stringify(users, null, 2))
    console.log(`  Exported ${users.length} users`)
  } catch (error) {
    console.error('  Failed to export users:', error)
  }

  // Export songs (main table)
  console.log('Exporting songs...')
  try {
    const songs = await query('SELECT * FROM songs ORDER BY id')
    fs.writeFileSync(path.join(OUTPUT_DIR, 'songs.json'), JSON.stringify(songs, null, 2))
    console.log(`  Exported ${songs.length} songs`)

    // Export songs relationship tables
    const songRelTables = [
      'songs_countries',
      'songs_lyrics',
      'songs_lyrics_translations',
      'songs_scores',
      'songs_history_documents',
      'songs_audio_tracks',
      'songs_audio_tracks_versions',
      'songs_rels',
    ]

    for (const table of songRelTables) {
      console.log(`Exporting ${table}...`)
      try {
        const rows = await query(`SELECT * FROM ${table} ORDER BY id`)
        fs.writeFileSync(path.join(OUTPUT_DIR, `${table}.json`), JSON.stringify(rows, null, 2))
        console.log(`  Exported ${rows.length} rows`)
      } catch (error) {
        console.error(`  Failed to export ${table}:`, error)
      }
    }
  } catch (error) {
    console.error('  Failed to export songs:', error)
  }

  console.log('\nExport complete! Files saved to migration-data/')
  process.exit(0)
}

exportData().catch((error) => {
  console.error('Export failed:', error)
  process.exit(1)
})
