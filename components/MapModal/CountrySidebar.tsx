import { X, Music } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Song } from '@/types/song'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLookupStore } from '@/store/useLookupStore'
import { translateCountry } from '@/data/geography'

interface CountrySidebarProps {
  country: string | null
  songs: Song[]
  onClose: () => void
}

export default function CountrySidebar({
  country,
  songs,
  onClose,
}: CountrySidebarProps) {
  const { language, t } = useLanguage()
  const { translateLookup } = useLookupStore()

  if (!country) return null

  // Translate country name if in English mode
  const displayCountry = language === 'en' ? translateCountry(country, 'fr', 'en') : country

  // Helper to get song count text
  const songCountText = songs.length === 1 ? t('song') : t('songs')

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`
          hidden md:flex flex-col
          w-80 border-r border-gray-100 bg-white
          transform transition-transform duration-300
          ${country ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">{displayCountry}</h3>
            <p className="text-sm text-gray-500">
              {songs.length} {songCountText}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('close')}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/song/${song.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {song.thumbnail ? (
                  <Image
                    src={song.thumbnail}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {song.title}
                </p>
                {song.metadata?.genres && song.metadata.genres.length > 0 && (
                  <p className="text-sm text-gray-500 truncate">
                    {song.metadata.genres.map(g => translateLookup(g, 'genres', language)).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-10
          bg-white rounded-t-2xl shadow-lg
          transform transition-transform duration-300
          ${country ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ maxHeight: '60vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">{displayCountry}</h3>
            <p className="text-sm text-gray-500">
              {songs.length} {songCountText}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('close')}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Song List */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 80px)' }}>
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/song/${song.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {song.thumbnail ? (
                  <Image
                    src={song.thumbnail}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {song.title}
                </p>
                {song.metadata?.genres && song.metadata.genres.length > 0 && (
                  <p className="text-sm text-gray-500 truncate">
                    {song.metadata.genres.map(g => translateLookup(g, 'genres', language)).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
