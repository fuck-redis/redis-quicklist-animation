import { ScenarioConfig } from '@/types';

/**
 * 预定义的测试场景
 */
export const SCENARIOS: ScenarioConfig[] = [
  {
    name: '基础插入操作',
    description: '演示基础的头尾插入操作',
    setup: { fill: 8, compress: 0 },
    actions: [
      { type: 'pushBack', params: { value: 1 }, delay: 500 },
      { type: 'pushBack', params: { value: 2 }, delay: 500 },
      { type: 'pushBack', params: { value: 3 }, delay: 500 },
      { type: 'pushFront', params: { value: 0 }, delay: 500 },
      { type: 'pushFront', params: { value: -1 }, delay: 500 },
    ],
    metrics: ['节点数量', '元素数量', '内存使用'],
  },
  
  {
    name: '节点分裂演示',
    description: '插入足够多的元素触发节点分裂',
    setup: { fill: 5, compress: 0 },
    actions: [
      { type: 'pushBack', params: { value: 1 }, delay: 300 },
      { type: 'pushBack', params: { value: 2 }, delay: 300 },
      { type: 'pushBack', params: { value: 3 }, delay: 300 },
      { type: 'pushBack', params: { value: 4 }, delay: 300 },
      { type: 'pushBack', params: { value: 5 }, delay: 300 },
      { type: 'pushBack', params: { value: 6 }, delay: 300 }, // 触发分裂
      { type: 'pushBack', params: { value: 7 }, delay: 300 },
      { type: 'pushBack', params: { value: 8 }, delay: 300 },
    ],
    metrics: ['分裂次数', '节点数量', '平均填充率'],
  },
  
  {
    name: '大量小元素',
    description: '测试QuickList处理大量小元素的性能',
    setup: { fill: 8, compress: 0 },
    actions: Array.from({ length: 50 }, (_, i) => ({
      type: 'pushBack' as const,
      params: { value: i + 1 },
      delay: 100,
    })),
    metrics: ['节点数量', '内存使用', '操作时间'],
  },
  
  {
    name: '压缩效果测试',
    description: '测试不同压缩深度的效果',
    setup: { fill: 8, compress: 2, enableCompression: true },
    actions: [
      ...Array.from({ length: 32 }, (_, i) => ({
        type: 'pushBack' as const,
        params: { value: `data_${i}` },
        delay: 100,
      })),
      { type: 'compressNode', params: { targetNode: '' }, delay: 1000 },
    ],
    metrics: ['压缩率', '内存节省', '节点状态'],
  },
  
  {
    name: '队列工作模式',
    description: '模拟队列使用场景：尾部入队，头部出队',
    setup: { fill: 10, compress: 0 },
    actions: [
      // 先填充一些数据
      ...Array.from({ length: 15 }, (_, i) => ({
        type: 'pushBack' as const,
        params: { value: i + 1 },
        delay: 200,
      })),
      // 模拟队列操作
      { type: 'pushBack', params: { value: 16 }, delay: 300 },
      { type: 'popFront', params: {}, delay: 300 },
      { type: 'pushBack', params: { value: 17 }, delay: 300 },
      { type: 'popFront', params: {}, delay: 300 },
    ],
    metrics: ['头节点压力', '尾节点压力', '操作性能'],
  },
  
  {
    name: '内存敏感场景',
    description: '大节点+压缩以优化内存使用',
    setup: { fill: 32, compress: 2, enableCompression: true },
    actions: Array.from({ length: 100 }, (_, i) => ({
      type: 'pushBack' as const,
      params: { value: `item_${i}` },
      delay: 50,
    })),
    metrics: ['节点数量', '内存使用', '压缩率', '内存效率'],
  },
];

/**
 * 性能对比场景
 */
export const COMPARISON_SCENARIOS = [
  {
    name: '小fill值 vs 大fill值',
    scenarios: [
      {
        name: 'Fill=4',
        config: { fill: 4, compress: 0 },
      },
      {
        name: 'Fill=16',
        config: { fill: 16, compress: 0 },
      },
      {
        name: 'Fill=50',
        config: { fill: 50, compress: 0 },
      },
    ],
  },
  {
    name: '压缩深度对比',
    scenarios: [
      {
        name: 'Compress=0',
        config: { fill: 16, compress: 0 },
      },
      {
        name: 'Compress=1',
        config: { fill: 16, compress: 1 },
      },
      {
        name: 'Compress=2',
        config: { fill: 16, compress: 2 },
      },
    ],
  },
];

/**
 * 优化配置方案
 */
export const OPTIMIZATION_PROFILES = [
  {
    name: '高吞吐量场景',
    description: '大量写入操作',
    config: { fill: 8, compress: 0, autoRebalance: true, enableCompression: false },
    reasoning: '小节点减少分裂开销，禁用压缩保证写入性能',
    useCase: '消息队列、实时数据流',
  },
  {
    name: '内存敏感场景',
    description: '内存有限，数据量大',
    config: { fill: 32, compress: 2, autoRebalance: false, enableCompression: true },
    reasoning: '大节点减少元数据开销，压缩节省内存',
    useCase: '缓存系统、大数据集',
  },
  {
    name: '混合工作负载',
    description: '读写平衡',
    config: { fill: 16, compress: 1, autoRebalance: true, enableCompression: true },
    reasoning: '平衡的内存效率和操作性能',
    useCase: '通用场景、Web应用',
  },
  {
    name: '读密集场景',
    description: '主要是读取操作',
    config: { fill: 50, compress: 0, autoRebalance: false, enableCompression: false },
    reasoning: '大节点减少节点遍历，不压缩保证读取速度',
    useCase: '配置数据、静态内容',
  },
];
