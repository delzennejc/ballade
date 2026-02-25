/**
 * Copy files from Cloudinary to R2
 *
 * Downloads all Cloudinary resources via REST API and uploads (copies) them to R2
 * with the same key structure. Does NOT delete anything from Cloudinary.
 *
 * Usage: npx tsx scripts/migrate-cloudinary-to-r2.ts
 *
 * Required env vars (from .env.local):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
const API_KEY = process.env.CLOUDINARY_API_KEY || ''
const API_SECRET = process.env.CLOUDINARY_API_SECRET || ''

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.R2_BUCKET_NAME || 'ballade'
const OUTPUT_DIR = path.join(process.cwd(), 'migration-data')
const MAPPING_FILE = path.join(OUTPUT_DIR, 'id-mapping.json')

interface IdMapping {
  [cloudinaryPublicId: string]: string // maps to R2 object key
}

interface CloudinaryResource {
  public_id: string
  format: string
  secure_url: string
  resource_type: string
}

async function cloudinaryApiRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const authString = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')
  const queryParams = new URLSearchParams(params)
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}?${queryParams}`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${authString}`,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Cloudinary API error: ${response.status} ${text}`)
  }

  return response.json()
}

async function listCloudinaryResources(
  resourceType: 'image' | 'video' | 'raw',
  prefix: string
): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = []
  let nextCursor: string | undefined

  do {
    const params: Record<string, string> = {
      type: 'upload',
      prefix,
      max_results: '500',
    }
    if (nextCursor) params.next_cursor = nextCursor

    const result = await cloudinaryApiRequest(`resources/${resourceType}`, params)
    resources.push(...result.resources)
    nextCursor = result.next_cursor
  } while (nextCursor)

  return resources
}

async function downloadFile(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download: ${url} (${response.status})`)
  }
  return Buffer.from(await response.arrayBuffer())
}

function getContentType(format: string, resourceType: string): string {
  const mimeMap: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    pdf: 'application/pdf',
  }

  if (mimeMap[format]) return mimeMap[format]
  if (resourceType === 'image') return `image/${format}`
  if (resourceType === 'video') return `audio/${format}`
  return 'application/octet-stream'
}

async function migrateResources() {
  console.log('Starting Cloudinary to R2 migration...\n')
  console.log('NOTE: This is a COPY operation. Nothing will be deleted from Cloudinary.\n')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const mapping: IdMapping = {}
  let totalMigrated = 0
  let totalFailed = 0

  // Migrate by resource type and prefix
  const resourceTypes: Array<{ type: 'image' | 'video' | 'raw'; prefixes: string[] }> = [
    { type: 'image', prefixes: ['templates/', 'songs/'] },
    { type: 'video', prefixes: ['songs/'] },
    { type: 'raw', prefixes: ['songs/'] },
  ]

  for (const { type, prefixes } of resourceTypes) {
    for (const prefix of prefixes) {
      console.log(`Listing ${type} resources with prefix "${prefix}"...`)
      const resources = await listCloudinaryResources(type, prefix)
      console.log(`  Found ${resources.length} resources`)

      for (const resource of resources) {
        // R2 object key = cloudinary public_id + extension
        const objectKey = resource.format
          ? `${resource.public_id}.${resource.format}`
          : resource.public_id

        try {
          console.log(`  Copying: ${resource.public_id} -> ${objectKey}`)
          const buffer = await downloadFile(resource.secure_url)

          await s3Client.send(
            new PutObjectCommand({
              Bucket: BUCKET,
              Key: objectKey,
              Body: buffer,
              ContentType: getContentType(resource.format, type),
            })
          )

          mapping[resource.public_id] = objectKey
          totalMigrated++
        } catch (error) {
          console.error(`  FAILED: ${resource.public_id}`, error)
          totalFailed++
        }
      }
    }
  }

  // Save mapping file
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2))
  console.log(`\nMigration complete!`)
  console.log(`  Migrated: ${totalMigrated}`)
  console.log(`  Failed: ${totalFailed}`)
  console.log(`  Mapping saved to: ${MAPPING_FILE}`)

  process.exit(totalFailed > 0 ? 1 : 0)
}

migrateResources().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
