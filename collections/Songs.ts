import type { CollectionConfig } from 'payload'
import { findRemovedAssets, deleteRemovedAssets, extractCloudinaryAssets } from '../lib/cloudinary-cleanup'
import { getAllCountries } from '../data/geography'

export const Songs: CollectionConfig = {
  slug: 'songs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'difficulty'],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generate slug from title on create if slug not provided
        if (operation === 'create' && data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        // Clean up removed Cloudinary assets on update
        if (operation === 'update' && previousDoc) {
          const removedAssets = findRemovedAssets(previousDoc, doc)
          if (removedAssets.length > 0) {
            console.log(`Cleaning up ${removedAssets.length} removed Cloudinary asset(s)`)
            await deleteRemovedAssets(removedAssets)
          }
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Clean up all Cloudinary assets when song is deleted
        const allAssets = extractCloudinaryAssets(doc)
        if (allAssets.length > 0) {
          console.log(`Cleaning up ${allAssets.length} Cloudinary asset(s) from deleted song`)
          await deleteRemovedAssets(allAssets)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title on create, but editable after',
      },
    },
    {
      name: 'thumbnailPublicId',
      type: 'text',
      admin: {
        description: 'Upload thumbnail image to Cloudinary',
        components: {
          Field: '@/components/payload/CloudinaryImageField#CloudinaryImageField',
        },
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Facile', value: 'Facile' },
        { label: 'Intermédiaire', value: 'Intermédiaire' },
        { label: 'Difficile', value: 'Difficile' },
      ],
    },
    // Many-to-many relationships to lookup collections
    {
      name: 'countries',
      type: 'select',
      hasMany: true,
      options: getAllCountries().map((country) => ({
        label: country,
        value: country,
      })),
    },
    {
      name: 'languages',
      type: 'relationship',
      relationTo: 'languages',
      hasMany: true,
    },
    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
    },
    {
      name: 'audiences',
      type: 'relationship',
      relationTo: 'audiences',
      hasMany: true,
    },
    {
      name: 'themes',
      type: 'relationship',
      relationTo: 'themes',
      hasMany: true,
    },
    // Lyrics array - multiple lyrics in different languages, each with their own translations
    {
      name: 'lyrics',
      type: 'array',
      labels: {
        singular: 'Lyric',
        plural: 'Lyrics',
      },
      admin: {
        description: 'Add lyrics in different languages. Each lyric can have its own translations.',
        components: {
          RowLabel: '@/components/payload/LanguageRowLabel#LyricsRowLabel',
        },
      },
      fields: [
        {
          name: 'language',
          type: 'relationship',
          relationTo: 'languages',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The lyrics text in this language',
          },
        },
        {
          name: 'translations',
          type: 'array',
          labels: {
            singular: 'Translation',
            plural: 'Translations',
          },
          admin: {
            description: 'Translations specific to this lyric version',
            components: {
              RowLabel: '@/components/payload/LanguageRowLabel#LyricTranslationsRowLabel',
            },
          },
          fields: [
            {
              name: 'language',
              type: 'relationship',
              relationTo: 'languages',
              required: true,
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
              admin: {
                description: 'The translation text',
              },
            },
          ],
        },
      ],
    },
    // Music sheets array - PDF documents per language
    {
      name: 'musicSheets',
      type: 'array',
      labels: {
        singular: 'Music Sheet',
        plural: 'Music Sheets',
      },
      admin: {
        description: 'Add music sheet PDFs in different languages',
        components: {
          RowLabel: '@/components/payload/LanguageRowLabel#MusicSheetsRowLabel',
        },
      },
      fields: [
        {
          name: 'language',
          type: 'relationship',
          relationTo: 'languages',
          required: true,
        },
        {
          name: 'pdfPublicId',
          type: 'text',
          required: true,
          admin: {
            description: 'Upload music sheet PDF to Cloudinary',
            custom: {
              folderType: 'sheets',
            },
            components: {
              Field: '@/components/payload/CloudinaryPdfField#CloudinaryPdfField',
            },
          },
        },
      ],
    },
    // History documents array - PDF documents per language
    {
      name: 'historyDocuments',
      type: 'array',
      labels: {
        singular: 'History Document',
        plural: 'History Documents',
      },
      admin: {
        description: 'Add history document PDFs in different languages',
        components: {
          RowLabel: '@/components/payload/LanguageRowLabel#HistoryDocumentsRowLabel',
        },
      },
      fields: [
        {
          name: 'language',
          type: 'relationship',
          relationTo: 'languages',
          required: true,
        },
        {
          name: 'pdfPublicId',
          type: 'text',
          required: true,
          admin: {
            description: 'Upload history document PDF to Cloudinary',
            custom: {
              folderType: 'history',
            },
            components: {
              Field: '@/components/payload/CloudinaryPdfField#CloudinaryPdfField',
            },
          },
        },
      ],
    },
    // Audio tracks array - multiple tracks with versions
    {
      name: 'audioTracks',
      type: 'array',
      labels: {
        singular: 'Audio Track',
        plural: 'Audio Tracks',
      },
      admin: {
        description: 'Add audio tracks with versions',
        components: {
          RowLabel: '@/components/payload/AudioTrackRowLabel#AudioTrackRowLabel',
        },
      },
      fields: [
        {
          name: 'trackType',
          type: 'relationship',
          relationTo: 'track-types',
          required: true,
        },
        {
          name: 'versions',
          type: 'array',
          labels: {
            singular: 'Version',
            plural: 'Versions',
          },
          admin: {
            description: 'Add different versions of this track',
            components: {
              RowLabel: '@/components/payload/AudioTrackRowLabel#AudioVersionRowLabel',
            },
          },
          fields: [
            {
              name: 'versionId',
              type: 'text',
              required: true,
              admin: {
                description: 'Unique identifier for this version (e.g., v1, v2)',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Display name for this version',
              },
            },
            {
              name: 'audioPublicId',
              type: 'text',
              required: true,
              admin: {
                description: 'Upload audio file to Cloudinary',
                components: {
                  Field: '@/components/payload/CloudinaryAudioField#CloudinaryAudioField',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
