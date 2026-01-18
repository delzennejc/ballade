import { useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import ContentSection from './ContentSection';

interface PartitionsSectionProps {
  sheetMusic: string;
}

export default function PartitionsSection({
  sheetMusic,
}: PartitionsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamic import to avoid SSR issues
    import('abcjs').then((ABCJS) => {
      if (containerRef.current) {
        ABCJS.renderAbc(containerRef.current, sheetMusic, {
          responsive: 'resize',
          add_classes: true,
        });
      }
    });
  }, [sheetMusic]);

  const headerActions = (
    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
      <MoreVertical className="w-5 h-5" />
    </button>
  );

  return (
    <ContentSection
      title="Partitions"
      headerImage="/partition-header.svg"
      headerActions={headerActions}
    >
      <div
        ref={containerRef}
        className="overflow-x-auto"
        style={{ minHeight: '200px' }}
      />
    </ContentSection>
  );
}
