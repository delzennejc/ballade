import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Globe } from "lucide-react"
import { MapModal } from "./MapModal"
import { useSongsDataStore } from "@/store/useSongsDataStore"
import { useLanguage } from "@/contexts/LanguageContext"

export default function MainContent() {
  const { t, language, setLanguage } = useLanguage()
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { songs } = useSongsDataStore()

  const filteredSongs = searchQuery.trim()
    ? songs
        .filter((song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
          const query = searchQuery.toLowerCase()
          const aTitle = a.title.toLowerCase()
          const bTitle = b.title.toLowerCase()
          const aIndex = aTitle.indexOf(query)
          const bIndex = bTitle.indexOf(query)
          // Prioritize matches at the start of the title
          if (aIndex === 0 && bIndex !== 0) return -1
          if (bIndex === 0 && aIndex !== 0) return 1
          // Then by position of match
          if (aIndex !== bIndex) return aIndex - bIndex
          // Then alphabetically
          return aTitle.localeCompare(bTitle)
        })
        .slice(0, 10)
    : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-blue-50">
      {/* Header with Bienvenue, Language Switcher and Admin */}
      <div className="flex justify-between items-start px-4 md:px-8 pt-6">
        <h1 className="font-urbanist text-5xl md:text-7xl lg:text-8xl font-bold text-blue-300 tracking-tight md:ml-8">
          {t("welcome")}
        </h1>
        <div className="flex items-center gap-3">
          {/* Language Switcher - Mobile only */}
          <div className="flex gap-2 md:hidden">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                language === "fr"
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white border border-gray-200"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                language === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white border border-gray-200"
              }`}
            >
              EN
            </button>
          </div>
          {/* Admin Link */}
          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-gray-600 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin
          </Link>
        </div>
      </div>

      {/* Main Content Area - Frosted Card */}
      <div className="flex-1 flex flex-col items-center px-4 md:px-8 pb-8 -mt-3 md:-mt-6">
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl shadow-md">
          {/* Gradient top section with blur */}
          <div className="h-8 backdrop-blur-sm bg-gradient-to-b from-white/30 to-white/80 top-shadow-md" />
          {/* Main card content */}
          <div className="bg-white p-4 md:p-6 -mt-1">
            {/* Hero Section */}
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Main Illustration */}
              <div className="relative w-full aspect-[16/9] flex justify-center">
                <Image
                  src={
                    language === "en" ? "/home-image-en.svg" : "/home-image.svg"
                  }
                  alt="Association Ballade - Jouer ensemble pour vivre ensemble"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Action Buttons - Mobile: stacked, Desktop: inline search */}
            <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-center">
              {/* Mobile: Show list button, Desktop: Show search */}
              <Link
                href="/songs"
                className="md:hidden w-full max-w-sm inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 rounded-full text-white font-medium hover:bg-blue-600 transition-colors"
              >
                {t("viewSongList")}
              </Link>

              {/* Desktop search */}
              <div ref={searchRef} className="relative hidden md:block">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 rounded-full shadow-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder={t("searchSong")}
                    className="bg-transparent text-white placeholder-white/80 font-medium outline-none w-48 pt-1"
                  />
                  <Search className="w-5 h-5 flex-shrink-0 text-white" />
                </div>
                {isSearchFocused && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    {filteredSongs.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        {t("noSongsFound")}
                      </div>
                    ) : (
                      filteredSongs.map((song) => (
                        <Link
                          key={song.id}
                          href={`/song/${song.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSearchQuery("")
                            setIsSearchFocused(false)
                          }}
                        >
                          {song.thumbnail && (
                            <Image
                              src={song.thumbnail}
                              alt={song.title}
                              width={32}
                              height={32}
                              className="rounded object-cover"
                            />
                          )}
                          <span className="text-gray-700 text-sm font-medium truncate">
                            {song.title}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Map button - Both mobile and desktop */}
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="w-full max-w-sm md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-gray-50 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors leading-none"
              >
                <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="translate-y-px mt-0.5">
                  {t("viewSongMap")}
                </span>
              </button>
            </div>

            {/* Sponsors Section */}
            <section className="w-full mt-8">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                {t("ourSupporters")}
              </h2>
              <div className="flex justify-center">
                {/* Desktop sponsor logos */}
                <Image
                  src="/sponsor-logos.svg"
                  alt="Nos partenaires et soutiens"
                  width={900}
                  height={400}
                  className="hidden md:block object-contain"
                />
                {/* Mobile sponsor logos */}
                <Image
                  src="/sponsor-logos-mobile.svg"
                  alt="Nos partenaires et soutiens"
                  width={350}
                  height={600}
                  className="md:hidden object-contain"
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        songs={songs}
      />
    </main>
  )
}
