import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useSongsDataStore } from "@/store/useSongsDataStore";
import { useLookupStore } from "@/store/useLookupStore";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function App({ Component, pageProps }: AppProps) {
  const { songs, fetchSongs } = useSongsDataStore();
  const { fetchLookups } = useLookupStore();

  // Fetch songs and lookups once when the app loads
  useEffect(() => {
    if (songs.length === 0) {
      fetchSongs();
    }
    fetchLookups();
  }, [songs.length, fetchSongs, fetchLookups]);

  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
