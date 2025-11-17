import React from 'react';
import { VisualizationArea } from './VisualizationArea';
import { ControlPanel } from './ControlPanel';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <div className={styles.visualizationArea}>
        <VisualizationArea />
      </div>
      <div className={styles.controlPanel}>
        <ControlPanel />
      </div>
    </div>
  );
};
