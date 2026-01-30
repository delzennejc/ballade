import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Share2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ActionMenuProps {
  onShare: () => void
}

export default function ActionMenu({ onShare }: ActionMenuProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleShare = () => {
    setIsOpen(false)
    onShare()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10 min-w-36 py-1">
          <button
            onClick={handleShare}
            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('share')}</span>
          </button>
        </div>
      )}
    </div>
  )
}
