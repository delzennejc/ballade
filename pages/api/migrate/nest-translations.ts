import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()

    // Fetch all songs with depth to get relationship data
    const { docs: songs } = await payload.find({
      collection: 'songs',
      limit: 1000,
      depth: 2,
    })

    const results: Array<{
      id: number | string
      title: string
      status: string
      reason?: string
      translationsMoved?: number
    }> = []

    for (const song of songs) {
      const lyrics = (song.lyrics as any[]) || []
      const translations = (song.translations as any[]) || []

      // Skip if no lyrics or no translations to migrate
      if (lyrics.length === 0) {
        results.push({
          id: song.id,
          title: song.title as string,
          status: 'skipped',
          reason: 'no lyrics',
        })
        continue
      }

      if (translations.length === 0) {
        results.push({
          id: song.id,
          title: song.title as string,
          status: 'skipped',
          reason: 'no translations to migrate',
        })
        continue
      }

      // Check if first lyric already has nested translations
      if (lyrics[0]?.translations && lyrics[0].translations.length > 0) {
        results.push({
          id: song.id,
          title: song.title as string,
          status: 'skipped',
          reason: 'already migrated (first lyric has translations)',
        })
        continue
      }

      // Migrate: assign all translations to the first lyric
      const updatedLyrics = lyrics.map((lyric, index) => {
        if (index === 0) {
          // Move all translations to the first lyric
          return {
            language: typeof lyric.language === 'object' ? lyric.language.id : lyric.language,
            text: lyric.text,
            translations: translations.map((t: any) => ({
              language: typeof t.language === 'object' ? t.language.id : t.language,
              text: t.text,
            })),
          }
        }
        // Other lyrics get empty translations array
        return {
          language: typeof lyric.language === 'object' ? lyric.language.id : lyric.language,
          text: lyric.text,
          translations: [],
        }
      })

      // Update the song
      await payload.update({
        collection: 'songs',
        id: song.id as number,
        data: {
          lyrics: updatedLyrics,
        },
      })

      results.push({
        id: song.id,
        title: song.title as string,
        status: 'migrated',
        translationsMoved: translations.length,
      })
    }

    const migrated = results.filter((r) => r.status === 'migrated').length
    const skipped = results.filter((r) => r.status === 'skipped').length

    return res.status(200).json({
      message: 'Migration complete',
      summary: {
        total: songs.length,
        migrated,
        skipped,
      },
      results,
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return res.status(500).json({
      error: 'Migration failed',
      details: error.message,
    })
  }
}
