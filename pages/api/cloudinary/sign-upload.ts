import type { NextApiRequest, NextApiResponse } from 'next'
import cloudinary from '@/lib/cloudinary'

type SignatureResponse = {
  signature: string
  timestamp: number
  cloudName: string
  apiKey: string
  folder: string
  resourceType: 'image' | 'video' | 'raw'
}

type ErrorResponse = {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { folder, resourceType = 'image' } = req.body

  if (!folder || typeof folder !== 'string') {
    return res.status(400).json({ error: 'Folder path is required' })
  }

  // Validate resource type
  const validResourceTypes = ['image', 'video', 'raw']
  if (!validResourceTypes.includes(resourceType)) {
    return res.status(400).json({ error: 'Invalid resource type' })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET || ''
  )

  res.status(200).json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    folder,
    resourceType,
  })
}
