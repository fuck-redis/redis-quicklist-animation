export type Language = 'java' | 'python' | 'go' | 'javascript';

export type SolutionId = 'countFill' | 'byteFill';

export interface InputConfig {
  values: Array<number | string>;
  fillByCount: number;
  fillByBytes: number;
  compressDepth: number;
  queuePopCount: number;
}

export interface QuickListEntry {
  id: string;
  value: number | string;
  bytes: number;
}

export interface QuickListNode {
  id: string;
  index: number;
  entries: QuickListEntry[];
  prev: string | null;
  next: string | null;
  rawBytes: number;
  isCompressed: boolean;
  compressionRatio: number;
}

export interface QuickListModel {
  head: string | null;
  tail: string | null;
  nodes: Record<string, QuickListNode>;
  totalElements: number;
  totalBytes: number;
}

export interface StepMetrics {
  splitCount: number;
  mergeCount: number;
  compressCount: number;
  operationCount: number;
  fillRate: number;
  memoryEfficiency: number;
}

export interface FlowArrow {
  fromKey: string;
  toKey: string;
  label: string;
  tone?: 'info' | 'success' | 'warn';
}

export interface Annotation {
  anchorKey: string;
  text: string;
  tone?: 'info' | 'success' | 'warn';
  dx?: number;
  dy?: number;
}

export interface AlgorithmStep {
  id: string;
  title: string;
  description: string;
  stage: string;
  model: QuickListModel;
  focusNodeIds: string[];
  focusEntryIds: string[];
  flowArrows: FlowArrow[];
  annotations: Annotation[];
  stackFrames: string[];
  variables: Record<string, string | number>;
  lineHighlights: Record<Language, number[]>;
  lineNotes: Record<Language, Record<number, string>>;
  metrics: StepMetrics;
}

export interface ScenarioPreset {
  key: string;
  label: string;
  hint: string;
  values: Array<number | string>;
  queuePopCount: number;
}
