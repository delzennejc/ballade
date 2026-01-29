import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import FilterModal, { FilterState } from "./FilterModal"
import { useSongsDataStore } from "@/store/useSongsDataStore"

interface SidebarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const emptyFilters: FilterState = {
  geographicOrigin: [],
  musicalStyle: [],
  language: [],
  theme: [],
  targetAudience: [],
  difficultyLevel: [],
}

export default function Sidebar({ searchQuery, setSearchQuery }: SidebarProps) {
  const [language, setLanguage] = useState<"FR" | "EN">("FR")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const router = useRouter()

  const { songs, isLoading, error, fetchSongs } = useSongsDataStore()

  // Fetch songs on mount
  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get current slug from router
  const currentSlug = router.query.slug as string | undefined

  // Calculate total active filters
  const activeFiltersCount = Object.values(filters).reduce(
    (total, arr) => total + arr.length,
    0,
  )

  return (
    <aside className="w-[200px] min-h-screen bg-slate-700 flex flex-col py-6">
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
          onClick={() => setLanguage("FR")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === "FR"
              ? "bg-blue-500 text-white"
              : "bg-slate-600 text-slate-300 hover:bg-slate-500"
          }`}
        >
          FR
        </button>
        <button
          onClick={() => setLanguage("EN")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === "EN"
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
            placeholder="Rechercher"
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
        LISTE DES CHANSONS
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
        Filtres
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
      />

      {/* Song List */}
      <nav className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="text-slate-400 text-sm px-4 py-2">
            Chargement...
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm px-4 py-2">
            Erreur: {error}
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
