import { useEffect, useRef, useCallback } from 'react';
import { useSongStore } from '@/store/songStore';

export function useAudioPlayer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isLooping,
    selectedTrack,
    selectedVersionId,
    setIsPlaying,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    toggleLoop,
    setSelectedTrack,
    setSelectedVersionId,
    setSelectedAudio,
  } = useSongStore();

  // Simulate audio playback progress (mock - no real audio)
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        useSongStore.setState((state) => {
          const newTime = state.currentTime + 0.1;
          if (newTime >= state.duration) {
            if (state.isLooping) {
              return { currentTime: 0 };
            }
            return { currentTime: state.duration, isPlaying: false };
          }
          return { currentTime: newTime };
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const seek = useCallback(
    (time: number) => {
      const clampedTime = Math.max(0, Math.min(duration, time));
      setCurrentTime(clampedTime);
    },
    [duration, setCurrentTime]
  );

  const seekByPercentage = useCallback(
    (percentage: number) => {
      const time = (percentage / 100) * duration;
      seek(time);
    },
    [duration, seek]
  );

  const restart = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(true);
  }, [setCurrentTime, setIsPlaying]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [setIsPlaying, setCurrentTime]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    // State
    isPlaying,
    currentTime,
    duration,
    volume,
    isLooping,
    selectedTrack,
    selectedVersionId,
    progressPercentage,

    // Formatted values
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),

    // Actions
    togglePlayPause,
    seek,
    seekByPercentage,
    setVolume,
    toggleLoop,
    setSelectedTrack,
    setSelectedVersionId,
    setSelectedAudio,
    restart,
    stop,
  };
}
