import type { CollectionConfig } from 'payload'

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
      type: 'relationship',
      relationTo: 'countries',
      hasMany: true,
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
    // Lyrics array - multiple lyrics in different languages
    {
      name: 'lyrics',
      type: 'array',
      labels: {
        singular: 'Lyric',
        plural: 'Lyrics',
      },
      admin: {
        description: 'Add lyrics in different languages',
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
      ],
    },
    // Translations array - multiple translations in different languages
    {
      name: 'translations',
      type: 'array',
      labels: {
        singular: 'Translation',
        plural: 'Translations',
      },
      admin: {
        description: 'Add translations in different languages',
        components: {
          RowLabel: '@/components/payload/LanguageRowLabel#TranslationsRowLabel',
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
            description: 'The translation text in this language',
          },
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
        description: 'Add audio tracks (groupe, violon, chant, guitare, percussion) with versions',
        components: {
          RowLabel: '@/components/payload/AudioTrackRowLabel#AudioTrackRowLabel',
        },
      },
      fields: [
        {
          name: 'trackType',
          type: 'select',
          required: true,
          options: [
            { label: 'Groupe', value: 'groupe' },
            { label: 'Violon', value: 'violon' },
            { label: 'Chant', value: 'chant' },
            { label: 'Guitare', value: 'guitare' },
            { label: 'Percussion', value: 'percussion' },
          ],
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
