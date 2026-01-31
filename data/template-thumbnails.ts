export interface TemplateThumbnail {
  id: string
  publicId: string
  label: string
}

export const TEMPLATE_THUMBNAILS: TemplateThumbnail[] = [
  {
    id: 'template-1',
    publicId: 'templates/thumbnails/image-chanson-1',
    label: 'Violoniste (Bleu)',
  },
  {
    id: 'template-2',
    publicId: 'templates/thumbnails/image-chanson-2',
    label: 'Guitariste (Rose)',
  },
  {
    id: 'template-3',
    publicId: 'templates/thumbnails/image-chanson-3',
    label: 'Musicien (Vert)',
  },
  {
    id: 'template-4',
    publicId: 'templates/thumbnails/image-chanson-4',
    label: 'Musicien (Orange)',
  },
  {
    id: 'template-5',
    publicId: 'templates/thumbnails/image-chanson-5',
    label: 'Musicien (Violet)',
  },
  {
    id: 'template-6',
    publicId: 'templates/thumbnails/image-chanson-6',
    label: 'Chanteur (Jaune)',
  },
]

export const TEMPLATE_FOLDER_PREFIX = 'templates/thumbnails/'

export function isTemplateThumbnail(publicId: string): boolean {
  return publicId.startsWith(TEMPLATE_FOLDER_PREFIX)
}
