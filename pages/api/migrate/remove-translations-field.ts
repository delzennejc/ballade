import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { sql } from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()
    const db = payload.db.drizzle

    // In Payload with PostgreSQL, array fields are stored in separate tables
    // The translations table is typically named songs_translations
    // Let's try to truncate/delete from that table

    try {
      // Delete all rows from the translations table
      await db.execute(sql`DELETE FROM songs_translations`)

      return res.status(200).json({
        message: 'Translations data deleted from database',
        status: 'success',
      })
    } catch (tableError: any) {
      // If that table doesn't exist, try songs_rels for relationship data
      // or report what tables exist
      return res.status(200).json({
        message: 'Could not find translations table - it may already be removed or have a different name',
        details: tableError.message,
      })
    }
  } catch (error: any) {
    console.error('Error removing translations:', error)
    return res.status(500).json({
      error: 'Failed to remove translations field',
      details: error.message,
    })
  }
}
