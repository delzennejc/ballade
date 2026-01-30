import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import SongHeader from '@/components/song/SongHeader';
import AudioPlayer from '@/components/song/AudioPlayer';
import ContentTabs from '@/components/song/ContentTabs';
import LyricsSection from '@/components/song/LyricsSection';
import TranslationsSection from '@/components/song/TranslationsSection';
import { useSongStore } from '@/store/songStore';
import { useSongsDataStore } from '@/store/useSongsDataStore';
import { ContentTab, Song } from '@/types/song';

function getAvailableTabs(song: Song | null): ContentTab[] {
  if (!song) return [];

  const available: ContentTab[] = [];

  // Paroles: has lyrics with text
  if (song.lyrics?.some((l) => l.text?.trim())) {
    available.push('paroles');
  }

  // Scores: has scores with PDF
  if (song.scores?.some((m) => m.pdf?.trim())) {
    available.push('scores');
  }

  // Traductions: has lyrics with translations
  if (song.lyrics?.some((l) => l.translations?.some((t) => t.text?.trim()))) {
    available.push('traductions');
  }

  // Histoire: has history with PDF
  if (song.history?.some((h) => h.pdf?.trim())) {
    available.push('histoire');
  }

  return available;
}

// Dynamic imports to avoid SSR issues
const ScoresSection = dynamic(
  () => import('@/components/song/ScoresSection'),
  { ssr: false }
);

const HistorySection = dynamic(
  () => import('@/components/song/HistorySection'),
  { ssr: false }
);

export default function SongPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { selectedTabs, resetState, setSelectedTabs, setSelectedAudio, selectedVersionId } = useSongStore();
  const { currentSong: song, isLoading, error, fetchSongBySlug, clearCurrentSong } = useSongsDataStore();

  // Calculate available tabs based on song content
  const availableTabs = useMemo(() => getAvailableTabs(song), [song]);

  // Set initial selected tab to first available tab when song loads
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(selectedTabs[0])) {
      setSelectedTabs([availableTabs[0]]);
    }
  }, [availableTabs, selectedTabs, setSelectedTabs]);

  // Set initial audio track and version when song loads
  useEffect(() => {
    if (song?.audioTracks?.length && !selectedVersionId) {
      const firstTrack = song.audioTracks[0];
      if (firstTrack.versions?.length) {
        setSelectedAudio(firstTrack.track, firstTrack.versions[0].id);
      }
    }
  }, [song, selectedVersionId, setSelectedAudio]);

  // Fetch song when slug changes
  useEffect(() => {
    if (typeof slug === 'string') {
      fetchSongBySlug(slug);
    }
  }, [slug, fetchSongBySlug]);

  // Reset state when navigating to a new song
  useEffect(() => {
    return () => {
      resetState();
      clearCurrentSong();
    };
  }, [slug, resetState, clearCurrentSong]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <main className="flex-1 flex items-center justify-center bg-blue-50">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-200"></div>
              <p className="text-slate-600">Chargement...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <main className="flex-1 flex items-center justify-center bg-blue-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Erreur
            </h1>
            <p className="text-slate-600">{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not found state
  if (!song) {
    return (
      <>
        <main className="flex-1 flex items-center justify-center bg-blue-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Chanson non trouvée
            </h1>
            <p className="text-slate-600">
              La chanson que vous recherchez n&apos;existe pas.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Always use 2-column grid - content sections max out at half width
  const getGridClass = () => {
    return 'grid-cols-1 md:grid-cols-2';
  };

  return (
    <>
      <main className="flex-1 bg-blue-50 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Song Header */}
          <SongHeader song={song} />

          {/* Audio Player - only show if there are audio tracks */}
          {song.audioTracks?.length > 0 && (
            <AudioPlayer audioTracks={song.audioTracks} />
          )}

          {/* Content Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            {/* Content Tabs */}
            <ContentTabs availableTabs={availableTabs} />

            {/* Content Sections - rendered in selection order */}
            <div className={`grid ${getGridClass()} gap-6`}>
              {selectedTabs.filter((tab) => availableTabs.includes(tab)).map((tab) => {
                switch (tab) {
                  case 'paroles':
                    return <LyricsSection key={tab} lyrics={song.lyrics} />;
                  case 'scores':
                    return <ScoresSection key={tab} scores={song.scores} />;
                  case 'traductions':
                    return <TranslationsSection key={tab} lyrics={song.lyrics} />;
                  case 'histoire':
                    return <HistorySection key={tab} history={song.history} />;
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
