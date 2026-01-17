import { useEffect, useRef } from 'react';
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

  return (
    <ContentSection
      title="Partitions"
      headerImage="/partition-header.png"
      headerColor="bg-blue-500"
    >
      <div
        ref={containerRef}
        className="overflow-x-auto"
        style={{ minHeight: '200px' }}
      />
    </ContentSection>
  );
}
