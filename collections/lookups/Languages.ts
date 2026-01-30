import type { CollectionConfig } from 'payload'

export const Languages: CollectionConfig = {
  slug: 'languages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameEn', 'code'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'nameEn',
      type: 'text',
      required: false,
      admin: {
        description: 'English name (e.g., "French" for "Français")',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
