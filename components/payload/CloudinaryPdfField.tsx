'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useState, useCallback } from 'react'

type CloudinaryPdfFieldProps = {
  path: string
  field: {
    name: string
    label?: string
    required?: boolean
    admin?: {
      description?: string
      custom?: {
        folderType?: 'sheets' | 'history'
      }
    }
  }
}

export const CloudinaryPdfField = ({ path, field }: CloudinaryPdfFieldProps) => {
  const { value, setValue } = useField<string>({ path })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the slug field value to build the folder path
  const slugField = useFormFields(([fields]) => fields.slug)
  const slug = slugField?.value as string | undefined

  // Get folder type from field config
  const folderType = field.admin?.custom?.folderType || 'sheets'

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Build folder path: /songs/{slug}/sheets/ or /songs/{slug}/history/
      const folder = slug ? `songs/${slug}/${folderType}` : `songs/${folderType}`

      // Get upload signature from API
      const signResponse = await fetch('/api/cloudinary/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, resourceType: 'raw' }),
      })

      if (!signResponse.ok) {
        throw new Error('Failed to get upload signature')
      }

      const { signature, timestamp, cloudName, apiKey, folder: signedFolder } = await signResponse.json()

      // Upload to Cloudinary as raw file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp.toString())
      formData.append('api_key', apiKey)
      formData.append('folder', signedFolder)
      formData.append('resource_type', 'raw')

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload PDF')
      }

      const uploadData = await uploadResponse.json()
      setValue(uploadData.public_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [slug, folderType, setValue])

  const handleClear = useCallback(() => {
    setValue('')
    setError(null)
  }, [setValue])

  // Build the Cloudinary URL for the PDF link
  const getPdfUrl = (publicId: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) return null
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`
  }

  // Extract filename from public_id
  const getFilename = (publicId: string) => {
    const parts = publicId.split('/')
    return parts[parts.length - 1]
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <a
              href={getPdfUrl(value) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--theme-text)', textDecoration: 'underline' }}
            >
              {getFilename(value)}
            </a>
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
            accept=".pdf,application/pdf"
            onChange={handleUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
          {isUploading ? 'Uploading...' : value ? 'Change PDF' : 'Upload PDF'}
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

export default CloudinaryPdfField
