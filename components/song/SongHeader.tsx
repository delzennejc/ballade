import { useState } from "react"
import Image from "next/image"
import {
  Globe,
  MessageCircle,
  Music,
  Users,
  Mountain,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Song } from "@/types/song"
import { useLanguage } from "@/contexts/LanguageContext"
import { useLookupStore } from "@/store/useLookupStore"
import { translateCountry } from "@/data/geography"
import ActionMenu from "@/components/ui/ActionMenu"

interface SongHeaderProps {
  song: Song
  onShare: () => void
}

interface TagGroupProps {
  icon: React.ReactNode
  items: string[]
  colorClass: string
}

function TagGroup({ icon, items, colorClass }: TagGroupProps) {
  if (items.length === 0) return null

  return (
    <div
      className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 rounded-full ${colorClass}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm md:text-base font-medium mt-0.5">
        {items.join("  ")}
      </span>
    </div>
  )
}

export default function SongHeader({ song, onShare }: SongHeaderProps) {
  const { language } = useLanguage()
  const { translateLookup } = useLookupStore()
  const { metadata } = song

  // Translate metadata based on current language
  const translatedCountries = metadata.countries.map((c) =>
    language === "en" ? translateCountry(c, "fr", "en") : c,
  )
  const translatedLanguages = metadata.languages.map((l) =>
    translateLookup(l, "languages", language),
  )
  const translatedGenres = metadata.genres.map((g) =>
    translateLookup(g, "genres", language),
  )
  const translatedAudience = metadata.audience.map((a) =>
    translateLookup(a, "audiences", language),
  )
  const translatedThemes = metadata.themes.map((t) =>
    translateLookup(t, "themes", language),
  )
  const translatedDifficulty = translateLookup(
    metadata.difficulty,
    "difficultyLevels",
    language,
  )

  // Collect all tags for mobile "see more" functionality
  const allTags = [
    {
      icon: <Globe className="w-4 h-4 md:w-5 md:h-5" />,
      items: translatedCountries,
      colorClass: "bg-blue-50 text-blue-700",
    },
    {
      icon: <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />,
      items: translatedLanguages,
      colorClass: "bg-green-50 text-green-700",
    },
    {
      icon: <Music className="w-4 h-4 md:w-5 md:h-5" />,
      items: translatedGenres,
      colorClass: "bg-purple-50 text-purple-700",
    },
    {
      icon: <Users className="w-4 h-4 md:w-5 md:h-5" />,
      items: translatedAudience,
      colorClass: "bg-orange-50 text-orange-700",
    },
    {
      icon: <Mountain className="w-4 h-4 md:w-5 md:h-5" />,
      items: [translatedDifficulty],
      colorClass: "bg-amber-50 text-amber-700",
    },
    {
      icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5" />,
      items: translatedThemes,
      colorClass: "bg-rose-50 text-rose-700",
    },
  ].filter((tag) => tag.items.length > 0 && tag.items[0])

  const [showAllTags, setShowAllTags] = useState(false)
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 3)
  const hasMoreTags = allTags.length > 3

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-8 mb-3 md:mb-6 overflow-hidden">
      <div className="flex items-start gap-4 md:gap-8">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 md:w-42 md:h-42 shrink-0 rounded-xl overflow-hidden">
          <Image
            src={song.thumbnail}
            alt={song.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Title and metadata */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 md:gap-4 mb-2 md:mb-5">
            <h1 className="text-lg md:text-4xl font-bold text-[#18375E] leading-tight wrap-break-words">
              {song.title}
            </h1>
            <ActionMenu onShare={onShare} />
          </div>

          {/* Tags - show limited on mobile with "see more" */}
          <div className="flex flex-wrap gap-2 md:gap-3 md:pr-8 overflow-hidden">
            {visibleTags.map((tag, index) => (
              <TagGroup
                key={index}
                icon={tag.icon}
                items={tag.items}
                colorClass={tag.colorClass}
              />
            ))}
            {/* See more button on mobile */}
            {hasMoreTags && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="md:hidden inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showAllTags ? "rotate-180" : ""}`}
                />
                {showAllTags ? "Voir moins" : "Voir plus"}
              </button>
            )}
            {/* Show all tags on desktop */}
            {!showAllTags &&
              allTags.slice(3).map((tag, index) => (
                <div key={index + 3} className="hidden md:inline-flex">
                  <TagGroup
                    icon={tag.icon}
                    items={tag.items}
                    colorClass={tag.colorClass}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
