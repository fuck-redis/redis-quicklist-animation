import React, { useState } from 'react';
import { VisualizationArea } from '../components/layout/VisualizationArea';
import { ControlPanel } from '../components/layout/ControlPanel';
import { useQuickListStore } from '../store/quicklistStore';
import styles from './PlaygroundPage.module.css';

export const PlaygroundPage: React.FC = () => {
  const { quickList } = useQuickListStore();
  const [showGuide, setShowGuide] = useState(quickList.nodeCount === 0);
  
  const nodeArray = Object.values(quickList.nodes);
  
  const stats = {
    nodeCount: quickList.nodeCount,
    elementCount: quickList.totalElements,
    memoryUsage: (quickList.totalMemory / 1024).toFixed(1),
    avgFillRate: nodeArray.length > 0 && quickList.config.fill !== 0
      ? Math.round(nodeArray.reduce((sum: number, node) => sum + (node.elementCount / Math.abs(quickList.config.fill) * 100), 0) / nodeArray.length)
      : 0
  };
  
  // 当有数据时自动关闭引导
  React.useEffect(() => {
    if (quickList.nodeCount > 0 && showGuide) {
      setShowGuide(false);
    }
  }, [quickList.nodeCount, showGuide]);
  
  return (
    <div className={styles.playgroundPage}>
      {/* 页面头部 */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>🎮 可视化演示</h1>
          <p>亲手操作 QuickList，实时观察数据结构的变化</p>
        </div>
        
        {/* 实时统计栏 */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>节点数</span>
            <span className={styles.statValue}>{stats.nodeCount}</span>
            <span className={styles.statHint}>QuickList中的节点总数</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>元素数</span>
            <span className={styles.statValue}>{stats.elementCount}</span>
            <span className={styles.statHint}>所有节点中的元素总数</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>内存</span>
            <span className={styles.statValue}>{stats.memoryUsage}KB</span>
            <span className={styles.statHint}>QuickList占用的总内存</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>填充率</span>
            <span className={styles.statValue}>{stats.avgFillRate}%</span>
            <span className={styles.statHint}>节点的平均填充程度</span>
          </div>
        </div>
      </div>
      
      {/* 新手引导区域 */}
      {showGuide && (
        <div className={styles.guideOverlay}>
          <div className={styles.guideCard}>
            <button className={styles.guideClose} onClick={() => setShowGuide(false)}>×</button>
            <h2>🎯 快速上手指南</h2>
            <div className={styles.guideSteps}>
              <div className={styles.guideStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>创建QuickList</h4>
                  <p>点击右侧控制面板的<strong>「创建新QuickList」</strong>按钮</p>
                </div>
              </div>
              <div className={styles.guideStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>插入元素</h4>
                  <p>在输入框输入值，点击<strong>「头部插入」</strong>或<strong>「尾部插入」</strong></p>
                  <p className={styles.hint}>💡 试试「插入5个元素」快速测试</p>
                </div>
              </div>
              <div className={styles.guideStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>观察结构变化</h4>
                  <p>在左侧可视化区域查看QuickList的实时结构</p>
                  <p className={styles.hint}>💡 点击节点查看详情</p>
                </div>
              </div>
              <div className={styles.guideStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h4>探索更多</h4>
                  <p>切换不同标签页，查看内存分布、性能分析等</p>
                </div>
              </div>
            </div>
            <button className={styles.guideButton} onClick={() => setShowGuide(false)}>
              开始体验 →
            </button>
          </div>
        </div>
      )}
      
      {/* 主操作区域 */}
      <div className={styles.playground}>
        <div className={styles.visualizationSection}>
          <VisualizationArea />
        </div>
        
        <div className={styles.controlSection}>
          <ControlPanel />
        </div>
      </div>
      
      {/* 帮助按钮 */}
      {!showGuide && (
        <button className={styles.helpButton} onClick={() => setShowGuide(true)}>
          ❓ 显示引导
        </button>
      )}
    </div>
  );
};
