import React, { useState } from 'react';
import { OperationSelector } from '../control/OperationSelector';
import { ConfigPanel } from '../control/ConfigPanel';
import { ScenarioLab } from '../control/ScenarioLab';
import { AnimationControls } from '../control/AnimationControls';
import styles from './MainLayout.module.css';

export const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'operations' | 'config' | 'scenarios' | 'animation'>('operations');
  
  return (
    <>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>⚙️</span>
          <span>控制面板</span>
        </div>
        
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'operations' ? styles.active : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            操作
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'config' ? styles.active : ''}`}
            onClick={() => setActiveTab('config')}
          >
            配置
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'scenarios' ? styles.active : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            场景
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'animation' ? styles.active : ''}`}
            onClick={() => setActiveTab('animation')}
          >
            动画
          </div>
        </div>
        
        <div className={styles.sectionContent}>
          {activeTab === 'operations' && <OperationSelector />}
          {activeTab === 'config' && <ConfigPanel />}
          {activeTab === 'scenarios' && <ScenarioLab />}
          {activeTab === 'animation' && <AnimationControls />}
        </div>
      </div>
    </>
  );
};
