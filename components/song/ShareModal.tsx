import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

export default function ShareModal({ isOpen, onClose, url }: ShareModalProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Truncate URL for display
  const truncatedUrl = url.length > 35 ? url.substring(0, 35) + '...' : url

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
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-semibold text-gray-800">{t('share')}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center p-8">
          <QRCodeSVG
            value={url}
            size={200}
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Link Display */}
        <div className="px-6 pb-4 text-center">
          <span className="text-gray-600">{t('linkToShare')} </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 hover:underline"
            title={url}
          >
            {truncatedUrl}
          </a>
        </div>

        {/* Copy Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleCopyLink}
            className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {copied ? t('linkCopied') : t('copyLink')}
          </button>
        </div>
      </div>
    </div>
  )
}
