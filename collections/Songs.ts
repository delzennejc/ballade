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
        description: 'Cloudinary public ID for the thumbnail image',
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
  ],
}
