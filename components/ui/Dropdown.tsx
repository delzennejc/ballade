import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, ChevronLeft } from "lucide-react"

// Hook to detect if we're on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export interface DropdownOption {
  id: string
  label: string
  subOptions?: { id: string; label: string }[]
}

interface DropdownProps {
  options: DropdownOption[]
  selectedId: string
  selectedSubId?: string
  onSelect: (optionId: string, subOptionId?: string) => void
  displayValue?: string
  align?: "left" | "right"
}

export default function Dropdown({
  options,
  selectedId,
  selectedSubId,
  onSelect,
  displayValue,
  align = "right",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedOption, setExpandedOption] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setExpandedOption(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionId: string, subOptionId?: string) => {
    onSelect(optionId, subOptionId)
    setIsOpen(false)
    setExpandedOption(null)
  }

  // Get display value from selected option if not provided
  const getDisplayValue = () => {
    if (displayValue) return displayValue
    const selectedOption = options.find((o) => o.id === selectedId)
    if (!selectedOption) return ""

    if (selectedOption.subOptions && selectedSubId) {
      const subOption = selectedOption.subOptions.find((s) => s.id === selectedSubId)
      return subOption?.label || selectedOption.label
    }
    return selectedOption.label
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-4 py-1.5 bg-[#F4F7FA] rounded-lg text-base md:text-sm font-medium text-[#466387] hover:bg-slate-200 transition-colors"
      >
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span className="mt-0.5">{getDisplayValue()}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 bg-white rounded-lg shadow-lg z-10 w-56 md:w-auto md:min-w-40 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option, index) => {
            const hasSubOptions = option.subOptions && option.subOptions.length > 1
            const isExpanded = expandedOption === option.id
            const isSelected = selectedId === option.id
            const isFirst = index === 0
            const isLast = index === options.length - 1

            return (
              <div key={option.id} className={isMobile ? "" : "relative"}>
                <button
                  onClick={() => {
                    if (hasSubOptions) {
                      setExpandedOption(isExpanded ? null : option.id)
                    } else {
                      handleSelect(option.id, option.subOptions?.[0]?.id)
                    }
                  }}
                  className={`w-full px-4 py-2 md:py-1.5 text-base md:text-sm hover:bg-slate-50 flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-100 text-slate-700 font-medium"
                      : "text-[#466387]"
                  } ${isFirst ? "rounded-t-lg" : ""} ${isLast && !isExpanded ? "rounded-b-lg" : ""}`}
                >
                  <span className="w-4">
                    {hasSubOptions && isMobile && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {hasSubOptions && !isMobile && (
                      <ChevronLeft
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "-rotate-90" : ""
                        }`}
                      />
                    )}
                  </span>
                  <span>{option.label}</span>
                </button>

                {/* Submenu - below on mobile, left on desktop */}
                {hasSubOptions && isExpanded && (
                  <div
                    className={
                      isMobile
                        ? "bg-slate-50 rounded-lg pl-6 my-1"
                        : "absolute top-0 right-full mr-1 bg-white rounded-lg shadow-lg min-w-48"
                    }
                  >
                    {option.subOptions?.map((subOption, subIndex) => {
                      const isSubSelected =
                        isSelected && selectedSubId === subOption.id
                      const isSubFirst = subIndex === 0
                      const isSubLast = subIndex === (option.subOptions?.length ?? 0) - 1

                      return (
                        <button
                          key={subOption.id}
                          onClick={() => handleSelect(option.id, subOption.id)}
                          className={`w-full text-right px-4 py-2 md:py-1.5 text-base md:text-sm flex items-center justify-end gap-2 ${
                            isMobile ? "hover:bg-slate-100" : "hover:bg-slate-50"
                          } ${
                            isSubSelected
                              ? isMobile
                                ? "bg-slate-200 text-slate-700 font-medium"
                                : "bg-slate-100 text-slate-700 font-medium"
                              : "text-[#466387]"
                          } ${isSubFirst ? "rounded-t-lg" : ""} ${isSubLast ? "rounded-b-lg" : ""}`}
                        >
                          {subOption.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
