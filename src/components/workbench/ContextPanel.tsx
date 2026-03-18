import React from 'react';
import { AlgorithmStep } from '@/types/quicklistViz';
import styles from './ContextPanel.module.css';

interface ContextPanelProps {
  step: AlgorithmStep;
}

function asPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ step }) => {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>{step.title}</h3>
        <p className={styles.description}>{step.description}</p>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>操作次数</span>
          <span className={styles.metricValue}>{step.metrics.operationCount}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>分裂次数</span>
          <span className={styles.metricValue}>{step.metrics.splitCount}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>合并次数</span>
          <span className={styles.metricValue}>{step.metrics.mergeCount}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>压缩节点数</span>
          <span className={styles.metricValue}>{step.metrics.compressCount}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>平均填充率</span>
          <span className={styles.metricValue}>{asPercent(step.metrics.fillRate)}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>内存效率</span>
          <span className={styles.metricValue}>{asPercent(step.metrics.memoryEfficiency)}</span>
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineTitle}>当前阶段标识</div>
        <div className={styles.timelineBadge}>{step.stage}</div>
      </div>
    </section>
  );
};
