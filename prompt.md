# PRD: Payload CMS Song Catalog

## Introduction

Migrate the song catalog from hardcoded data (`lib/mockData.ts`) to a proper database setup using Payload CMS. This will enable content editors to manage songs, metadata, lyrics, translations, audio tracks, and documents through an intuitive admin interface while maintaining the existing frontend data shape and Zustand store compatibility.

## Goals

- Replace hardcoded song data with a database-backed CMS
- Provide an intuitive admin UI for non-technical users to manage songs
- Maintain the existing `Song` TypeScript interface for frontend compatibility
- Store all media (thumbnails, PDFs, audio) in Cloudinary with organized folder structure
- Enable filtering songs by metadata (country, language, genre, audience, theme)
- Support the complex audio track/version hierarchy (e.g., violin with chorus/verse versions, vocals in 8 languages)

## User Stories

### US-001: Install and configure Payload CMS

**Description:** As a developer, I need Payload CMS installed as a Next.js plugin so that I can build the admin interface.

**Acceptance Criteria:**

- [ ] Install `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`
- [ ] Create `payload.config.ts` at project root with PostgreSQL/Neon connection
- [ ] Configure Payload to use existing `DATABASE_URL` environment variable
- [ ] Add Payload admin route at `/admin` via Next.js catch-all route
- [ ] Admin panel loads at `http://localhost:3000/admin`
- [ ] Create initial admin user via Payload's setup flow
- [ ] Typecheck passes

---

### US-002: Create lookup collections for metadata

**Description:** As a developer, I need lookup collections for reusable metadata so that songs can reference shared values.

**Acceptance Criteria:**

- [ ] Create `Countries` collection with fields: `name` (text, required, unique)
- [ ] Create `Languages` collection with fields: `name` (text, required, unique), `code` (text, required, unique, e.g., "fr", "en")
- [ ] Create `Genres` collection with fields: `name` (text, required, unique)
- [ ] Create `Audiences` collection with fields: `name` (text, required, unique)
- [ ] Create `Themes` collection with fields: `name` (text, required, unique)
- [ ] Each collection has admin UI with list view showing all entries
- [ ] Typecheck passes

---

### US-003: Create Songs collection with basic fields

**Description:** As a developer, I need the core Songs collection with basic fields and metadata relationships.

**Acceptance Criteria:**

- [ ] Create `Songs` collection with fields:
  - `title` (text, required)
  - `slug` (text, required, unique, auto-generated from title but editable)
  - `thumbnailPublicId` (text) - Cloudinary public_id for thumbnail
  - `difficulty` (select: "Facile" | "Intermédiaire" | "Difficile", required)
- [ ] Add relationship fields (many-to-many):
  - `countries` (relationship to Countries, hasMany)
  - `languages` (relationship to Languages, hasMany)
  - `genres` (relationship to Genres, hasMany)
  - `audiences` (relationship to Audiences, hasMany)
  - `themes` (relationship to Themes, hasMany)
- [ ] Slug auto-generates from title on create (using Payload hook)
- [ ] Slug is editable after creation
- [ ] Admin list view shows title, slug, difficulty
- [ ] Typecheck passes

---

### US-004: Add lyrics and translations arrays to Songs

**Description:** As a content editor, I want to add multiple lyrics and translations in different languages to a song.

**Acceptance Criteria:**

- [ ] Add `lyrics` array field to Songs with sub-fields:
  - `language` (relationship to Languages, required)
  - `text` (textarea, required)
- [ ] Add `translations` array field to Songs with sub-fields:
  - `language` (relationship to Languages, required)
  - `text` (textarea, required)
- [ ] Admin UI shows inline array editing with "Add Lyric" / "Add Translation" buttons
- [ ] Each array item shows language name as row label
- [ ] Validation: at least one lyric required
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill (admin UI)

---

### US-005: Add music sheets and history documents to Songs

**Description:** As a content editor, I want to upload PDF documents for music sheets and history per language.

**Acceptance Criteria:**

- [ ] Add `musicSheets` array field to Songs with sub-fields:
  - `language` (relationship to Languages, required)
  - `pdfPublicId` (text, required) - Cloudinary public_id
- [ ] Add `historyDocuments` array field to Songs with sub-fields:
  - `language` (relationship to Languages, required)
  - `pdfPublicId` (text, required) - Cloudinary public_id
- [ ] Admin UI shows inline array editing
- [ ] Typecheck passes

---

### US-006: Add audio tracks with versions to Songs

**Description:** As a content editor, I want to add audio tracks (groupe, violon, chant, guitare, percussion) with multiple versions per track.

**Acceptance Criteria:**

- [ ] Add `audioTracks` array field to Songs with sub-fields:
  - `trackType` (select: "groupe" | "violon" | "chant" | "guitare" | "percussion", required)
  - `versions` (array, required, minRows: 1) with sub-fields:
    - `versionId` (text, required, auto-generated UUID or user-provided)
    - `name` (text, required) - e.g., "Français", "Chorus", "Part 1"
    - `audioPublicId` (text, required) - Cloudinary public_id
