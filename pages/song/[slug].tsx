import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import SongHeader from '@/components/song/SongHeader';
import AudioPlayer from '@/components/song/AudioPlayer';
import ContentTabs from '@/components/song/ContentTabs';
import ParolesSection from '@/components/song/ParolesSection';
import TraductionsSection from '@/components/song/TraductionsSection';
import { getSongBySlug } from '@/lib/mockData';
import { useSongStore } from '@/store/songStore';

// Dynamic imports to avoid SSR issues
const PartitionsSection = dynamic(
  () => import('@/components/song/PartitionsSection'),
  { ssr: false }
);

const HistoireSection = dynamic(
  () => import('@/components/song/HistoireSection'),
  { ssr: false }
);

export default function SongPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { selectedTabs, resetState } = useSongStore();

  const song = typeof slug === 'string' ? getSongBySlug(slug) : undefined;

  // Reset state when navigating to a new song
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [slug, resetState]);

  if (!song) {
    return (
      <div className="flex min-h-screen bg-white font-league">
        <SidebarWrapper />
        <div className="flex-1 flex flex-col">
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
        </div>
      </div>
    );
  }

  // Always use 2-column grid - content sections max out at half width
  const getGridClass = () => {
    return 'grid-cols-1 md:grid-cols-2';
  };

  return (
    <div className="flex min-h-screen bg-white font-league">
      <SidebarWrapper />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-blue-50 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Song Header */}
            <SongHeader song={song} />

            {/* Audio Player */}
            <AudioPlayer audioTracks={song.audioTracks} />

            {/* Content Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              {/* Content Tabs */}
              <ContentTabs />

              {/* Content Sections - rendered in selection order */}
              <div className={`grid ${getGridClass()} gap-6`}>
                {selectedTabs.map((tab) => {
                  switch (tab) {
                    case 'paroles':
                      return <ParolesSection key={tab} lyrics={song.lyrics} />;
                    case 'partitions':
                      return <PartitionsSection key={tab} musicSheet={song.musicSheet} />;
                    case 'traductions':
                      return <TraductionsSection key={tab} translations={song.translations} />;
                    case 'histoire':
                      return <HistoireSection key={tab} history={song.history} />;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Wrapper component for Sidebar to handle state
function SidebarWrapper() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Sidebar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
}
