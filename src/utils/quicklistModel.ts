import { QuickListEntry, QuickListModel, QuickListNode } from '@/types/quicklistViz';

let nodeCounter = 0;
let entryCounter = 0;

export function resetModelCounters(): void {
  nodeCounter = 0;
  entryCounter = 0;
}

export function estimateEntryBytes(value: number | string): number {
  if (typeof value === 'number') {
    return value >= -32768 && value <= 32767 ? 4 : 8;
  }
  const utf8 = new TextEncoder().encode(String(value)).length;
  return Math.max(utf8 + 3, 6);
}

function createNode(index: number, prev: string | null, next: string | null): QuickListNode {
  return {
    id: `node-${++nodeCounter}`,
    index,
    entries: [],
    prev,
    next,
    rawBytes: 16,
    isCompressed: false,
    compressionRatio: 0,
  };
}

function calculateNodeBytes(node: QuickListNode): number {
  const entryBytes = node.entries.reduce((sum, item) => sum + item.bytes, 0);
  const raw = 16 + entryBytes;
  if (!node.isCompressed || node.compressionRatio <= 0) {
    return raw;
  }
  return Math.max(20, Math.round(raw * (1 - node.compressionRatio)));
}

function updateTotals(model: QuickListModel): void {
  let totalElements = 0;
  let totalBytes = 24;

  Object.values(model.nodes).forEach((node) => {
    totalElements += node.entries.length;
    totalBytes += calculateNodeBytes(node);
  });

  model.totalElements = totalElements;
  model.totalBytes = totalBytes;
}

export function createEmptyModel(): QuickListModel {
  return {
    head: null,
    tail: null,
    nodes: {},
    totalElements: 0,
    totalBytes: 24,
  };
}

export function cloneModel(model: QuickListModel): QuickListModel {
  const nodes: Record<string, QuickListNode> = {};
  Object.values(model.nodes).forEach((node) => {
    nodes[node.id] = {
      ...node,
      entries: node.entries.map((entry) => ({ ...entry })),
    };
  });

  return {
    head: model.head,
    tail: model.tail,
    nodes,
    totalElements: model.totalElements,
    totalBytes: model.totalBytes,
  };
}

export function nodesInOrder(model: QuickListModel): QuickListNode[] {
  const ordered: QuickListNode[] = [];
  let current = model.head;

  while (current) {
    const node = model.nodes[current];
    if (!node) {
      break;
    }
    ordered.push(node);
    current = node.next;
  }

  return ordered;
}

function ensureTail(model: QuickListModel): QuickListNode {
  if (model.tail && model.nodes[model.tail]) {
    return model.nodes[model.tail];
  }

  const first = createNode(0, null, null);
  model.nodes[first.id] = first;
  model.head = first.id;
  model.tail = first.id;
  updateTotals(model);
  return first;
}

function createNodeAfter(model: QuickListModel, node: QuickListNode): QuickListNode {
  const nextId = node.next;
  const created = createNode(node.index + 1, node.id, nextId);

  model.nodes[created.id] = created;
  node.next = created.id;

  if (nextId && model.nodes[nextId]) {
    model.nodes[nextId].prev = created.id;
  } else {
    model.tail = created.id;
  }

  reindex(model);
  updateTotals(model);
  return created;
}

function removeNode(model: QuickListModel, nodeId: string): void {
  const node = model.nodes[nodeId];
  if (!node) {
    return;
  }

  if (node.prev && model.nodes[node.prev]) {
    model.nodes[node.prev].next = node.next;
  } else {
    model.head = node.next;
  }

  if (node.next && model.nodes[node.next]) {
    model.nodes[node.next].prev = node.prev;
  } else {
    model.tail = node.prev;
  }

  delete model.nodes[nodeId];
  reindex(model);
  updateTotals(model);
}

function reindex(model: QuickListModel): void {
  let idx = 0;
  let current = model.head;

  while (current) {
    const node = model.nodes[current];
    if (!node) {
      break;
    }
    node.index = idx++;
    current = node.next;
  }
}

export function appendEntry(model: QuickListModel, targetNode: QuickListNode, value: number | string): QuickListEntry {
  const entry: QuickListEntry = {
    id: `entry-${++entryCounter}`,
    value,
    bytes: estimateEntryBytes(value),
  };

  targetNode.entries.push(entry);
  targetNode.isCompressed = false;
  targetNode.compressionRatio = 0;
  updateTotals(model);
  return entry;
}

export interface PushResult {
  nodeUsedId: string;
  createdNodeId?: string;
  movedEntryIds?: string[];
  insertedEntryId: string;
  splitHappened: boolean;
}

