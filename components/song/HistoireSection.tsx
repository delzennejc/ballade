import ContentSection from './ContentSection';

interface HistoireSectionProps {
  history: string;
}

export default function HistoireSection({ history }: HistoireSectionProps) {
  return (
    <ContentSection
      title="Histoire"
      headerImage="/histoire-header.png"
      headerColor="bg-teal-500"
    >
      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
        {history || 'Histoire non disponible'}
      </div>
    </ContentSection>
  );
}
