'use client'

import { createContext, useContext, useCallback, useSyncExternalStore, ReactNode } from 'react'
import { AppLanguage } from '@/data/geography'
import { translations, TranslationKey } from '@/data/translations'

const STORAGE_KEY = 'app-language'

interface LanguageContextType {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Storage subscription for useSyncExternalStore
let listeners: (() => void)[] = []

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

function getSnapshot(): AppLanguage {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'fr'
}

function getServerSnapshot(): AppLanguage {
  return 'fr'
}

function setStoredLanguage(lang: AppLanguage) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang)
    // Notify all listeners
    listeners.forEach(listener => listener())
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore to safely sync with localStorage
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setLanguage = useCallback((lang: AppLanguage) => {
    setStoredLanguage(lang)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
