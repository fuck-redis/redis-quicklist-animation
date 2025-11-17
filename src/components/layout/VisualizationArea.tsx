import React, { useState } from 'react';
import { StructureView } from '../visualization/StructureView';
import { NodeDetailView } from '../visualization/NodeDetailView';
import { MemoryView } from '../visualization/MemoryView';
import { PerformancePanel } from '../visualization/PerformancePanel';
import { EducationPanel } from '../common/EducationPanel';
import styles from './MainLayout.module.css';

export const VisualizationArea: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'detail' | 'memory' | 'performance' | 'education'>('structure');
  
  return (
    <>
      <div className={styles.section} style={{ flex: 1 }}>
        <div className={styles.sectionTitle}>
          <span>🎨</span>
          <span>QuickList 可视化</span>
        </div>
        
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'structure' ? styles.active : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            结构总览
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'detail' ? styles.active : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            节点详情
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'memory' ? styles.active : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            内存视图
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            性能分析
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'education' ? styles.active : ''}`}
            onClick={() => setActiveTab('education')}
          >
            学习指南
          </div>
        </div>
        
        <div className={styles.sectionContent}>
          {activeTab === 'structure' && <StructureView />}
          {activeTab === 'detail' && <NodeDetailView />}
          {activeTab === 'memory' && <MemoryView />}
          {activeTab === 'performance' && <PerformancePanel />}
          {activeTab === 'education' && <EducationPanel />}
        </div>
      </div>
    </>
  );
};
