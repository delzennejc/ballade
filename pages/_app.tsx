import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useSongsDataStore } from "@/store/useSongsDataStore";
import { useLookupStore } from "@/store/useLookupStore";
import { useFocusedViewStore } from "@/store/useFocusedViewStore";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { MapModal } from "@/components/MapModal";
import CookieConsent from "@/components/CookieConsent";

export default function App({ Component, pageProps }: AppProps) {
  const { songs, fetchSongs } = useSongsDataStore();
  const { fetchLookups } = useLookupStore();
  const focusedView = useFocusedViewStore((state) => state.focusedView);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Fetch songs and lookups once when the app loads
  useEffect(() => {
    if (songs.length === 0) {
      fetchSongs();
    }
    fetchLookups();
  }, [songs.length, fetchSongs, fetchLookups]);

  return (
    <LanguageProvider>
      <div className="flex min-h-dvh bg-white font-league">
        {!focusedView && <Sidebar className="hidden md:flex" />}
        <div className="flex-1 flex flex-col">
          <Component {...pageProps} />
        </div>
        {!focusedView && <BottomNav onMapClick={() => setIsMapModalOpen(true)} />}
      </div>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        songs={songs}
      />
      <CookieConsent />
    </LanguageProvider>
  );
}
