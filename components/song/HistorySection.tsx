'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MoreVertical, ZoomIn, ZoomOut } from 'lucide-react';
import ContentSection from './ContentSection';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import { HistoryVersion } from '@/types/song';
import { useSongStore } from '@/store/songStore';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface HistorySectionProps {
  history: HistoryVersion[];
}

const DEFAULT_SCALE = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.05;

// Proxy Cloudinary URLs to avoid CORS issues
function getProxiedUrl(url: string): string {
  if (url.startsWith('https://res.cloudinary.com/')) {
    return `/api/proxy/pdf?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function HistorySection({ history }: HistorySectionProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  const { historyLanguage, setHistoryLanguage } = useSongStore();

  const isZoomed = scale > DEFAULT_SCALE;

  // Create language options from available history versions
  const languageOptions: DropdownOption[] = history.map((h) => ({
    id: h.languageCode,
    label: h.language,
  }));

  // Find the current history version based on selected language
  const currentHistory =
    history.find((h) => h.languageCode === historyLanguage) || history[0];

  // Get effective language (fallback to first available if selected not found)
  const effectiveLanguage = currentHistory?.languageCode || history[0]?.languageCode || 'fr';

  // Sync language if the selected one is not available
  useEffect(() => {
    if (history.length > 0 && !history.find((h) => h.languageCode === historyLanguage)) {
      setHistoryLanguage(history[0].languageCode);
    }
  }, [history, historyLanguage, setHistoryLanguage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed || !containerRef.current) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setScrollStart({
      x: containerRef.current.scrollLeft,
      y: containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    containerRef.current.scrollLeft = scrollStart.x - deltaX;
    containerRef.current.scrollTop = scrollStart.y - deltaY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const zoomIn = () => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE));
  const zoomOut = () => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE));
  const resetZoom = () => setScale(DEFAULT_SCALE);

  const titleActions = (
    <div className="flex items-center gap-1">
      <button
        onClick={zoomOut}
        disabled={scale <= MIN_SCALE}
        className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30"
        title="Zoom arrière"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button
        onClick={resetZoom}
        className="px-2 py-1 text-sm text-slate-500 hover:text-slate-700 transition-colors min-w-12"
        title="Réinitialiser le zoom"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        onClick={zoomIn}
        disabled={scale >= MAX_SCALE}
        className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30"
        title="Zoom avant"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
    </div>
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      {history.length > 1 && (
        <Dropdown
          options={languageOptions}
          selectedId={effectiveLanguage}
          onSelect={(id) => setHistoryLanguage(id)}
          align="right"
        />
      )}
      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!currentHistory?.pdf) {
    return (
      <ContentSection
        title="Histoire"
        headerImage="/histoire-header.svg"
        titleActions={titleActions}
        headerActions={headerActions}
      >
        <div className="text-slate-700 text-[22px] leading-8">
          Histoire non disponible
        </div>
      </ContentSection>
    );
  }

  const pageWidth = containerWidth ? containerWidth * scale : undefined;

  return (
    <ContentSection
      title="Histoire"
      headerImage="/histoire-header.svg"
      titleActions={titleActions}
      headerActions={headerActions}
    >
      <div
        ref={containerRef}
        className={`overflow-auto ${isZoomed ? (isDragging ? 'cursor-grabbing select-none' : 'cursor-grab') : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Document
          file={getProxiedUrl(currentHistory.pdf)}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500">Chargement...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">Erreur de chargement du PDF</div>
            </div>
          }
        >
          {numPages &&
            pageWidth &&
            Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={pageWidth}
                className="mb-4"
              />
            ))}
        </Document>
      </div>
    </ContentSection>
  );
}
