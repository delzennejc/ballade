import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

interface CsvRow {
  Title: string
  'Thèmes': string
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

    // Build theme lookup by normalized title
    const themesByTitle = new Map<string, string[]>()
    for (const row of result.data) {
      if (row.Title && row['Thèmes']) {
        const normalized = normalizeTitle(row.Title)
        const themes = row['Thèmes'].split(',').map(t => t.trim()).filter(Boolean)
        if (themes.length > 0) {
          themesByTitle.set(normalized, themes)
        }
      }
    }

    // Fetch all themes from Payload
    const themesRes = await payload.find({
      collection: 'themes',
      limit: 500,
    })
    const themeMap = new Map<string, number>()
    for (const doc of themesRes.docs) {
      themeMap.set(doc.name as string, doc.id as number)
      // Also add lowercase version for matching
      themeMap.set((doc.name as string).toLowerCase(), doc.id as number)
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
      const csvThemes = themesByTitle.get(normalizedTitle)

      if (!csvThemes || csvThemes.length === 0) {
        results.skipped.push(`${song.title} (no themes in CSV)`)
        continue
      }

      // Resolve theme IDs
      const themeIds: number[] = []
      for (const themeName of csvThemes) {
        // Try exact match, then normalized (capitalized), then lowercase
        const normalized = themeName.charAt(0).toUpperCase() + themeName.slice(1).toLowerCase()
        const id = themeMap.get(themeName) || themeMap.get(normalized) || themeMap.get(themeName.toLowerCase())
        if (id) {
          themeIds.push(id)
        }
      }

      if (themeIds.length === 0) {
        results.skipped.push(`${song.title} (no matching themes found)`)
        continue
      }

      try {
        await payload.update({
          collection: 'songs',
          id: song.id as number,
          data: {
            themes: themeIds,
          },
        })
        results.updated.push(`${song.title} (${themeIds.length} themes)`)
      } catch (error: any) {
        results.errors.push({ title: song.title as string, error: error.message })
      }
    }

    return res.status(200).json({
      message: 'Theme update complete',
      summary: {
        updated: results.updated.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
      details: results,
    })
  } catch (error: any) {
    console.error('Error updating themes:', error)
    return res.status(500).json({
      error: 'Failed to update themes',
      details: error.message,
    })
  }
}
