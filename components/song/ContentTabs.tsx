import { useSongStore } from "@/store/songStore"
import { ContentTab } from "@/types/song"
import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { TranslationKey } from "@/data/translations"

interface TabConfig {
  id: ContentTab
  labelKey: TranslationKey
}

const tabConfigs: TabConfig[] = [
  { id: "paroles", labelKey: "lyrics" },
  { id: "scores", labelKey: "sheets" },
  { id: "traductions", labelKey: "translations" },
  { id: "histoire", labelKey: "history" },
]

interface ContentTabsProps {
  availableTabs: ContentTab[]
}

export default function ContentTabs({ availableTabs }: ContentTabsProps) {
  const { t } = useLanguage()
  const { selectedTabs, toggleTab } = useSongStore()

  const tabs = tabConfigs.filter((tab) => availableTabs.includes(tab.id))

  if (tabs.length === 0) return null

  return (
    <div className="mb-3 md:mb-6">
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 rounded-2xl md:w-fit">
        {tabs.map((tab) => {
          const isSelected = selectedTabs.includes(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => toggleTab(tab.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full font-medium text-base md:text-base transition-all ${
                isSelected
                  ? "bg-[#3D5A73] text-white"
                  : "text-[#466387] hover:bg-slate-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  isSelected ? "bg-white" : "border-2 border-[#466387]"
                }`}
              >
                {isSelected && (
                  <Check className="w-3 h-3 text-[#3D5A73]" />
                )}
              </div>
              <span className="mt-0.5">{t(tab.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
