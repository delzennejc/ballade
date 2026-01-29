import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { songId, languageId, text } = req.body

  if (!songId || !languageId || !text) {
    return res.status(400).json({ error: 'Missing songId, languageId, or text' })
  }

  try {
    const payload = await getPayloadClient()

    // Fetch current song
    const song = await payload.findByID({
      collection: 'songs',
      id: songId,
    })

    if (!song) {
      return res.status(404).json({ error: 'Song not found' })
    }

    // Get current lyrics array
    const currentLyrics = (song.lyrics as any[]) || []

    // Check if lyrics for this language already exist
    const existingIndex = currentLyrics.findIndex(
      (l: any) => l.language === parseInt(languageId) || l.language?.id === parseInt(languageId)
    )

    let updatedLyrics
    if (existingIndex >= 0) {
      // Update existing lyrics
      updatedLyrics = [...currentLyrics]
      updatedLyrics[existingIndex] = {
        ...updatedLyrics[existingIndex],
        text,
      }
    } else {
      // Add new lyrics
      updatedLyrics = [
        ...currentLyrics,
        {
          language: parseInt(languageId),
          text,
        },
      ]
    }

    // Update the song
    const updated = await payload.update({
      collection: 'songs',
      id: songId,
      data: {
        lyrics: updatedLyrics,
      },
    })

    return res.status(200).json({
      message: 'Lyrics added successfully',
      song: {
        id: updated.id,
        title: updated.title,
        lyricsCount: (updated.lyrics as any[])?.length || 0,
      },
    })
  } catch (error: any) {
    console.error('Error adding lyrics:', error)
    return res.status(500).json({
      error: 'Failed to add lyrics',
      details: error.message,
    })
  }
}
