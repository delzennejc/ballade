import Image from "next/image"
import {
  Globe,
  MessageCircle,
  Music,
  Users,
  Mountain,
  Sparkles,
} from "lucide-react"
import { Song } from "@/types/song"

interface SongHeaderProps {
  song: Song
}

interface TagGroupProps {
  icon: React.ReactNode
  items: string[]
  colorClass: string
}

function TagGroup({ icon, items, colorClass }: TagGroupProps) {
  if (items.length === 0) return null

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1 rounded-full ${colorClass}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-base font-medium mt-0.5">{items.join("  ")}</span>
    </div>
  )
}

export default function SongHeader({ song }: SongHeaderProps) {
  const { metadata } = song

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6">
      <div className="flex items-start gap-8">
        {/* Thumbnail */}
        <div className="relative w-42 h-42 shrink-0 rounded-xl overflow-hidden">
          <Image
            src={song.thumbnail}
            alt={song.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Title and metadata */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold text-[#18375E] mb-5">
            {song.title}
          </h1>

          {/* Tags - Row 1 */}
          <div className="flex flex-wrap gap-3 mb-3">
            <TagGroup
              icon={<Globe className="w-5 h-5" />}
              items={[metadata.country]}
              colorClass="bg-blue-50 text-blue-700"
            />
            <TagGroup
              icon={<MessageCircle className="w-5 h-5" />}
              items={[metadata.language]}
              colorClass="bg-green-50 text-green-700"
            />
            <TagGroup
              icon={<Music className="w-5 h-5" />}
              items={metadata.genres}
              colorClass="bg-purple-50 text-purple-700"
            />
            <TagGroup
              icon={<Users className="w-5 h-5" />}
              items={metadata.audience}
              colorClass="bg-orange-50 text-orange-700"
            />
          </div>

          {/* Tags - Row 2 */}
          <div className="flex flex-wrap gap-3">
            <TagGroup
              icon={<Mountain className="w-5 h-5" />}
              items={[metadata.difficulty]}
              colorClass="bg-amber-50 text-amber-700"
            />
            <TagGroup
              icon={<Sparkles className="w-5 h-5" />}
              items={metadata.themes}
              colorClass="bg-rose-50 text-rose-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
