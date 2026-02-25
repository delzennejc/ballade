'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useState, useCallback } from 'react'

type R2ImageFieldProps = {
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

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export const R2ImageField = ({ path, field }: R2ImageFieldProps) => {
  const { value, setValue } = useField<string>({ path })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the slug field value to build the folder path
  const slugField = useFormFields(([fields]) => fields.slug)
  const slug = slugField?.value as string | undefined

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Build object key: songs/{slug}/thumbnails/{filename}
      const folder = slug ? `songs/${slug}/thumbnails` : 'songs/thumbnails'
      const ext = file.name.split('.').pop() || 'jpg'
      const key = `${folder}/${Date.now()}.${ext}`

      // Get presigned URL from API
      const presignResponse = await fetch('/api/r2/presign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, contentType: file.type }),
      })

      if (!presignResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl, objectKey } = await presignResponse.json()

      // Upload directly to R2 via presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      setValue(objectKey)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [slug, setValue])

  const handleClear = useCallback(() => {
    setValue('')
    setError(null)
  }, [setValue])

  // Build the R2 URL for preview
  const getImageUrl = (objectKey: string) => {
    if (!R2_PUBLIC_URL || !objectKey) return null
    return `${R2_PUBLIC_URL}/${objectKey}`
  }

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {field.label || field.name}
        {field.required && <span className="required" style={{ color: 'var(--theme-error-500)' }}> *</span>}
      </label>

      {field.admin?.description && (
        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--theme-elevation-500)' }}>
          {field.admin.description}
        </p>
      )}

      {value && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(value) || ''}
              alt="Thumbnail preview"
              style={{ display: 'block', maxWidth: '300px', height: 'auto' }}
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
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
          {isUploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}
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

export default R2ImageField
