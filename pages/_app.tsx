import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useSongsDataStore } from "@/store/useSongsDataStore";

export default function App({ Component, pageProps }: AppProps) {
  const { songs, fetchSongs } = useSongsDataStore();

  // Fetch songs once when the app loads
  useEffect(() => {
    if (songs.length === 0) {
      fetchSongs();
    }
  }, [songs.length, fetchSongs]);

  return <Component {...pageProps} />;
}
