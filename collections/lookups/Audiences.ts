import type { CollectionConfig } from 'payload'

export const Audiences: CollectionConfig = {
  slug: 'audiences',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
