import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

export const NodeMerge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = frame < 30 ? 0 : frame < 90 ? 1 : 2;
  const mergeProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });

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
        节点合并动画
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#10b981',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 Phase 1: 删除元素后，检查相邻节点'}
        {phase === 1 && '⚡ Phase 2: 将 Node2 元素追加到 Node1'}
        {phase === 2 && '✅ Phase 3: 删除 Node2，更新指针'}
      </div>

      {/* Initial state - two nodes with few elements */}
      {phase < 2 && (
        <>
          {/* Node 1 */}
          <div
            style={{
              position: 'absolute',
              left: 100,
              top: 200,
              width: 180,
              height: 160,
              transform: `translateX(${mergeProgress * 100}px)`,
              opacity: 1,
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
                Node1 (3元素)
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
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: 4,
                      padding: '4px 10px',
                      color: '#93c5fd',
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow between nodes */}
          <div
            style={{
              position: 'absolute',
              left: 280,
              top: 270,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ color: '#f472b6', fontSize: 20 }}>◀</span>
            <div style={{ width: 30, height: 3, background: '#3b82f6' }} />
            <span style={{ color: '#10b981', fontSize: 20 }}>▶</span>
          </div>

          {/* Node 2 */}
          <div
            style={{
              position: 'absolute',
              left: 330,
              top: 200,
              width: 180,
              height: 160,
              transform: `translateX(${-mergeProgress * 50}px)`,
              opacity: 1 - mergeProgress * 0.5,
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
                Node2 (2元素)
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
                {[4, 5].map((num) => (
                  <div
                    key={num}
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 4,
                      padding: '4px 10px',
                      color: '#6ee7b7',
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node 3 */}
          <div
            style={{
              position: 'absolute',
              left: 530,
              top: 200,
              width: 180,
              height: 160,
              opacity: phase === 0 ? 1 : 0.3,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 12,
                border: '3px solid #94a3b8',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              }}
            >
              <div
                style={{
                  background: '#94a3b8',
                  color: 'white',
                  padding: '8px 0',
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  borderTopLeftRadius: 9,
                  borderTopRightRadius: 9,
                }}
              >
                Node3
              </div>
            </div>
          </div>
        </>
      )}

      {/* After merge - single combined node */}
      {phase >= 1 && (
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 200,
            width: 280,
            height: 180,
            transform: `scale(${0.5 + mergeProgress * 0.5})`,
            opacity: mergeProgress,
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
              Node1 (合并后: 5元素)
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
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: 4,
                    padding: '4px 10px',
                    color: '#6ee7b7',
                    fontSize: 12,
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
        {phase === 0 && '删除元素后，相邻节点总元素数小于 fill，可以合并'}
        {phase === 1 && '将 Node2 的元素追加到 Node1'}
        {phase === 2 && '删除 Node2，Node1 <-> Node3，节点数量减少'}
      </div>
    </AbsoluteFill>
  );
};
