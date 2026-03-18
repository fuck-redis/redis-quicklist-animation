import { SOLUTION_CODES } from '@/data/quicklistCode';
import {
  AlgorithmStep,
  InputConfig,
  Language,
  QuickListModel,
  SolutionId,
  StepMetrics,
} from '@/types/quicklistViz';
import {
  applyCompression,
  cloneModel,
  createEmptyModel,
  nodesInOrder,
  popFront,
  pushBackByBytes,
  pushBackByCount,
  resetModelCounters,
} from '@/utils/quicklistModel';

interface MutableMetrics {
  splitCount: number;
  mergeCount: number;
  compressCount: number;
  operationCount: number;
}

interface StepDraft {
  title: string;
  description: string;
  stage: string;
  focusNodeIds?: string[];
  focusEntryIds?: string[];
  flowArrows?: AlgorithmStep['flowArrows'];
  annotations?: AlgorithmStep['annotations'];
  stackFrames?: string[];
  variables?: Record<string, string | number>;
  lineRuntime?: Record<number, string>;
}

function computeMetrics(model: QuickListModel, counters: MutableMetrics): StepMetrics {
  const ordered = nodesInOrder(model);
  const fillRate = ordered.length === 0
    ? 0
    : ordered.reduce((sum, node) => sum + node.entries.length, 0) /
      (ordered.length * Math.max(1, ordered.reduce((max, node) => Math.max(max, node.entries.length), 1)));

  const dataBytes = ordered.reduce(
    (sum, node) => sum + node.entries.reduce((entrySum, entry) => entrySum + entry.bytes, 0),
    0
  );

  const memoryEfficiency = model.totalBytes > 0 ? dataBytes / model.totalBytes : 0;

  return {
    splitCount: counters.splitCount,
    mergeCount: counters.mergeCount,
    compressCount: counters.compressCount,
    operationCount: counters.operationCount,
    fillRate,
    memoryEfficiency,
  };
}

function buildLineHighlights(solutionId: SolutionId, stage: string): Record<Language, number[]> {
  const stageLines = SOLUTION_CODES[solutionId].stageLineMap[stage];
  return {
    java: stageLines?.java ?? [],
    python: stageLines?.python ?? [],
    go: stageLines?.go ?? [],
    javascript: stageLines?.javascript ?? [],
  };
}

function buildLineNotes(
  solutionId: SolutionId,
  stage: string,
  runtime: Record<number, string> | undefined
): Record<Language, Record<number, string>> {
  const base: Record<Language, Record<number, string>> = {
    java: {},
    python: {},
    go: {},
    javascript: {},
  };

  if (!runtime) {
    return base;
  }

  const stageLines = SOLUTION_CODES[solutionId].stageLineMap[stage];
  if (!stageLines) {
    return base;
  }

  (Object.keys(base) as Language[]).forEach((language) => {
    const firstLine = stageLines[language]?.[0];
    if (typeof firstLine === 'number') {
      base[language][firstLine] = Object.values(runtime).join(' | ');
    }
  });

  return base;
}

function pushStep(
  steps: AlgorithmStep[],
  solutionId: SolutionId,
  model: QuickListModel,
  counters: MutableMetrics,
  draft: StepDraft
): void {
  const metrics = computeMetrics(model, counters);
  const step: AlgorithmStep = {
    id: `step-${steps.length + 1}`,
    title: draft.title,
    description: draft.description,
    stage: draft.stage,
    model: cloneModel(model),
    focusNodeIds: draft.focusNodeIds ?? [],
    focusEntryIds: draft.focusEntryIds ?? [],
    flowArrows: draft.flowArrows ?? [],
    annotations: draft.annotations ?? [],
    stackFrames: draft.stackFrames ?? [],
    variables: draft.variables ?? {},
    lineHighlights: buildLineHighlights(solutionId, draft.stage),
    lineNotes: buildLineNotes(solutionId, draft.stage, draft.lineRuntime),
    metrics,
  };

  steps.push(step);
}

function prettyValues(values: Array<number | string>): string {
  return `[${values.map((item) => (typeof item === 'number' ? item : `"${item}"`)).join(', ')}]`;
}

