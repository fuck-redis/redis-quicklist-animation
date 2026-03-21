import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const PointerConnections: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 30) % 3;

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
        节点指针连接
      </div>

      {/* Visualization */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* HEAD label */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 200,
            color: '#3b82f6',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          HEAD
        </div>

        {/* Nodes with pointers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[0, 1, 2].map((index) => (
            <React.Fragment key={index}>
              {/* prev pointer */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: phase >= 1 ? 1 : 0.3,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 8,
                    background: '#f472b6',
                    borderRadius: 4,
                  }}
                />
                <div style={{ color: '#f472b6', fontSize: 10 }}>prev</div>
              </div>

              {/* Node */}
              <div
                style={{
                  width: 100,
                  height: 120,
                  background: '#1e293b',
                  border: '3px solid #3b82f6',
                  borderRadius: 12,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ color: '#f8fafc', fontSize: 20, fontWeight: 'bold' }}>
                  Node{index}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4 }}>
                  16B prev
                </div>
                <div style={{ color: '#94a3b8', fontSize: 10 }}>16B next</div>
              </div>

              {/* next pointer */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: phase >= 1 ? 1 : 0.3,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 8,
                    background: '#10b981',
                    borderRadius: 4,
                  }}
                />
                <div style={{ color: '#10b981', fontSize: 10 }}>next</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* TAIL label */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: 160,
            color: '#f472b6',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          TAIL
        </div>
      </div>

      {/* Memory cost */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          每个节点额外开销: 16B (prev) + 16B (next) = 32B 指针
        </div>
      </div>

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
        双向链表通过 prev 和 next 指针连接节点，支持 O(1) 的头尾操作
      </div>
    </AbsoluteFill>
  );
};
