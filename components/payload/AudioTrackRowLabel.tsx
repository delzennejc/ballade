'use client'

import { useRowLabel } from '@payloadcms/ui'

type TrackRowData = {
  trackType?: string
}

type VersionRowData = {
  name?: string
  versionId?: string
}

const trackTypeLabels: Record<string, string> = {
  groupe: 'Groupe',
  violon: 'Violon',
  chant: 'Chant',
  guitare: 'Guitare',
  percussion: 'Percussion',
}

export const AudioTrackRowLabel = () => {
  const { data } = useRowLabel<TrackRowData>()
  const label = data?.trackType ? trackTypeLabels[data.trackType] || data.trackType : 'Audio Track'
  return <span>{label}</span>
}

export const AudioVersionRowLabel = () => {
  const { data } = useRowLabel<VersionRowData>()
  const label = data?.name || data?.versionId || 'Version'
  return <span>{label}</span>
}
