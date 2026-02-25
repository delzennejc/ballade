import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { isTemplateThumbnail } from '@/data/template-thumbnails'

interface DeleteResult {
  objectKey: string
  success: boolean
  error?: string
}

function getS3Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  })
}

const R2_BUCKET = process.env.R2_BUCKET_NAME || 'ballade'

export async function deleteFromR2(objectKey: string): Promise<DeleteResult> {
  if (!objectKey) {
    return { objectKey, success: false, error: 'No object key provided' }
  }

  try {
    const client = getS3Client()
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
      })
    )
    console.log(`Deleted from R2: ${objectKey}`)
    return { objectKey, success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to delete from R2: ${objectKey}`, error)
    return { objectKey, success: false, error: message }
  }
}

// Extract all R2 object keys from a song document
interface SongData {
  thumbnailPublicId?: string
  scores?: Array<{ pdfPublicId?: string }>
  historyDocuments?: Array<{ pdfPublicId?: string }>
  audioTracks?: Array<{
    versions?: Array<{ audioPublicId?: string }>
  }>
}

interface R2Asset {
  objectKey: string
}

export function extractAssets(data: SongData): R2Asset[] {
  const assets: R2Asset[] = []

  // Thumbnail - skip if it's a template (templates should never be deleted)
  if (data.thumbnailPublicId && !isTemplateThumbnail(data.thumbnailPublicId)) {
    assets.push({ objectKey: data.thumbnailPublicId })
  }

  // Scores (PDFs)
  if (data.scores) {
    for (const score of data.scores) {
      if (score.pdfPublicId) {
        assets.push({ objectKey: score.pdfPublicId })
      }
    }
  }

  // History documents (PDFs)
  if (data.historyDocuments) {
    for (const doc of data.historyDocuments) {
      if (doc.pdfPublicId) {
        assets.push({ objectKey: doc.pdfPublicId })
      }
    }
  }

  // Audio tracks
  if (data.audioTracks) {
    for (const track of data.audioTracks) {
      if (track.versions) {
        for (const version of track.versions) {
          if (version.audioPublicId) {
            assets.push({ objectKey: version.audioPublicId })
          }
        }
      }
    }
  }

  return assets
}

// Find assets that were removed (exist in old but not in new)
export function findRemovedAssets(
  oldData: SongData | null,
  newData: SongData
): R2Asset[] {
  if (!oldData) return []

  const oldAssets = extractAssets(oldData)
  const newAssets = extractAssets(newData)
  const newKeys = new Set(newAssets.map((a) => a.objectKey))

  return oldAssets.filter((asset) => !newKeys.has(asset.objectKey))
}

// Delete multiple assets from R2
export async function deleteRemovedAssets(
  removedAssets: R2Asset[]
): Promise<DeleteResult[]> {
  const results = await Promise.all(
    removedAssets.map((asset) => deleteFromR2(asset.objectKey))
  )
  return results
}
