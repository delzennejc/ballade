'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useState, useCallback, useRef, useEffect } from 'react'

type CloudinaryAudioFieldProps = {
  path: string
  field: {
    name: string
    label?: string
    required?: boolean
    admin?: {
      description?: string
    }
  }
}

export const CloudinaryAudioField = ({ path }: CloudinaryAudioFieldProps) => {
  const { value, setValue } = useField<string>({ path })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get the slug field value to build the folder path
  const slugField = useFormFields(([fields]) => fields.slug)
  const slug = slugField?.value as string | undefined

  // Get the trackType from the parent array context
  // Path format: audioTracks.0.versions.0.audioPublicId
  // We need to get audioTracks.0.trackType
  const pathParts = path.split('.')
  const audioTracksIndex = pathParts[1] // e.g., "0"
  const trackTypeField = useFormFields(([fields]) => {
    const key = `audioTracks.${audioTracksIndex}.trackType`
    return fields[key]
  })
  const trackType = (trackTypeField?.value as string) || 'audio'

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (audio files)
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file (MP3, WAV, etc.)')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Build folder path: /songs/{slug}/audio/{track-type}/
      const folder = slug ? `songs/${slug}/audio/${trackType}` : `songs/audio/${trackType}`

      // Get upload signature from API
      const signResponse = await fetch('/api/cloudinary/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, resourceType: 'video' }), // Cloudinary uses 'video' for audio
      })

      if (!signResponse.ok) {
        throw new Error('Failed to get upload signature')
      }

      const { signature, timestamp, cloudName, apiKey, folder: signedFolder } = await signResponse.json()

      // Upload to Cloudinary as video (which includes audio)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp.toString())
      formData.append('api_key', apiKey)
      formData.append('folder', signedFolder)
      formData.append('resource_type', 'video')

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload audio file')
      }

      const uploadData = await uploadResponse.json()
      setValue(uploadData.public_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [slug, trackType, setValue])

  const handleClear = useCallback(() => {
    setValue('')
    setError(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [setValue])

  // Build the Cloudinary URL for audio streaming
  const getAudioUrl = (publicId: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) return null
    return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`
  }

  // Extract filename from public_id
  const getFilename = (publicId: string) => {
    const parts = publicId.split('/')
    return parts[parts.length - 1]
  }

  // Stop playback when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        Audio File
        <span className="required" style={{ color: 'var(--theme-error-500)' }}> *</span>
      </label>

      <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--theme-elevation-500)' }}>
        Upload an audio file (MP3, WAV, etc.)
      </p>

      {value && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span style={{ fontWeight: 500 }}>{getFilename(value)}</span>
            </div>
            {/* Audio player preview */}
            <audio
              ref={audioRef}
              controls
              src={getAudioUrl(value) || ''}
              style={{ width: '100%', height: '40px' }}
            />
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--theme-elevation-500)', fontFamily: 'monospace' }}>
            {value}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--theme-elevation-100)',
            border: '1px solid var(--theme-elevation-250)',
            borderRadius: '4px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            opacity: isUploading ? 0.6 : 1,
          }}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
          {isUploading ? 'Uploading...' : value ? 'Change Audio' : 'Upload Audio'}
        </label>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--theme-error-500)',
              borderRadius: '4px',
              color: 'var(--theme-error-500)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p style={{ marginTop: '0.5rem', color: 'var(--theme-error-500)', fontSize: '0.875rem' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default CloudinaryAudioField
