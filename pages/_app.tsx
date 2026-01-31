import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useSongsDataStore } from "@/store/useSongsDataStore";
import { useLookupStore } from "@/store/useLookupStore";
import { useFocusedViewStore } from "@/store/useFocusedViewStore";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import CookieConsent from "@/components/CookieConsent";

export default function App({ Component, pageProps }: AppProps) {
  const { songs, fetchSongs } = useSongsDataStore();
  const { fetchLookups } = useLookupStore();
  const focusedView = useFocusedViewStore((state) => state.focusedView);

  // Fetch songs and lookups once when the app loads
  useEffect(() => {
    if (songs.length === 0) {
      fetchSongs();
    }
    fetchLookups();
  }, [songs.length, fetchSongs, fetchLookups]);

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-white font-league">
        {!focusedView && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Component {...pageProps} />
        </div>
      </div>
      <CookieConsent />
    </LanguageProvider>
  );
}
