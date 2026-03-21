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

  // 步骤 1: 初始化
  pushStep(steps, solutionId, model, counters, {
    title: '🚀 初始化 QuickList',
    description: '创建一个空的 QuickList，它是一个双向链表，每个节点内部是一个 ZipList 压缩列表。等待数据从尾部进入。',
    stage: 'init',
    stackFrames: ['初始化 QuickList'],
    annotations: [
      {
        anchorKey: 'meta:input',
        text: `待插入数据: ${prettyValues(config.values)}`,
        tone: 'info',
      },
    ],
    variables: {
      '链表状态': '空',
      '节点数量': 0,
      '总元素数': 0,
    },
    lineRuntime: {
      1: `fill=${config.fillByCount} | compressDepth=${config.compressDepth}`,
    },
  });

  // 步骤 1b: 参数说明
  pushStep(steps, solutionId, model, counters, {
    title: '⚙️ QuickList 配置参数',
    description: 'QuickList 有两个关键配置参数：fill 控制节点大小，compress 控制压缩策略。',
    stage: 'init',
    stackFrames: ['参数配置说明'],
    annotations: [
      {
        anchorKey: 'meta:input',
        text: solutionId === 'countFill'
          ? `fill=${config.fillByCount} (按元素数量)`
          : `fill=${config.fillByBytes}B (按字节大小)`,
        tone: 'info',
        dy: 30,
      },
    ],
    variables: {
      '填充模式': solutionId === 'countFill' ? '按元素数量' : '按字节大小',
      'fill限制': solutionId === 'countFill' ? `${config.fillByCount} 个元素` : `${config.fillByBytes} 字节`,
      '压缩深度': `${config.compressDepth} 层`,
      '待插入数据': config.values.length,
    },
    lineRuntime: {
      1: solutionId === 'countFill'
        ? `fillByCount=${config.fillByCount}`
        : `fillByBytes=${config.fillByBytes}`,
    },
  });

  // 插入数据
  config.values.forEach((value, index) => {
    counters.operationCount += 1;

    const orderedBefore = nodesInOrder(model);
    const tailBefore = orderedBefore[orderedBefore.length - 1];

    // 步骤 2: 定位尾节点
    pushStep(steps, solutionId, model, counters, {
      title: `📍 插入第 ${index + 1} 个值: ${value}`,
      description: `将指针移动到链表尾部（节点 #${tailBefore?.index ?? '（空）'}），检查是否还有空间存入新数据。`,
      stage: 'push.locateTail',
      focusNodeIds: tailBefore ? [tailBefore.id] : [],
      flowArrows: [
        {
          fromKey: 'meta:input',
          toKey: tailBefore ? `node:${tailBefore.id}` : 'meta:new-node-slot',
          label: `写入 ${value}`,
          tone: 'info',
        },
      ],
      annotations: tailBefore
        ? [
            {
              anchorKey: `node:${tailBefore.id}`,
              text: `检查: ${tailBefore.entries.length}/${config.fillByCount} 个元素`,
              tone: 'warn',
              dy: -40,
            },
          ]
        : [
            {
              anchorKey: 'meta:new-node-slot',
              text: '链表为空，准备创建第一个节点',
              tone: 'info',
            },
          ],
      stackFrames: [`定位 tail 节点`],
      variables: {
        '当前值': value,
        '目标节点': tailBefore ? `节点 #${tailBefore.index}` : '需新建',
        '该节点已有': tailBefore ? `${tailBefore.entries.length} 个元素` : '0',
      },
      lineRuntime: {
        1: `value=${value}`,
      },
    });

    const pushResult = solutionId === 'countFill'
      ? pushBackByCount(model, value, config.fillByCount)
      : pushBackByBytes(model, value, config.fillByBytes);

    // 步骤 3: 节点分裂
    if (pushResult.splitHappened) {
      counters.splitCount += 1;
      const createdNode = model.nodes[pushResult.createdNodeId!];

      pushStep(steps, solutionId, model, counters, {
        title: `⚡ 节点 #${tailBefore?.index ?? 0} 已满，触发分裂`,
        description:
          solutionId === 'countFill'
            ? `该节点已有 ${config.fillByCount} 个元素（达到上限）。创建新节点 #${createdNode?.index ?? 1} 来存储新数据。`
            : `该节点字节数达到上限。创建新节点 #${createdNode?.index ?? 1}，并迁移部分数据到新节点。`,
        stage: 'push.split',
        focusNodeIds: [pushResult.nodeUsedId, pushResult.createdNodeId ?? pushResult.nodeUsedId],
        focusEntryIds: pushResult.movedEntryIds ?? [],
        flowArrows: [
          {
            fromKey: `node:${pushResult.nodeUsedId}`,
            toKey: pushResult.createdNodeId ? `node:${pushResult.createdNodeId}` : `node:${pushResult.nodeUsedId}`,
            label: solutionId === 'countFill' ? '新建节点' : '迁移数据',
            tone: 'warn',
          },
        ],
        annotations: [
          {
            anchorKey: pushResult.createdNodeId ? `node:${pushResult.createdNodeId}` : `node:${pushResult.nodeUsedId}`,
            text: solutionId === 'countFill' ? `新节点 #${createdNode?.index}` : `新节点 + 数据迁移`,
            tone: 'warn',
            dy: -38,
          },
        ],
        stackFrames: [`节点分裂`],
        variables: {
          '分裂次数': counters.splitCount,
          '新节点': `节点 #${createdNode?.index ?? '?'}`,
          '分裂原因': solutionId === 'countFill' ? '元素数达到上限' : '字节数达到上限',
        },
        lineRuntime: {
          1: solutionId === 'countFill' ? `entries >= ${config.fillByCount}` : `字节数超限`,
        },
      });
    } else if (pushResult.createdNodeId) {
      // 步骤 3b: 创建首节点
      const newNode = model.nodes[pushResult.createdNodeId];
      pushStep(steps, solutionId, model, counters, {
        title: `➕ 创建首节点 #${newNode?.index ?? 0}`,
        description: '链表为空，创建第一个节点作为 head 和 tail。',
        stage: 'push.createNode',
        focusNodeIds: [pushResult.createdNodeId],
        annotations: [
          {
            anchorKey: `node:${pushResult.createdNodeId}`,
            text: '✅ 节点创建成功',
            tone: 'success',
            dy: -36,
          },
        ],
        stackFrames: ['创建首节点'],
        variables: {
          '节点': `节点 #${newNode?.index ?? 0}`,
          '类型': 'head & tail',
        },
      });
    }

    // 步骤 4: 写入数据
    const targetNode = model.nodes[pushResult.nodeUsedId];
    pushStep(steps, solutionId, model, counters, {
      title: `✅ 成功写入值 ${value} 到节点 #${targetNode?.index ?? '?'}`,
      description: `数据已存入 ZipList。现在该节点有 ${targetNode?.entries.length ?? 0} 个元素。`,
      stage: 'push.insert',
      focusNodeIds: [pushResult.nodeUsedId],
      focusEntryIds: [pushResult.insertedEntryId],
      flowArrows: [
        {
          fromKey: 'meta:input',
          toKey: `entry:${pushResult.insertedEntryId}`,
          label: `${value}`,
          tone: 'success',
        },
      ],
      annotations: [
        {
          anchorKey: `entry:${pushResult.insertedEntryId}`,
          text: `✅ 新增`,
          tone: 'success',
          dy: -30,
        },
      ],
      stackFrames: [`写入 ZipList`],
      variables: {
        '值': value,
        '存入节点': `节点 #${targetNode?.index ?? '?'}`,
        '该节点元素数': `${targetNode?.entries.length ?? 0} / ${config.fillByCount}`,
        '总元素数': model.totalElements,
      },
      lineRuntime: {
        1: `写入节点 #${targetNode?.index ?? '?'}`,
      },
    });

    // 步骤 4b: 字节计算说明（仅字节填充模式）
    if (solutionId === 'byteFill' && targetNode) {
      const entryBytes = typeof value === 'number'
        ? (value >= -32768 && value <= 32767 ? 4 : 8)
        : Math.max(new TextEncoder().encode(String(value)).length + 3, 6);
      const nodeRawBytes = 16 + targetNode.entries.reduce((sum, item) => sum + item.bytes, 0);

      pushStep(steps, solutionId, model, counters, {
        title: '📊 节点字节统计',
        description: '分析当前节点的字节占用情况，判断是否接近 fill 限制。',
        stage: 'push.insert',
        focusNodeIds: [pushResult.nodeUsedId],
        stackFrames: ['字节计算'],
        variables: {
          '元素大小': `${entryBytes} B`,
          '节点头部': '16 B',
          '节点总字节': `${nodeRawBytes} B`,
          'fill限制': `${config.fillByBytes} B`,
          '填充率': `${Math.round((nodeRawBytes / config.fillByBytes) * 100)}%`,
        },
        lineRuntime: {
          1: `节点字节: ${nodeRawBytes}/${config.fillByBytes}`,
        },
      });
    }

    // 步骤 5: 压缩扫描
    const compressedNodeIds = applyCompression(model, config.compressDepth);
    if (compressedNodeIds.length > 0) {
      counters.compressCount += compressedNodeIds.length;

      pushStep(steps, solutionId, model, counters, {
        title: `🔍 扫描可压缩节点（compressDepth=${config.compressDepth}）`,
        description: `QuickList 保留头部 ${config.compressDepth} 个节点和尾部 ${config.compressDepth} 个节点为热区，中间节点为冷区，可以压缩。`,
        stage: 'compress.scan',
        focusNodeIds: compressedNodeIds,
        annotations: compressedNodeIds.map((id) => {
          const n = model.nodes[id];
          return {
            anchorKey: `node:${id}`,
            text: `冷区节点 #${n?.index ?? '?'}`,
            tone: 'info',
            dy: -34,
          };
        }),
        stackFrames: ['扫描压缩区'],
        variables: {
          '热区节点': `首尾各 ${config.compressDepth} 个`,
          '可压缩节点': `${compressedNodeIds.length} 个`,
        },
      });

      pushStep(steps, solutionId, model, counters, {
        title: `🗜️ 执行 LZF 压缩`,
        description: '对冷区节点进行 LZF 压缩，内存占用减少，访问速度略有下降。',
        stage: 'compress.apply',
        focusNodeIds: compressedNodeIds,
        annotations: compressedNodeIds.map((id) => ({
          anchorKey: `node:${id}`,
          text: '🗜️ 已压缩',
          tone: 'success',
          dy: -34,
        })),
        stackFrames: ['执行压缩'],
        variables: {
          '压缩节点数': counters.compressCount,
          '节省内存': `约 ${Math.round(30 * compressedNodeIds.length)}%`,
        },
        lineRuntime: {
          1: `compressed: ${compressedNodeIds.length} nodes`,
        },
      });
    }
  });

  // 弹出操作
  const popTimes = Math.min(config.queuePopCount, model.totalElements);
  for (let idx = 0; idx < popTimes; idx += 1) {
    counters.operationCount += 1;

    pushStep(steps, solutionId, model, counters, {
      title: `🗑️ 弹出第 ${idx + 1} 个元素（LPOP）`,
      description: '从链表头部移除第一个元素，就像队列的出队操作。',
      stage: 'pop.remove',
      focusNodeIds: model.head ? [model.head] : [],
      flowArrows: model.head
        ? [{ fromKey: `node:${model.head}`, toKey: 'meta:trash', label: 'LPOP', tone: 'warn' }]
        : [],
      annotations: model.head
        ? [{ anchorKey: `node:${model.head}`, text: '🔓 移除头部元素', tone: 'warn', dy: -36 }]
        : [],
      stackFrames: ['LPOP'],
      variables: {
        '当前头部': model.head ? `节点 #${model.nodes[model.head]?.index ?? '?'}` : 'null',
        '剩余元素': model.totalElements,
      },
    });

    const popResult = popFront(model, config.fillByCount, config.fillByBytes, solutionId === 'byteFill');

    // 节点删除
    if (popResult.removedNodeId) {
      const removedNode = popResult.removedNodeId;
      pushStep(steps, solutionId, model, counters, {
        title: '✂️ 删除空节点',
        description: `节点元素已全部弹出，节点被从链表中移除，prev/next 指针已更新。`,
        stage: 'pop.dropNode',
        focusNodeIds: popResult.headNodeId ? [popResult.headNodeId] : [],
        flowArrows: [
          {
            fromKey: `node:${popResult.removedNodeId}`,
            toKey: 'meta:trash',
            label: '节点删除',
            tone: 'warn',
          },
        ],
        stackFrames: ['删除空节点'],
        variables: {
          '删除节点': removedNode,
          '新头部': popResult.headNodeId ? `节点 #${model.nodes[popResult.headNodeId]?.index ?? '?'}` : 'null',
        },
      });
    }

    // 节点合并检查
    const freshHead = model.head ? model.nodes[model.head] : null;
    const freshNext = freshHead?.next ? model.nodes[freshHead.next] : null;
    if (freshHead && freshNext) {
      const leftCount = freshHead.entries.length;
      const rightCount = freshNext.entries.length;
      const leftBytes = 16 + freshHead.entries.reduce((sum, item) => sum + item.bytes, 0);
      const rightBytes = 16 + freshNext.entries.reduce((sum, item) => sum + item.bytes, 0);
      const canMerge = solutionId === 'byteFill'
        ? leftBytes + rightBytes <= config.fillByBytes
        : leftCount + rightCount <= config.fillByCount;

      pushStep(steps, solutionId, model, counters, {
        title: canMerge ? '🔍 检查合并条件（可合并）' : '🔍 检查合并条件（不合并）',
        description: canMerge
          ? `相邻节点元素数量较少，可以合并以节省内存。`
          : `相邻节点元素数量仍然较多，暂不合并。`,
        stage: 'pop.merge',
        focusNodeIds: [freshHead.id, freshNext.id],
        stackFrames: ['合并条件检查'],
        variables: {
          '左节点元素': `${leftCount} 个`,
          '右节点元素': `${rightCount} 个`,
          '左节点字节': `${leftBytes} B`,
          '右节点字节': `${rightBytes} B`,
          '合并条件': solutionId === 'byteFill'
            ? `${leftBytes + rightBytes} <= ${config.fillByBytes}`
            : `${leftCount + rightCount} <= ${config.fillByCount}`,
          '结果': canMerge ? '✅ 可以合并' : '❌ 暂不合并',
        },
        lineRuntime: {
          1: canMerge ? '条件满足，触发合并' : '条件不满足，保持分离',
        },
      });
    }

    // 节点合并
    if (popResult.mergedNodeIds) {
      counters.mergeCount += 1;
      const [leftId, rightId] = popResult.mergedNodeIds;
      const leftNode = model.nodes[leftId];
      const rightNode = model.nodes[rightId];
      pushStep(steps, solutionId, model, counters, {
        title: '🔗 合并相邻节点',
        description: `节点 #${leftNode?.index ?? ''} 和节点 #${rightNode?.index ?? ''} 元素都很少，合并成一个节点以节省内存。`,
        stage: 'pop.merge',
        focusNodeIds: [leftId],
        flowArrows: [
          {
            fromKey: `node:${rightId}`,
            toKey: `node:${leftId}`,
            label: '合并',
            tone: 'success',
          },
        ],
        annotations: [
          {
            anchorKey: `node:${leftId}`,
            text: '🔗 合并后',
            tone: 'success',
            dy: -36,
          },
        ],
        stackFrames: ['合并节点'],
        variables: {
          '合并次数': counters.mergeCount,
          '合并后节点': `节点 #${leftNode?.index ?? '?'}`,
        },
        lineRuntime: {
          1: `合并 ${leftId} + ${rightId}`,
        },
      });
    }
  }

  // 最终状态
  const finalNodes = nodesInOrder(model);

  // 步骤 X: 性能统计总结
  const dataBytes = finalNodes.reduce(
    (sum, node) => sum + node.entries.reduce((entrySum, entry) => entrySum + entry.bytes, 0),
    0
  );
  const memoryEfficiency = model.totalBytes > 0 ? Math.round((dataBytes / model.totalBytes) * 100) : 0;
  const compressedCount = finalNodes.filter((n) => n.isCompressed).length;

  pushStep(steps, solutionId, model, counters, {
    title: '📊 性能统计总结',
    description: '分析整个操作过程中的关键性能指标。',
    stage: 'init',
    focusNodeIds: model.head ? [model.head] : [],
    stackFrames: ['统计总结'],
    variables: {
      '分裂次数': counters.splitCount,
      '合并次数': counters.mergeCount,
      '压缩节点': `${compressedCount} / ${finalNodes.length}`,
      '总操作数': counters.operationCount,
      '数据字节': `${dataBytes} B`,
      '总内存': `${model.totalBytes} B`,
      '内存效率': `${memoryEfficiency}%`,
    },
    lineRuntime: {
      1: `分裂:${counters.splitCount} 合并:${counters.mergeCount}`,
    },
  });

  pushStep(steps, solutionId, model, counters, {
    title: '✅ 演示完成',
    description: `整个操作演示完毕！QuickList 最终包含 ${finalNodes.length} 个节点，共 ${model.totalElements} 个元素。`,
    stage: 'init',
    focusNodeIds: model.head ? [model.head] : [],
    stackFrames: ['完成'],
    variables: {
      '最终节点数': finalNodes.length,
      '总元素数': model.totalElements,
      '总内存': `${model.totalBytes} B`,
    },
  });

  return steps;
}
