import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const LinkedListProblems: React.FC = () => {
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
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#ef4444',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        传统双向链表的问题
      </div>

      {/* Problems */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* Problem 1: Memory Fragmentation */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 0 ? '#ef4444' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 400,
            transform: `scale(${phase >= 0 ? 1 : 0.95})`,
            opacity: phase >= 0 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ❌ 问题 1: 内存碎片严重
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            每个元素单独分配内存，导致大量内存碎片，内存利用率低
          </div>
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginTop: 12,
              justifyContent: 'center',
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: 30 + Math.random() * 20,
                  background: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][i],
                  borderRadius: 4,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* Problem 2: Pointer Overhead */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 1 ? '#ef4444' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 400,
            transform: `scale(${phase >= 1 ? 1 : 0.95})`,
            opacity: phase >= 1 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ❌ 问题 2: 指针开销大
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            每个节点需要 prev + next 指针（32字节），小数据指针开销占比大
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 12,
            }}
          >
            <div
              style={{
                background: '#334155',
                padding: '8px 12px',
                borderRadius: 8,
                color: '#f8fafc',
                fontSize: 12,
              }}
            >
              数据: 8B
            </div>
            <div style={{ color: '#ef4444', fontSize: 20 }}>+</div>
            <div
              style={{
                background: '#dc2626',
                padding: '8px 12px',
                borderRadius: 8,
                color: 'white',
                fontSize: 12,
              }}
            >
              指针: 32B
            </div>
            <div style={{ color: '#ef4444', fontSize: 20 }}>=</div>
            <div
              style={{
                background: '#ef4444',
                padding: '8px 12px',
                borderRadius: 8,
                color: 'white',
                fontSize: 12,
              }}
            >
              总计: 40B
            </div>
          </div>
        </div>

        {/* Problem 3: Low Memory Efficiency */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 2 ? '#ef4444' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 400,
            transform: `scale(${phase >= 2 ? 1 : 0.95})`,
            opacity: phase >= 2 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ❌ 问题 3: 内存利用率低
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            小数据（如整数 "1"）实际只需 2-4 字节，但指针开销 32B，利用率仅 6-12%
          </div>
          <div
            style={{
              marginTop: 12,
              height: 20,
              background: '#334155',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '10%',
                height: '100%',
                background: 'linear-gradient(90deg, #dc2626, #ef4444)',
              }}
            />
          </div>
          <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4, textAlign: 'center' }}>
            有效数据仅占 10%
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
          color: '#ef4444',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        双向链表虽然操作灵活，但内存效率低，不适合存储小数据
      </div>
    </AbsoluteFill>
  );
};
