import React from 'react';
import { AlgorithmStep } from '@/types/quicklistViz';
import styles from './ContextPanel.module.css';

interface ContextPanelProps {
  step: AlgorithmStep;
}

function asPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// 阶段中文解释
const STAGE_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  'init': { label: '初始化', icon: '🚀', desc: '创建空的 QuickList 数据结构' },
  'push.locateTail': { label: '定位插入位置', icon: '📍', desc: '找到链表的尾部节点，准备插入新数据' },
  'push.split': { label: '节点分裂', icon: '⚡', desc: '节点已满（达到 fill 限制），创建新节点来存储新数据' },
  'push.createNode': { label: '创建首节点', icon: '➕', desc: '链表为空，创建第一个节点作为 head 和 tail' },
  'push.insert': { label: '写入数据', icon: '✅', desc: '数据已成功写入 ZipList 压缩列表' },
  'compress.scan': { label: '扫描压缩区', icon: '🔍', desc: '检查哪些节点可以压缩（中间冷数据区域）' },
  'compress.apply': { label: '执行压缩', icon: '🗜️', desc: '对冷数据节点进行 LZF 压缩，节省内存' },
  'pop.remove': { label: '弹出元素', icon: '🗑️', desc: '从头部移除一个元素（LPOP 操作）' },
  'pop.dropNode': { label: '删除空节点', icon: '✂️', desc: '节点变空，从链表中移除它' },
  'pop.merge': { label: '合并节点', icon: '🔗', desc: '相邻节点元素很少，合并成一个节点节省内存' },
};

export const ContextPanel: React.FC<ContextPanelProps> = ({ step }) => {
  const stageInfo = STAGE_LABELS[step.stage] || { label: step.stage, icon: '📋', desc: '' };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.stageBadge}>
          <span className={styles.stageIcon}>{stageInfo.icon}</span>
          <span className={styles.stageLabel}>{stageInfo.label}</span>
        </div>
        <h3 className={styles.title}>{step.title}</h3>
        <p className={styles.description}>{step.description}</p>
        {stageInfo.desc && <p className={styles.stageDesc}>{stageInfo.desc}</p>}
      </div>

      <div className={styles.dataStructure}>
        <div className={styles.dsTitle}>📚 数据结构说明</div>
        <div className={styles.dsContent}>
          <div className={styles.dsItem}>
            <span className={styles.dsIcon}>📦</span>
            <span><b>QuickList</b> = 链表（管理多个节点）</span>
          </div>
          <div className={styles.dsItem}>
            <span className={styles.dsIcon}>🗂️</span>
            <span><b>ZipList</b> = 压缩列表（存储实际数据）</span>
          </div>
          <div className={styles.dsItem}>
            <span className={styles.dsIcon}>🔗</span>
            <span><b>NEXT/PREV</b> = 双向指针（连接节点）</span>
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>💾 节点数</span>
          <span className={styles.metricValue}>{step.metrics.operationCount > 0 ? '>' : '0'} / {step.metrics.splitCount + 1}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>📊 填充率</span>
          <span className={styles.metricValue}>{asPercent(step.metrics.fillRate)}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>🗜️ 压缩节点</span>
          <span className={styles.metricValue}>{step.metrics.compressCount}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>⚡ 内存效率</span>
          <span className={styles.metricValue}>{asPercent(step.metrics.memoryEfficiency)}</span>
        </div>
      </div>

      {step.focusNodeIds.length > 0 && (
        <div className={styles.focusInfo}>
          <div className={styles.focusTitle}>🎯 当前聚焦</div>
          <div className={styles.focusNodes}>
            {step.focusNodeIds.map(id => (
              <span key={id} className={styles.focusBadge}>
                节点 {id.replace('node-', '#')}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
