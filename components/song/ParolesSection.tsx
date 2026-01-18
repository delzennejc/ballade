import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import ContentSection from './ContentSection';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import { LyricsVersion } from '@/types/song';

interface ParolesSectionProps {
  lyrics: LyricsVersion[];
}

export default function ParolesSection({ lyrics }: ParolesSectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    lyrics[0]?.languageCode || 'fr'
  );

  const currentLyrics =
    lyrics.find((l) => l.languageCode === selectedLanguage) || lyrics[0];

  const languageOptions: DropdownOption[] = lyrics.map((lyric) => ({
    id: lyric.languageCode,
    label: lyric.language,
  }));

  const headerActions = (
    <>
      {lyrics.length > 1 && (
        <Dropdown
          options={languageOptions}
          selectedId={selectedLanguage}
          onSelect={(id) => setSelectedLanguage(id)}
          align="right"
        />
      )}
      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </>
  );

  return (
    <ContentSection
      title="Paroles"
      headerImage="/parole-header.svg"
      headerActions={headerActions}
    >
      {/* Lyrics content */}
      <div className="whitespace-pre-wrap text-slate-700 text-[22px] leading-[32px]">
        {currentLyrics?.text || 'Paroles non disponibles'}
      </div>
    </ContentSection>
  );
}
