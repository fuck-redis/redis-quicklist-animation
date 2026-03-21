import React, { useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { QuickListOverview } from '@/remotion/compositions/QuickListOverview';
import { NodeSplit } from '@/remotion/compositions/NodeSplit';
import { NodeMerge } from '@/remotion/compositions/NodeMerge';
import { Compression } from '@/remotion/compositions/Compression';
import { ZipListStructure } from '@/remotion/compositions/ZipListStructure';
import { QueueOperations } from '@/remotion/compositions/QueueOperations';
import { Comparison } from '@/remotion/compositions/Comparison';
import { FillConfig } from '@/remotion/compositions/FillConfig';
import { LInsertOps } from '@/remotion/compositions/LInsertOps';
import { MemoryOptimization } from '@/remotion/compositions/MemoryOptimization';
import { Scenarios } from '@/remotion/compositions/Scenarios';
import { PerformanceSummary } from '@/remotion/compositions/PerformanceSummary';
import { LinkedListStructure } from '@/remotion/compositions/LinkedListStructure';
import { PointerConnections } from '@/remotion/compositions/PointerConnections';
import { LinkedListProblems } from '@/remotion/compositions/LinkedListProblems';
import { ZipListProblems } from '@/remotion/compositions/ZipListProblems';
import { QuickListAdvantages } from '@/remotion/compositions/QuickListAdvantages';
import { EntryStructure } from '@/remotion/compositions/EntryStructure';
import { EncodingDemo } from '@/remotion/compositions/EncodingDemo';
import { FillEffects } from '@/remotion/compositions/FillEffects';
import { CompressEffects } from '@/remotion/compositions/CompressEffects';
import { LRemDemo } from '@/remotion/compositions/LRemDemo';
import { LTrimDemo } from '@/remotion/compositions/LTrimDemo';
import { MemoryAllocation } from '@/remotion/compositions/MemoryAllocation';
import { CompressionRatio } from '@/remotion/compositions/CompressionRatio';
import { ScenarioQueue } from '@/remotion/compositions/ScenarioQueue';
import { ScenarioFeed } from '@/remotion/compositions/ScenarioFeed';
import { ScenarioComments } from '@/remotion/compositions/ScenarioComments';
import { ScenarioRateLimit } from '@/remotion/compositions/ScenarioRateLimit';
import { PerformanceTable } from '@/remotion/compositions/PerformanceTable';
import { ConfigRecommendations } from '@/remotion/compositions/ConfigRecommendations';
import type { AnimationType } from '@/pages/TutorialPage';
import styles from './MultiAnimationShowcase.module.css';

interface VideoItem {
  type: AnimationType;
  title: string;
}

interface MultiAnimationShowcaseProps {
  videos: VideoItem[];
  defaultTitle?: string;
}

const componentMap: Record<string, React.FC<any>> = {
  'overview': QuickListOverview,
  'split': NodeSplit,
  'merge': NodeMerge,
  'compression': Compression,
  'ziplist': ZipListStructure,
  'lpush': () => <QueueOperations operation="lpush" />,
  'rpush': () => <QueueOperations operation="rpush" />,
  'lpop': () => <QueueOperations operation="lpop" />,
  'rpop': () => <QueueOperations operation="rpop" />,
  'comparison': Comparison,
  'fillconfig': FillConfig,
  'linsert': LInsertOps,
  'memory': MemoryOptimization,
  'scenarios': Scenarios,
  'performance': PerformanceSummary,
  'linkedlist-structure': LinkedListStructure,
  'pointer-connections': PointerConnections,
  'linkedlist-problems': LinkedListProblems,
  'ziplist-problems': ZipListProblems,
  'quicklist-advantages': QuickListAdvantages,
  'entry-structure': EntryStructure,
  'encoding-demo': EncodingDemo,
  'fill-effects': FillEffects,
  'compress-effects': CompressEffects,
  'linsert-demo': LInsertOps,
  'lrem-demo': LRemDemo,
  'ltrim-demo': LTrimDemo,
  'memory-allocation': MemoryAllocation,
  'compression-ratio': CompressionRatio,
  'scenario-queue': ScenarioQueue,
  'scenario-feed': ScenarioFeed,
  'scenario-comments': ScenarioComments,
  'scenario-rate-limit': ScenarioRateLimit,
  'performance-table': PerformanceTable,
  'config-recommendations': ConfigRecommendations,
};

export const MultiAnimationShowcase: React.FC<MultiAnimationShowcaseProps> = ({
  videos,
  defaultTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = React.useRef<PlayerRef>(null);

  const currentVideo = videos[currentIndex];
  const Component = componentMap[currentVideo?.type] || QuickListOverview;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const handleRestart = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : videos.length - 1;
    setCurrentIndex(newIndex);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const newIndex = currentIndex < videos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setIsPlaying(true);
  };

  React.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  }, [currentIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {currentVideo?.title || defaultTitle || '动画演示'}
          {videos.length > 1 && (
            <span className={styles.counter}>
              ({currentIndex + 1} / {videos.length})
            </span>
          )}
        </h3>
        <div className={styles.controls}>
          {videos.length > 1 && (
            <>
              <button className={styles.navButton} onClick={handlePrev} title="上一个">
                ◀
              </button>
              <button className={styles.navButton} onClick={handleNext} title="下一个">
                ▶
              </button>
            </>
          )}
          <button className={styles.controlButton} onClick={handleRestart} title="重播">
            ⏮️
          </button>
          <button className={styles.controlButton} onClick={handlePlayPause} title={isPlaying ? '暂停' : '播放'}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      <div className={styles.videoTabs}>
        {videos.length > 1 && videos.map((video, index) => (
          <button
            key={video.type}
            className={`${styles.tab} ${index === currentIndex ? styles.activeTab : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}. {video.title}
          </button>
        ))}
      </div>

      <div className={styles.playerWrapper}>
        <div style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Player
            ref={playerRef}
            component={Component}
            durationInFrames={180}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            autoPlay={true}
            loop={true}
            controls={false}
            clickToPlay={false}
            acknowledgeRemotionLicense={true}
            style={{
              width: '100%',
              height: '500px',
              maxWidth: '100%',
            }}
          />
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar} />
      </div>
    </div>
  );
};
