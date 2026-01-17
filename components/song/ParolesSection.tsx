import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ContentSection from './ContentSection';
import { LyricsVersion } from '@/types/song';

interface ParolesSectionProps {
  lyrics: LyricsVersion[];
}

export default function ParolesSection({ lyrics }: ParolesSectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    lyrics[0]?.languageCode || 'fr'
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const currentLyrics =
    lyrics.find((l) => l.languageCode === selectedLanguage) || lyrics[0];

  return (
    <ContentSection
      title="Paroles"
      headerImage="/parole-header.png"
      headerColor="bg-red-500"
    >
      {/* Language selector */}
      {lyrics.length > 1 && (
        <div className="relative mb-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
          >
            {currentLyrics?.language || 'Langue'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-32">
              {lyrics.map((lyric) => (
                <button
                  key={lyric.languageCode}
                  onClick={() => {
                    setSelectedLanguage(lyric.languageCode);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 first:rounded-t-lg last:rounded-b-lg ${
                    selectedLanguage === lyric.languageCode
                      ? 'bg-blue-50 text-blue-700'
                      : ''
                  }`}
                >
                  {lyric.language}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lyrics content */}
      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
        {currentLyrics?.text || 'Paroles non disponibles'}
      </div>
    </ContentSection>
  );
}
