import { useState, useEffect, useRef } from "react"
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

export interface FilterState {
  geographicOrigin: string[]
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
}

const FILTER_DATA = {
  geographicOrigin: [
    "Afrique du Nord",
    "Afrique de l'Ouest",
    "Afrique de l'Est",
    "Afrique Australe",
    "Afrique Centrale",
    "Amérique du Nord",
    "Amérique Centrale",
    "Amérique du Sud",
    "Asie de l'Ouest",
    "Asie Centrale",
    "Europe de l'Ouest",
    "Europe de l'Est",
    "Europe du Nord-Ouest",
    "Europe du Nord",
    "Europe du Nord-Est",
    "Europe du Sud-Ouest",
    "Europe du Sud-Est",
    "Europe du Sud",
  ],
  musicalStyle: [
    "Traditionnel",
    "Folk",
    "Classique",
    "Populaire",
    "Berceuse",
    "Comptine",
    "Chant de travail",
    "Chant religieux",
  ],
  language: [
    "Albanais",
    "Allemand",
    "Alsacien",
    "Anglais",
    "Arabe",
    "Arapaho",
    "Arménien",
    "BCMS",
    "Brésilien indigène",
    "Bulgare",
    "Chechen",
    "Espagnol",
    "Farsi",
    "Français",
    "Gaélique",
    "Gascon",
    "Géorgien",
    "Grec",
    "Hongrois",
    "Italien",
    "Kurde",
    "Ladino",
    "Letton",
    "Lingala",
    "Macédonien",
    "Maori",
    "Néerlandais",
    "Polonais",
    "Portugais",
    "Romani",
    "Roumain",
    "Russe",
    "Suédois",
    "Swahili",
    "Turc",
    "Ukrainien",
    "Wolof",
    "Yiddish",
    "Zulu",
  ],
  theme: [
    "Amour",
    "Nature",
    "Fête",
    "Voyage",
    "Histoire",
    "Enfance",
    "Travail",
    "Liberté",
  ],
  targetAudience: [
    "Enfants",
    "Adolescents",
    "Adultes",
    "Tous publics",
    "Scolaire",
    "Famille",
  ],
  difficultyLevel: ["Débutant", "Intermédiaire", "Avancé"],
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
                {option}
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
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [expandedSections, setExpandedSections] = useState<Set<FilterCategory>>(
    new Set(["geographicOrigin"]),
  )
  const modalRef = useRef<HTMLDivElement>(null)

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
      className="fixed inset-0 z-50 flex items-center justify-center"
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
          <h2 className="text-xl font-semibold text-gray-800">Filtres</h2>
          <button
            onClick={() => onClose(filters)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto px-6">
          <FilterSection
            icon={<Globe className="w-5 h-5" />}
            title="Origine géographique"
            category="geographicOrigin"
            options={FILTER_DATA.geographicOrigin}
            selectedOptions={filters.geographicOrigin}
            isExpanded={expandedSections.has("geographicOrigin")}
            onToggle={() => toggleSection("geographicOrigin")}
            onSelect={handleSelect}
            colorClass="text-blue-700"
            selectedBadgeClass="border-2 border-blue-700 text-blue-700 bg-blue-50"
            countBadgeClass="text-blue-700 bg-blue-100"
          />
          <FilterSection
            icon={<Music className="w-5 h-5" />}
            title="Style musical"
            category="musicalStyle"
            options={FILTER_DATA.musicalStyle}
            selectedOptions={filters.musicalStyle}
            isExpanded={expandedSections.has("musicalStyle")}
            onToggle={() => toggleSection("musicalStyle")}
            onSelect={handleSelect}
            colorClass="text-purple-700"
            selectedBadgeClass="border-2 border-purple-700 text-purple-700 bg-purple-50"
            countBadgeClass="text-purple-700 bg-purple-100"
          />
          <FilterSection
            icon={<MessageCircle className="w-5 h-5" />}
            title="Langue d'origine"
            category="language"
            options={FILTER_DATA.language}
            selectedOptions={filters.language}
            isExpanded={expandedSections.has("language")}
            onToggle={() => toggleSection("language")}
            onSelect={handleSelect}
            colorClass="text-green-700"
            selectedBadgeClass="border-2 border-green-700 text-green-700 bg-green-50"
            countBadgeClass="text-green-700 bg-green-100"
          />
          <FilterSection
            icon={<Sparkles className="w-5 h-5" />}
            title="Thème"
            category="theme"
            options={FILTER_DATA.theme}
            selectedOptions={filters.theme}
            isExpanded={expandedSections.has("theme")}
            onToggle={() => toggleSection("theme")}
            onSelect={handleSelect}
            colorClass="text-rose-700"
            selectedBadgeClass="border-2 border-rose-700 text-rose-700 bg-rose-50"
            countBadgeClass="text-rose-700 bg-rose-100"
          />
          <FilterSection
            icon={<Users className="w-5 h-5" />}
            title="Bénéficiaires / Public cible"
            category="targetAudience"
            options={FILTER_DATA.targetAudience}
            selectedOptions={filters.targetAudience}
            isExpanded={expandedSections.has("targetAudience")}
            onToggle={() => toggleSection("targetAudience")}
            onSelect={handleSelect}
            colorClass="text-orange-700"
            selectedBadgeClass="border-2 border-orange-700 text-orange-700 bg-orange-50"
            countBadgeClass="text-orange-700 bg-orange-100"
          />
          <FilterSection
            icon={<Layers className="w-5 h-5" />}
            title="Niveau de difficulté"
            category="difficultyLevel"
            options={FILTER_DATA.difficultyLevel}
            selectedOptions={filters.difficultyLevel}
            isExpanded={expandedSections.has("difficultyLevel")}
            onToggle={() => toggleSection("difficultyLevel")}
            onSelect={handleSelect}
            colorClass="text-amber-700"
            selectedBadgeClass="border-2 border-amber-700 text-amber-700 bg-amber-50"
            countBadgeClass="text-amber-700 bg-amber-100"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 p-6 pt-4 border-t border-gray-100">
          <button
            onClick={clearAllFilters}
            className="flex-1 flex items-center justify-center px-6 py-1 bg-gray-100 rounded-xl text-gray-500 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            <span className="pt-0.5">Supprimer tous les filtres</span>
          </button>
          <button
            onClick={handleValidate}
            className="flex-1 flex items-center justify-center px-6 py-1 bg-blue-500 rounded-xl text-white font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <span className="pt-0.5">Valider les filtres</span>
          </button>
        </div>
      </div>
    </div>
  )
}
