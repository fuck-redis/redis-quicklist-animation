import React, { useState } from 'react';
import styles from './ComparisonPage.module.css';

type DataStructure = 'linkedlist' | 'ziplist' | 'quicklist';

export const ComparisonPage: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<DataStructure>('quicklist');
  
  const structures = [
    {
      id: 'linkedlist' as DataStructure,
      name: '双向链表',
      icon: '🔗',
      description: '传统的链表实现',
      pros: [
        '插入和删除操作灵活',
        '不需要连续内存',
        '支持快速头尾操作',
        '不需要预分配空间'
      ],
      cons: [
        '每个节点需要额外的指针开销（16字节）',
        '内存碎片严重',
        '缓存局部性差',
        '小数据时内存利用率低'
      ],
      complexity: {
        insert: 'O(1) 头尾插入',
        delete: 'O(1) 头尾删除',
        access: 'O(n) 随机访问',
        memory: '高 - 每个元素额外16字节'
      },
      bestFor: ['频繁的头尾操作', '不确定大小的列表', '不在意内存开销']
    },
    {
      id: 'ziplist' as DataStructure,
      name: 'ZipList',
      icon: '📦',
      description: '压缩的连续内存列表',
      pros: [
        '内存紧凑，无指针开销',
        '缓存友好，顺序访问快',
        '智能编码节省空间',
        '小数据集性能优秀'
      ],
      cons: [
        '插入删除需要移动数据',
        '大数据集性能下降',
        '频繁realloc开销大',
        '可能触发级联更新'
      ],
      complexity: {
        insert: 'O(n) 需要移动数据',
        delete: 'O(n) 需要移动数据',
        access: 'O(n) 顺序查找',
        memory: '低 - 非常紧凑'
      },
      bestFor: ['小数据集', '少量修改', '内存敏感场景']
    },
    {
      id: 'quicklist' as DataStructure,
      name: 'QuickList',
      icon: '⚡',
      description: 'Redis 的混合优化方案',
      pros: [
        '平衡内存和性能',
        '可配置参数适应场景',
        '支持压缩节省内存',
        '头尾操作保持O(1)'
      ],
      cons: [
        '实现复杂度高',
        '需要调优参数',
        '中间操作仍较慢',
        '压缩增加CPU开销'
      ],
      complexity: {
        insert: 'O(1) 头尾，O(n) 中间',
        delete: 'O(1) 头尾，O(n) 中间',
        access: 'O(n) 需遍历节点',
        memory: '中 - 可通过压缩优化'
      },
      bestFor: ['队列/栈场景', '需要平衡性能和内存', 'Redis List实现']
    }
  ];
  
  const selected = structures.find(s => s.id === selectedStructure)!;
  
  return (
    <div className={styles.comparisonPage}>
      <div className={styles.pageHeader}>
        <h1>⚖️ 数据结构对比</h1>
        <p>深入理解不同数据结构的设计权衡</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.structureSelector}>
          {structures.map(structure => (
            <button
              key={structure.id}
              className={`${styles.structureButton} ${selectedStructure === structure.id ? styles.active : ''}`}
              onClick={() => setSelectedStructure(structure.id)}
            >
              <span className={styles.structureIcon}>{structure.icon}</span>
              <span className={styles.structureName}>{structure.name}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.detailSection}>
          <div className={styles.detailHeader}>
            <span className={styles.detailIcon}>{selected.icon}</span>
            <div>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
            </div>
          </div>
          
          <div className={styles.prosConsGrid}>
            <div className={styles.prosSection}>
              <h3>✅ 优势</h3>
              <ul>
                {selected.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.consSection}>
              <h3>⚠️ 劣势</h3>
              <ul>
                {selected.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className={styles.complexitySection}>
            <h3>⏱️ 时间复杂度</h3>
            <div className={styles.complexityGrid}>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>插入</span>
                <span className={styles.complexityValue}>{selected.complexity.insert}</span>
              </div>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>删除</span>
                <span className={styles.complexityValue}>{selected.complexity.delete}</span>
              </div>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>访问</span>
                <span className={styles.complexityValue}>{selected.complexity.access}</span>
              </div>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>内存</span>
                <span className={styles.complexityValue}>{selected.complexity.memory}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.bestForSection}>
            <h3>🎯 最适合的场景</h3>
            <ul>
              {selected.bestFor.map((scenario, index) => (
                <li key={index}>{scenario}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className={styles.comparisonTable}>
          <h2>📊 综合对比</h2>
          <table>
            <thead>
              <tr>
                <th>特性</th>
                <th>双向链表</th>
                <th>ZipList</th>
                <th>QuickList</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>内存效率</td>
                <td className={styles.poor}>低 ⭐</td>
                <td className={styles.excellent}>高 ⭐⭐⭐</td>
                <td className={styles.good}>中等 ⭐⭐</td>
              </tr>
              <tr>
                <td>头尾插入</td>
                <td className={styles.excellent}>O(1) ⭐⭐⭐</td>
                <td className={styles.good}>O(n) ⭐⭐</td>
                <td className={styles.excellent}>O(1) ⭐⭐⭐</td>
              </tr>
              <tr>
                <td>中间插入</td>
                <td className={styles.good}>O(n) ⭐⭐</td>
                <td className={styles.poor}>O(n) ⭐</td>
                <td className={styles.good}>O(n) ⭐⭐</td>
              </tr>
              <tr>
                <td>随机访问</td>
                <td className={styles.poor}>O(n) ⭐</td>
                <td className={styles.poor}>O(n) ⭐</td>
                <td className={styles.poor}>O(n) ⭐</td>
              </tr>
              <tr>
                <td>缓存友好</td>
                <td className={styles.poor}>差 ⭐</td>
                <td className={styles.excellent}>好 ⭐⭐⭐</td>
                <td className={styles.good}>中 ⭐⭐</td>
              </tr>
              <tr>
                <td>实现复杂度</td>
                <td className={styles.good}>简单 ⭐⭐</td>
                <td className={styles.good}>中等 ⭐⭐</td>
                <td className={styles.poor}>复杂 ⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className={styles.conclusion}>
          <h2>💡 设计启示</h2>
          <div className={styles.insight}>
            <p><strong>QuickList 的设计智慧：</strong></p>
            <ul>
              <li>没有完美的数据结构，只有合适的权衡</li>
              <li>小规模用紧凑结构，大规模用灵活结构</li>
              <li>通过参数配置适应不同场景</li>
              <li>在热点路径（头尾）优化性能，在冷路径（中间）优化空间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
