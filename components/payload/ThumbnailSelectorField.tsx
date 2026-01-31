'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useState, useCallback } from 'react'
import { TEMPLATE_THUMBNAILS, isTemplateThumbnail } from '@/data/template-thumbnails'

type ThumbnailSelectorFieldProps = {
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

export const ThumbnailSelectorField = ({ path, field }: ThumbnailSelectorFieldProps) => {
  const { value, setValue } = useField<string>({ path })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const slugField = useFormFields(([fields]) => fields.slug)
  const slug = slugField?.value as string | undefined

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const getImageUrl = (publicId: string, size: number = 100) => {
    if (!cloudName || !publicId) return null
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},h_${size},c_fill/${publicId}`
  }

  const getPreviewUrl = (publicId: string) => {
    if (!cloudName || !publicId) return null
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${publicId}`
  }

  const handleTemplateSelect = useCallback(
    (publicId: string) => {
      setValue(publicId)
      setError(null)
      setIsModalOpen(false)
    },
    [setValue]
  )

  const handleCustomUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        const folder = slug ? `songs/${slug}/thumbnails` : 'songs/thumbnails'

        const signResponse = await fetch('/api/cloudinary/sign-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder }),
        })

        if (!signResponse.ok) {
          throw new Error('Failed to get upload signature')
        }

        const {
          signature,
          timestamp,
          cloudName: cn,
          apiKey,
          folder: signedFolder,
        } = await signResponse.json()

        const formData = new FormData()
        formData.append('file', file)
        formData.append('signature', signature)
        formData.append('timestamp', timestamp.toString())
        formData.append('api_key', apiKey)
        formData.append('folder', signedFolder)

        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cn}/image/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        setValue(uploadData.public_id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setIsUploading(false)
      }
    },
    [slug, setValue]
  )

  const handleClear = useCallback(() => {
    setValue('')
    setError(null)
  }, [setValue])

  const selectedTemplate = value ? TEMPLATE_THUMBNAILS.find((t) => t.publicId === value) : null

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label
        className="field-label"
        style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
      >
        {field.label || field.name}
        {field.required && <span style={{ color: 'var(--theme-error-500)' }}> *</span>}
      </label>

      {field.admin?.description && (
        <p
          style={{
            marginBottom: '0.75rem',
            fontSize: '0.875rem',
            color: 'var(--theme-elevation-500)',
          }}
        >
          {field.admin.description}
        </p>
      )}

      {/* Current selection preview */}
      {value && (
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'inline-block',
              border: '2px solid var(--theme-elevation-150)',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={() => setIsModalOpen(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPreviewUrl(value) || ''}
              alt={selectedTemplate?.label || 'Custom thumbnail'}
              style={{ display: 'block', width: '120px', height: '120px', objectFit: 'cover' }}
            />
          </div>
          {selectedTemplate && (
            <p
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--theme-elevation-600)',
              }}
            >
              {selectedTemplate.label}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--theme-elevation-100)',
            border: '1px solid var(--theme-elevation-250)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          {value && isTemplateThumbnail(value) ? 'Change Template' : 'Select Template'}
        </button>

        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
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
            onChange={handleCustomUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
          {isUploading ? 'Uploading...' : 'Upload Custom'}
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
            Clear
          </button>
        )}
      </div>

      {error && (
        <p style={{ marginTop: '0.5rem', color: 'var(--theme-error-500)', fontSize: '0.875rem' }}>
          {error}
        </p>
      )}

      {/* Template Selection Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--theme-elevation-0)',
              borderRadius: '8px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                Select a Template
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--theme-elevation-500)',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
              }}
            >
              {TEMPLATE_THUMBNAILS.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.publicId)}
                  style={{
                    position: 'relative',
                    border:
                      value === template.publicId
                        ? '3px solid var(--theme-success-500)'
                        : '2px solid var(--theme-elevation-150)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(template.publicId, 120) || ''}
                    alt={template.label}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {value === template.publicId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'var(--theme-success-500)',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '11px',
                      }}
                    >
                      ✓
                    </div>
                  )}
                  <div
                    style={{
                      padding: '0.35rem',
                      fontSize: '0.65rem',
                      textAlign: 'center',
                      background: 'var(--theme-elevation-50)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {template.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThumbnailSelectorField
