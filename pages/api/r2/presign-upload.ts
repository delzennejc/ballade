import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

type PresignResponse = {
  uploadUrl: string
  objectKey: string
  publicUrl: string
}

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PresignResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { key, contentType } = req.body

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Object key is required' })
  }

  if (!contentType || typeof contentType !== 'string') {
    return res.status(400).json({ error: 'Content type is required' })
  }

  try {
    const client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    })

    const bucketName = process.env.R2_BUCKET_NAME || 'ballade'

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 })

    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''
    const publicUrl = `${r2PublicUrl}/${key}`

    res.status(200).json({
      uploadUrl,
      objectKey: key,
      publicUrl,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    res.status(500).json({ error: 'Failed to generate upload URL' })
  }
}
