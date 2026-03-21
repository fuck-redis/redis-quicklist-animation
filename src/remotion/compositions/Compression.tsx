import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

export const Compression: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const nodeCount = 5;
  const phase = frame < 30 ? 0 : frame < 90 ? 1 : 2;
  const compressProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });

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
          top: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f8fafc',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        LZF 压缩动画
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#a855f7',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 Phase 1: compress = 0 (不压缩)'}
        {phase === 1 && '⚡ Phase 2: compress = 1 (头尾不压缩)'}
        {phase === 2 && '✅ Phase 3: 中间节点启用 LZF 压缩'}
      </div>

      {/* Config display */}
      <div
        style={{
          position: 'absolute',
          top: 110,
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
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>list-compress-depth: </span>
          <span style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>
            {phase === 0 ? 0 : 1}
          </span>
        </div>
      </div>

      {/* Nodes */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {Array.from({ length: nodeCount }, (_, index) => {
          const isHot = phase > 0 && index > 0 && index < nodeCount - 1;
          const isCompressed = phase >= 2 && isHot;
          const compressionRatio = isCompressed ? compressProgress * 0.5 : 0;

          return (
            <div
              key={index}
              style={{
                width: 100,
                height: 140,
                transform: isCompressed ? `scale(${1 - compressionRatio * 0.3})` : 'scale(1)',
                opacity: 0.7 + (isHot && phase > 0 ? compressProgress * 0.3 : 0),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 10,
                  border: `3px solid ${isCompressed ? '#a855f7' : isHot ? '#94a3b8' : '#3b82f6'}`,
                  boxShadow: `0 0 20px ${
                    isCompressed
                      ? 'rgba(168, 85, 247, 0.5)'
                      : isHot
                      ? 'rgba(148, 163, 184, 0.3)'
                      : 'rgba(59, 130, 246, 0.3)'
                  }`,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                }}
              >
                <div
                  style={{
                    background: isCompressed ? '#a855f7' : isHot ? '#94a3b8' : '#3b82f6',
                    color: 'white',
                    padding: '6px 0',
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: 'bold',
                    borderTopLeftRadius: 7,
                    borderTopRightRadius: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  {isCompressed && <span>🔒 LZF</span>}
                  {isHot && !isCompressed && <span>❄️ COLD</span>}
                  {!isHot && <span>🔥 HOT</span>}
                  Node {index}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    padding: 8,
                  }}
                >
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        background: isCompressed
                          ? 'rgba(168, 85, 247, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                        border: `1px solid ${
                          isCompressed ? 'rgba(168, 85, 247, 0.4)' : 'rgba(59, 130, 246, 0.4)'
                        }`,
                        borderRadius: 3,
                        padding: '2px 8px',
                        color: isCompressed ? '#d8b4fe' : '#93c5fd',
                        fontSize: 10,
                      }}
                    >
                      item{n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows between nodes */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {Array.from({ length: nodeCount - 1 }, (_, index) => (
          <div
            key={index}
            style={{
              width: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span style={{ color: '#f472b6', fontSize: 16 }}>◀</span>
            <div style={{ width: 30, height: 2, background: '#475569' }} />
            <span style={{ color: '#10b981', fontSize: 16 }}>▶</span>
          </div>
        ))}
      </div>

      {/* Compression effect legend */}
      {phase >= 2 && (
        <div
          style={{
            position: 'absolute',
            top: 400,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 80,
                height: 16,
                background: '#ef4444',
                borderRadius: 4,
              }}
            />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>压缩前</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: 20 }}>→</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 40,
                height: 16,
                background: '#10b981',
                borderRadius: 4,
              }}
            />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>压缩后 (节省 30-70%)</span>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        {phase === 0 && 'compress=0: 所有节点都不压缩'}
        {phase === 1 && 'compress=1: 头尾各1个节点保持热备，中间节点可以压缩'}
        {phase === 2 && 'LZF 算法压缩中间节点，节省 30-70% 内存'}
      </div>
    </AbsoluteFill>
  );
};
