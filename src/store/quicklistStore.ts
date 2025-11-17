import { create } from 'zustand';
import {
  QuickListState,
  AnimationState,
  PerformanceMetrics,
  ScenarioConfig,
  QuickListConfig,
} from '@/types';
import {
  createQuickList,
  pushFront,
  pushBack,
  splitNode,
  mergeNodes,
  compressNode,
  calculateMetrics,
} from '@/utils/quicklistOps';

interface QuickListStore {
  // 状态
  quickList: QuickListState;
  animation: AnimationState;
  metrics: PerformanceMetrics;
  selectedNodeId: string | null;
  
  // 操作
  createList: (config?: Partial<QuickListConfig>) => void;
  pushFrontValue: (value: string | number) => void;
  pushBackValue: (value: string | number) => void;
  splitNodeById: (nodeId: string) => void;
  mergeNodesById: (nodeId1: string, nodeId2: string) => void;
  compressNodeById: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  updateConfig: (config: Partial<QuickListConfig>) => void;
  runScenario: (scenario: ScenarioConfig) => Promise<void>;
  reset: () => void;
  
  // 动画控制
  playAnimation: () => void;
  pauseAnimation: () => void;
  stopAnimation: () => void;
  setAnimationSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
}

const initialAnimationState: AnimationState = {
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 1.0,
  isPaused: false,
};

export const useQuickListStore = create<QuickListStore>((set, get) => ({
  quickList: createQuickList(),
  animation: initialAnimationState,
  metrics: {
    operationCount: 0,
    splitCount: 0,
    mergeCount: 0,
    compressionCount: 0,
    averageFillRate: 0,
    memoryEfficiency: 0,
    fragmentationRate: 0,
    balanceScore: 100,
  },
  selectedNodeId: null,
  
  createList: (config) => {
    const quickList = createQuickList(config);
    set({
      quickList,
      metrics: calculateMetrics(quickList),
      selectedNodeId: null,
    });
  },
  
  pushFrontValue: (value) => {
    const { quickList } = get();
    const newQuickList = pushFront(quickList, value);
    set({
      quickList: newQuickList,
      metrics: calculateMetrics(newQuickList),
    });
  },
  
  pushBackValue: (value) => {
    const { quickList } = get();
    const newQuickList = pushBack(quickList, value);
    set({
      quickList: newQuickList,
      metrics: calculateMetrics(newQuickList),
    });
  },
  
  splitNodeById: (nodeId) => {
    const { quickList } = get();
    const newQuickList = splitNode(quickList, nodeId);
    set({
      quickList: newQuickList,
      metrics: calculateMetrics(newQuickList),
    });
  },
  
  mergeNodesById: (nodeId1, nodeId2) => {
    const { quickList } = get();
    const newQuickList = mergeNodes(quickList, nodeId1, nodeId2);
    set({
      quickList: newQuickList,
      metrics: calculateMetrics(newQuickList),
    });
  },
  
  compressNodeById: (nodeId) => {
    const { quickList } = get();
    const newQuickList = compressNode(quickList, nodeId);
    set({
      quickList: newQuickList,
      metrics: calculateMetrics(newQuickList),
    });
  },
  
  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },
  
  updateConfig: (config) => {
    const { quickList } = get();
    const newQuickList = {
      ...quickList,
      config: { ...quickList.config, ...config },
    };
    set({
      quickList: newQuickList,
      metrics: calculateMetrics(newQuickList),
    });
  },
  
  runScenario: async (scenario) => {
    const { createList, pushFrontValue, pushBackValue } = get();
    
    // 应用场景配置
    createList(scenario.setup);
    
    // 执行场景动作
    for (const action of scenario.actions) {
      await new Promise(resolve => setTimeout(resolve, action.delay || 500));
      
      switch (action.type) {
        case 'pushFront':
          if (action.params.value !== undefined) {
            pushFrontValue(action.params.value);
          }
          break;
        case 'pushBack':
          if (action.params.value !== undefined) {
            pushBackValue(action.params.value);
          }
          break;
        // 其他操作...
      }
    }
  },
  
  reset: () => {
    set({
      quickList: createQuickList(),
      animation: initialAnimationState,
      metrics: {
        operationCount: 0,
        splitCount: 0,
        mergeCount: 0,
        compressionCount: 0,
        averageFillRate: 0,
        memoryEfficiency: 0,
        fragmentationRate: 0,
        balanceScore: 100,
      },
      selectedNodeId: null,
    });
  },
  
  playAnimation: () => {
    set(state => ({
      animation: { ...state.animation, isPlaying: true, isPaused: false },
    }));
  },
  
  pauseAnimation: () => {
    set(state => ({
      animation: { ...state.animation, isPaused: true },
    }));
  },
  
  stopAnimation: () => {
    set(state => ({
      animation: { ...state.animation, isPlaying: false, isPaused: false, currentStep: 0 },
    }));
  },
  
  setAnimationSpeed: (speed) => {
    set(state => ({
      animation: { ...state.animation, speed },
    }));
  },
  
  stepForward: () => {
    set(state => {
      const newStep = Math.min(state.animation.currentStep + 1, state.animation.totalSteps);
      return {
        animation: { ...state.animation, currentStep: newStep },
      };
    });
  },
  
  stepBackward: () => {
    set(state => {
      const newStep = Math.max(state.animation.currentStep - 1, 0);
      return {
        animation: { ...state.animation, currentStep: newStep },
      };
    });
  },
}));
