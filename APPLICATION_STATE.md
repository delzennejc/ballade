# Ballade - Application State Documentation

> Current state of the application as of February 2026

## Overview

**Ballade** is a Next.js web application serving as a traditional song catalog for music education and cultural exploration. The platform allows users to browse, search, and interact with songs containing lyrics, translations, musical scores, historical documents, and audio tracks in multiple languages.

**Key characteristics:**
- Multilingual support (French/English)
- Rich multimedia content per song
- Mobile-responsive design
- Content management via Payload CMS

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Payload CMS 3.73, PostgreSQL (Neon serverless), Drizzle ORM |
| **File Storage** | Cloudinary (images, PDFs, audio) |
| **State Management** | Zustand |
| **Maps** | Leaflet + react-leaflet |
| **PDF Viewing** | react-pdf |
| **Audio Processing** | SoundTouch (fallback for pitch preservation) |
| **QR Codes** | qrcode.react |

---

## Core Features

### A. Song Catalog & Browsing

**Song Listing**
- Sidebar list view displaying song titles
- Title-based search functionality
- Alphabetical sorting

**Advanced Filtering Modal**
- Geographic region (countries mapped to regions like "Europe de l'Ouest", "Afrique du Nord")
- Musical style (genres)
- Original language
- Theme
- Target audience
- Difficulty level (Facile, Intermédiaire, Difficile)

**Filter UI**
- Dynamic filter badges showing active selections
- Clear all filters option
- Collapsible filter sections by category
- Color-coded categories for visual distinction

---

### B. Song Detail Page

**Multi-Tab Content System**
| Tab | Content |
|-----|---------|
| Paroles | Original lyrics with stanza display |
| Partitions | PDF musical scores |
| Traductions | Translations of lyrics |
| Histoire | Historical context documents (PDF) |
| Audio | Audio player with track selection |

**Focused View Mode**
- Allows sharing specific content sections (e.g., just lyrics or scores)
- URL parameter `?view=[type]` opens that section in isolation
- Used for targeted sharing of song content
- Not full-screen, but isolated view within the page

**Song Metadata Display**
- Countries of origin
- Genres
- Themes
- Difficulty level

**Share Functionality**
- Copy link to clipboard
- QR code generation
- Section-specific sharing options

---

### C. Audio Player

**Track Management**
- Multiple track types per song (e.g., violin, vocals, full band)
- Version selection within tracks (verse/chorus variants, different languages)
- Dropdown for track and version switching

**Playback Controls**
- Play/Pause
- Progress bar with seek functionality
- Time display (current / total)

**Speed Control (Slowdown Only)**
- 1x (normal speed)
- 0.75x
- 0.5x
- Cycles through speeds on button click

**Pitch Preservation**
- Uses native browser `preservesPitch` property (primary)
- SoundTouch processor as fallback for unsupported browsers

**Additional Features**
- Loop toggle
- Volume control (desktop only)
- Keyboard shortcuts: Arrow keys for ±10 second seeking
- Media Session API for lock screen controls on mobile

---

### D. Content Management (Payload CMS)

**Admin Panel**
- Accessible at `/admin`
- User authentication via Payload

**Songs Collection**
- Basic fields: title, slug (auto-generated from title), difficulty
- Thumbnail image (Cloudinary)
- Relationships to lookup tables (countries, languages, genres, audiences, themes)

**Nested Content Arrays**
- `lyrics[]`: Language + stanzas[] + translations[]
- `scores[]`: PDF files for sheet music
- `historyDocuments[]`: Language-specific historical PDFs
- `audioTracks[]`: Track type + versions[] (each version has name and audio file)

**Cloudinary Integration**
- Custom upload fields for images, PDFs, and audio
- Organized folder structure: `/songs/{slug}/audio/{track-type}/`
- Automatic cleanup of deleted assets on song update/delete

**Lookup Collections**
| Collection | Fields |
|------------|--------|
| Languages | name, nameEn, code |
| Genres | name |
| Audiences | name |
| Themes | name |
| TrackTypes | name, nameEn, slug |

---

### E. Geographic Discovery (Map Modal)

- Interactive Leaflet map
- Country sidebar for browsing songs by location
- Fly-to animation when selecting countries
- Integrates with song filtering by country

---

### F. Internationalization (i18n)

**Language Support**
- French (primary)
- English

**Implementation**
- `LanguageContext` for UI translations
- Translation function `t()` for UI strings
- Lookup value translations (genres, languages, themes, etc.)
- Localized home page images based on selected language

**Content Translation**
- Song lyrics support multiple language versions
- Translations nested within lyrics structure
- Region names translated for filter display

---

### G. Mobile Responsive Design

**Layout Adaptations**
- Mobile-first CSS approach
- Bottom navigation bar on mobile (replaces sidebar)
- Sidebar hidden on mobile devices
- Single-column layouts on small screens

**Touch Optimization**
- Audio player optimized for touch interaction
- Larger tap targets on mobile
- Swipe-friendly navigation

