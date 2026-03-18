import React from 'react';
import { SolutionId } from '@/types/quicklistViz';
import styles from './IdeaModal.module.css';

interface IdeaModalProps {
  open: boolean;
  solutionId: SolutionId;
  onClose: () => void;
}

const IDEA_TEXT: Record<SolutionId, string[]> = {
  countFill: [
    '核心建模：双向链表节点 + 每个节点内部 ZipList(entry数组)。',
    '分裂触发：tail 节点 entry 数量达到 fill(count) 时，创建新节点承接写入。',
    '队列弹出：从 head 删除 entry，空节点回收；若 head 与 next 足够小则执行合并。',
    '压缩策略：按 compressDepth 仅压缩中间冷区节点，头尾热区保持未压缩。',
    '教学重点：用分镜展示节点创建、指针更新、数据搬运和内存变化。',
  ],
  byteFill: [
    '核心建模：按 entry 估算字节控制分裂阈值，模拟 Redis 在空间层面的决策。',
    '分裂触发：rawBytes + entryBytes 超过 fill(bytes) 时，创建新节点并迁移半数 entry。',
    '合并策略：弹出后按字节阈值判断是否合并，避免碎片节点常驻。',
    '压缩策略：中段节点标记压缩，呈现内存节省与访问成本的权衡。',
    '教学重点：同一输入下对比 count-fill 与 byte-fill 的不同镜头轨迹。',
  ],
};

export const IdeaModal: React.FC<IdeaModalProps> = ({ open, solutionId, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.mask} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <h3 className={styles.title}>算法思路</h3>
        <ul className={styles.list}>
          {IDEA_TEXT[solutionId].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          我知道了
        </button>
      </div>
    </div>
  );
};
