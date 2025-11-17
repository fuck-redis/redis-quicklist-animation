import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Visualization.module.css';

export const PerformancePanel: React.FC = () => {
  const { metrics } = useQuickListStore();
  
  return (
    <div className={styles.detailContainer}>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>操作次数</div>
          <div className={styles.metricValue}>{metrics.operationCount}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>平均填充率</div>
          <div className={styles.metricValue}>{metrics.averageFillRate.toFixed(0)}%</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>内存效率</div>
          <div className={styles.metricValue}>{metrics.memoryEfficiency.toFixed(0)}%</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>平衡得分</div>
          <div className={styles.metricValue}>{metrics.balanceScore.toFixed(0)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>分裂次数</div>
          <div className={styles.metricValue}>{metrics.splitCount}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>合并次数</div>
          <div className={styles.metricValue}>{metrics.mergeCount}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>压缩次数</div>
          <div className={styles.metricValue}>{metrics.compressionCount}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>碎片率</div>
          <div className={styles.metricValue}>{metrics.fragmentationRate.toFixed(0)}%</div>
        </div>
      </div>
      
      <div className={styles.recommendationBox}>
        <div className={styles.recommendationTitle}>💡 优化建议</div>
        <ul className={styles.recommendationList}>
          {metrics.averageFillRate < 50 && (
            <li>平均填充率偏低，考虑减小fill值或执行节点合并</li>
          )}
          {metrics.fragmentationRate > 30 && (
            <li>碎片率较高，建议执行重新平衡操作</li>
          )}
          {metrics.memoryEfficiency < 60 && (
            <li>内存效率偏低，考虑启用压缩功能</li>
          )}
          {metrics.splitCount > metrics.mergeCount * 3 && (
            <li>分裂操作频繁，可以适当增大fill值</li>
          )}
        </ul>
      </div>
    </div>
  );
};
