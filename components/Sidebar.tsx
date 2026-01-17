import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const songs = [
  { name: "A LA CLAIRE FONTAINE", slug: "a-la-claire-fontaine" },
  { name: "A LA UNA", slug: "a-la-una" },
  { name: "AH VOUS DIRAI-JE MAMAN", slug: "ah-vous-dirai-je-maman" },
  { name: "ALORS ON DANSE", slug: "alors-on-danse" },
  { name: "ANEVA STO TRAPEZIMOU", slug: "aneva-sto-trapezimou" },
  { name: "APALAIS MENESS", slug: "apalais-meness" },
  { name: "ARMSTRONG", slug: "armstrong" },
  { name: "JOYEUX ANNIVERSAIRE", slug: "joyeux-anniversaire" },
  { name: "BELLA CIAO", slug: "bella-ciao" },
];

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Sidebar({
  searchQuery,
  setSearchQuery,
}: SidebarProps) {
  const [language, setLanguage] = useState<"FR" | "EN">("FR");
  const router = useRouter();

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current slug from router
  const currentSlug = router.query.slug as string | undefined;

  return (
    <aside className="w-[200px] min-h-screen bg-slate-700 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/ballade-logo.png"
          alt="Association Ballade"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Language Selector */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setLanguage("FR")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === "FR"
              ? "bg-blue-500 text-white"
              : "bg-slate-600 text-slate-300 hover:bg-slate-500"
          }`}
        >
          FR
        </button>
        <button
          onClick={() => setLanguage("EN")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === "EN"
              ? "bg-blue-500 text-white"
              : "bg-slate-600 text-slate-300 hover:bg-slate-500"
          }`}
        >
          EN
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Rechercher"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 pr-8 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
        />
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Song List Header */}
      <h2 className="text-sm font-semibold text-white mb-3 tracking-wide">
        LISTE DES CHANSONS
      </h2>

      {/* Filters Button */}
      <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-500 rounded-full text-sm text-slate-300 mb-4 w-fit hover:bg-slate-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        Filtres
      </button>

      {/* Song List */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {filteredSongs.map((song) => (
            <li key={song.slug}>
              <Link
                href={`/song/${song.slug}`}
                className={`block w-full text-left px-2 py-1.5 text-sm transition-colors rounded ${
                  currentSlug === song.slug
                    ? "bg-slate-600 text-white"
                    : "text-slate-300 hover:bg-slate-600"
                }`}
              >
                {song.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
