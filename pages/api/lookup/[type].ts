import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

// Valid lookup types mapped to collection slugs
const VALID_LOOKUP_TYPES = ['countries', 'languages', 'genres', 'audiences', 'themes', 'track-types'] as const
type LookupType = (typeof VALID_LOOKUP_TYPES)[number]

// Response types
interface LookupItem {
  id: string
  name: string
  nameEn?: string
}

interface LanguageLookupItem extends LookupItem {
  code: string
}

interface TrackTypeLookupItem extends LookupItem {
  slug: string
}

type LookupResponse = LookupItem[] | LanguageLookupItem[] | TrackTypeLookupItem[]

function isValidLookupType(type: string): type is LookupType {
  return VALID_LOOKUP_TYPES.includes(type as LookupType)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LookupResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type } = req.query

  // Validate type parameter
  if (!type || typeof type !== 'string' || !isValidLookupType(type)) {
    return res.status(400).json({
      error: `Invalid lookup type. Valid types are: ${VALID_LOOKUP_TYPES.join(', ')}`,
    })
  }

  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: type,
      sort: 'name', // Sort alphabetically by name
      limit: 1000, // Get all entries
      depth: 0, // No relationships to populate
    })

    // Transform documents to response format
    const items = result.docs.map((doc) => {
      const item: LookupItem = {
        id: String(doc.id),
        name: (doc.name as string) || '',
        nameEn: (doc.nameEn as string) || undefined,
      }

      // Add code field for languages
      if (type === 'languages') {
        return {
          ...item,
          code: (doc.code as string) || '',
        } as LanguageLookupItem
      }

      // Add slug field for track types
      if (type === 'track-types') {
        return {
          ...item,
          slug: (doc.slug as string) || '',
        } as TrackTypeLookupItem
      }

      return item
    })

    return res.status(200).json(items)
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
    return res.status(500).json({ error: `Failed to fetch ${type}` })
  }
}