export function pushBackByCount(model: QuickListModel, value: number | string, fillByCount: number): PushResult {
  const tail = ensureTail(model);
  let target = tail;
  let createdNode: QuickListNode | undefined;

  if (target.entries.length >= fillByCount) {
    createdNode = createNodeAfter(model, target);
    target = createdNode;
  }

  const inserted = appendEntry(model, target, value);

  return {
    nodeUsedId: target.id,
    createdNodeId: createdNode?.id,
    insertedEntryId: inserted.id,
    splitHappened: Boolean(createdNode),
  };
}

export function pushBackByBytes(model: QuickListModel, value: number | string, fillByBytes: number): PushResult {
  const tail = ensureTail(model);
  let target = tail;
  const entryBytes = estimateEntryBytes(value);
  let createdNode: QuickListNode | undefined;
  const movedEntryIds: string[] = [];

  const tailRawBytes = 16 + target.entries.reduce((sum, item) => sum + item.bytes, 0);
  if (tailRawBytes + entryBytes > fillByBytes) {
    createdNode = createNodeAfter(model, target);

    if (createdNode && target.entries.length >= 2) {
      const moveCount = Math.floor(target.entries.length / 2);
      const moved = target.entries.splice(target.entries.length - moveCount, moveCount);
      moved.forEach((item) => {
        movedEntryIds.push(item.id);
        createdNode.entries.push(item);
      });
    }

    target = createdNode;
    updateTotals(model);
  }

  const inserted = appendEntry(model, target, value);

  return {
    nodeUsedId: target.id,
    createdNodeId: createdNode?.id,
    movedEntryIds,
    insertedEntryId: inserted.id,
    splitHappened: Boolean(createdNode),
  };
}

export interface PopResult {
  popped?: QuickListEntry;
  headNodeId?: string;
  removedNodeId?: string;
  mergedNodeIds?: [string, string];
}

export function popFront(model: QuickListModel, fillByCount: number, fillByBytes: number, byBytes: boolean): PopResult {
  if (!model.head) {
    return {};
  }

  const head = model.nodes[model.head];
  if (!head || head.entries.length === 0) {
    return {};
  }

  head.isCompressed = false;
  head.compressionRatio = 0;
  const popped = head.entries.shift();
  updateTotals(model);

  let removedNodeId: string | undefined;
  if (head.entries.length === 0 && head.next) {
    removedNodeId = head.id;
    removeNode(model, head.id);
  }

  const freshHeadId = model.head;
  const freshHead = freshHeadId ? model.nodes[freshHeadId] : null;
  const nextId = freshHead?.next ?? null;
  const next = nextId ? model.nodes[nextId] : null;

  let mergedNodeIds: [string, string] | undefined;
  if (freshHead && next) {
    const leftCount = freshHead.entries.length;
    const rightCount = next.entries.length;
    const leftBytes = 16 + freshHead.entries.reduce((sum, item) => sum + item.bytes, 0);
    const rightBytes = 16 + next.entries.reduce((sum, item) => sum + item.bytes, 0);

    const canMerge = byBytes
      ? leftBytes + rightBytes <= fillByBytes
      : leftCount + rightCount <= fillByCount;

    if (canMerge) {
      next.entries.forEach((item) => freshHead.entries.push(item));
      removeNode(model, next.id);
      mergedNodeIds = [freshHead.id, next.id];
      updateTotals(model);
    }
  }

  return {
    popped,
    headNodeId: freshHeadId ?? undefined,
    removedNodeId,
    mergedNodeIds,
  };
}

export function applyCompression(model: QuickListModel, compressDepth: number): string[] {
  if (compressDepth <= 0) {
    return [];
  }

  const ordered = nodesInOrder(model);
  if (ordered.length <= compressDepth * 2) {
    ordered.forEach((node) => {
      node.isCompressed = false;
      node.compressionRatio = 0;
    });
    updateTotals(model);
    return [];
  }

  const compressedNodeIds: string[] = [];

  ordered.forEach((node, idx) => {
    const inSafeZone = idx < compressDepth || idx >= ordered.length - compressDepth;
    if (inSafeZone) {
      node.isCompressed = false;
      node.compressionRatio = 0;
      return;
    }

    if (!node.isCompressed) {
      node.isCompressed = true;
      const density = Math.min(0.68, 0.25 + node.entries.length * 0.06);
      node.compressionRatio = density;
      compressedNodeIds.push(node.id);
    }
  });

  updateTotals(model);
  return compressedNodeIds;
}
