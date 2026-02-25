import path from 'path'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import { Users } from './collections/Users'
import { Songs } from './collections/Songs'
import { Languages, Genres, Audiences, Themes, TrackTypes, DifficultyLevels } from './collections/lookups'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Songs, Languages, Genres, Audiences, Themes, TrackTypes, DifficultyLevels],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.TURSO_DB_URL!,
      authToken: process.env.TURSO_DB_TOKEN,
    },
    blocksAsJSON: true,
  }),
})
