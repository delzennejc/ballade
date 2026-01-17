import { useState } from "react"
import {
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
} from "lucide-react"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import { AudioTrack, AudioTrackData } from "@/types/song"
import { useSongStore } from "@/store/songStore"

interface AudioPlayerProps {
  audioTracks: AudioTrackData[]
}

const trackLabels: Record<AudioTrack, string> = {
  groupe: "Audio groupe",
  violon: "Audio violon",
  chant: "Audio chant",
  guitare: "Audio guitare",
  percussion: "Audio percussions",
}

export default function AudioPlayer({ audioTracks }: AudioPlayerProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [expandedTrack, setExpandedTrack] = useState<AudioTrack | null>(null)

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

  // Get display name for the dropdown button
  const getDisplayName = () => {
    if (!currentTrackData) return trackLabels[selectedTrack]

    // If single version, show track name
    if (currentTrackData.versions.length === 1) {
      return trackLabels[selectedTrack]
    }

    // If multiple versions, show selected version name
    const selectedVersion = currentTrackData.versions.find(
      (v) => v.id === selectedVersionId
    )
    return selectedVersion?.name || currentTrackData.versions[0]?.name || trackLabels[selectedTrack]
  }

  const handleSelectTrack = (trackData: AudioTrackData, versionId?: string) => {
    const version = versionId
      ? trackData.versions.find((v) => v.id === versionId)
      : trackData.versions[0]

    if (version) {
      setSelectedAudio(trackData.track, version.id)
    }
    setShowDropdown(false)
    setExpandedTrack(null)
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
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-4 py-1.5 bg-[#F4F7FA] rounded-lg text-sm font-medium text-[#466387] hover:bg-slate-200 transition-colors"
          >
            {showDropdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span className="mt-0.5">{getDisplayName()}</span>
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10 min-w-40 py-2">
              {audioTracks.map((trackData) => {
                const hasMultipleVersions = trackData.versions.length > 1
                const isExpanded = expandedTrack === trackData.track
                const isSelected = selectedTrack === trackData.track

                return (
                  <div key={trackData.track} className="relative">
                    <button
                      onClick={() => {
                        if (hasMultipleVersions) {
                          setExpandedTrack(isExpanded ? null : trackData.track)
                        } else {
                          handleSelectTrack(trackData)
                        }
                      }}
                      className={`w-full px-4 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-between ${
                        isSelected
                          ? "bg-slate-100 text-slate-700 font-medium"
                          : "text-[#466387]"
                      }`}
                    >
                      <span className="w-4">
                        {hasMultipleVersions && (
                          <ChevronLeft className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        )}
                      </span>
                      <span>{trackLabels[trackData.track]}</span>
                    </button>

                    {/* Submenu for multiple versions */}
                    {hasMultipleVersions && isExpanded && (
                      <div className="absolute top-0 right-full mr-1 bg-white rounded-lg shadow-lg min-w-32 py-2">
                        {trackData.versions.map((version) => {
                          const isVersionSelected =
                            isSelected && selectedVersionId === version.id

                          return (
                            <button
                              key={version.id}
                              onClick={() =>
                                handleSelectTrack(trackData, version.id)
                              }
                              className={`w-full text-right px-4 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-end gap-2 ${
                                isVersionSelected
                                  ? "bg-slate-100 text-slate-700 font-medium"
                                  : "text-[#466387]"
                              }`}
                            >
                              {version.name}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
