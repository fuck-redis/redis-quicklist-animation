import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface PlaybackOptions {
  frameCount: number;
  speed: number;
}

interface PlaybackApi {
  currentIndex: number;
  isPlaying: boolean;
  setIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  next: () => void;
  prev: () => void;
  progress: number;
}

export function usePlayback({ frameCount, speed }: PlaybackOptions): PlaybackApi {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const safeFrameCount = Math.max(1, frameCount);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), safeFrameCount - 1));
  }, [safeFrameCount]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, safeFrameCount - 1));
  }, [safeFrameCount]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const play = useCallback(() => {
    if (safeFrameCount <= 1) {
      return;
    }
    setPlaying(true);
  }, [safeFrameCount]);

  const toggle = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    if (currentIndex >= safeFrameCount - 1) {
      setPlaying(false);
      return;
    }

    const delay = Math.max(120, Math.round(650 / Math.max(speed, 0.1)));
    timerRef.current = window.setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, safeFrameCount - 1));
    }, delay);

    return clearTimer;
  }, [currentIndex, isPlaying, safeFrameCount, speed]);

  useEffect(() => {
    if (currentIndex >= safeFrameCount) {
      setCurrentIndex(safeFrameCount - 1);
    }
  }, [currentIndex, safeFrameCount]);

  useEffect(() => clearTimer, []);

  const progress = useMemo(() => {
    if (safeFrameCount <= 1) {
      return 0;
    }
    return (currentIndex / (safeFrameCount - 1)) * 100;
  }, [currentIndex, safeFrameCount]);

  return {
    currentIndex,
    isPlaying,
    setIndex,
    play,
    pause,
    toggle,
    reset,
    next,
    prev,
    progress,
  };
}
