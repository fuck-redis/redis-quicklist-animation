import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

export const NodeSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  // Phase 0: Initial state (frames 0-30)
  // Phase 1: Split happening (frames 30-90)
  // Phase 2: Split complete (frames 90-180)

  const phase = frame < 30 ? 0 : frame < 90 ? 1 : 2;
  const splitProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });

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
        节点分裂动画
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 Phase 1: 节点元素超过 fill 限制'}
        {phase === 1 && '⚡ Phase 2: 在中间位置分裂'}
        {phase === 2 && '✅ Phase 3: 分裂完成'}
      </div>

      {/* Before split - single node */}
      {phase < 2 && (
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 200,
            width: 280,
            height: 220,
            transform: `scale(${1 - splitProgress * 0.3})`,
            opacity: 1 - splitProgress * 0.5,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 12,
              border: '3px solid #f59e0b',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            }}
          >
            <div
              style={{
                background: '#f59e0b',
                color: 'white',
                padding: '8px 0',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                borderTopLeftRadius: 9,
                borderTopRightRadius: 9,
              }}
            >
              ZipList #0 (过满!)
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                padding: 12,
                justifyContent: 'center',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <div
                  key={num}
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: 4,
                    padding: '4px 8px',
                    color: '#fcd34d',
                    fontSize: 11,
                    fontFamily: 'monospace',
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Split arrow */}
      {phase >= 1 && (
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 300,
            opacity: splitProgress,
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: 40, fontWeight: 'bold' }}>→∣←</div>
          <div style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            分裂点
          </div>
        </div>
      )}

      {/* After split - two nodes */}
      {phase >= 1 && (
        <>
          {/* Node 1 */}
          <div
            style={{
              position: 'absolute',
              left: 480,
              top: 180,
              width: 160,
              height: 180,
              transform: `translateX(${(1 - splitProgress) * 200}px)`,
              opacity: splitProgress,
            }}
          >
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
                ZipList #0
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  padding: 12,
                  justifyContent: 'center',
                }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: 4,
                      padding: '4px 8px',
                      color: '#93c5fd',
                      fontSize: 11,
                      fontFamily: 'monospace',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node 2 */}
          <div
            style={{
              position: 'absolute',
              left: 660,
              top: 240,
              width: 160,
              height: 180,
              transform: `translateX(${(1 - splitProgress) * 200}px)`,
              opacity: splitProgress,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 12,
                border: '3px solid #10b981',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              }}
            >
              <div
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '8px 0',
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  borderTopLeftRadius: 9,
                  borderTopRightRadius: 9,
                }}
              >
                ZipList #1 (新)
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  padding: 12,
                  justifyContent: 'center',
                }}
              >
                {[6, 7, 8, 9, 10, 11].map((num) => (
                  <div
                    key={num}
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 4,
                      padding: '4px 8px',
                      color: '#6ee7b7',
                      fontSize: 11,
                      fontFamily: 'monospace',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow between new nodes */}
          {phase >= 2 && (
            <div
              style={{
                position: 'absolute',
                left: 620,
                top: 300,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ color: '#f472b6', fontSize: 20 }}>◀</span>
              <div
                style={{
                  width: 30,
                  height: 3,
                  background: '#3b82f6',
                }}
              />
              <span style={{ color: '#10b981', fontSize: 20 }}>▶</span>
            </div>
          )}
        </>
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
        {phase === 0 && '当节点元素数量超过 fill 限制时，触发分裂'}
        {phase === 1 && '在中间位置将数据分成两部分，创建新节点'}
        {phase === 2 && '更新链表指针，Node1 <-> Node2'}
      </div>
    </AbsoluteFill>
  );
};
