import {
  QuickListState,
  QuickListNode,
  QuickListConfig,
  OperationParams,
  QuickListOperationRecord,
  QuickListOperationType,
  DEFAULT_CONFIG,
  PerformanceMetrics,
} from '@/types';
import { createEmptyZipList, calculateEntrySize, ZipListEntry } from '@/types';

/**
 * 生成唯一ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建新的QuickList
 */
export function createQuickList(config?: Partial<QuickListConfig>): QuickListState {
  return {
    config: { ...DEFAULT_CONFIG, ...config },
    head: null,
    tail: null,
    nodeCount: 0,
    totalElements: 0,
    totalMemory: 0,
    nodes: {},
    operations: [],
  };
}

/**
 * 创建新节点
 */
function createNode(index: number, prev: string | null, next: string | null): QuickListNode {
  const id = generateId('node');
  const zl = createEmptyZipList();
  
  return {
    id,
    index,
    zl,
    elementCount: 0,
    memorySize: zl.totalSize + 16, // ZipList + 指针开销
    isCompressed: false,
    prev,
    next,
  };
}

/**
 * 计算节点内存大小
 */
function calculateNodeMemory(node: QuickListNode): number {
  let size = node.zl.totalSize + 16; // ZipList + 指针
  
  if (node.isCompressed && node.compressionRatio) {
    size = size * (1 - node.compressionRatio);
  }
  
  return Math.ceil(size);
}

/**
 * 向头部插入元素
 */
export function pushFront(
  state: QuickListState,
  value: string | number
): QuickListState {
  const startTime = Date.now();
  const newState = { ...state };
  const memoryBefore = newState.totalMemory;
  const elementCountBefore = newState.totalElements;
  
  // 如果没有节点，创建第一个节点
  if (!newState.head) {
    const node = createNode(0, null, null);
    newState.nodes[node.id] = node;
    newState.head = node.id;
    newState.tail = node.id;
    newState.nodeCount = 1;
  }
  
  const headNode = newState.nodes[newState.head!];
  const affectedNodes = [headNode.id];
  
  // 检查是否需要分裂
  if (headNode.elementCount >= newState.config.fill) {
    // 创建新的头节点
    const newHeadNode = createNode(0, null, headNode.id);
    newState.nodes[newHeadNode.id] = newHeadNode;
    headNode.prev = newHeadNode.id;
    headNode.index = 1;
    newState.head = newHeadNode.id;
    newState.nodeCount++;
    affectedNodes.push(newHeadNode.id);
    
    // 向新头节点插入
    insertToZipList(newHeadNode, value, 0);
  } else {
    // 向现有头节点插入
    insertToZipList(headNode, value, 0);
  }
  
  newState.totalElements++;
  newState.totalMemory = calculateTotalMemory(newState);
  
  // 记录操作
  const operation: QuickListOperationRecord = {
    id: generateId('op'),
    type: 'pushFront',
    params: { value, operationType: 'head' },
    timestamp: Date.now(),
    duration: Date.now() - startTime,
    affectedNodes,
    memoryBefore,
    memoryAfter: newState.totalMemory,
    elementCountBefore,
    elementCountAfter: newState.totalElements,
  };
  
  newState.operations.push(operation);
  
  return newState;
}

/**
 * 向尾部插入元素
 */
export function pushBack(
  state: QuickListState,
  value: string | number
): QuickListState {
  const startTime = Date.now();
  const newState = { ...state };
  const memoryBefore = newState.totalMemory;
  const elementCountBefore = newState.totalElements;
  
  // 如果没有节点，创建第一个节点
  if (!newState.tail) {
    const node = createNode(0, null, null);
    newState.nodes[node.id] = node;
    newState.head = node.id;
    newState.tail = node.id;
    newState.nodeCount = 1;
  }
  
  const tailNode = newState.nodes[newState.tail!];
  const affectedNodes = [tailNode.id];
  
  // 检查是否需要分裂
  if (tailNode.elementCount >= newState.config.fill) {
    // 创建新的尾节点
    const newTailNode = createNode(tailNode.index + 1, tailNode.id, null);
    newState.nodes[newTailNode.id] = newTailNode;
    tailNode.next = newTailNode.id;
    newState.tail = newTailNode.id;
    newState.nodeCount++;
    affectedNodes.push(newTailNode.id);
    
    // 向新尾节点插入
    insertToZipList(newTailNode, value, 0);
  } else {
    // 向现有尾节点插入
    insertToZipList(tailNode, value, tailNode.elementCount);
  }
  
  newState.totalElements++;
  newState.totalMemory = calculateTotalMemory(newState);
  
  // 记录操作
  const operation: QuickListOperationRecord = {
    id: generateId('op'),
    type: 'pushBack',
    params: { value, operationType: 'tail' },
    timestamp: Date.now(),
    duration: Date.now() - startTime,
    affectedNodes,
    memoryBefore,
    memoryAfter: newState.totalMemory,
    elementCountBefore,
    elementCountAfter: newState.totalElements,
  };
  
  newState.operations.push(operation);
  
  return newState;
}

