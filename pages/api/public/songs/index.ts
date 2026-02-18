import type { NextApiRequest, NextApiResponse } from 'next'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import type { Song, SongMetadata, LyricsVersion, ScoreVersion, HistoryVersion, AudioTrackData } from '@/types/song'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

function buildCloudinaryUrl(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): string {
  if (!publicId) return ''
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${publicId}`
}

// Helper to extract name from relationship field (handles both populated and ID-only)
function extractName(field: { name?: string } | string | number | null | undefined): string {
  if (!field) return ''
  if (typeof field === 'object' && 'name' in field) {
    return field.name || ''
  }
  return ''
}

// Helper to extract code from language relationship
function extractCode(field: { code?: string } | string | number | null | undefined): string {
  if (!field) return ''
  if (typeof field === 'object' && 'code' in field) {
    return field.code || ''
  }
  return ''
}

// Transform Payload song document to Song interface
function transformSong(doc: Record<string, unknown>): Song {
  // Countries is a select field with hasMany: true, so it stores strings directly
  const countries = (doc.countries as string[] || []).filter(Boolean)

  const languages = (doc.languages as Array<{ name?: string } | string | number> || [])
    .map(extractName)
    .filter(Boolean)

  const genres = (doc.genres as Array<{ name?: string } | string | number> || [])
    .map(extractName)
    .filter(Boolean)

  const audiences = (doc.audiences as Array<{ name?: string } | string | number> || [])
    .map(extractName)
    .filter(Boolean)

  const themes = (doc.themes as Array<{ name?: string } | string | number> || [])
    .map(extractName)
    .filter(Boolean)

  const metadata: SongMetadata = {
    countries,
    languages,
    genres,
    audience: audiences,
    difficulty: extractName(doc.difficulty as { name?: string } | string | number | null | undefined) || '',
    themes,
  }

  // Transform lyrics array with nested translations
  const lyrics: LyricsVersion[] = ((doc.lyrics as Array<{
    language?: { name?: string; code?: string };
    text?: string;
    translations?: Array<{ language?: { name?: string; code?: string }; text?: string }>;
  }>) || []).map((lyric) => ({
    language: extractName(lyric.language),
    languageCode: extractCode(lyric.language),
    text: lyric.text || '',
    translations: (lyric.translations || []).map((trans) => ({
      language: extractName(trans.language),
      languageCode: extractCode(trans.language),
      text: trans.text || '',
    })),
  }))

  // Transform scores array
  const scores: ScoreVersion[] = ((doc.scores as Array<{ pdfPublicId?: string }>) || []).map((score) => ({
    pdf: buildCloudinaryUrl(score.pdfPublicId || '', 'raw'),
  }))

  // Transform history documents array
  const history: HistoryVersion[] = ((doc.historyDocuments as Array<{ language?: { name?: string; code?: string }; pdfPublicId?: string }>) || []).map((hist) => ({
    language: extractName(hist.language),
    languageCode: extractCode(hist.language),
    pdf: buildCloudinaryUrl(hist.pdfPublicId || '', 'raw'),
  }))

  // Helper to extract slug from track type relationship
  const extractSlug = (field: { slug?: string } | string | number | null | undefined): string => {
    if (!field) return ''
    if (typeof field === 'object' && 'slug' in field) {
      return field.slug || ''
    }
    return ''
  }

  // Transform audio tracks array
  const audioTracks: AudioTrackData[] = ((doc.audioTracks as Array<{ trackType?: { slug?: string; name?: string } | string | number; versions?: Array<{ versionId?: string; name?: string; audioPublicId?: string }> }>) || []).map((track) => ({
    track: extractSlug(track.trackType) || 'groupe',
    trackName: extractName(track.trackType) || 'Audio',
    versions: (track.versions || []).map((v) => ({
      id: v.versionId || '',
      name: v.name || '',
    })),
  }))

  return {
    id: String(doc.id),
    slug: (doc.slug as string) || '',
    title: (doc.title as string) || '',
    thumbnail: buildCloudinaryUrl((doc.thumbnailPublicId as string) || '', 'image'),
    metadata,
    lyrics,
    scores,
    history,
    audioTracks,
  }
}

// Build Payload where clause from query filters
function buildWhereClause(query: NextApiRequest['query']): Where | undefined {
  const conditions: Where[] = []

  // Filter by country name
  if (query.country) {
    conditions.push({ 'countries.name': { equals: query.country as string } })
  }

  // Filter by language name
  if (query.language) {
    conditions.push({ 'languages.name': { equals: query.language as string } })
  }

  // Filter by genre name
  if (query.genre) {
    conditions.push({ 'genres.name': { equals: query.genre as string } })
  }

  // Filter by audience name
  if (query.audience) {
    conditions.push({ 'audiences.name': { equals: query.audience as string } })
  }

  // Filter by theme name
  if (query.theme) {
    conditions.push({ 'themes.name': { equals: query.theme as string } })
  }

  // Filter by difficulty
  if (query.difficulty) {
    conditions.push({ 'difficulty.name': { equals: query.difficulty as string } })
  }

  if (conditions.length === 0) {
    return undefined
  }

  // Combine with AND
  if (conditions.length === 1) {
    return conditions[0]
  }

  return { and: conditions }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Song[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()

    const where = buildWhereClause(req.query)

    const result = await payload.find({
      collection: 'songs',
      where,
      depth: 2, // Populate relationships
      limit: 100,
    })

    const songs = result.docs.map((doc) => transformSong(doc as Record<string, unknown>))

    return res.status(200).json(songs)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return res.status(500).json({ error: 'Failed to fetch songs' })
  }
}
