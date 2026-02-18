import { useState, useEffect, useRef, useMemo } from "react"
import {
  X,
  ChevronDown,
  ChevronUp,
  Globe,
  Music,
  MessageCircle,
  Sparkles,
  Users,
  Layers,
} from "lucide-react"
import { getRegionByCountry, translateRegion } from "@/data/geography"
import { Song } from "@/types/song"
import { useLanguage } from "@/contexts/LanguageContext"
import { useLookupStore } from "@/store/useLookupStore"

export interface FilterState {
  geographicOrigin: string[] // Stores region names
  musicalStyle: string[]
  language: string[]
  theme: string[]
  targetAudience: string[]
  difficultyLevel: string[]
}

interface FilterModalProps {
  isOpen: boolean
  onClose: (filters: FilterState) => void
  initialFilters?: FilterState
  songs?: Song[]
}

// Compute available filter options from songs
function computeAvailableOptions(songs: Song[]) {
  const regions = new Set<string>()
  const genres = new Set<string>()
  const languages = new Set<string>()
  const themes = new Set<string>()
  const audiences = new Set<string>()
  const difficulties = new Set<string>()

  for (const song of songs) {
    const meta = song.metadata
    if (!meta) continue

    // Map countries to regions
    for (const country of meta.countries || []) {
      const region = getRegionByCountry(country)
      if (region) regions.add(region)
    }

    // Collect genres
    for (const genre of meta.genres || []) {
      genres.add(genre)
    }

    // Collect languages
    for (const lang of meta.languages || []) {
      languages.add(lang)
    }

    // Collect themes
    for (const theme of meta.themes || []) {
      themes.add(theme)
    }

    // Collect audiences
    for (const aud of meta.audience || []) {
      audiences.add(aud)
    }

    // Collect difficulty
    if (meta.difficulty) {
      difficulties.add(meta.difficulty)
    }
  }

  return {
    geographicOrigin: Array.from(regions).sort((a, b) => a.localeCompare(b, "fr")),
    musicalStyle: Array.from(genres).sort((a, b) => a.localeCompare(b, "fr")),
    language: Array.from(languages).sort((a, b) => a.localeCompare(b, "fr")),
    theme: Array.from(themes).sort((a, b) => a.localeCompare(b, "fr")),
    targetAudience: Array.from(audiences).sort((a, b) => a.localeCompare(b, "fr")),
    difficultyLevel: Array.from(difficulties).sort((a, b) => a.localeCompare(b, "fr")),
  }
}

type FilterCategory = keyof FilterState

interface FilterSectionProps {
  icon: React.ReactNode
  title: string
  category: FilterCategory
  options: string[]
  selectedOptions: string[]
  isExpanded: boolean
  onToggle: () => void
  onSelect: (category: FilterCategory, option: string) => void
  colorClass: string
  selectedBadgeClass: string
  countBadgeClass: string
  translateOption?: (option: string) => string
}

