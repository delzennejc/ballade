import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import ContentSection from './ContentSection';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
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

  const currentTranslation =
    translations.find((t) => t.languageCode === selectedLanguage) ||
    translations[0];

  const languageOptions: DropdownOption[] = translations.map((translation) => ({
    id: translation.languageCode,
    label: translation.language,
  }));

  const headerActions = (
    <>
      {translations.length > 1 && (
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
