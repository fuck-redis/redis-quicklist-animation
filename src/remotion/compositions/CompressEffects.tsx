import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const CompressEffects: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 4;

  const nodeCount = 7;

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
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f8fafc',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        compress 参数效果演示
      </div>

      {/* Config display */}
      <div
        style={{
          position: 'absolute',
          top: 70,
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
            border: '2px solid #a855f7',
            borderRadius: 8,
            padding: '8px 20px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 14 }}>list-compress-depth: </span>
          <span style={{ color: '#a855f7', fontSize: 20, fontWeight: 'bold' }}>{phase}</span>
        </div>
      </div>

      {/* Nodes visualization */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {Array.from({ length: nodeCount }, (_, index) => {
          const isHot = index < phase || index >= nodeCount - phase;
          const isCompressed = !isHot && phase > 0;

          return (
            <React.Fragment key={index}>
              <div
                style={{
                  width: 70,
                  height: 90,
                  background: '#1e293b',
                  border: `3px solid ${isCompressed ? '#a855f7' : '#3b82f6'}`,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCompressed
                    ? '0 0 15px rgba(168, 85, 247, 0.5)'
                    : '0 0 15px rgba(59, 130, 246, 0.3)',
                  transform: `scale(${phase >= 0 ? 1 : 0.8})`,
                }}
              >
                <div
                  style={{
                    background: isCompressed ? '#a855f7' : '#3b82f6',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    color: 'white',
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}
                >
                  {isCompressed ? '🔒 LZF' : isHot ? '🔥 HOT' : '❄️'}
                </div>
                <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 'bold' }}>Node {index}</div>
              </div>
              {index < nodeCount - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>↔</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Explanation boxes */}
      <div
        style={{
          position: 'absolute',
          top: 280,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            padding: 16,
            width: 280,
          }}
        >
          <div style={{ color: '#3b82f6', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            🔥 HOT 节点 (不压缩)
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
            头尾两端的节点保持热备状态，访问频繁，不压缩保证最低延迟
          </div>
        </div>

        <div
          style={{
            background: '#1e293b',
            border: '2px solid #a855f7',
            borderRadius: 12,
            padding: 16,
            width: 280,
          }}
        >
          <div style={{ color: '#a855f7', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            🔒 COLD 节点 (LZF压缩)
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
            中间节点访问较少，启用 LZF 压缩，节省 30-70% 内存
          </div>
        </div>
      </div>

      {/* Compression effect */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ color: '#94a3b8', fontSize: 12 }}>内存占用:</div>
          <div
            style={{
              width: 150 - phase * 30,
              height: 20,
              background: '#ef4444',
              borderRadius: 4,
              transition: 'width 0.3s ease',
            }}
          />
          <div style={{ color: '#94a3b8', fontSize: 12 }}>
            -{phase * 10}% (预估)
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        compress 参数控制两端不压缩的节点数，适合队列等头尾访问频繁的场景
      </div>
    </AbsoluteFill>
  );
};
