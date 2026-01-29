import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    const client = await pool.connect()

    // Drop the old countries table if it exists
    await client.query('DROP TABLE IF EXISTS countries CASCADE')

    // Drop the songs_countries table if it exists (from old relationship)
    await client.query('DROP TABLE IF EXISTS songs_countries CASCADE')

    // Remove countries_id column from songs_rels if it exists
    await client.query(`
      ALTER TABLE songs_rels DROP COLUMN IF EXISTS countries_id
    `)

    client.release()

    return res.status(200).json({
      message: 'Cleaned up countries tables. Restart the dev server to apply new schema.',
    })
  } catch (error: any) {
    console.error('Error fixing countries:', error)
    return res.status(500).json({
      error: 'Failed to fix countries',
      details: error.message,
    })
  } finally {
    await pool.end()
  }
}
