import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

// Valid lookup types — collection-based lookups + special cases
const COLLECTION_LOOKUP_TYPES = ['languages', 'genres', 'audiences', 'themes', 'track-types', 'difficulty-levels'] as const
const VALID_LOOKUP_TYPES = ['countries', ...COLLECTION_LOOKUP_TYPES] as const
type LookupType = (typeof VALID_LOOKUP_TYPES)[number]
type CollectionLookupType = (typeof COLLECTION_LOOKUP_TYPES)[number]

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
    // Countries is a special case — it's a select field on Songs, not a collection
    if (type === 'countries') {
      const { getAllCountries } = await import('@/data/geography')
      const countries = getAllCountries().map((name) => ({
        id: name,
        name,
      }))
      return res.status(200).json(countries)
    }

    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: type as CollectionLookupType,
      sort: 'name', // Sort alphabetically by name
      limit: 1000, // Get all entries
      depth: 0, // No relationships to populate
    })

    // Transform documents to response format
    const items = result.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const item: LookupItem = {
        id: String(d.id),
        name: (d.name as string) || '',
        nameEn: (d.nameEn as string) || undefined,
      }

      // Add code field for languages
      if (type === 'languages') {
        return {
          ...item,
          code: (d.code as string) || '',
        } as LanguageLookupItem
      }

      // Add slug field for track types
      if (type === 'track-types') {
        return {
          ...item,
          slug: (d.slug as string) || '',
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
