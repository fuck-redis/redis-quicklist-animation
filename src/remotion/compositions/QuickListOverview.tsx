import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

export const QuickListOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const nodeCount = 3;
  const nodes = Array.from({ length: nodeCount }, (_, i) => i);

  const getNodeX = (index: number) => 150 + index * 220;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f8fafc',
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        QuickList 结构概述
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 16,
        }}
      >
        双向链表 + ZipList = 高性能 + 低内存
      </div>

      {/* Nodes */}
      {nodes.map((_, index) => {
        const x = getNodeX(index);
        const y = 180;
        const entryCount = 3 + index;
        const nodeScale = interpolate(frame, [index * 15, index * 15 + 10], [0.5, 1], { extrapolateRight: 'clamp' });
        const nodeOpacity = interpolate(frame, [index * 15, index * 15 + 10], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 160,
              height: 280,
              transform: `scale(${nodeScale})`,
              opacity: nodeOpacity,
              transformOrigin: 'center center',
            }}
          >
            {/* Node border */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 12,
                border: '3px solid #3b82f6',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '8px 0',
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  borderTopLeftRadius: 9,
                  borderTopRightRadius: 9,
                }}
              >
                ZipList #{index}
              </div>

              {/* Index */}
              <div
                style={{
                  textAlign: 'center',
                  color: '#e5e7eb',
                  fontSize: 18,
                  fontWeight: 'bold',
                  padding: '16px 0 8px',
                }}
              >
                #{index}
              </div>

              {/* Entries */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '0 12px',
                }}
              >
                {Array.from({ length: entryCount }, (_, e) => (
                  <div
                    key={e}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: 4,
                      padding: '4px 12px',
                      color: '#93c5fd',
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                  >
                    [{e}] item
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows between nodes */}
      {nodes.slice(0, -1).map((_, index) => {
        const x1 = getNodeX(index) + 160;
        const x2 = getNodeX(index + 1);
        const y = 360;
        const arrowOpacity = interpolate(frame, [(index + 1) * 15, (index + 1) * 15 + 10], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <div
            key={`arrow-${index}`}
            style={{
              position: 'absolute',
              left: x1,
              top: y,
              width: x2 - x1,
              opacity: arrowOpacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#f472b6', fontSize: 20 }}>◀</span>
              <div
                style={{
                  width: 40,
                  height: 3,
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                }}
              />
              <span style={{ color: '#10b981', fontSize: 20 }}>▶</span>
            </div>
          </div>
        );
      })}

      {/* Head/Tail labels */}
      <div
        style={{
          position: 'absolute',
          left: getNodeX(0) + 60,
          top: 520,
          color: '#3b82f6',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        HEAD
      </div>
      <div
        style={{
          position: 'absolute',
          left: getNodeX(nodeCount - 1) + 60,
          top: 520,
          color: '#f472b6',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        TAIL
      </div>

      {/* Explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        每个节点是一个 ZipList，节点之间通过双向链表连接
      </div>
    </AbsoluteFill>
  );
};
