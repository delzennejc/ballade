import {
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import { AudioTrackData } from "@/types/song"
import { useSongStore } from "@/store/songStore"
import Dropdown, { DropdownOption } from "@/components/ui/Dropdown"
import ActionMenu from "@/components/ui/ActionMenu"

interface AudioPlayerProps {
  audioTracks: AudioTrackData[]
  onShare: () => void
}

export default function AudioPlayer({ audioTracks, onShare }: AudioPlayerProps) {
  const {
    isPlaying,
    volume,
    isLooping,
    progressPercentage,
    formattedCurrentTime,
    formattedDuration,
    togglePlayPause,
    seekByPercentage,
    setVolume,
    toggleLoop,
  } = useAudioPlayer()

  const { selectedTrack, selectedVersionId, setSelectedAudio } = useSongStore()

  // Find current track data
  const currentTrackData = audioTracks.find((t) => t.track === selectedTrack)

  // Convert audio tracks to dropdown options
  const audioOptions: DropdownOption[] = audioTracks.map((trackData) => ({
    id: trackData.track,
    label: trackData.trackName || trackData.track,
    subOptions:
      trackData.versions.length > 1
        ? trackData.versions.map((v) => ({ id: v.id, label: v.name }))
        : undefined,
  }))

  // Get display name for the dropdown button
  const getDisplayName = () => {
    const trackLabel = currentTrackData?.trackName || selectedTrack

    if (!currentTrackData) return trackLabel

    // If single version, show track name
    if (currentTrackData.versions.length === 1) {
      return trackLabel
    }

    // If multiple versions, show selected version name
    const selectedVersion = currentTrackData.versions.find(
      (v) => v.id === selectedVersionId
    )
    return selectedVersion?.name || currentTrackData.versions[0]?.name || trackLabel
  }

  const handleSelectAudio = (trackId: string, versionId?: string) => {
    const trackData = audioTracks.find((t) => t.track === trackId)
    if (!trackData) return

    const version = versionId
      ? trackData.versions.find((v) => v.id === versionId)
      : trackData.versions[0]

    if (version) {
      setSelectedAudio(trackData.track, version.id)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 mb-6">
      <div className="flex items-center gap-5">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 flex items-center justify-center bg-orange-400 hover:bg-orange-500 rounded-full text-white transition-colors shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Time and Progress Bar */}
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm text-slate-500 tabular-nums w-10">
            {formattedCurrentTime}
          </span>
          <div
            className="flex-1 h-1.5 bg-slate-200 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percentage = ((e.clientX - rect.left) / rect.width) * 100
              seekByPercentage(percentage)
            }}
          >
            <div
              className="h-full bg-slate-700 rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-sm text-slate-500 tabular-nums w-10 text-right">
            {formattedDuration}
          </span>
        </div>

        {/* Loop Toggle */}
        <button
          onClick={toggleLoop}
          className={`p-2 rounded-full transition-colors ${
            isLooping
              ? "text-orange-500"
              : "text-slate-400 hover:text-slate-600"
          }`}
          title="Boucle"
        >
          <Repeat className="w-5 h-5" />
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            {volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div
            className="w-14 h-1.5 bg-slate-200 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percentage = (e.clientX - rect.left) / rect.width
              setVolume(Math.max(0, Math.min(1, percentage)))
            }}
          >
            <div
              className="h-full bg-slate-700 rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* Audio Selection Dropdown */}
        <Dropdown
          options={audioOptions}
          selectedId={selectedTrack}
          selectedSubId={selectedVersionId}
          onSelect={handleSelectAudio}
          displayValue={getDisplayName()}
        />

        {/* Share Menu */}
        <ActionMenu onShare={onShare} />
      </div>
    </div>
  )
}
