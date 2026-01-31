import { X, Music } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Song } from '@/types/song'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLookupStore } from '@/store/useLookupStore'
import { translateCountry } from '@/data/geography'

interface CountrySidebarProps {
  country: string | null
  songs: Song[]
  onClose: () => void
  onModalClose: () => void
}

export default function CountrySidebar({
  country,
  songs,
  onClose,
  onModalClose,
}: CountrySidebarProps) {
  const router = useRouter()
  const { language, t } = useLanguage()
  const { translateLookup } = useLookupStore()

  // Drag state for mobile bottom sheet
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef(0)
  const sheetHeight = useRef(0)

  // Reset drag state when country changes
  useEffect(() => {
    setDragOffset(0)
    setIsDragging(false)
  }, [country])

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true)
    dragStartY.current = clientY
    if (sheetRef.current) {
      sheetHeight.current = sheetRef.current.offsetHeight
    }
  }, [])

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return
    const delta = clientY - dragStartY.current
    // Only allow dragging down (positive delta)
    setDragOffset(Math.max(0, delta))
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // If dragged more than 30% of sheet height, animate down then close
    const threshold = sheetHeight.current * 0.3
    if (dragOffset > threshold) {
      // Animate to full height (off screen)
      setDragOffset(sheetHeight.current)
      // Close after animation completes
      setTimeout(() => {
        onClose()
        setDragOffset(0)
      }, 300)
    } else {
      setDragOffset(0)
    }
  }, [isDragging, dragOffset, onClose])

  // Touch event handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY)
  }, [handleDragStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY)
  }, [handleDragMove])

  const onTouchEnd = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  // Mouse event handlers (for desktop testing)
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientY)
  }, [handleDragStart])

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY)
    }

    const onMouseUp = () => {
      handleDragEnd()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Handle song click - animate drawer down, close modal, navigate
  const handleSongClick = useCallback((slug: string) => {
    // Animate drawer down
    if (sheetRef.current) {
      setDragOffset(sheetRef.current.offsetHeight)
    }
    // After animation, close modal and navigate
    setTimeout(() => {
      onModalClose()
      router.push(`/song/${slug}`)
    }, 300)
  }, [onModalClose, router])

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
            <button
              key={song.id}
              onClick={() => {
                onModalClose()
                router.push(`/song/${song.slug}`)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
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
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-1000
          bg-white rounded-t-3xl shadow-lg
          transform
          ${!isDragging ? 'transition-transform duration-300' : ''}
          ${country ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          maxHeight: '50vh',
          transform: country ? `translateY(${dragOffset}px)` : 'translateY(100%)',
        }}
      >
        {/* Handle - draggable area */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
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
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(50vh - 80px)' }}>
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSongClick(song.slug)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
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
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
