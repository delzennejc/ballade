import cloudinary from './cloudinary'
import { isTemplateThumbnail } from '@/data/template-thumbnails'

type ResourceType = 'image' | 'video' | 'raw'

interface DeleteResult {
  publicId: string
  success: boolean
  error?: string
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: ResourceType
): Promise<DeleteResult> {
  if (!publicId) {
    return { publicId, success: false, error: 'No public ID provided' }
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    console.log(`Deleted from Cloudinary: ${publicId} (${resourceType})`)
    return { publicId, success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to delete from Cloudinary: ${publicId}`, error)
    return { publicId, success: false, error: message }
  }
}

// Extract all Cloudinary public IDs from a song document
interface SongData {
  thumbnailPublicId?: string
  scores?: Array<{ pdfPublicId?: string }>
  historyDocuments?: Array<{ pdfPublicId?: string }>
  audioTracks?: Array<{
    versions?: Array<{ audioPublicId?: string }>
  }>
}

interface CloudinaryAsset {
  publicId: string
  resourceType: ResourceType
}

export function extractCloudinaryAssets(data: SongData): CloudinaryAsset[] {
  const assets: CloudinaryAsset[] = []

  // Thumbnail (image) - skip if it's a template (templates should never be deleted)
  if (data.thumbnailPublicId && !isTemplateThumbnail(data.thumbnailPublicId)) {
    assets.push({ publicId: data.thumbnailPublicId, resourceType: 'image' })
  }

  // Scores (raw/PDF)
  if (data.scores) {
    for (const score of data.scores) {
      if (score.pdfPublicId) {
        assets.push({ publicId: score.pdfPublicId, resourceType: 'raw' })
      }
    }
  }

  // History documents (raw/PDF)
  if (data.historyDocuments) {
    for (const doc of data.historyDocuments) {
      if (doc.pdfPublicId) {
        assets.push({ publicId: doc.pdfPublicId, resourceType: 'raw' })
      }
    }
  }

  // Audio tracks (video - Cloudinary uses 'video' for audio)
  if (data.audioTracks) {
    for (const track of data.audioTracks) {
      if (track.versions) {
        for (const version of track.versions) {
          if (version.audioPublicId) {
            assets.push({ publicId: version.audioPublicId, resourceType: 'video' })
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
): CloudinaryAsset[] {
  if (!oldData) return []

  const oldAssets = extractCloudinaryAssets(oldData)
  const newAssets = extractCloudinaryAssets(newData)
  const newPublicIds = new Set(newAssets.map((a) => a.publicId))

  return oldAssets.filter((asset) => !newPublicIds.has(asset.publicId))
}

// Delete multiple assets from Cloudinary
export async function deleteRemovedAssets(
  removedAssets: CloudinaryAsset[]
): Promise<DeleteResult[]> {
  const results = await Promise.all(
    removedAssets.map((asset) =>
      deleteFromCloudinary(asset.publicId, asset.resourceType)
    )
  )
  return results
}
