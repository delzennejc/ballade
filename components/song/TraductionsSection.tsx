import { useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import ContentSection from './ContentSection';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import { LyricsVersion } from '@/types/song';
import { useSongStore } from '@/store/songStore';

interface TraductionsSectionProps {
  lyrics: LyricsVersion[];
}

export default function TraductionsSection({
  lyrics,
}: TraductionsSectionProps) {
  const { lyricsLanguage, translationLanguage, setTranslationLanguage } =
    useSongStore();

  // Find the currently selected lyrics to get its translations
  const currentLyrics =
    lyrics.find((l) => l.languageCode === lyricsLanguage) || lyrics[0];
  const availableTranslations = currentLyrics?.translations || [];

  // Use store value if available in translations, otherwise fallback to first available
  const effectiveLanguage = availableTranslations.find(
    (t) => t.languageCode === translationLanguage
  )
    ? translationLanguage
    : availableTranslations[0]?.languageCode || '';

  // Sync store with effective language when translations change
  useEffect(() => {
    if (effectiveLanguage && effectiveLanguage !== translationLanguage) {
      setTranslationLanguage(effectiveLanguage);
    }
  }, [effectiveLanguage, translationLanguage, setTranslationLanguage]);

  const currentTranslation =
    availableTranslations.find((t) => t.languageCode === effectiveLanguage) ||
    availableTranslations[0];

  const languageOptions: DropdownOption[] = availableTranslations.map(
    (translation) => ({
      id: translation.languageCode,
      label: translation.language,
    })
  );

  // Handle empty state when no translations available for selected lyrics
  if (availableTranslations.length === 0) {
    return (
      <ContentSection
        title="Traductions"
        headerImage="/traduction-header.svg"
        headerActions={
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        }
      >
        <div className="text-slate-500 italic">
          Aucune traduction disponible pour cette version des paroles
        </div>
      </ContentSection>
    );
  }

  const headerActions = (
    <>
      {availableTranslations.length > 1 && (
        <Dropdown
          options={languageOptions}
          selectedId={effectiveLanguage}
          onSelect={(id) => setTranslationLanguage(id)}
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
      title="Traductions"
      headerImage="/traduction-header.svg"
      headerActions={headerActions}
    >
      {/* Translation content */}
      <div className="whitespace-pre-wrap text-slate-700 text-[22px] leading-[32px]">
        {currentTranslation?.text || 'Traduction non disponible'}
      </div>
    </ContentSection>
  );
}
