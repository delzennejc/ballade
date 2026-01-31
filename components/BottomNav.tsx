import { useRouter } from 'next/router'
import Link from 'next/link'
import { Home, Search, Map } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface BottomNavProps {
  onMapClick: () => void
}

export default function BottomNav({ onMapClick }: BottomNavProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }

  const navItems = [
    { id: 'home', label: t('home'), icon: Home, href: '/' },
    { id: 'search', label: t('search'), icon: Search, href: '/songs' },
    { id: 'map', label: t('map'), icon: Map, action: onMapClick },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-700 z-50 pb-[env(safe-area-inset-bottom)] rounded-t-2xl">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.href ? isActive(item.href.split('?')[0]) : false

          if (item.action) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active ? 'text-blue-300' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
