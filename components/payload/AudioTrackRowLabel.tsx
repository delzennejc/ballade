'use client'

import { useRowLabel } from '@payloadcms/ui'

type TrackType = {
  name?: string
  slug?: string
} | number | null

type TrackRowData = {
  trackType?: TrackType
}

type VersionRowData = {
  name?: string
  versionId?: string
}

export const AudioTrackRowLabel = () => {
  const { data } = useRowLabel<TrackRowData>()
  let label = 'Audio Track'
  if (data?.trackType && typeof data.trackType === 'object' && data.trackType.name) {
    label = data.trackType.name
  }
  return <span>{label}</span>
}

export const AudioVersionRowLabel = () => {
  const { data } = useRowLabel<VersionRowData>()
  const label = data?.name || data?.versionId || 'Version'
  return <span>{label}</span>
}
