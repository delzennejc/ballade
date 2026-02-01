import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import FilterModal, { FilterState } from "./FilterModal"
import { useSongsDataStore } from "@/store/useSongsDataStore"
import { useSidebarStore } from "@/store/useSidebarStore"
import { getRegionByCountry } from "@/data/geography"
import { useLanguage } from "@/contexts/LanguageContext"

const emptyFilters: FilterState = {
  geographicOrigin: [],
  musicalStyle: [],
  language: [],
  theme: [],
  targetAudience: [],
  difficultyLevel: [],
}

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const { searchQuery, setSearchQuery } = useSidebarStore()
  const { language, setLanguage, t } = useLanguage()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const router = useRouter()

  const { songs, isLoading, error } = useSongsDataStore()

  // Filter songs by search query and active filters, sorted alphabetically
  const filteredSongs = useMemo(() => {
    return songs
      .filter((song) => {
        // Search query filter
        if (
          searchQuery &&
          !song.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false
        }

        const meta = song.metadata
        if (!meta) return true // If no metadata, only apply search filter

        // Geographic origin filter (check if song's countries belong to selected regions)
        if (filters.geographicOrigin.length > 0) {
          const songRegions = (meta.countries || [])
            .map((country) => getRegionByCountry(country))
            .filter(Boolean) as string[]
          if (
            !filters.geographicOrigin.some((region) =>
              songRegions.includes(region),
            )
          ) {
            return false
          }
        }

        // Musical style filter
        if (filters.musicalStyle.length > 0) {
          if (
            !filters.musicalStyle.some((style) =>
              (meta.genres || []).includes(style),
            )
          ) {
            return false
          }
        }

        // Language filter
        if (filters.language.length > 0) {
          if (
            !filters.language.some((lang) =>
              (meta.languages || []).includes(lang),
            )
          ) {
            return false
          }
        }

        // Theme filter
        if (filters.theme.length > 0) {
          if (
            !filters.theme.some((theme) => (meta.themes || []).includes(theme))
          ) {
            return false
          }
        }

        // Target audience filter
        if (filters.targetAudience.length > 0) {
          if (
            !filters.targetAudience.some((aud) =>
              (meta.audience || []).includes(aud),
            )
          ) {
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

  // Get current slug from router
  const currentSlug = router.query.slug as string | undefined

  // Calculate total active filters
  const activeFiltersCount = Object.values(filters).reduce(
    (total, arr) => total + arr.length,
    0,
  )

  return (
    <aside
      className={`w-50 min-h-screen bg-slate-700 flex-col py-6 ${className}`}
    >
      {/* Logo */}
      <Link href="/" className="flex justify-center mb-4 px-4">
        <Image
          src="/ballade-logo.png"
          alt="Association Ballade"
          width={100}
          height={100}
          className="object-contain cursor-pointer"
        />
      </Link>

      {/* Language Selector */}
      <div className="flex justify-center gap-2 mb-4 px-4">
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

      {/* Search Input */}
      <div className="mb-6 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pr-8 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
          />
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Song List Header */}
      <h2 className="text-sm font-semibold text-white mb-3 tracking-wide px-4">
        {t("songList")}
      </h2>

      {/* Filters Button */}
      <button
        onClick={() => setIsFilterModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1 bg-slate-600 hover:bg-blue-500 rounded-full text-sm text-white mb-4 w-fit transition-colors mx-4"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        {t("filters")}
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full text-xs font-semibold">
            <span className="pt-0.5">{activeFiltersCount}</span>
          </span>
        )}
      </button>

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

      {/* Song List */}
      <nav className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="text-slate-400 text-sm px-4 py-2">{t("loading")}</div>
        )}
        {error && (
          <div className="text-red-400 text-sm px-4 py-2">
            {t("error")}: {error}
          </div>
        )}
        {!isLoading && !error && (
          <ul className="space-y-1">
            {filteredSongs.map((song) => (
              <li key={song.slug}>
                <Link
                  href={`/song/${song.slug}`}
                  className={`block w-full text-left py-1.5 text-sm transition-colors ${
                    currentSlug === song.slug
                      ? "bg-blue-500 text-white px-4"
                      : "text-slate-300 hover:bg-slate-600 px-4"
                  }`}
                >
                  {song.title.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  )
}
