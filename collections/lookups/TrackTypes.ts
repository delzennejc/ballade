import type { CollectionConfig } from 'payload'

export const TrackTypes: CollectionConfig = {
  slug: 'track-types',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameEn', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Display name in French (e.g., "Groupe", "Violon")',
      },
    },
    {
      name: 'nameEn',
      type: 'text',
      required: false,
      admin: {
        description: 'Display name in English (e.g., "Full Band", "Violin")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "groupe", "violon")',
      },
    },
  ],
}
