export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export function getR2PublicUrl(objectKey: string): string {
  if (!objectKey) return ''
  return `${R2_PUBLIC_URL}/${objectKey}`
}
