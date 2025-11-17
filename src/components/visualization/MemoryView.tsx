import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Visualization.module.css';

export const MemoryView: React.FC = () => {
  const { quickList } = useQuickListStore();
  
  const nodes = Object.values(quickList.nodes);
  const totalDataSize = nodes.reduce((sum, node) => 
    sum + node.zl.entries.reduce((s, e) => s + e.dataSize, 0), 0
  );
  
  const metadataSize = quickList.totalMemory - totalDataSize;
  const efficiency = quickList.totalMemory > 0 ? (totalDataSize / quickList.totalMemory * 100) : 0;
  
  return (
    <div className={styles.detailContainer}>
      <div className={styles.memoryBreakdown}>
        <div className={styles.memorySection}>
          <h3 className={styles.memoryTitle}>内存分布</h3>
          <div className={styles.memoryBar}>
            <div 
              className={styles.memorySegment}
              style={{ width: `${(totalDataSize / quickList.totalMemory) * 100}%`, background: '#52c41a' }}
            >
              数据 {totalDataSize}B
            </div>
            <div 
              className={styles.memorySegment}
              style={{ width: `${(metadataSize / quickList.totalMemory) * 100}%`, background: '#1890ff' }}
            >
              元数据 {metadataSize}B
            </div>
          </div>
          
          <div>
            <div className={styles.memoryItem}>
              <span>QuickList结构</span>
              <span>32 B</span>
            </div>
            <div className={styles.memoryItem}>
              <span>节点指针 ({nodes.length}个)</span>
              <span>{nodes.length * 16} B</span>
            </div>
            <div className={styles.memoryItem}>
              <span>ZipList头部</span>
              <span>{nodes.reduce((sum, n) => sum + n.zl.headerSize, 0)} B</span>
            </div>
            <div className={styles.memoryItem}>
              <span>元素数据</span>
              <span>{totalDataSize} B</span>
            </div>
            <div className={styles.memoryItem}>
              <strong>总内存</strong>
              <strong>{quickList.totalMemory} B</strong>
            </div>
          </div>
        </div>
        
        <div className={styles.memorySection}>
          <h3 className={styles.memoryTitle}>内存效率</h3>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#52c41a' }}>
              {efficiency.toFixed(1)}%
            </div>
            <div style={{ color: '#8c8c8c', marginTop: '10px' }}>
              有效数据占比
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
