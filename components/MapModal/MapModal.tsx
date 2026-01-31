import { useState, useEffect, useRef, useMemo } from "react"
import { X } from "lucide-react"
import dynamic from "next/dynamic"
import { Song } from "@/types/song"
import { getCountryCoordinates } from "@/data/countryCoordinates"
import CountrySidebar from "./CountrySidebar"
import { useLanguage } from "@/contexts/LanguageContext"

// Loading component for MapView (moved outside to avoid hooks in dynamic import)
function MapLoading() {
  return (
    <div className="flex-1 bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  )
}

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <MapLoading />,
})

export interface CountryMarkerData {
  country: string
  coordinates: [number, number]
  songCount: number
}

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  songs: Song[]
}

function aggregateSongsByCountry(songs: Song[]): Map<string, Song[]> {
  const map = new Map<string, Song[]>()
  for (const song of songs) {
    for (const country of song.metadata?.countries || []) {
      if (!map.has(country)) {
        map.set(country, [])
      }
      map.get(country)!.push(song)
    }
  }
  return map
}

export default function MapModal({ isOpen, onClose, songs }: MapModalProps) {
  const { t } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Aggregate songs by country
  const countrySongsMap = useMemo(() => aggregateSongsByCountry(songs), [songs])

  // Create marker data for countries with songs
  const countryMarkers: CountryMarkerData[] = useMemo(() => {
    const markers: CountryMarkerData[] = []
    for (const [country, countrySongs] of countrySongsMap) {
      const coordinates = getCountryCoordinates(country)
      if (coordinates) {
        markers.push({
          country,
          coordinates,
          songCount: countrySongs.length,
        })
      }
    }
    return markers
  }, [countrySongsMap])

  // Get songs for selected country
  const selectedCountrySongs = selectedCountry
    ? countrySongsMap.get(selectedCountry) || []
    : []

  // Body scroll lock
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

  // Reset selected country when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCountry(null)
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
  }

  const handleCloseSidebar = () => {
    setSelectedCountry(null)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-[95vw] h-[90vh] max-w-7xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('songMap')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('close')}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content: Sidebar + Map */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (left) */}
          <CountrySidebar
            country={selectedCountry}
            songs={selectedCountrySongs}
            onClose={handleCloseSidebar}
            onModalClose={onClose}
          />

          {/* Map Container */}
          <div
            className={`flex-1 transition-all duration-300 ${
              selectedCountry ? "md:w-[70%]" : "w-full"
            }`}
          >
            <MapView
              countryMarkers={countryMarkers}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
