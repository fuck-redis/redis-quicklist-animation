import React, { useState, useEffect } from 'react';
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
import styles from './RemotionAnimation.module.css';

type AnimationType =
  | 'overview'
  | 'split'
  | 'merge'
  | 'compression'
  | 'ziplist'
  | 'lpush'
  | 'rpush'
  | 'lpop'
  | 'rpop'
  | 'comparison'
  | 'fillconfig'
  | 'linsert'
  | 'memory'
  | 'scenarios'
  | 'performance';

interface RemotionAnimationProps {
  animationType: AnimationType;
  title?: string;
}

const componentMap: Record<string, React.FC<any>> = {
  overview: QuickListOverview,
  split: NodeSplit,
  merge: NodeMerge,
  compression: Compression,
  ziplist: ZipListStructure,
  lpush: () => <QueueOperations operation="lpush" />,
  rpush: () => <QueueOperations operation="rpush" />,
  lpop: () => <QueueOperations operation="lpop" />,
  rpop: () => <QueueOperations operation="rpop" />,
  comparison: Comparison,
  fillconfig: FillConfig,
  linsert: LInsertOps,
  memory: MemoryOptimization,
  scenarios: Scenarios,
  performance: PerformanceSummary,
};

export const RemotionAnimation: React.FC<RemotionAnimationProps> = ({
  animationType,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = React.useRef<PlayerRef>(null);

  const Component = componentMap[animationType] || QuickListOverview;

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title || '动画演示'}</h3>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={handleRestart}
            title="重播"
          >
            ⏮️
          </button>
          <button
            className={styles.controlButton}
            onClick={handlePlayPause}
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      <div className={styles.playerWrapper}>
        <Player
          ref={playerRef}
          component={Component}
          durationInFrames={180}
          fps={30}
          compositionWidth={800}
          compositionHeight={450}
          autoPlay={true}
          loop={true}
          controls={false}
          clickToPlay={false}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
