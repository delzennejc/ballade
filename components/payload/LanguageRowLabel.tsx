'use client'

import { useRowLabel } from '@payloadcms/ui'

type RowData = {
  language?: {
    name?: string
  } | string
}

export const LyricsRowLabel = () => {
  const { data } = useRowLabel<RowData>()
  const languageName = typeof data?.language === 'object' ? data?.language?.name : data?.language
  return <span>{languageName || 'Lyric'}</span>
}

export const TranslationsRowLabel = () => {
  const { data } = useRowLabel<RowData>()
  const languageName = typeof data?.language === 'object' ? data?.language?.name : data?.language
  return <span>{languageName || 'Translation'}</span>
}

export const MusicSheetsRowLabel = () => {
  const { data } = useRowLabel<RowData>()
  const languageName = typeof data?.language === 'object' ? data?.language?.name : data?.language
  return <span>{languageName || 'Music Sheet'}</span>
}

export const HistoryDocumentsRowLabel = () => {
  const { data } = useRowLabel<RowData>()
  const languageName = typeof data?.language === 'object' ? data?.language?.name : data?.language
  return <span>{languageName || 'History Document'}</span>
}
