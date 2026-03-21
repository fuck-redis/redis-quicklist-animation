import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const FillConfig: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = frame < 45 ? 0 : frame < 90 ? 1 : frame < 135 ? 2 : 3;
  const fillValue = phase < 1 ? -2 : phase < 2 ? -5 : phase < 3 ? -1 : 2;
  const compressDepth = phase >= 3 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 fill = -2 (默认 8KB)'}
        {phase === 1 && '📍 fill = -5 (64KB 大节点)'}
        {phase === 2 && '⚡ fill = -1 (4KB 小节点)'}
        {phase === 3 && '✅ compress = 1 压缩策略'}
      </div>

      {/* Config display */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 8,
            padding: '8px 20px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 14 }}>list-max-ziplist-size:</span>
          <span style={{ color: '#10b981', fontSize: 20, fontWeight: 'bold' }}>{fillValue}</span>
        </div>
        {phase >= 3 && (
          <div
            style={{
              background: '#1e293b',
              border: '2px solid #10b981',
              borderRadius: 8,
              padding: '8px 20px',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: 14 }}>list-compress-depth:</span>
            <span style={{ color: '#10b981', fontSize: 20, fontWeight: 'bold' }}>{compressDepth}</span>
          </div>
        )}
      </div>

      {/* Nodes */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {[0, 1, 2, 3, 4].map((idx) => {
          const isHot = compressDepth > 0 && (idx < compressDepth || idx >= 5 - compressDepth);
          const isCompressed = compressDepth > 0 && !isHot;

          return (
            <div
              key={idx}
              style={{
                width: 100,
                height: 160,
                borderRadius: 12,
                border: `3px solid ${isCompressed ? '#a855f7' : isHot ? '#3b82f6' : '#10b981'}`,
                boxShadow: `0 0 20px ${
                  isCompressed ? 'rgba(168, 85, 247, 0.4)' : isHot ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'
                }`,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                overflow: 'hidden',
              }}
            >
              {/* Node header */}
              <div
                style={{
                  background: isCompressed ? '#a855f7' : isHot ? '#3b82f6' : '#10b981',
                  color: 'white',
                  padding: '6px 0',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                {isCompressed && <span>🔒</span>}
                {isHot && <span>🔥</span>}
                ZipList #{idx}
              </div>

              {/* Node index */}
              <div
                style={{
                  textAlign: 'center',
                  color: '#e5e7eb',
                  fontSize: 18,
                  fontWeight: 'bold',
                  padding: '12px 0 8px',
                }}
              >
                #{idx}
              </div>

              {/* Entries */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  padding: '0 8px',
                }}
              >
                {[0, 1].map((e) => (
                  <div
                    key={e}
                    style={{
                      background: isCompressed
                        ? 'rgba(168, 85, 247, 0.2)'
                        : 'rgba(59, 130, 246, 0.2)',
                      border: `1px solid ${
                        isCompressed ? 'rgba(168, 85, 247, 0.4)' : 'rgba(59, 130, 246, 0.4)'
                      }`,
                      borderRadius: 4,
                      padding: '3px 8px',
                      color: isCompressed ? '#d8b4fe' : '#93c5fd',
                      fontSize: 10,
                    }}
                  >
                    [{e}] item
                  </div>
                ))}
              </div>

              {/* Compressed badge */}
              {isCompressed && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#a855f7',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: 8,
                    fontWeight: 'bold',
                  }}
                >
                  LZF 压缩
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, background: '#3b82f6' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>HOT (不压缩)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, background: '#a855f7' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>COLD (LZF压缩)</span>
        </div>
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
        {phase === 0 && 'fill=-2: 每个节点最大 8KB，适合通用场景'}
        {phase === 1 && 'fill=-5: 每个节点最大 64KB，适合小元素批量存储'}
        {phase === 2 && 'fill=-1: 每个节点最大 4KB，适合大元素场景'}
        {phase === 3 && 'compress=1: 头尾各1个节点不压缩，中间节点启用 LZF 压缩'}
      </div>
    </AbsoluteFill>
  );
};
