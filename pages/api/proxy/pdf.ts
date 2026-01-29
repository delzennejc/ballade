import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing URL parameter' })
  }

  // Only allow Cloudinary URLs
  if (!url.includes('cloudinary.com')) {
    return res.status(403).json({ error: 'Only Cloudinary URLs are allowed' })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch PDF' })
    }

    const buffer = await response.arrayBuffer()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error('PDF proxy error:', error)
    res.status(500).json({ error: 'Failed to proxy PDF' })
  }
}
