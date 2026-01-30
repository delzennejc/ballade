import type { CollectionConfig } from 'payload'

export const Audiences: CollectionConfig = {
  slug: 'audiences',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameEn'],
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
        description: 'English translation of the audience name',
      },
    },
  ],
}
