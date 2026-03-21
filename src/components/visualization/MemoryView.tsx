import React from 'react';
import styles from './Visualization.module.css';

export const MemoryView: React.FC = () => {
  return (
    <div className={styles.detailContainer}>
      <div className={styles.memoryBreakdown}>
        <div className={styles.memorySection}>
          <h3 className={styles.memoryTitle}>💾 ZipList 内存结构</h3>
          <div className={styles.memoryDiagram}>
            <div className={styles.memoryRow}>
              <span className={styles.memoryLabel}>zlbytes</span>
              <span className={styles.memoryValue}>4B - 总字节数</span>
            </div>
            <div className={styles.memoryRow}>
              <span className={styles.memoryLabel}>zltail</span>
              <span className={styles.memoryValue}>4B - 尾节点偏移</span>
            </div>
            <div className={styles.memoryRow}>
              <span className={styles.memoryLabel}>zllen</span>
              <span className={styles.memoryValue}>2B - 元素数量</span>
            </div>
            <div className={styles.memoryRow}>
              <span className={styles.memoryLabel}>entries</span>
              <span className={styles.memoryValue}>N - 数据 entry</span>
            </div>
            <div className={styles.memoryRow}>
              <span className={styles.memoryLabel}>zlend</span>
              <span className={styles.memoryValue}>1B - 结束标记 (0xFF)</span>
            </div>
          </div>
          <p className={styles.memoryNote}>* ZipList 是连续内存块，缓存友好</p>
        </div>

        <div className={styles.memorySection}>
          <h3 className={styles.memoryTitle}>📊 QuickList vs ZipList vs 链表</h3>
          <div className={styles.compareTable}>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>内存效率</span>
              <span className={styles.compareBar}>
                <span style={{ width: '85%', background: '#52c41a' }}></span>
              </span>
              <span>QuickList ⭐⭐⭐</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>头尾操作</span>
              <span className={styles.compareBar}>
                <span style={{ width: '100%', background: '#1890ff' }}></span>
              </span>
              <span>QuickList ⭐⭐⭐</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>中间操作</span>
              <span className={styles.compareBar}>
                <span style={{ width: '40%', background: '#faad14' }}></span>
              </span>
              <span>三者相同 ⭐</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>压缩支持</span>
              <span className={styles.compareBar}>
                <span style={{ width: '100%', background: '#52c41a' }}></span>
              </span>
              <span>仅 QuickList ⭐⭐⭐</span>
            </div>
          </div>
        </div>

        <div className={styles.memorySection}>
          <h3 className={styles.memoryTitle}>📈 Entry 编码方式</h3>
          <div className={styles.encodingList}>
            <div className={styles.encodingItem}>
              <span className={styles.encodingTag}>字符串</span>
              <span className={styles.encodingDesc}>前导长度 + 数据</span>
            </div>
            <div className={styles.encodingItem}>
              <span className={styles.encodingTag}>整数</span>
              <span className={styles.encodingDesc}>1/2/4/8 字节变长编码</span>
            </div>
            <div className={styles.encodingItem}>
              <span className={styles.encodingTag}>LZF</span>
              <span className={styles.encodingDesc}>压缩后的字符串</span>
            </div>
          </div>
          <p className={styles.memoryNote}>* Redis 根据数据大小自动选择最优编码</p>
        </div>

        <div className={styles.memorySection}>
          <h3 className={styles.memoryTitle}>🗜️ LZF 压缩原理</h3>
          <div className={styles.compressExplain}>
            <p>LZF 是 QuickList 的压缩算法，采用<strong>滑动窗口 + 前向引用</strong>：</p>
            <ul>
              <li>相同前缀的数据用引用代替</li>
              <li>压缩率通常 <strong>40-70%</strong></li>
              <li>访问时需要解压（CPU 开销）</li>
            </ul>
            <div className={styles.compressExample}>
              <span>原始: "Hello World Hello"</span>
              <span>压缩: "Hello World [引用:回溯12,长度5]"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