**Responsive Breakpoints**
- Mobile: default styles
- Tablet/Desktop: `md:` and `lg:` breakpoints

---

### H. Sharing & Social

**Share Modal**
- Copy link to clipboard functionality
- QR code generation for easy mobile sharing
- Section-specific sharing (share just lyrics, scores, history, or audio)

**Social Integration**
- Social links in footer
- Share URLs preserve focused view state

---

### I. GDPR Compliance

**Cookie Consent Banner**
- Displayed on first visit
- Accept/Decline options
- Persistent consent storage in local storage
- Banner dismissed after choice

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with search bar and welcome content |
| `/songs` | Full song catalog with advanced filtering |
| `/song/[slug]` | Dynamic song detail page |
| `/song/[slug]?view=[type]` | Focused view for shared content sections |
| `/mentions-legales` | Legal notices / terms page |
| `/admin` | Payload CMS admin panel |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/public/songs` | GET | List all songs with optional filtering by country, language, genre, audience, theme, difficulty |
| `/api/public/songs/[slug]` | GET | Get single song by slug with all relationships populated |
| `/api/public/songs/[slug]/audio/[trackType]/[versionId]` | GET | Stream audio file from Cloudinary |
| `/api/lookup/[type]` | GET | Get lookup values (languages, genres, audiences, themes, tracktypes) |
| `/api/cloudinary/sign-upload` | POST | Generate signed upload credentials for Cloudinary |
| `/api/proxy/pdf` | GET | PDF proxy endpoint |

---

## Data Model

### Songs Collection Schema

```
Song {
  id: string
  title: string
  slug: string (auto-generated, editable)
  difficulty: "Facile" | "Intermédiaire" | "Difficile"
  thumbnail: string (Cloudinary public_id)

  // Relationships
  countries: Country[]
  languages: Language[]
  genres: Genre[]
  audiences: Audience[]
  themes: Theme[]

  // Content Arrays
  lyrics: [
    {
      language: Language
      stanzas: [{ content: string }]
      translations: [
        {
          language: Language
          stanzas: [{ content: string }]
        }
      ]
    }
  ]

  scores: [
    { file: string (Cloudinary public_id) }
  ]

  historyDocuments: [
    {
      language: Language
      file: string (Cloudinary public_id)
    }
  ]

  audioTracks: [
    {
      trackType: TrackType
      versions: [
        {
          id: string
          name: string
          file: string (Cloudinary public_id)
        }
      ]
    }
  ]
}
```

### Lookup Collections

| Collection | Fields |
|------------|--------|
| **Languages** | name (French), nameEn (English), code (ISO) |
| **Genres** | name |
| **Audiences** | name |
| **Themes** | name |
| **TrackTypes** | name, nameEn, slug |
| **Users** | email, name (CMS authentication) |

---

## State Management (Zustand Stores)

| Store | Purpose |
|-------|---------|
| `useSongsDataStore` | Fetching and caching song data, current song state |
| `useSongStore` | Current song UI state (selected tab, audio track, version) |
| `useFilterStore` | Active filter selections |
| `useLookupStore` | Cached lookup data with translation functions |
| `useFocusedViewStore` | Focused view mode state |
| `useSidebarStore` | Sidebar visibility and search state |

---

## Project Structure

```
/ballade
├── pages/                 # Next.js Pages Router
│   ├── index.tsx         # Home page
│   ├── songs.tsx         # Song catalog
│   ├── song/[slug].tsx   # Song detail
│   ├── mentions-legales.tsx
│   └── api/              # API routes
├── app/                   # Payload CMS App Router integration
├── components/
│   ├── song/             # Song-related components
│   ├── payload/          # Custom Payload CMS fields
│   ├── ui/               # Reusable UI components
│   ├── MapModal/         # Map components
│   └── ...               # Layout components
├── collections/          # Payload CMS collections
├── store/                # Zustand stores
├── contexts/             # React contexts (Language)
├── hooks/                # Custom hooks (useAudioPlayer)
├── lib/                  # Utilities (Cloudinary, Payload client)
├── data/                 # Static data (geography, translations)
├── types/                # TypeScript types
├── styles/               # Global styles
├── public/               # Static assets
└── db/                   # Drizzle schema
```

---

## Development Timeline

| Period | Milestones |
|--------|------------|
| **Jan 17-18** | Initial project setup, home page, song page UI, filter modal, PDF support |
| **Jan 28-29** | Payload CMS integration (US-001 to US-016), API routes, database migration, lookup seeding |
| **Jan 29-30** | Advanced filtering with dynamic badges, map modal, i18n (French/English), sharing modal, sidebar persistence |
| **Jan 31** | Mobile responsive design, SoundTouch pitch preservation fallback, cookie consent banner |
| **Feb 1** | UI polish, filter modal desktop layout, map zoom fixes, keyboard seek controls, TypeScript build fixes, project cleanup |

---

## Environment Configuration

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection (Neon) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public Cloudinary config |
| `PAYLOAD_SECRET` | Admin panel encryption |
