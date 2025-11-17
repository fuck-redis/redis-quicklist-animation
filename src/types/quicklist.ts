import { ZipListState } from './ziplist';

/**
 * QuickList 配置参数
 */
export interface QuickListConfig {
  fill: number;           // 每个ZipList节点的最大元素数量
  compress: number;       // 压缩深度，0=不压缩
  maxMemory: number;      // 最大内存限制(字节)
  autoRebalance: boolean; // 自动重新平衡
  enableCompression: boolean; // 启用压缩
}

/**
 * QuickList 节点
 */
export interface QuickListNode {
  id: string;                    // 节点唯一标识
  index: number;                 // 在链表中的位置
  zl: ZipListState;              // 内部的ZipList状态
  elementCount: number;          // 当前元素数量
  memorySize: number;            // 内存占用大小
  isCompressed: boolean;         // 是否被压缩
  compressionRatio?: number;     // 压缩率 (0-1)
  prev: string | null;           // 前驱节点ID
  next: string | null;           // 后继节点ID
  isHighlighted?: boolean;       // 是否高亮显示
  isSplitting?: boolean;         // 是否正在分裂
  isMerging?: boolean;           // 是否正在合并
}

/**
 * QuickList 整体状态
 */
export interface QuickListState {
  config: QuickListConfig;
  head: string | null;           // 头节点ID
  tail: string | null;           // 尾节点ID
  nodeCount: number;             // 节点数量
  totalElements: number;         // 总元素数量
  totalMemory: number;           // 总内存占用
  nodes: { [id: string]: QuickListNode }; // 节点映射
  operations: QuickListOperationRecord[]; // 操作历史
}

/**
 * 操作类型
 */
export type QuickListOperationType = 
  | 'create'              // 创建QuickList
  | 'pushFront'           // 头部插入
  | 'pushBack'            // 尾部插入
  | 'popFront'            // 头部弹出
  | 'popBack'             // 尾部弹出
  | 'insertAt'            // 指定位置插入
  | 'deleteAt'            // 指定位置删除
  | 'splitNode'           // 分裂节点
  | 'mergeNodes'          // 合并节点
  | 'compressNode'        // 压缩节点
  | 'decompressNode'      // 解压节点
  | 'rebalance'           // 重新平衡
  | 'batchOperation'      // 批量操作
  | 'configure';          // 配置调整

/**
 * 操作参数
 */
export interface OperationParams {
  position?: number;              // 全局位置索引
  value?: string | number;        // 元素值
  values?: (string | number)[];   // 批量值
  targetNode?: string;            // 目标节点ID
  nodeIndex?: number;             // 节点内索引
  operationType?: 'head' | 'tail' | 'middle'; // 操作位置
  fillFactor?: number;            // 填充因子调整
  compressDepth?: number;         // 压缩深度调整
  config?: Partial<QuickListConfig>; // 配置更新
}

/**
 * 操作记录
 */
export interface QuickListOperationRecord {
  id: string;                          // 操作ID
  type: QuickListOperationType;        // 操作类型
  params: OperationParams;             // 操作参数
  timestamp: number;                   // 时间戳
  duration: number;                    // 执行时间(ms)
  affectedNodes: string[];             // 影响的节点
  memoryBefore: number;                // 操作前内存
  memoryAfter: number;                 // 操作后内存
  elementCountBefore: number;          // 操作前元素数
  elementCountAfter: number;           // 操作后元素数
}

/**
 * 默认配置
 */
export const DEFAULT_CONFIG: QuickListConfig = {
  fill: 10,
  compress: 0,
  maxMemory: 10 * 1024 * 1024, // 10MB
  autoRebalance: false,
  enableCompression: false,
};

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  operationCount: number;        // 操作次数
  splitCount: number;            // 分裂次数
  mergeCount: number;            // 合并次数
  compressionCount: number;      // 压缩次数
  averageFillRate: number;       // 平均填充率
  memoryEfficiency: number;      // 内存效率
  fragmentationRate: number;     // 碎片率
  balanceScore: number;          // 平衡得分(0-100)
}

/**
 * 动画状态
 */
export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;                 // 播放速度(1.0为正常)
  isPaused: boolean;
}

/**
 * 场景配置
 */
export interface ScenarioConfig {
  name: string;
  description: string;
  setup: Partial<QuickListConfig>;
  actions: Array<{
    type: QuickListOperationType;
    params: OperationParams;
    delay?: number;
  }>;
  metrics: string[];
}
