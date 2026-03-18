import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PlaybackControls.module.css';

interface PlaybackControlsProps {
  currentIndex: number;
  total: number;
  progress: number;
  isPlaying: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSeek: (index: number) => void;
}

const SPEEDS = [0.5, 0.8, 1, 1.25, 1.5, 2];

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentIndex,
  total,
  progress,
  isPlaying,
  speed,
  onSpeedChange,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  onSeek,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const seekByClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current || total <= 1) {
        return;
      }
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      onSeek(Math.round(ratio * (total - 1)));
    },
    [onSeek, total]
  );

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragging) {
        return;
      }
      seekByClientX(event.clientX);
    };

    const onUp = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, seekByClientX]);

  return (
    <section className={styles.panel}>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.actionButton} onClick={onPrev} title="ArrowLeft">
          上一步 ←
        </button>
        <button type="button" className={styles.actionButton} onClick={onNext} title="ArrowRight">
          下一步 →
        </button>
        <button type="button" className={styles.playButton} onClick={onTogglePlay} title="Space">
          {isPlaying ? '暂停 Space' : '播放 Space'}
        </button>
        <button type="button" className={styles.actionButton} onClick={onReset} title="R">
          重置 R
        </button>

        <div className={styles.speedBlock}>
          {SPEEDS.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.speedButton} ${Math.abs(item - speed) < 0.001 ? styles.speedActive : ''}`}
              onClick={() => onSpeedChange(item)}
            >
              {item.toFixed(item % 1 === 0 ? 0 : 2)}x
            </button>
          ))}
        </div>

        <div className={styles.position}>
          {currentIndex + 1}/{Math.max(total, 1)}
        </div>
      </div>

      <div
        ref={trackRef}
        className={styles.progressTrack}
        onMouseDown={(event) => {
          setDragging(true);
          seekByClientX(event.clientX);
        }}
      >
        <div className={styles.progressPlayed} style={{ width: `${progress}%` }} />
        <div className={styles.progressHandle} style={{ left: `${progress}%` }} />
      </div>
    </section>
  );
};