export function generateQuickListSteps(solutionId: SolutionId, config: InputConfig): AlgorithmStep[] {
  resetModelCounters();
  const model = createEmptyModel();
  const counters: MutableMetrics = {
    splitCount: 0,
    mergeCount: 0,
    compressCount: 0,
    operationCount: 0,
  };

  const steps: AlgorithmStep[] = [];

  pushStep(steps, solutionId, model, counters, {
    title: '初始化 QuickList',
    description: '建立空链表，等待输入数据进入尾节点。',
    stage: 'init',
    stackFrames: ['run(values, fill, compressDepth)'],
    annotations: [
      {
        anchorKey: 'meta:input',
        text: `输入序列 ${prettyValues(config.values)}`,
        tone: 'info',
      },
    ],
    variables: {
      head: 'null',
      tail: 'null',
      totalElements: 0,
    },
    lineRuntime: {
      1: `values=${config.values.length}个`,
    },
  });

  config.values.forEach((value, index) => {
    counters.operationCount += 1;

    const orderedBefore = nodesInOrder(model);
    const tailBefore = orderedBefore[orderedBefore.length - 1];

    pushStep(steps, solutionId, model, counters, {
      title: `插入值 ${String(value)}`,
      description: '定位 tail 节点并检查 fill 限制。',
      stage: 'push.locateTail',
      focusNodeIds: tailBefore ? [tailBefore.id] : [],
      flowArrows: [
        {
          fromKey: 'meta:input',
          toKey: tailBefore ? `node:${tailBefore.id}` : 'meta:new-node-slot',
          label: `待插入 value=${String(value)}`,
        },
      ],
      annotations: tailBefore
        ? [
            {
              anchorKey: `node:${tailBefore.id}`,
              text: '检查是否需要分裂',
              tone: 'warn',
              dy: -40,
            },
          ]
        : [
            {
              anchorKey: 'meta:new-node-slot',
              text: '当前为空，创建首节点',
              tone: 'info',
            },
          ],
      stackFrames: [`run -> pushBack(${String(value)})`],
      variables: {
        opIndex: index + 1,
        tail: tailBefore?.id ?? 'null',
      },
      lineRuntime: {
        1: `value=${String(value)}`,
      },
    });

    const pushResult = solutionId === 'countFill'
      ? pushBackByCount(model, value, config.fillByCount)
      : pushBackByBytes(model, value, config.fillByBytes);

    if (pushResult.splitHappened) {
      counters.splitCount += 1;

      pushStep(steps, solutionId, model, counters, {
        title: '触发节点分裂',
        description:
          solutionId === 'countFill'
            ? 'tail 节点达到元素上限，创建新节点承接后续写入。'
            : 'tail 节点达到字节上限，创建新节点并迁移部分数据。',
        stage: 'push.split',
        focusNodeIds: [pushResult.nodeUsedId, pushResult.createdNodeId ?? pushResult.nodeUsedId],
        focusEntryIds: pushResult.movedEntryIds ?? [],
        flowArrows: [
          {
            fromKey: `node:${pushResult.nodeUsedId}`,
            toKey: pushResult.createdNodeId ? `node:${pushResult.createdNodeId}` : `node:${pushResult.nodeUsedId}`,
            label: solutionId === 'countFill' ? '链表新增节点' : '迁移半数 entry',
            tone: 'warn',
          },
        ],
        annotations: [
          {
            anchorKey: pushResult.createdNodeId ? `node:${pushResult.createdNodeId}` : `node:${pushResult.nodeUsedId}`,
            text: solutionId === 'countFill' ? '新 tail 节点' : '新 tail + 数据迁移',
            tone: 'warn',
            dy: -38,
          },
        ],
        stackFrames: [`run -> split tail for ${String(value)}`],
        variables: {
          splitCount: counters.splitCount,
          newTail: pushResult.createdNodeId ?? pushResult.nodeUsedId,
        },
        lineRuntime: {
          1: solutionId === 'countFill' ? 'entries >= fillByCount' : 'rawBytes + entryBytes > fillByBytes',
        },
      });
    } else if (pushResult.createdNodeId) {
      pushStep(steps, solutionId, model, counters, {
        title: '创建新节点',
        description: '无可用 tail，先创建 QuickList 首节点。',
        stage: 'push.createNode',
        focusNodeIds: [pushResult.createdNodeId],
        annotations: [
          {
            anchorKey: `node:${pushResult.createdNodeId}`,
            text: '首节点创建完成',
            tone: 'success',
            dy: -36,
          },
        ],
        stackFrames: [`run -> createNode for ${String(value)}`],
        variables: {
          nodeId: pushResult.createdNodeId,
        },
      });
    }

    pushStep(steps, solutionId, model, counters, {
      title: '写入 Entry',
      description: `值 ${String(value)} 已写入 tail，对应 ZipList 增加一个 entry。`,
      stage: 'push.insert',
      focusNodeIds: [pushResult.nodeUsedId],
      focusEntryIds: [pushResult.insertedEntryId],
      flowArrows: [
        {
          fromKey: 'meta:input',
          toKey: `entry:${pushResult.insertedEntryId}`,
          label: `entry=${String(value)}`,
          tone: 'success',
        },
      ],
      annotations: [
        {
          anchorKey: `entry:${pushResult.insertedEntryId}`,
          text: '新 entry',
          tone: 'success',
          dy: -30,
        },
      ],
      stackFrames: [`run -> pushBack(${String(value)}) -> append`],
      variables: {
        tail: pushResult.nodeUsedId,
        totalElements: model.totalElements,
        totalBytes: model.totalBytes,
      },
      lineRuntime: {
        1: `tail=${pushResult.nodeUsedId}`,
        2: `totalElements=${model.totalElements}`,
      },
    });

    const compressedNodeIds = applyCompression(model, config.compressDepth);
    if (compressedNodeIds.length > 0) {
      counters.compressCount += compressedNodeIds.length;

      pushStep(steps, solutionId, model, counters, {
        title: '扫描压缩区域',
        description: '根据 compressDepth 保留头尾热区，将中间冷区节点纳入压缩范围。',
        stage: 'compress.scan',
        focusNodeIds: compressedNodeIds,
        annotations: compressedNodeIds.map((id, seq) => ({
          anchorKey: `node:${id}`,
          text: `冷区节点 #${seq + 1}`,
          tone: 'info',
          dy: -34,
        })),
        stackFrames: ['run -> compress scan'],
        variables: {
          compressDepth: config.compressDepth,
          compressed: compressedNodeIds.length,
        },
      });

      pushStep(steps, solutionId, model, counters, {
        title: '执行节点压缩',
        description: '中间节点进入压缩态，内存占用下降，访问代价上升。',
        stage: 'compress.apply',
        focusNodeIds: compressedNodeIds,
        annotations: compressedNodeIds.map((id) => ({
          anchorKey: `node:${id}`,
          text: '已压缩',
          tone: 'success',
          dy: -34,
        })),
        stackFrames: ['run -> compress(node)'],
        variables: {
          compressCount: counters.compressCount,
          totalBytes: model.totalBytes,
        },
        lineRuntime: {
          1: `compressed=${compressedNodeIds.join(',')}`,
        },
      });
    }
  });

  const popTimes = Math.min(config.queuePopCount, model.totalElements);
  for (let idx = 0; idx < popTimes; idx += 1) {
    counters.operationCount += 1;

    pushStep(steps, solutionId, model, counters, {
      title: `队列弹出 #${idx + 1}`,
      description: '从 head 节点弹出第一个 entry。',
      stage: 'pop.remove',
      focusNodeIds: model.head ? [model.head] : [],
      flowArrows: model.head
        ? [{ fromKey: `node:${model.head}`, toKey: 'meta:trash', label: 'popFront', tone: 'warn' }]
        : [],
      annotations: model.head
        ? [{ anchorKey: `node:${model.head}`, text: '头节点弹出', tone: 'warn', dy: -36 }]
        : [],
      stackFrames: ['run -> popFront()'],
      variables: {
        head: model.head ?? 'null',
      },
    });

    const popResult = popFront(model, config.fillByCount, config.fillByBytes, solutionId === 'byteFill');

    if (popResult.removedNodeId) {
      pushStep(steps, solutionId, model, counters, {
        title: '删除空节点',
        description: '节点元素耗尽后从链表移除，修复 prev/next 指针。',
        stage: 'pop.dropNode',
        focusNodeIds: popResult.headNodeId ? [popResult.headNodeId] : [],
        flowArrows: [
          {
            fromKey: `node:${popResult.removedNodeId}`,
            toKey: 'meta:trash',
            label: 'empty node removed',
            tone: 'warn',
          },
        ],
        stackFrames: ['run -> removeNode(emptyHead)'],
        variables: {
          removedNode: popResult.removedNodeId,
          newHead: popResult.headNodeId ?? 'null',
        },
      });
    }

    if (popResult.mergedNodeIds) {
      counters.mergeCount += 1;
      const [leftId, rightId] = popResult.mergedNodeIds;
      pushStep(steps, solutionId, model, counters, {
        title: '执行节点合并',
        description: '相邻节点满足条件，合并后减少链表长度和指针开销。',
        stage: 'pop.merge',
        focusNodeIds: [leftId],
        flowArrows: [
          {
            fromKey: `node:${rightId}`,
            toKey: `node:${leftId}`,
            label: 'entries merge',
            tone: 'success',
          },
        ],
        annotations: [
          {
            anchorKey: `node:${leftId}`,
            text: '合并后的节点',
            tone: 'success',
            dy: -36,
          },
        ],
        stackFrames: ['run -> mergeHeadWithNext()'],
        variables: {
          mergeCount: counters.mergeCount,
          head: model.head ?? 'null',
        },
        lineRuntime: {
          1: `left=${leftId}, right=${rightId}`,
        },
      });
    }
  }

  pushStep(steps, solutionId, model, counters, {
    title: '演示完成',
    description: '你可以拖动时间轴回看每一步，也可以切换方案进行同输入对比。',
    stage: 'compress.scan',
    focusNodeIds: model.head ? [model.head] : [],
    stackFrames: ['run -> done'],
    variables: {
      finalNodes: nodesInOrder(model).length,
      finalElements: model.totalElements,
      totalBytes: model.totalBytes,
    },
  });

  return steps;
}
