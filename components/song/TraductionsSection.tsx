import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ContentSection from './ContentSection';
import { TranslationVersion } from '@/types/song';

interface TraductionsSectionProps {
  translations: TranslationVersion[];
}

export default function TraductionsSection({
  translations,
}: TraductionsSectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    translations[0]?.languageCode || 'en'
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const currentTranslation =
    translations.find((t) => t.languageCode === selectedLanguage) ||
    translations[0];

  return (
    <ContentSection
      title="Traductions"
      headerImage="/traduction-header.png"
      headerColor="bg-gray-500"
    >
      {/* Language selector */}
      {translations.length > 1 && (
        <div className="relative mb-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
          >
            {currentTranslation?.language || 'Langue'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-32">
              {translations.map((translation) => (
                <button
                  key={translation.languageCode}
                  onClick={() => {
                    setSelectedLanguage(translation.languageCode);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 first:rounded-t-lg last:rounded-b-lg ${
                    selectedLanguage === translation.languageCode
                      ? 'bg-blue-50 text-blue-700'
                      : ''
                  }`}
                >
                  {translation.language}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Translation content */}
      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
        {currentTranslation?.text || 'Traduction non disponible'}
      </div>
    </ContentSection>
  );
}
