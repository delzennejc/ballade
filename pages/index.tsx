import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-white font-league">
      {/* Sidebar */}
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSong={selectedSong}
        setSelectedSong={setSelectedSong}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}
