import type { CollectionConfig } from 'payload'

export const TrackTypes: CollectionConfig = {
  slug: 'track-types',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Display name (e.g., "Groupe", "Violon")',
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