function FilterSection({
  icon,
  title,
  category,
  options,
  selectedOptions,
  isExpanded,
  onToggle,
  onSelect,
  colorClass,
  selectedBadgeClass,
  countBadgeClass,
  translateOption,
}: FilterSectionProps) {
  const selectedCount = selectedOptions.length

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={colorClass}>{icon}</span>
          <span className={`font-medium ${colorClass}`}>{title}</span>
          {selectedCount > 0 && (
            <span
              className={`w-5 h-5 text-xs font-semibold rounded-full flex items-center justify-center ${countBadgeClass}`}
            >
              <span className="mt-1">{selectedCount}</span>
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-wrap gap-2 pb-4 px-1">
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option)
            const displayText = translateOption ? translateOption(option) : option
            return (
              <button
                key={option}
                onClick={() => onSelect(category, option)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  isSelected
                    ? selectedBadgeClass
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {displayText}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const emptyFilters: FilterState = {
  geographicOrigin: [],
  musicalStyle: [],
  language: [],
  theme: [],
  targetAudience: [],
  difficultyLevel: [],
}

export default function FilterModal({
  isOpen,
  onClose,
  initialFilters = emptyFilters,
  songs = [],
}: FilterModalProps) {
  const { language, t } = useLanguage()
  const { translateLookup } = useLookupStore()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [expandedSections, setExpandedSections] = useState<Set<FilterCategory>>(
    new Set(["geographicOrigin"]),
  )
  const modalRef = useRef<HTMLDivElement>(null)

  // Compute available filter options based on songs
  const availableOptions = useMemo(() => computeAvailableOptions(songs), [songs])

  // Helper to translate filter option based on category
  const translateOption = (option: string, category: FilterCategory): string => {
    if (language === 'fr') return option

    switch (category) {
      case 'geographicOrigin':
        return translateRegion(option, 'fr', 'en')
      case 'musicalStyle':
        return translateLookup(option, 'genres', language)
      case 'language':
        return translateLookup(option, 'languages', language)
      case 'theme':
        return translateLookup(option, 'themes', language)
      case 'targetAudience':
        return translateLookup(option, 'audiences', language)
      case 'difficultyLevel':
        return translateLookup(option, 'difficultyLevels', language)
      default:
        return option
    }
  }

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters)
    }
  }, [isOpen, initialFilters])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose(filters)
    }
  }

  const toggleSection = (section: FilterCategory) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const handleSelect = (category: FilterCategory, option: string) => {
    setFilters((prev) => {
      const currentOptions = prev[category]
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter((o) => o !== option)
        : [...currentOptions, option]
      return { ...prev, [category]: newOptions }
    })
  }

  const clearAllFilters = () => {
    setFilters(emptyFilters)
  }

  const handleValidate = () => {
    onClose(filters)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-800">{t('filterTitle')}</h2>
          <button
            onClick={() => onClose(filters)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto px-6">
          {availableOptions.geographicOrigin.length > 0 && (
            <FilterSection
              icon={<Globe className="w-5 h-5" />}
              title={t('geographicOrigin')}
              category="geographicOrigin"
              options={availableOptions.geographicOrigin}
              selectedOptions={filters.geographicOrigin}
              isExpanded={expandedSections.has("geographicOrigin")}
              onToggle={() => toggleSection("geographicOrigin")}
              onSelect={handleSelect}
              colorClass="text-blue-700"
              selectedBadgeClass="ring-2 ring-inset ring-blue-700 text-blue-700 bg-blue-50"
              countBadgeClass="text-blue-700 bg-blue-100"
              translateOption={(opt) => translateOption(opt, 'geographicOrigin')}
            />
          )}
          {availableOptions.musicalStyle.length > 0 && (
            <FilterSection
              icon={<Music className="w-5 h-5" />}
              title={t('musicalStyle')}
              category="musicalStyle"
              options={availableOptions.musicalStyle}
              selectedOptions={filters.musicalStyle}
              isExpanded={expandedSections.has("musicalStyle")}
              onToggle={() => toggleSection("musicalStyle")}
              onSelect={handleSelect}
              colorClass="text-purple-700"
              selectedBadgeClass="ring-2 ring-inset ring-purple-700 text-purple-700 bg-purple-50"
              countBadgeClass="text-purple-700 bg-purple-100"
              translateOption={(opt) => translateOption(opt, 'musicalStyle')}
            />
          )}
          {availableOptions.language.length > 0 && (
            <FilterSection
              icon={<MessageCircle className="w-5 h-5" />}
              title={t('originalLanguage')}
              category="language"
              options={availableOptions.language}
              selectedOptions={filters.language}
              isExpanded={expandedSections.has("language")}
              onToggle={() => toggleSection("language")}
              onSelect={handleSelect}
              colorClass="text-green-700"
              selectedBadgeClass="ring-2 ring-inset ring-green-700 text-green-700 bg-green-50"
              countBadgeClass="text-green-700 bg-green-100"
              translateOption={(opt) => translateOption(opt, 'language')}
            />
          )}
          {availableOptions.theme.length > 0 && (
            <FilterSection
              icon={<Sparkles className="w-5 h-5" />}
              title={t('theme')}
              category="theme"
              options={availableOptions.theme}
              selectedOptions={filters.theme}
              isExpanded={expandedSections.has("theme")}
              onToggle={() => toggleSection("theme")}
              onSelect={handleSelect}
              colorClass="text-rose-700"
              selectedBadgeClass="ring-2 ring-inset ring-rose-700 text-rose-700 bg-rose-50"
              countBadgeClass="text-rose-700 bg-rose-100"
              translateOption={(opt) => translateOption(opt, 'theme')}
            />
          )}
          {availableOptions.targetAudience.length > 0 && (
            <FilterSection
              icon={<Users className="w-5 h-5" />}
              title={t('targetAudience')}
              category="targetAudience"
              options={availableOptions.targetAudience}
              selectedOptions={filters.targetAudience}
              isExpanded={expandedSections.has("targetAudience")}
              onToggle={() => toggleSection("targetAudience")}
              onSelect={handleSelect}
              colorClass="text-orange-700"
              selectedBadgeClass="ring-2 ring-inset ring-orange-700 text-orange-700 bg-orange-50"
              countBadgeClass="text-orange-700 bg-orange-100"
              translateOption={(opt) => translateOption(opt, 'targetAudience')}
            />
          )}
          {availableOptions.difficultyLevel.length > 0 && (
            <FilterSection
              icon={<Layers className="w-5 h-5" />}
              title={t('difficultyLevel')}
              category="difficultyLevel"
              options={availableOptions.difficultyLevel}
              selectedOptions={filters.difficultyLevel}
              isExpanded={expandedSections.has("difficultyLevel")}
              onToggle={() => toggleSection("difficultyLevel")}
              onSelect={handleSelect}
              colorClass="text-amber-700"
              selectedBadgeClass="ring-2 ring-inset ring-amber-700 text-amber-700 bg-amber-50"
              countBadgeClass="text-amber-700 bg-amber-100"
              translateOption={(opt) => translateOption(opt, 'difficultyLevel')}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col md:flex-row gap-3 p-6 pt-4 border-t border-gray-100">
          <button
            onClick={clearAllFilters}
            className="flex-1 flex items-center justify-center px-6 py-2 bg-gray-100 rounded-xl text-gray-500 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            <span className="pt-0.5">{t('clearAllFilters')}</span>
          </button>
          <button
            onClick={handleValidate}
            className="flex-1 flex items-center justify-center px-6 py-2 bg-blue-500 rounded-xl text-white font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <span className="pt-0.5">{t('validateFilters')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
