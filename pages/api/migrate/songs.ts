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

    const doc = await payload.create({
      collection: 'songs',
      data: req.body,
    })

    return res.status(201).json({ doc, message: 'Song created successfully' })
  } catch (error: any) {
    console.error('Error creating song:', error)
    return res.status(500).json({
      error: 'Failed to create song',
      details: error.message
    })
  }
}
