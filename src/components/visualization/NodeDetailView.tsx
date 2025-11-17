import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Visualization.module.css';

export const NodeDetailView: React.FC = () => {
  const { quickList, selectedNodeId } = useQuickListStore();
  
  const selectedNode = selectedNodeId ? quickList.nodes[selectedNodeId] : null;
  
  if (!selectedNode) {
    return (
      <div className={styles.emptyMessage}>
        请在结构总览中点击选择一个节点
      </div>
    );
  }
  
  return (
    <div className={styles.detailContainer}>
      <div className={styles.nodeHeader}>
        <h3 className={styles.nodeTitle}>节点 {selectedNode.index} (ID: {selectedNode.id})</h3>
        <div className={styles.nodeStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>元素数量</span>
            <span className={styles.statValue}>{selectedNode.elementCount}/{quickList.config.fill}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>内存大小</span>
            <span className={styles.statValue}>{selectedNode.memorySize} B</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>填充率</span>
            <span className={styles.statValue}>
              {((selectedNode.elementCount / quickList.config.fill) * 100).toFixed(0)}%
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>压缩状态</span>
            <span className={styles.statValue}>
              {selectedNode.isCompressed ? `已压缩 (${(selectedNode.compressionRatio! * 100).toFixed(0)}%)` : '未压缩'}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.ziplistEntries}>
        <h4>ZipList 内部结构</h4>
        <div className={styles.entryList}>
          {selectedNode.zl.entries.map(entry => (
            <div key={entry.id} className={styles.entry}>
              <span className={styles.entryIndex}>#{entry.index}</span>
              <span className={styles.entryValue}>{String(entry.value)}</span>
              <span className={styles.entryEncoding}>{entry.encoding}</span>
              <span className={styles.entrySize}>{entry.totalSize}B</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