/**
 * 向ZipList插入元素
 */
function insertToZipList(node: QuickListNode, value: string | number, index: number): void {
  const prevLen = index > 0 ? node.zl.entries[index - 1]?.totalSize || 0 : 0;
  const entrySize = calculateEntrySize(value, prevLen);
  
  const entry: ZipListEntry = {
    id: generateId('entry'),
    index,
    value,
    encoding: entrySize.encoding,
    prevLen: entrySize.prevLen,
    encodingSize: entrySize.encodingSize,
    dataSize: entrySize.dataSize,
    totalSize: entrySize.totalSize,
  };
  
  // 插入entry
  node.zl.entries.splice(index, 0, entry);
  
  // 更新后续entries的index和prevLen
  for (let i = index + 1; i < node.zl.entries.length; i++) {
    node.zl.entries[i].index = i;
    node.zl.entries[i].prevLen = node.zl.entries[i - 1].totalSize < 254 ? 1 : 5;
  }
  
  // 更新ZipList统计
  node.zl.zllen++;
  node.zl.zlbytes += entry.totalSize;
  node.zl.totalSize = node.zl.zlbytes;
  
  // 更新节点统计
  node.elementCount++;
  node.memorySize = calculateNodeMemory(node);
}

/**
 * 计算总内存
 */
function calculateTotalMemory(state: QuickListState): number {
  let total = 0;
  
  // QuickList结构开销
  total += 32; // 头部指针、尾部指针、计数器等
  
  // 所有节点的内存
  Object.values(state.nodes).forEach(node => {
    total += node.memorySize;
  });
  
  return total;
}

/**
 * 分裂节点
 */
export function splitNode(
  state: QuickListState,
  nodeId: string
): QuickListState {
  const startTime = Date.now();
  const newState = { ...state };
  const node = newState.nodes[nodeId];
  
  if (!node || node.elementCount < 2) {
    return state; // 不需要分裂
  }
  
  const memoryBefore = newState.totalMemory;
  const splitPoint = Math.floor(node.elementCount / 2);
  
  // 创建新节点
  const newNode = createNode(node.index + 1, node.id, node.next);
  
  // 转移后半部分元素
  const movedEntries = node.zl.entries.splice(splitPoint);
  newNode.zl.entries = movedEntries.map((entry, i) => ({ ...entry, index: i }));
  newNode.elementCount = movedEntries.length;
  newNode.zl.zllen = movedEntries.length;
  
  // 更新原节点
  node.elementCount = node.zl.entries.length;
  node.zl.zllen = node.elementCount;
  node.next = newNode.id;
  
  // 更新链接
  if (node.next) {
    const nextNode = newState.nodes[node.next];
    if (nextNode) {
      nextNode.prev = newNode.id;
    }
  } else {
    newState.tail = newNode.id;
  }
  
  // 更新内存
  recalculateZipListSize(node.zl);
  recalculateZipListSize(newNode.zl);
  node.memorySize = calculateNodeMemory(node);
  newNode.memorySize = calculateNodeMemory(newNode);
  
  newState.nodes[newNode.id] = newNode;
  newState.nodeCount++;
  newState.totalMemory = calculateTotalMemory(newState);
  
  // 更新所有节点的index
  reindexNodes(newState);
  
  // 记录操作
  const operation: QuickListOperationRecord = {
    id: generateId('op'),
    type: 'splitNode',
    params: { targetNode: nodeId },
    timestamp: Date.now(),
    duration: Date.now() - startTime,
    affectedNodes: [node.id, newNode.id],
    memoryBefore,
    memoryAfter: newState.totalMemory,
    elementCountBefore: newState.totalElements,
    elementCountAfter: newState.totalElements,
  };
  
  newState.operations.push(operation);
  
  return newState;
}

/**
 * 合并节点
 */
