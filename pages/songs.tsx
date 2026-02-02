import { useState, useMemo, useEffect } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import FilterModal from "@/components/FilterModal"
import { useSongsDataStore } from "@/store/useSongsDataStore"
import { useSidebarStore } from "@/store/useSidebarStore"
import { useFilterStore } from "@/store/useFilterStore"
import { getRegionByCountry } from "@/data/geography"
import { useLanguage } from "@/contexts/LanguageContext"

// Remove accents/diacritics from a string for accent-insensitive search
const deburr = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export default function SongsPage() {
  const { searchQuery, setSearchQuery } = useSidebarStore()
  const { filters, setFilters } = useFilterStore()
  const { language, setLanguage, t } = useLanguage()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const { songs, isLoading, error } = useSongsDataStore()

  // Set body/html background to match the dark theme on mount, revert on unmount
  useEffect(() => {
    const originalBodyBg = document.body.style.background
    const originalHtmlBg = document.documentElement.style.background

    document.body.style.background = "#334155"
    document.documentElement.style.background = "#334155"

    return () => {
      document.body.style.background = originalBodyBg
      document.documentElement.style.background = originalHtmlBg
    }
  }, [])

  // Filter songs by search query and active filters, sorted alphabetically
  const filteredSongs = useMemo(() => {
    return songs
      .filter((song) => {
        // Search query filter (accent-insensitive)
        if (searchQuery && !deburr(song.title.toLowerCase()).includes(deburr(searchQuery.toLowerCase()))) {
          return false
        }

        const meta = song.metadata
        if (!meta) return true

        // Geographic origin filter
        if (filters.geographicOrigin.length > 0) {
          const songRegions = (meta.countries || [])
            .map((country) => getRegionByCountry(country))
            .filter(Boolean) as string[]
          if (!filters.geographicOrigin.some((region) => songRegions.includes(region))) {
            return false
          }
        }

        // Musical style filter
        if (filters.musicalStyle.length > 0) {
          if (!filters.musicalStyle.some((style) => (meta.genres || []).includes(style))) {
            return false
          }
        }

        // Language filter
        if (filters.language.length > 0) {
          if (!filters.language.some((lang) => (meta.languages || []).includes(lang))) {
            return false
          }
        }

        // Theme filter
        if (filters.theme.length > 0) {
          if (!filters.theme.some((theme) => (meta.themes || []).includes(theme))) {
            return false
          }
        }

        // Target audience filter
        if (filters.targetAudience.length > 0) {
          if (!filters.targetAudience.some((aud) => (meta.audience || []).includes(aud))) {
            return false
          }
        }

        // Difficulty level filter
        if (filters.difficultyLevel.length > 0) {
          if (!filters.difficultyLevel.includes(meta.difficulty)) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => a.title.localeCompare(b.title, "fr"))
  }, [songs, searchQuery, filters])

  // Calculate total active filters
  const activeFiltersCount = Object.values(filters).reduce(
    (total, arr) => total + arr.length,
    0,
  )

  return (
    <>
      <Head>
        <meta name="theme-color" content="#334155" />
      </Head>
      <main className="min-h-screen bg-slate-700">
      {/* Header with Logo and Language Switcher */}
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/">
          <Image
            src="/ballade-logo.png"
            alt="Association Ballade"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("fr")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === "fr"
                ? "bg-blue-500 text-white"
                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === "en"
                ? "bg-blue-500 text-white"
                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-slate-600 border border-slate-500 rounded-xl text-white placeholder-slate-400 outline-none ring-0 focus:ring-0 focus:border-blue-400"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Song List Header with Filter Button */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-white tracking-wide">
          {t('songList')}
        </h2>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-full text-sm text-white transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('filters')}
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Song List */}
      <nav className="flex-1 overflow-y-auto bg-slate-700">
        {isLoading && (
          <div className="text-slate-400 text-sm px-4 py-4">
            {t('loading')}
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm px-4 py-4">
            {t('error')}: {error}
          </div>
        )}
        {!isLoading && !error && (
          <ul>
            {filteredSongs.map((song) => (
              <li key={song.slug}>
                <Link
                  href={`/song/${song.slug}`}
                  className="block w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-600 transition-colors border-b border-slate-600/50"
                >
                  {song.title}
                </Link>
              </li>
            ))}
            {filteredSongs.length === 0 && !isLoading && (
              <li className="px-4 py-4 text-slate-400 text-sm">
                {t('noSongsFound')}
              </li>
            )}
          </ul>
        )}
      </nav>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={(newFilters) => {
          setFilters(newFilters)
          setIsFilterModalOpen(false)
        }}
        initialFilters={filters}
        songs={songs}
      />
    </main>
    </>
  )
}
