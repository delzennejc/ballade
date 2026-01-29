import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

// Cloudinary base URL
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME

function buildCloudinaryAudioUrl(publicId: string): string {
  if (!publicId) return ''
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`
}

// Valid track types
const VALID_TRACK_TYPES = ['groupe', 'violon', 'chant', 'guitare', 'percussion']

type AudioUrlResponse = { url: string }
type ErrorResponse = { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AudioUrlResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, trackType, versionId } = req.query

  // Validate parameters
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug parameter is required' })
  }

  if (!trackType || typeof trackType !== 'string') {
    return res.status(400).json({ error: 'Track type parameter is required' })
  }

  if (!versionId || typeof versionId !== 'string') {
    return res.status(400).json({ error: 'Version ID parameter is required' })
  }

  // Validate track type
  if (!VALID_TRACK_TYPES.includes(trackType)) {
    return res.status(404).json({ error: `Track type '${trackType}' not found. Valid types: ${VALID_TRACK_TYPES.join(', ')}` })
  }

  try {
    const payload = await getPayloadClient()

    // Find the song by slug
    const result = await payload.find({
      collection: 'songs',
      where: {
        slug: { equals: slug },
      },
      depth: 0, // No need to populate relationships for this query
      limit: 1,
    })

    if (result.docs.length === 0) {
      return res.status(404).json({ error: 'Song not found' })
    }

    const song = result.docs[0] as Record<string, unknown>
    const audioTracks = song.audioTracks as Array<{
      trackType?: string
      versions?: Array<{
        versionId?: string
        name?: string
        audioPublicId?: string
      }>
    }> | undefined

    if (!audioTracks || audioTracks.length === 0) {
      return res.status(404).json({ error: 'No audio tracks found for this song' })
    }

    // Find the track with matching type
    const track = audioTracks.find(t => t.trackType === trackType)

    if (!track) {
      return res.status(404).json({ error: `Track type '${trackType}' not found for this song` })
    }

    if (!track.versions || track.versions.length === 0) {
      return res.status(404).json({ error: `No versions found for track type '${trackType}'` })
    }

    // Find the version with matching ID
    const version = track.versions.find(v => v.versionId === versionId)

    if (!version) {
      return res.status(404).json({ error: `Version '${versionId}' not found for track type '${trackType}'` })
    }

    if (!version.audioPublicId) {
      return res.status(404).json({ error: 'Audio file not found for this version' })
    }

    // Build and return the Cloudinary URL
    const url = buildCloudinaryAudioUrl(version.audioPublicId)

    return res.status(200).json({ url })
  } catch (error) {
    console.error('Error fetching audio URL:', error)
    return res.status(500).json({ error: 'Failed to fetch audio URL' })
  }
}
