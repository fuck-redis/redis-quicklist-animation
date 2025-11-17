import React, { useEffect, useRef, useState } from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import * as d3 from 'd3';
import styles from './Visualization.module.css';

export const StructureView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { quickList, selectedNodeId, selectNode } = useQuickListStore();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const container = svgRef.current.parentElement;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    svg
      .attr('width', width)
      .attr('height', height);
    
    // 创建主容器组，用于缩放和拖拽
    const mainGroup = svg.append('g');
    
    // 添加缩放和拖拽功能
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform.toString());
      });
    
    svg.call(zoom as any);
    
    // 获取节点列表
    const nodes = Object.values(quickList.nodes).sort((a, b) => a.index - b.index);
    
    if (nodes.length === 0) {
      mainGroup.append('text')
        .attr('x', width / 2 - 100)
        .attr('y', height / 2)
        .attr('fill', '#8c8c8c')
        .attr('font-size', '16px')
        .text('QuickList为空，请添加元素...');
      return;
    }
    
    const nodeWidth = 180;
    const collapsedHeight = 120;
    const expandedHeight = 300;
    const spacing = 60;
    
    // 计算布局
    let currentX = 50;
    const baseY = 80;
    
    // 定义箭头标记
    mainGroup.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 7)
      .attr('refX', 9)
      .attr('refY', 3.5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3.5, 0 7')
      .attr('fill', '#bfbfbf');
    
    // 绘制节点
    nodes.forEach((node, i) => {
      const isExpanded = expandedNodes.has(node.id);
      const nodeHeight = isExpanded ? expandedHeight : collapsedHeight;
      const x = currentX;
      const y = baseY;
      
      // 节点容器
      const nodeGroup = mainGroup.append('g')
        .attr('transform', `translate(${x}, ${y})`);
      
      // 节点背景
      nodeGroup.append('rect')
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 8)
        .attr('fill', node.isCompressed ? '#f0f0f0' : '#e6f7ff')
        .attr('stroke', selectedNodeId === node.id ? '#1890ff' : '#91d5ff')
        .attr('stroke-width', selectedNodeId === node.id ? 3 : 2);
      
      // 可点击的头部区域（用于展开/收起）
      const headerHeight = 100;
      nodeGroup.append('rect')
        .attr('width', nodeWidth)
        .attr('height', headerHeight)
        .attr('rx', 8)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('click', (event) => {
          event.stopPropagation();
          toggleNodeExpand(node.id);
        })
        .on('mouseenter', function() {
          d3.select(this).attr('fill', 'rgba(24, 144, 255, 0.1)');
        })
        .on('mouseleave', function() {
          d3.select(this).attr('fill', 'transparent');
        });
      
      // 节点标题
      nodeGroup.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('font-size', '16px')
        .text(`节点 ${node.index}`);
      
      // ZipList标签
      nodeGroup.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#666')
        .text('ZipList');
      
      // 元素数量
      nodeGroup.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', 65)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(`元素: ${node.elementCount}/${quickList.config.fill}`);
      
      // 内存大小
      nodeGroup.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', 80)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#8c8c8c')
        .text(`${node.memorySize}B`);
      
      // 填充率进度条
      const fillRate = node.elementCount / quickList.config.fill;
      const barWidth = nodeWidth - 20;
      const barX = 10;
      const barY = 88;
      
      nodeGroup.append('rect')
        .attr('x', barX)
        .attr('y', barY)
        .attr('width', barWidth)
        .attr('height', 8)
        .attr('rx', 4)
        .attr('fill', '#f0f0f0');
      
      nodeGroup.append('rect')
        .attr('x', barX)
        .attr('y', barY)
        .attr('width', barWidth * fillRate)
        .attr('height', 8)
        .attr('rx', 4)
        .attr('fill', fillRate > 0.8 ? '#ff4d4f' : fillRate > 0.6 ? '#faad14' : '#52c41a');
      
      // 展开/收起按钮
      const expandButton = nodeGroup.append('g')
        .attr('transform', `translate(${nodeWidth / 2}, 105)`)
        .style('cursor', 'pointer');
      
      expandButton.append('circle')
        .attr('r', 12)
        .attr('fill', '#1890ff')
        .attr('opacity', 0.1);
      
      expandButton.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '16px')
        .text(isExpanded ? '▲' : '▼');
      
      // 展开内容区域
      if (isExpanded && node.zl.entries && node.zl.entries.length > 0) {
        // 分隔线
        nodeGroup.append('line')
          .attr('x1', 10)
          .attr('y1', headerHeight)
          .attr('x2', nodeWidth - 10)
          .attr('y2', headerHeight)
          .attr('stroke', '#d9d9d9')
          .attr('stroke-width', 1);
        
        // ZipList 条目标题
        nodeGroup.append('text')
          .attr('x', nodeWidth / 2)
          .attr('y', headerHeight + 20)
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .attr('font-size', '13px')
          .attr('fill', '#666')
          .text('ZipList 内部元素');
        
        // 绘制每个元素
        node.zl.entries.slice(0, 8).forEach((entry, entryIdx) => {
          const entryY = headerHeight + 40 + entryIdx * 20;
          
          // 元素背景
          const entryGroup = nodeGroup.append('g');
          
          entryGroup.append('rect')
            .attr('x', 10)
            .attr('y', entryY)
            .attr('width', nodeWidth - 20)
            .attr('height', 18)
            .attr('rx', 4)
            .attr('fill', '#fff7e6');
          
          // 元素索引
          entryGroup.append('text')
            .attr('x', 20)
            .attr('y', entryY + 13)
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .text(`#${entryIdx}`);
          
          // 元素值
          entryGroup.append('text')
            .attr('x', 50)
            .attr('y', entryY + 13)
            .attr('font-size', '11px')
            .text(String(entry.value).substring(0, 12));
          
          // 元素类型
          entryGroup.append('text')
            .attr('x', nodeWidth - 60)
            .attr('y', entryY + 13)
            .attr('font-size', '10px')
            .attr('fill', '#999')
            .text(entry.encoding || 'STRING');
        });
        
        // 如果元素太多，显示省略号
        if (node.zl.entries.length > 8) {
          nodeGroup.append('text')
            .attr('x', nodeWidth / 2)
            .attr('y', headerHeight + 200)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#999')
            .text(`... 还有 ${node.zl.entries.length - 8} 个元素`);
        }
      }
      
      // 压缩标志
      if (node.isCompressed) {
        nodeGroup.append('text')
          .attr('x', nodeWidth - 15)
          .attr('y', 20)
          .attr('text-anchor', 'end')
          .attr('font-size', '18px')
          .text('🗜️');
      }
      
      // 绘制连接箭头
      if (i < nodes.length - 1) {
        const arrowStartX = x + nodeWidth;
        const arrowEndX = x + nodeWidth + spacing;
        const arrowY = y + nodeHeight / 2;
        
        // 向右箭头
        mainGroup.append('line')
          .attr('x1', arrowStartX)
          .attr('y1', arrowY)
          .attr('x2', arrowEndX)
          .attr('y2', arrowY)
          .attr('stroke', '#bfbfbf')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)');
        
        // 向左箭头
        mainGroup.append('line')
          .attr('x1', arrowEndX)
          .attr('y1', arrowY + 10)
          .attr('x2', arrowStartX)
          .attr('y2', arrowY + 10)
          .attr('stroke', '#bfbfbf')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)');
      }
      
      // 更新X坐标，为下一个节点留出空间
      currentX += nodeWidth + spacing;
    });
    
    // 添加头尾标签
    if (nodes.length > 0) {
      mainGroup.append('text')
        .attr('x', 50 + nodeWidth / 2)
        .attr('y', baseY - 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('fill', '#1890ff')
        .attr('font-weight', 'bold')
        .text('↓ HEAD');
      
      if (nodes.length > 1) {
        const lastNodeX = 50 + (nodes.length - 1) * (nodeWidth + spacing);
        mainGroup.append('text')
          .attr('x', lastNodeX + nodeWidth / 2)
          .attr('y', baseY - 15)
          .attr('text-anchor', 'middle')
          .attr('font-size', '13px')
          .attr('fill', '#1890ff')
          .attr('font-weight', 'bold')
          .text('↓ TAIL');
      }
    }
    
    // 初始居中
    const totalWidth = nodes.length * (nodeWidth + spacing);
    const initialTransform = d3.zoomIdentity
      .translate((width - totalWidth) / 2, 0)
      .scale(1);
    svg.call(zoom.transform as any, initialTransform);
    
  }, [quickList, selectedNodeId, selectNode, expandedNodes]);
  
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <span className={styles.hint}>💡 鼠标拖动画布 | 滚轮缩放 | 点击节点头部展开/收起详情</span>
      </div>
      <svg ref={svgRef} className={styles.svg} />
    </div>
  );
};
