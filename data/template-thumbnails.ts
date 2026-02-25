export interface TemplateThumbnail {
  id: string
  publicId: string
  label: string
}

export const TEMPLATE_THUMBNAILS: TemplateThumbnail[] = [
  {
    id: 'template-1',
    publicId: 'templates/thumbnails/image-chanson-1.png',
    label: 'Violoniste (Bleu)',
  },
  {
    id: 'template-2',
    publicId: 'templates/thumbnails/image-chanson-2.png',
    label: 'Guitariste (Rose)',
  },
  {
    id: 'template-3',
    publicId: 'templates/thumbnails/image-chanson-3.png',
    label: 'Musicien (Vert)',
  },
  {
    id: 'template-4',
    publicId: 'templates/thumbnails/image-chanson-4.png',
    label: 'Musicien (Orange)',
  },
  {
    id: 'template-5',
    publicId: 'templates/thumbnails/image-chanson-5.png',
    label: 'Musicien (Violet)',
  },
  {
    id: 'template-6',
    publicId: 'templates/thumbnails/image-chanson-6.png',
    label: 'Chanteur (Jaune)',
  },
]

export const TEMPLATE_FOLDER_PREFIX = 'templates/thumbnails/'

export function isTemplateThumbnail(publicId: string): boolean {
  return publicId.startsWith(TEMPLATE_FOLDER_PREFIX)
}
