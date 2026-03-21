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

    // 固定布局参数，确保一致性
    const headerAreaHeight = 48;     // 节点标题区域高度
    const entryRowHeight = 26;      // 每个entry行的高度
    const entryStartOffset = 56;    // entry内容区起始Y偏移（相对节点顶部）

    orderedNodes.forEach((node, idx) => {
      const x = startX + idx * gapX;
      const y = baseY;
      // 动态计算节点高度：头部区域 + entry行 + 底部留白
      const height = headerAreaHeight + Math.max(node.entries.length, 1) * entryRowHeight + 12;

      const entryPositions: Record<string, Point> = {};
      node.entries.forEach((entry, entryIdx) => {
        entryPositions[entry.id] = {
          x,
          y: y - height / 2 + entryStartOffset + entryIdx * entryRowHeight,
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
          {/* 当前操作提示 */}
          <g>
            <rect x={-160} y={-130} width={320} height={36} rx={18} className={styles.currentStepBadge} />
            <text x={0} y={-108} textAnchor="middle" dominantBaseline="central" className={styles.currentStepText}>
              {step.title}
            </text>
          </g>

          {orderedNodes.length > 0 && (
            <>
              {/* HEAD 指针 */}
              <g>
                <rect x={layout.leftNullX - 30} y={-50} width={60} height={24} rx={6} className={styles.pointerBadge} />
                <text x={layout.leftNullX} y={-38} textAnchor="middle" dominantBaseline="central" className={styles.pointerBadgeText}>HEAD</text>
              </g>
              <rect x={layout.leftNullX - 30} y={-21} width={60} height={42} className={styles.nullNode} />
              <text x={layout.leftNullX} y={0} textAnchor="middle" dominantBaseline="central" className={styles.nullLabel}>
                NULL
              </text>

              {/* TAIL 指针 */}
              <g>
                <rect x={layout.rightNullX - 30} y={-50} width={60} height={24} rx={6} className={styles.pointerBadge} />
                <text x={layout.rightNullX} y={-38} textAnchor="middle" dominantBaseline="central" className={styles.pointerBadgeText}>TAIL</text>
              </g>
              <rect x={layout.rightNullX - 30} y={-21} width={60} height={42} className={styles.nullNode} />
              <text x={layout.rightNullX} y={0} textAnchor="middle" dominantBaseline="central" className={styles.nullLabel}>
                NULL
              </text>
            </>
          )}

          {layout.nodes.map((nodeLayout, idx) => {
            const nodeData = orderedNodes[idx];
            const focused = step.focusNodeIds.includes(nodeData.id);
            const compressed = nodeData.isCompressed;
            const nodeTop = nodeLayout.y - nodeLayout.height / 2;

            return (
              <g key={nodeData.id}>
                {/* 节点背景 */}
                <rect
                  x={nodeLayout.x - nodeLayout.width / 2}
                  y={nodeTop}
                  width={nodeLayout.width}
                  height={nodeLayout.height}
                  rx={14}
                  className={`${styles.nodeBox} ${compressed ? styles.compressedNode : ''} ${focused ? styles.focusedNode : ''}`}
                />

                {/* ZipList 标签 */}
                <rect
                  x={nodeLayout.x - 40}
                  y={nodeTop + 6}
                  width={80}
                  height={18}
                  rx={4}
                  className={styles.ziplistBadge}
                />
                <text x={nodeLayout.x} y={nodeTop + 18} textAnchor="middle" dominantBaseline="central" className={styles.ziplistBadgeText}>
                  ZipList
                </text>

                {/* 节点标题 */}
                <text x={nodeLayout.x} y={nodeTop + 38} textAnchor="middle" className={styles.nodeTitle}>
                  #{nodeData.index}
                </text>
                <text x={nodeLayout.x} y={nodeTop + 52} textAnchor="middle" className={styles.nodeMeta}>
                  {nodeData.entries.length} 个元素
                </text>

                {/* Entries 列表 */}
                {nodeData.entries.length > 0 && (
                  <g>
                    {nodeData.entries.map((entry, entryIdx) => {
                      const point = nodeLayout.entryPositions[entry.id];
                      const focusedEntry = step.focusEntryIds.includes(entry.id);
                      const entryBoxX = nodeLayout.x - nodeLayout.width / 2 + 12;
                      const entryBoxWidth = nodeLayout.width - 24;
                      return (
                        <g key={entry.id}>
                          <rect
                            x={entryBoxX}
                            y={point.y - 10}
                            width={entryBoxWidth}
                            height={20}
                            rx={6}
                            className={`${styles.entryBox} ${focusedEntry ? styles.focusedEntry : ''}`}
                          />
                          <text x={entryBoxX + 8} y={point.y + 1} className={styles.entryIndex}>
                            [{entryIdx}]
                          </text>
                          <text x={entryBoxX + 40} y={point.y + 1} className={styles.entryValue}>
                            {String(entry.value).substring(0, 8)}
                          </text>
                          <text x={entryBoxX + entryBoxWidth - 6} y={point.y + 1} className={styles.entrySize} textAnchor="end">
                            {entry.bytes}B
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 空节点提示 */}
                {nodeData.entries.length === 0 && (
                  <text x={nodeLayout.x} y={nodeTop + 80} textAnchor="middle" className={styles.emptyNode}>
                    (空)
                  </text>
                )}

                {/* 压缩标记 */}
                {compressed && (
                  <g>
                    <rect
                      x={nodeLayout.x + nodeLayout.width / 2 - 28}
                      y={nodeTop + 4}
                      width={24}
                      height={20}
                      rx={4}
                      className={styles.compressedBadge}
                    />
                    <text
                      x={nodeLayout.x + nodeLayout.width / 2 - 16}
                      y={nodeTop + 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={styles.compressedBadgeText}
                    >
                      LZF
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {layout.nodes.map((nodeLayout, idx) => {
            if (idx === layout.nodes.length - 1) {
              return null;
            }
            const next = layout.nodes[idx + 1];
            const currentCenterY = nodeLayout.y;
            const nextCenterY = next.y;
            const midX = (nodeLayout.x + nodeLayout.width / 2 + next.x - next.width / 2) / 2;

            return (
              <g key={`${nodeLayout.id}-link`}>
                {/* NEXT 指针（从上往下） */}
                <line
                  x1={nodeLayout.x + nodeLayout.width / 2}
                  y1={currentCenterY}
                  x2={next.x - next.width / 2}
                  y2={nextCenterY}
                  className={styles.nextArrow}
                  markerEnd="url(#arrow-info)"
                />
                {/* NEXT 标签 */}
                <rect x={midX - 22} y={currentCenterY - 28} width={44} height={18} rx={9} className={styles.arrowLabelBadge} />
                <text x={midX} y={currentCenterY - 16} textAnchor="middle" dominantBaseline="central" className={styles.arrowLabelText}>NEXT</text>

                {/* PREV 指针（从下往上） */}
                <line
                  x1={next.x - next.width / 2}
                  y1={nextCenterY}
                  x2={nodeLayout.x + nodeLayout.width / 2}
                  y2={currentCenterY}
                  className={styles.prevArrow}
                  markerEnd="url(#arrow-info)"
                />
                {/* PREV 标签 */}
                <rect x={midX - 22} y={currentCenterY + 12} width={44} height={18} rx={9} className={styles.arrowLabelBadgePrev} />
                <text x={midX} y={currentCenterY + 24} textAnchor="middle" dominantBaseline="central" className={styles.arrowLabelTextPrev}>PREV</text>
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

            const toneClass = flow.tone === 'warn'
              ? styles.flowArrowWarn
              : flow.tone === 'success'
              ? styles.flowArrowSuccess
              : styles.flowArrow;

            // 计算箭头的起点和终点，稍微内缩以避免覆盖节点
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const shrink = 40; // 从起点和终点各收缩的距离
            const startX = from.x + (dx / dist) * shrink;
            const startY = from.y + (dy / dist) * shrink;
            const endX = to.x - (dx / dist) * (shrink + 10);
            const endY = to.y - (dy / dist) * (shrink + 10);

            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            return (
              <g key={`flow-${index}`}>
                {/* 箭头线 */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  className={toneClass}
                  markerEnd={marker}
                  strokeDasharray="8 4"
                />
                {/* 标签背景 */}
                <rect
                  x={midX - 40}
                  y={midY - 12}
                  width={80}
                  height={24}
                  rx={12}
                  className={toneClass === styles.flowArrowWarn ? styles.flowLabelBgWarn : toneClass === styles.flowArrowSuccess ? styles.flowLabelBgSuccess : styles.flowLabelBg}
                />
                {/* 标签文字 */}
                <text x={midX} y={midY + 1} textAnchor="middle" dominantBaseline="central" className={styles.flowLabelText}>
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

            const bgClass = annotation.tone === 'warn'
              ? styles.annotationBgWarn
              : annotation.tone === 'success'
              ? styles.annotationBgSuccess
              : styles.annotationBg;

            const textClass = annotation.tone === 'warn'
              ? styles.annotationTextWarn
              : annotation.tone === 'success'
              ? styles.annotationTextSuccess
              : styles.annotationText;

            return (
              <g key={`annotation-${index}`}>
                <rect
                  x={x - 50}
                  y={y - 10}
                  width={100}
                  height={20}
                  rx={10}
                  className={bgClass}
                />
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" className={textClass}>
                  {annotation.text}
                </text>
              </g>
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
