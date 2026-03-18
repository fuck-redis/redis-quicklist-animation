import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AlgorithmStep } from '@/types/quicklistViz';
import { nodesInOrder } from '@/utils/quicklistModel';
import styles from './CanvasPanel.module.css';

interface CanvasPanelProps {
  step: AlgorithmStep;
}

interface Point {
  x: number;
  y: number;
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  entryPositions: Record<string, Point>;
}

function toneClassName(tone: 'info' | 'success' | 'warn' | undefined): string {
  if (tone === 'success') {
    return styles.annotationSuccess;
  }
  if (tone === 'warn') {
    return styles.annotationWarn;
  }
  return styles.annotationInfo;
}

export const CanvasPanel: React.FC<CanvasPanelProps> = ({ step }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 640 });
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  useEffect(() => {
    if (!wrapRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) {
        return;
      }
      setViewport({
        width: Math.max(rect.width, 640),
        height: Math.max(rect.height, 420),
      });
    });

    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 3.2])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    svg.call(zoomBehavior as never);

    const initial = d3.zoomIdentity.translate(viewport.width / 2, viewport.height / 2).scale(1);
    svg.call(zoomBehavior.transform as never, initial);
  }, [viewport.height, viewport.width]);

  const orderedNodes = useMemo(() => nodesInOrder(step.model), [step.model]);

  const layout = useMemo(() => {
    const nodes: LayoutNode[] = [];
    const pointMap: Record<string, Point> = {};

    const gapX = 250;
    const nodeWidth = 160;
    const baseY = 0;
    const startX = -((Math.max(orderedNodes.length, 1) - 1) * gapX) / 2;

    orderedNodes.forEach((node, idx) => {
      const x = startX + idx * gapX;
      const y = baseY;
      const height = 64 + Math.max(node.entries.length, 1) * 24;

      const entryPositions: Record<string, Point> = {};
      node.entries.forEach((entry, entryIdx) => {
        entryPositions[entry.id] = {
          x,
          y: y - height / 2 + 52 + entryIdx * 24,
        };
        pointMap[`entry:${entry.id}`] = entryPositions[entry.id];
      });

      pointMap[`node:${node.id}`] = { x, y };
      pointMap[`node-head:${node.id}`] = { x: x - nodeWidth / 2, y };
      pointMap[`node-tail:${node.id}`] = { x: x + nodeWidth / 2, y };

      nodes.push({
        id: node.id,
        x,
        y,
        width: nodeWidth,
        height,
        entryPositions,
      });
    });

    const leftNullX = startX - 170;
    const rightNullX = startX + (Math.max(orderedNodes.length - 1, 0) * gapX) + 170;
    pointMap['meta:input'] = { x: 0, y: -220 };
    pointMap['meta:trash'] = { x: 0, y: 250 };
    pointMap['meta:new-node-slot'] = { x: rightNullX, y: -70 };
    pointMap['meta:left-null'] = { x: leftNullX, y: 0 };
    pointMap['meta:right-null'] = { x: rightNullX, y: 0 };

    return { nodes, pointMap, leftNullX, rightNullX };
  }, [orderedNodes]);

  return (
    <div className={styles.panel} ref={wrapRef}>
      <svg ref={svgRef} className={styles.svg} width={viewport.width} height={viewport.height}>
        <defs>
          <marker id="arrow-info" markerWidth="10" markerHeight="10" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0f766e" />
          </marker>
          <marker id="arrow-warn" markerWidth="10" markerHeight="10" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#b45309" />
          </marker>
          <marker id="arrow-success" markerWidth="10" markerHeight="10" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#15803d" />
          </marker>
          <pattern id="canvas-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>

        <rect
          x={-viewport.width}
          y={-viewport.height}
          width={viewport.width * 3}
          height={viewport.height * 3}
          fill="url(#canvas-grid)"
          transform={transform.toString()}
        />

        <g transform={transform.toString()}>
          {orderedNodes.length > 0 && (
            <>
              <rect x={layout.leftNullX - 36} y={-21} width={72} height={42} className={styles.nullNode} />
              <text x={layout.leftNullX} y={5} className={styles.nullLabel}>
                NULL
              </text>

              <rect x={layout.rightNullX - 36} y={-21} width={72} height={42} className={styles.nullNode} />
              <text x={layout.rightNullX} y={5} className={styles.nullLabel}>
                NULL
              </text>
            </>
          )}

          {layout.nodes.map((nodeLayout, idx) => {
            const nodeData = orderedNodes[idx];
            const focused = step.focusNodeIds.includes(nodeData.id);
            const compressed = nodeData.isCompressed;
            return (
              <g key={nodeData.id}>
                <rect
                  x={nodeLayout.x - nodeLayout.width / 2}
                  y={nodeLayout.y - nodeLayout.height / 2}
                  width={nodeLayout.width}
                  height={nodeLayout.height}
                  rx={14}
                  className={`${styles.nodeBox} ${compressed ? styles.compressedNode : ''} ${focused ? styles.focusedNode : ''}`}
                />
                <text x={nodeLayout.x} y={nodeLayout.y - nodeLayout.height / 2 + 20} className={styles.nodeTitle}>
                  节点 #{nodeData.index}
                </text>
                <text x={nodeLayout.x} y={nodeLayout.y - nodeLayout.height / 2 + 38} className={styles.nodeMeta}>
                  {compressed ? `压缩 ${Math.round(nodeData.compressionRatio * 100)}%` : '未压缩'}
                </text>

                {nodeData.entries.map((entry, entryIdx) => {
                  const point = nodeLayout.entryPositions[entry.id];
                  const focusedEntry = step.focusEntryIds.includes(entry.id);
                  return (
                    <g key={entry.id}>
                      <rect
                        x={point.x - nodeLayout.width / 2 + 10}
                        y={point.y - 11}
                        width={nodeLayout.width - 20}
                        height={22}
                        rx={8}
                        className={`${styles.entryBox} ${focusedEntry ? styles.focusedEntry : ''}`}
                      />
                      <text x={point.x - 60} y={point.y + 4} className={styles.entryText}>
                        e{entryIdx}
                      </text>
                      <text x={point.x - 30} y={point.y + 4} className={styles.entryValue}>
                        {String(entry.value)}
                      </text>
                      <text x={point.x + 50} y={point.y + 4} className={styles.entrySize}>
                        {entry.bytes}B
                      </text>
                    </g>
                  );
                })}

                {idx === 0 && (
                  <text x={nodeLayout.x} y={nodeLayout.y - nodeLayout.height / 2 - 10} className={styles.pointerLabel}>
                    HEAD
                  </text>
                )}
                {idx === layout.nodes.length - 1 && (
                  <text x={nodeLayout.x} y={nodeLayout.y - nodeLayout.height / 2 - 10} className={styles.pointerLabel}>
                    TAIL
                  </text>
                )}
              </g>
            );
          })}

          {layout.nodes.map((nodeLayout, idx) => {
            if (idx === layout.nodes.length - 1) {
              return null;
            }
            const next = layout.nodes[idx + 1];
            return (
              <g key={`${nodeLayout.id}-link`}>
                <line
                  x1={nodeLayout.x + nodeLayout.width / 2}
                  y1={nodeLayout.y - 10}
                  x2={next.x - next.width / 2}
                  y2={next.y - 10}
                  className={styles.linkArrow}
                  markerEnd="url(#arrow-info)"
                />
                <line
                  x1={next.x - next.width / 2}
                  y1={next.y + 10}
                  x2={nodeLayout.x + nodeLayout.width / 2}
                  y2={nodeLayout.y + 10}
                  className={styles.linkArrow}
                  markerEnd="url(#arrow-info)"
                />
              </g>
            );
          })}

          {step.flowArrows.map((flow, index) => {
            const from = layout.pointMap[flow.fromKey];
            const to = layout.pointMap[flow.toKey];
            if (!from || !to) {
              return null;
            }

            const marker = flow.tone === 'warn'
              ? 'url(#arrow-warn)'
              : flow.tone === 'success'
              ? 'url(#arrow-success)'
              : 'url(#arrow-info)';
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 12;

            return (
              <g key={`flow-${index}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={styles.flowArrow}
                  markerEnd={marker}
                />
                <text x={midX} y={midY} className={styles.flowLabel}>
                  {flow.label}
                </text>
              </g>
            );
          })}

          {step.annotations.map((annotation, index) => {
            const anchor = layout.pointMap[annotation.anchorKey];
            if (!anchor) {
              return null;
            }
            const x = anchor.x + (annotation.dx ?? 0);
            const y = anchor.y + (annotation.dy ?? -22);
            return (
              <text key={`annotation-${index}`} x={x} y={y} className={toneClassName(annotation.tone)}>
                {annotation.text}
              </text>
            );
          })}
        </g>
      </svg>

      <div className={styles.overlayLeft}>
        <div className={styles.overlayTitle}>执行上下文</div>
        <div className={styles.stack}>
          {step.stackFrames.length === 0 ? <div className={styles.stackItem}>run()</div> : null}
          {step.stackFrames.map((frame, idx) => (
            <div key={`${frame}-${idx}`} className={styles.stackItem}>
              {frame}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.overlayRight}>
        <div className={styles.overlayTitle}>变量快照</div>
        <div className={styles.vars}>
          {Object.entries(step.variables).map(([key, value]) => (
            <div key={key} className={styles.varRow}>
              <span className={styles.varKey}>{key}</span>
              <span className={styles.varValue}>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.canvasHint}>拖动画布平移 · 滚轮缩放 · 分镜与代码行实时同步</div>
    </div>
  );
};
