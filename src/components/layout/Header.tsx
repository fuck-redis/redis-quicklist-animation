import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { quickList, metrics } = useQuickListStore();
  
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.logo}>📋</span>
        <div className={styles.titleText}>
          <h1>Redis QuickList 可视化演示</h1>
          <p>交互式数据结构学习平台</p>
        </div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>节点数</span>
            <span className={styles.statValue}>{quickList.nodeCount}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>元素数</span>
            <span className={styles.statValue}>{quickList.totalElements}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>内存</span>
            <span className={styles.statValue}>
              {(quickList.totalMemory / 1024).toFixed(1)}KB
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>填充率</span>
            <span className={styles.statValue}>
              {metrics.averageFillRate.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
