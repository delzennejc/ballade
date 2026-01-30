import { useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import ContentSection from './ContentSection';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import { LyricsVersion } from '@/types/song';
import { useSongStore } from '@/store/songStore';

interface LyricsSectionProps {
  lyrics: LyricsVersion[];
}

export default function LyricsSection({ lyrics }: LyricsSectionProps) {
  const { lyricsLanguage, setLyricsLanguage } = useSongStore();

  // Use store value if available in lyrics, otherwise fallback to first available
  const effectiveLanguage = lyrics.find((l) => l.languageCode === lyricsLanguage)
    ? lyricsLanguage
    : lyrics[0]?.languageCode || '';

  // Sync store with effective language on mount or when lyrics change
  useEffect(() => {
    if (effectiveLanguage && effectiveLanguage !== lyricsLanguage) {
      setLyricsLanguage(effectiveLanguage);
    }
  }, [effectiveLanguage, lyricsLanguage, setLyricsLanguage]);

  const currentLyrics =
    lyrics.find((l) => l.languageCode === effectiveLanguage) || lyrics[0];

  const languageOptions: DropdownOption[] = lyrics.map((lyric) => ({
    id: lyric.languageCode,
    label: lyric.language,
  }));

  const headerActions = (
    <>
      {lyrics.length > 1 && (
        <Dropdown
          options={languageOptions}
          selectedId={effectiveLanguage}
          onSelect={(id) => setLyricsLanguage(id)}
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
