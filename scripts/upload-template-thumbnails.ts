import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

// Load env vars before using them
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Configure cloudinary after env vars are loaded
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
  console.log('Uploading template thumbnails to Cloudinary...\n')

  const results: { filename: string; publicId: string }[] = []

  for (const filename of TEMPLATE_IMAGES) {
    const filePath = path.join(process.cwd(), 'public', filename)
    const publicId = `${TEMPLATE_FOLDER}/${path.basename(filename, '.png')}`

    if (!fs.existsSync(filePath)) {
      console.log(`  Skipped (not found): ${filename}`)
      continue
    }

    try {
      // Check if already exists
      try {
        await cloudinary.api.resource(publicId)
        console.log(`  Skipped (exists): ${publicId}`)
        results.push({ filename, publicId })
        continue
      } catch {
        // Doesn't exist, proceed with upload
      }

      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
      })
      console.log(`  Uploaded: ${result.public_id}`)
      results.push({ filename, publicId: result.public_id })
    } catch (error) {
      console.error(`  Failed: ${filename}`, error)
    }
  }

  console.log('\nTemplate upload complete!')
  console.log('\nPublic IDs for configuration:')
  for (const { publicId } of results) {
    console.log(`  ${publicId}`)
  }

  process.exit(0)
}

uploadTemplates().catch((error) => {
  console.error('Upload failed:', error)
  process.exit(1)
})
