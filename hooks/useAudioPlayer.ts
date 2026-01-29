import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSongStore } from '@/store/songStore';
import { useSongsDataStore } from '@/store/useSongsDataStore';

export function useAudioPlayer() {
  const router = useRouter();
  const { slug } = router.query;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadingAudio = useRef(false);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isLooping,
    selectedTrack,
    selectedVersionId,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleLoop,
    setSelectedTrack,
    setSelectedVersionId,
    setSelectedAudio,
  } = useSongStore();

  const { getAudioUrl } = useSongsDataStore();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isLooping, setCurrentTime, setDuration, setIsPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update loop setting when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Load audio when track or version changes
  useEffect(() => {
    const loadAudio = async () => {
      if (!slug || typeof slug !== 'string' || !selectedTrack || !selectedVersionId) {
        return;
      }

      if (isLoadingAudio.current) return;
      isLoadingAudio.current = true;

      try {
        const url = await getAudioUrl(slug, selectedTrack, selectedVersionId);

        if (url && audioRef.current) {
          const wasPlaying = !audioRef.current.paused;
          audioRef.current.src = url;
          audioRef.current.load();

          if (wasPlaying) {
            audioRef.current.play().catch(console.error);
          }
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
      } finally {
        isLoadingAudio.current = false;
      }
    };

    loadAudio();
  }, [slug, selectedTrack, selectedVersionId, getAudioUrl]);

  const formatTime = useCallback((seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, []);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;
      const clampedTime = Math.max(0, Math.min(audioRef.current.duration || 0, time));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [setCurrentTime]
  );

  const seekByPercentage = useCallback(
    (percentage: number) => {
      if (!audioRef.current) return;
      const time = (percentage / 100) * (audioRef.current.duration || 0);
      seek(time);
    },
    [seek]
  );

  const restart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(console.error);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }, [setCurrentTime]);

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
