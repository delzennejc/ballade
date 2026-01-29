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

    // Get current translations array
    const currentTranslations = (song.translations as any[]) || []

    // Check if translation for this language already exists
    const existingIndex = currentTranslations.findIndex(
      (t: any) => t.language === parseInt(languageId) || t.language?.id === parseInt(languageId)
    )

    let updatedTranslations
    if (existingIndex >= 0) {
      // Update existing translation
      updatedTranslations = [...currentTranslations]
      updatedTranslations[existingIndex] = {
        ...updatedTranslations[existingIndex],
        text,
      }
    } else {
      // Add new translation
      updatedTranslations = [
        ...currentTranslations,
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
        translations: updatedTranslations,
      },
    })

    return res.status(200).json({
      message: 'Translation added successfully',
      song: {
        id: updated.id,
        title: updated.title,
        translationsCount: (updated.translations as any[])?.length || 0,
      },
    })
  } catch (error: any) {
    console.error('Error adding translation:', error)
    return res.status(500).json({
      error: 'Failed to add translation',
      details: error.message,
    })
  }
}