- [ ] Admin UI shows nested structure: track type dropdown, then versions list
- [ ] "Add Version" button within each track
- [ ] Validation: at least one audio track required, each track needs at least one version
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill (admin UI)

---

### US-007: Implement Cloudinary upload integration

**Description:** As a content editor, I want to upload files directly to Cloudinary with automatic folder organization.

**Acceptance Criteria:**

- [ ] Create custom Cloudinary upload field component for Payload admin
- [ ] Upload to folder structure: `/songs/{slug}/thumbnails/`, `/songs/{slug}/sheets/`, `/songs/{slug}/history/`, `/songs/{slug}/audio/{track-type}/`
- [ ] Field displays upload button and current public_id
- [ ] After upload, stores Cloudinary public_id in database (not full URL)
- [ ] Thumbnail field shows image preview after upload
- [ ] PDF fields show filename/link after upload
- [ ] Audio fields show filename and playable preview after upload
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill (upload flow)

---

### US-008: Create API route to list songs with filtering

**Description:** As a frontend developer, I need an API endpoint to fetch all songs with optional metadata filters.

**Acceptance Criteria:**

- [ ] Create `GET /api/songs` route
- [ ] Returns array of songs with shape matching existing `Song` interface
- [ ] Support query parameters for filtering:
  - `country` - filter by country name
  - `language` - filter by language name
  - `genre` - filter by genre name
  - `audience` - filter by audience name
  - `theme` - filter by theme name
  - `difficulty` - filter by difficulty level
- [ ] Multiple filters combine with AND logic
- [ ] Transforms Payload data to match `Song` interface (including nested metadata object)
- [ ] Response includes Cloudinary URLs built from public_ids
- [ ] Typecheck passes

---

### US-009: Create API route to get single song by slug

**Description:** As a frontend developer, I need an API endpoint to fetch a single song with all related data.

**Acceptance Criteria:**

- [ ] Create `GET /api/songs/[slug]` route
- [ ] Returns single song object matching `Song` interface
- [ ] Returns 404 if song not found
- [ ] Includes all nested data: lyrics, translations, musicSheets, history, audioTracks
- [ ] Transforms relationship IDs to full objects with language names/codes
- [ ] Builds full Cloudinary URLs from public_ids
- [ ] Typecheck passes

---

### US-010: Create API route for audio file URLs

**Description:** As a frontend developer, I need an API endpoint to get the streaming URL for a specific audio track version.

**Acceptance Criteria:**

- [ ] Create `GET /api/songs/[slug]/audio/[trackType]/[versionId]` route
- [ ] Returns JSON with Cloudinary streaming URL for the audio file
- [ ] Returns 404 if song, track type, or version not found
- [ ] URL is suitable for `<audio>` element src attribute
- [ ] Typecheck passes

---

### US-011: Create API route for lookup values

**Description:** As a frontend developer, I need endpoints to fetch available lookup values for filter dropdowns.

**Acceptance Criteria:**

- [ ] Create `GET /api/lookup/[type]` route where type is: countries, languages, genres, audiences, themes
- [ ] Returns array of objects with `id` and `name` (and `code` for languages)
- [ ] Results sorted alphabetically by name
- [ ] Returns 400 for invalid lookup type
- [ ] Typecheck passes

---

### US-012: Seed lookup tables with existing data

**Description:** As a developer, I need to populate lookup tables with values from the existing hardcoded songs.

**Acceptance Criteria:**

- [ ] Create seed script at `scripts/seed-lookups.ts`
- [ ] Extract unique values from `lib/mockData.ts`:
  - Countries: France, Italie
  - Languages: Français, English, Italien, Español, Allemand, Anglais, Arabe, Turque, Ukrainien (with codes)
  - Genres: Traditionnel, Chant de résistance, Folk, Chanson enfantine, Comptine
  - Audiences: Enfants, Ados, Adultes, Séniors
  - Themes: Nature, Amour, Nostalgie, Résistance, Liberté, Histoire, Enfance, Famille, Éducation
- [ ] Script uses Payload Local API to create entries
- [ ] Script is idempotent (skips existing entries)
- [ ] Add npm script: `"db:seed": "npx tsx scripts/seed-lookups.ts"`
- [ ] Typecheck passes

---

### US-013: Migrate existing songs to database

**Description:** As a developer, I need to import the 3 existing songs from hardcoded data to the database.

**Acceptance Criteria:**

- [ ] Create migration script at `scripts/migrate-songs.ts`
- [ ] Script reads songs from `lib/mockData.ts`
- [ ] For each song, creates Payload document with:
  - Basic fields (title, slug, difficulty)
  - Relationships to lookup tables (countries, languages, genres, audiences, themes)
  - Lyrics and translations arrays
  - Music sheets and history (using placeholder public_ids like `songs/{slug}/sheets/score`)
  - Audio tracks with versions (using placeholder public_ids like `songs/{slug}/audio/{track}/{versionId}`)
