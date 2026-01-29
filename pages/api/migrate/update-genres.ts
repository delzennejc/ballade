import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

interface CsvRow {
  Title: string
  'Style musical': string
}

function normalizeTitle(title: string): string {
  return title
    .toUpperCase()
    .trim()
    .replace(/[_'`'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()

    // Read CSV
    const csvPath = path.join(process.cwd(), 'songs-data', 'songs-data.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const result = Papa.parse<CsvRow>(csvContent, { header: true })

    // Build genre lookup by normalized title
    const genresByTitle = new Map<string, string[]>()
    for (const row of result.data) {
      if (row.Title && row['Style musical']) {
        const normalized = normalizeTitle(row.Title)
        const genres = row['Style musical'].split(',').map(g => g.trim()).filter(Boolean)
        if (genres.length > 0) {
          genresByTitle.set(normalized, genres)
        }
      }
    }

    // Fetch all genres from Payload
    const genresRes = await payload.find({
      collection: 'genres',
      limit: 500,
    })
    const genreMap = new Map<string, number>()
    for (const doc of genresRes.docs) {
      genreMap.set(doc.name as string, doc.id as number)
      // Also add lowercase version for matching
      genreMap.set((doc.name as string).toLowerCase(), doc.id as number)
    }

    // Fetch all songs
    const songsRes = await payload.find({
      collection: 'songs',
      limit: 500,
    })

    const results = {
      updated: [] as string[],
      skipped: [] as string[],
      errors: [] as { title: string; error: string }[],
    }

    // Update each song
    for (const song of songsRes.docs) {
      const normalizedTitle = normalizeTitle(song.title as string)
      const csvGenres = genresByTitle.get(normalizedTitle)

      if (!csvGenres || csvGenres.length === 0) {
        results.skipped.push(`${song.title} (no genres in CSV)`)
        continue
      }

      // Resolve genre IDs
      const genreIds: number[] = []
      for (const genreName of csvGenres) {
        // Try exact match, then lowercase
        const id = genreMap.get(genreName) || genreMap.get(genreName.toLowerCase())
        if (id) {
          genreIds.push(id)
        }
      }

      if (genreIds.length === 0) {
        results.skipped.push(`${song.title} (no matching genres found)`)
        continue
      }

      try {
        await payload.update({
          collection: 'songs',
          id: song.id as number,
          data: {
            genres: genreIds,
          },
        })
        results.updated.push(`${song.title} (${genreIds.length} genres)`)
      } catch (error: any) {
        results.errors.push({ title: song.title as string, error: error.message })
      }
    }

    return res.status(200).json({
      message: 'Genre update complete',
      summary: {
        updated: results.updated.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
      details: results,
    })
  } catch (error: any) {
    console.error('Error updating genres:', error)
    return res.status(500).json({
      error: 'Failed to update genres',
      details: error.message,
    })
  }
}
