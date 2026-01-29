import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required' })
  }

  try {
    const payload = await getPayloadClient()

    // Find song by slug
    const existing = await payload.find({
      collection: 'songs',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      return res.status(404).json({ error: 'Song not found' })
    }

    const songId = existing.docs[0].id

    // Delete the song
    await payload.delete({
      collection: 'songs',
      id: songId,
    })

    return res.status(200).json({ message: `Song '${slug}' deleted successfully` })
  } catch (error: any) {
    console.error('Error deleting song:', error)
    return res.status(500).json({
      error: 'Failed to delete song',
      details: error.message
    })
  }
}