- [ ] Script is idempotent (skips songs with existing slug)
- [ ] Add npm script: `"db:migrate-songs": "npx tsx scripts/migrate-songs.ts"`
- [ ] After running, 3 songs visible in Payload admin
- [ ] Typecheck passes

---

### US-014: Update Zustand store to fetch from API

**Description:** As a developer, I need to update the app to fetch songs from the new API instead of hardcoded data.

**Acceptance Criteria:**

- [ ] Create new store or extend existing: `store/useSongsDataStore.ts`
- [ ] Add state: `songs: Song[]`, `currentSong: Song | null`, `isLoading: boolean`, `error: string | null`
- [ ] Add actions:
  - `fetchSongs(filters?)` - calls `GET /api/songs` with optional filters
  - `fetchSongBySlug(slug)` - calls `GET /api/songs/[slug]`
  - `getAudioUrl(slug, trackType, versionId)` - calls audio API route
- [ ] Keep existing `useSongStore` for UI state (selectedTabs, audio playback, etc.)
- [ ] Update `pages/index.tsx` to use new store for song list
- [ ] Update `pages/song/[slug].tsx` to use new store for song data
- [ ] Remove import of `lib/mockData.ts` from page components
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill (song list and song detail pages)

---

### US-015: Add admin UI polish for song management

**Description:** As a content editor, I want an intuitive admin experience for managing songs.

**Acceptance Criteria:**

- [ ] Songs list view shows: title, slug, thumbnail preview, difficulty, country flags/names
- [ ] Songs list is searchable by title
- [ ] Songs list is sortable by title, created date
- [ ] Song edit form has logical field grouping:
  - Basic Info section (title, slug, thumbnail, difficulty)
  - Metadata section (countries, languages, genres, audiences, themes)
  - Content section (lyrics, translations)
  - Documents section (music sheets, history)
  - Audio section (audio tracks with versions)
- [ ] Collapsible sections for content/documents/audio
- [ ] Helpful field descriptions/placeholders
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill (admin song form)

---

## Functional Requirements

- FR-1: Payload CMS admin accessible at `/admin` with authentication
- FR-2: Songs stored in PostgreSQL via Payload's Drizzle adapter using existing Neon database
- FR-3: Lookup values (countries, languages, genres, audiences, themes) stored as separate collections
- FR-4: Songs reference lookups via Payload relationship fields
- FR-5: Lyrics and translations stored as arrays within song document with language reference
- FR-6: Audio tracks stored as nested array with track type and versions sub-array
- FR-7: All media references stored as Cloudinary public_ids, not full URLs
- FR-8: API routes transform Payload data to match existing `Song` TypeScript interface
- FR-9: Cloudinary uploads organized by folder: `/songs/{slug}/{type}/`
- FR-10: Slug auto-generated from title but remains editable
- FR-11: Validation requires at least one lyric and one audio track per song

## Non-Goals (Out of Scope)

- User authentication/authorization for frontend (admin-only for now)
- Versioning/revision history for songs
- Bulk import from CSV/Excel
- Audio waveform visualization in admin
- Automatic audio transcoding
- Multi-tenant support
- Localization of admin interface
- Search functionality beyond basic filters
- Caching layer for API responses
- Image/PDF optimization pipeline

## Technical Considerations

- **Database:** Use existing Neon PostgreSQL instance via `DATABASE_URL`
- **Payload Version:** Use Payload 3.x with Next.js App Router integration
- **Drizzle:** Payload manages schema; existing `db/schema.ts` users table can coexist
- **Cloudinary:** Use existing `lib/cloudinary.ts` configuration; custom upload component calls Cloudinary SDK directly
- **Serverless:** Payload works on Vercel but admin may have cold start delays; acceptable tradeoff
- **Type Safety:** Generate Payload types and ensure `Song` interface compatibility
- **API Design:** Custom Next.js routes query Payload Local API (no HTTP overhead)

## Design Considerations

- Admin UI uses Payload's default styling (professional, no customization needed)
- Song edit form should group related fields into collapsible sections
- Array fields should show clear labels (language name) in collapsed state
- Metadata fields should use multi-select UI for relationships

## Success Metrics

- All 3 existing songs migrated and accessible via new API
- Content editor can add a new song with all data in under 10 minutes
- Frontend pages render correctly with data from API (visual parity with current hardcoded version)
- No TypeScript errors in frontend components consuming API data
- API response time under 500ms for song list, under 200ms for single song

## Open Questions

1. Should we implement image upload preview directly in Payload admin, or is entering Cloudinary public_id manually acceptable for MVP?
2. Do we need a "draft/published" status for songs, or are all songs immediately public?
3. Should the audio URL API return a signed/expiring URL for security, or is public access acceptable?
4. Are there plans to add more audio track types beyond the current 5 (groupe, violon, chant, guitare, percussion)?