export function mergeNodes(
  state: QuickListState,
  nodeId1: string,
  nodeId2: string
): QuickListState {
  const startTime = Date.now();
  const newState = { ...state };
  const node1 = newState.nodes[nodeId1];
  const node2 = newState.nodes[nodeId2];
  
  if (!node1 || !node2 || node1.next !== nodeId2) {
    return state; // 不能合并
  }
  
  const memoryBefore = newState.totalMemory;
  
  // 将node2的元素合并到node1
  const offset = node1.zl.entries.length;
  node2.zl.entries.forEach((entry, i) => {
    node1.zl.entries.push({ ...entry, index: offset + i });
  });
  
  // 更新node1
  node1.elementCount += node2.elementCount;
  node1.zl.zllen = node1.elementCount;
  node1.next = node2.next;
  
  // 更新链接
  if (node2.next) {
    const nextNode = newState.nodes[node2.next];
    if (nextNode) {
      nextNode.prev = node1.id;
    }
  } else {
    newState.tail = node1.id;
  }
  
  // 删除node2
  delete newState.nodes[nodeId2];
  newState.nodeCount--;
  
  // 更新内存
  recalculateZipListSize(node1.zl);
  node1.memorySize = calculateNodeMemory(node1);
  newState.totalMemory = calculateTotalMemory(newState);
  
  // 更新所有节点的index
  reindexNodes(newState);
  
  // 记录操作
  const operation: QuickListOperationRecord = {
    id: generateId('op'),
    type: 'mergeNodes',
    params: { targetNode: nodeId1 },
    timestamp: Date.now(),
    duration: Date.now() - startTime,
    affectedNodes: [node1.id, nodeId2],
    memoryBefore,
    memoryAfter: newState.totalMemory,
    elementCountBefore: newState.totalElements,
    elementCountAfter: newState.totalElements,
  };
  
  newState.operations.push(operation);
  
  return newState;
}

/**
 * 压缩节点
 */
export function compressNode(
  state: QuickListState,
  nodeId: string
): QuickListState {
  const newState = { ...state };
  const node = newState.nodes[nodeId];
  
  if (!node || node.isCompressed) {
    return state;
  }
  
  const memoryBefore = newState.totalMemory;
  
  // 模拟压缩：假设压缩率在30%-70%之间
  node.isCompressed = true;
  node.compressionRatio = 0.3 + Math.random() * 0.4;
  node.memorySize = calculateNodeMemory(node);
  
  newState.totalMemory = calculateTotalMemory(newState);
  
  // 记录操作
  const operation: QuickListOperationRecord = {
    id: generateId('op'),
    type: 'compressNode',
    params: { targetNode: nodeId },
    timestamp: Date.now(),
    duration: Date.now() - Date.now(),
    affectedNodes: [nodeId],
    memoryBefore,
    memoryAfter: newState.totalMemory,
    elementCountBefore: newState.totalElements,
    elementCountAfter: newState.totalElements,
  };
  
  newState.operations.push(operation);
  
  return newState;
}

/**
 * 重新计算ZipList大小
 */
function recalculateZipListSize(zl: any): void {
  let total = zl.headerSize + zl.endSize;
  zl.entries.forEach((entry: any) => {
    total += entry.totalSize;
  });
  zl.zlbytes = total;
  zl.totalSize = total;
}

/**
 * 重新索引所有节点
 */
function reindexNodes(state: QuickListState): void {
  let current = state.head;
  let index = 0;
  
  while (current) {
    const node = state.nodes[current];
    node.index = index++;
    current = node.next;
  }
}

/**
 * 计算性能指标
 */
export function calculateMetrics(state: QuickListState): PerformanceMetrics {
  const nodes = Object.values(state.nodes);
  
  // 计算平均填充率
  const avgFillRate = nodes.length > 0
    ? nodes.reduce((sum, node) => sum + node.elementCount / state.config.fill, 0) / nodes.length
    : 0;
  
  // 计算内存效率
  const dataSize = nodes.reduce((sum, node) => {
    return sum + node.zl.entries.reduce((s, e) => s + e.dataSize, 0);
  }, 0);
  const memoryEfficiency = state.totalMemory > 0 ? dataSize / state.totalMemory : 0;
  
  // 计算碎片率
  const usedSpace = nodes.reduce((sum, node) => sum + node.elementCount, 0);
  const totalSpace = nodes.length * state.config.fill;
  const fragmentationRate = totalSpace > 0 ? 1 - usedSpace / totalSpace : 0;
  
  // 计算平衡得分
  const fillRates = nodes.map(n => n.elementCount / state.config.fill);
  const avgRate = fillRates.reduce((a, b) => a + b, 0) / fillRates.length;
  const variance = fillRates.reduce((sum, rate) => sum + Math.pow(rate - avgRate, 2), 0) / fillRates.length;
  const balanceScore = Math.max(0, 100 - variance * 100);
  
  // 统计操作次数
  const operationCount = state.operations.length;
  const splitCount = state.operations.filter(op => op.type === 'splitNode').length;
  const mergeCount = state.operations.filter(op => op.type === 'mergeNodes').length;
  const compressionCount = state.operations.filter(op => op.type === 'compressNode').length;
  
  return {
    operationCount,
    splitCount,
    mergeCount,
    compressionCount,
    averageFillRate: avgFillRate * 100,
    memoryEfficiency: memoryEfficiency * 100,
    fragmentationRate: fragmentationRate * 100,
    balanceScore,
  };
}
