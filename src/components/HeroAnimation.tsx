import React from 'react';
import { Player } from '@remotion/player';
import { QuickListOverview } from '@/remotion/compositions/QuickListOverview';
import styles from './HeroAnimation.module.css';

export const HeroAnimation: React.FC = () => {
  return (
    <div className={styles.heroAnimation}>
      <div className={styles.playerContainer}>
        <Player
          component={QuickListOverview}
          durationInFrames={180}
          fps={30}
          compositionWidth={800}
          compositionHeight={400}
          autoPlay={true}
          loop={true}
          controls={false}
          clickToPlay={false}
          acknowledgeRemotionLicense={true}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
          }}
        />
      </div>
    </div>
  );
};
