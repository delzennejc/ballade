import { MoreVertical } from 'lucide-react';
import ContentSection from './ContentSection';

interface HistoireSectionProps {
  history: string;
}

export default function HistoireSection({ history }: HistoireSectionProps) {
  const headerActions = (
    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
      <MoreVertical className="w-5 h-5" />
    </button>
  );

  return (
    <ContentSection
      title="Histoire"
      headerImage="/histoire-header.svg"
      headerActions={headerActions}
    >
      <div className="whitespace-pre-wrap text-slate-700 text-[22px] leading-[32px]">
        {history || 'Histoire non disponible'}
      </div>
    </ContentSection>
  );
}
