import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

// Load env vars before using them
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.R2_BUCKET_NAME || 'ballade'
const TEMPLATE_FOLDER = 'templates/thumbnails'
const TEMPLATE_IMAGES = [
  'image-chanson-1.png',
  'image-chanson-2.png',
  'image-chanson-3.png',
  'image-chanson-4.png',
  'image-chanson-5.png',
  'image-chanson-6.png',
]

async function uploadTemplates() {
  console.log('Uploading template thumbnails to R2...\n')

  const results: { filename: string; objectKey: string }[] = []

  for (const filename of TEMPLATE_IMAGES) {
    const filePath = path.join(process.cwd(), 'public', filename)
    const objectKey = `${TEMPLATE_FOLDER}/${filename}`

    if (!fs.existsSync(filePath)) {
      console.log(`  Skipped (not found): ${filename}`)
      continue
    }

    try {
      // Check if already exists
      try {
        await client.send(
          new HeadObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
          })
        )
        console.log(`  Skipped (exists): ${objectKey}`)
        results.push({ filename, objectKey })
        continue
      } catch {
        // Doesn't exist, proceed with upload
      }

      const fileBuffer = fs.readFileSync(filePath)
      await client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: objectKey,
          Body: fileBuffer,
          ContentType: 'image/png',
        })
      )
      console.log(`  Uploaded: ${objectKey}`)
      results.push({ filename, objectKey })
    } catch (error) {
      console.error(`  Failed: ${filename}`, error)
    }
  }

  console.log('\nTemplate upload complete!')
  console.log('\nObject keys for configuration:')
  for (const { objectKey } of results) {
    console.log(`  ${objectKey}`)
  }

  process.exit(0)
}

uploadTemplates().catch((error) => {
  console.error('Upload failed:', error)
  process.exit(1)
})
