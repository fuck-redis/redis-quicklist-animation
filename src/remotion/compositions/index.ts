// Re-export all compositions for use with Remotion Player
export { QuickListOverview } from './QuickListOverview';
export { NodeSplit } from './NodeSplit';
export { NodeMerge } from './NodeMerge';
export { Compression } from './Compression';
export { ZipListStructure } from './ZipListStructure';
export { QueueOperations } from './QueueOperations';
export { Comparison } from './Comparison';
export { FillConfig } from './FillConfig';
export { LInsertOps } from './LInsertOps';
export { MemoryOptimization } from './MemoryOptimization';
export { Scenarios } from './Scenarios';
export { PerformanceSummary } from './PerformanceSummary';

export type AnimationType =
  | 'overview'
  | 'split'
  | 'merge'
  | 'compression'
  | 'ziplist'
  | 'lpush'
  | 'rpush'
  | 'lpop'
  | 'rpop'
  | 'comparison'
  | 'fillconfig'
  | 'linsert'
  | 'memory'
  | 'scenarios'
  | 'performance';
