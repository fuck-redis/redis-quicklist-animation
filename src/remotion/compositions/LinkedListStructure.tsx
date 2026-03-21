import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const LinkedListStructure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 4;

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
        双向链表结构
      </div>

      {/* Nodes */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Node */}
            <div
              style={{
                width: 80,
                height: 100,
                background: '#1e293b',
                border: '3px solid #3b82f6',
                borderRadius: 12,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${phase >= index ? 1 : 0.8})`,
                opacity: phase >= index ? 1 : 0.5,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ color: '#f8fafc', fontSize: 24, fontWeight: 'bold' }}>
                {String.fromCharCode(65 + index)}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4 }}>
                #{index}
              </div>
            </div>

            {/* Arrows */}
            {index < 3 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginLeft: 10,
                }}
              >
                <div style={{ color: '#10b981', fontSize: 16 }}>▶ next</div>
                <div style={{ color: '#f472b6', fontSize: 16 }}>◀ prev</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Memory layout illustration */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #334155',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
            内存布局示意
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 60,
                  height: 40,
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#93c5fd', fontSize: 10 }}>Node{i}</span>
                <span style={{ color: '#64748b', fontSize: 8 }}>16B ptr</span>
              </div>
            ))}
          </div>
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
        每个节点需要额外的 prev/next 指针（16字节），内存开销大
      </div>
    </AbsoluteFill>
  );
};
