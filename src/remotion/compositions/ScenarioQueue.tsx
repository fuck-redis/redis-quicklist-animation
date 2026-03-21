import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ScenarioQueue: React.FC = () => {
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
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f8fafc',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        📨 场景1: 消息队列
      </div>

      {/* Producer/Consumer diagram */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
        }}
      >
        {/* Producer */}
        <div
          style={{
            background: '#10b981',
            padding: '12px 20px',
            borderRadius: 12,
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          生产者 RPUSH
        </div>

        {/* Arrow */}
        <div style={{ color: '#3b82f6', fontSize: 32 }}>→</div>

        {/* Queue */}
        <div
          style={{
            background: '#1e293b',
            border: '3px solid #3b82f6',
            borderRadius: 12,
            padding: 16,
            minWidth: 200,
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
          }}
        >
          <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
            QuickList Queue
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['T1', 'T2', 'T3'].map((task, i) => (
              <div
                key={i}
                style={{
                  background: '#334155',
                  padding: '6px 10px',
                  borderRadius: 4,
                  color: '#93c5fd',
                  fontSize: 11,
                }}
              >
                {task}
              </div>
            ))}
            {phase >= 1 && (
              <div
                style={{
                  background: '#10b981',
                  padding: '6px 10px',
                  borderRadius: 4,
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 'bold',
                  animation: 'pulse 0.5s ease-in-out infinite',
                }}
              >
                T4
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: '#f472b6', fontSize: 32 }}>→</div>

        {/* Consumer */}
        <div
          style={{
            background: '#dc382d',
            padding: '12px 20px',
            borderRadius: 12,
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          消费者 LPOP
        </div>
      </div>

      {/* Config */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
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
          <span style={{ color: '#94a3b8', fontSize: 12 }}>fill = </span>
          <span style={{ color: '#3b82f6', fontSize: 16, fontWeight: 'bold' }}>-2</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (8KB)</span>
        </div>
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #10b981',
            borderRadius: 8,
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>compress = </span>
          <span style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>0</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (不压缩)</span>
        </div>
      </div>

      {/* Performance highlight */}
      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#10b981',
            padding: '10px 24px',
            borderRadius: 20,
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          O(1) 时间复杂度 - 高性能队列
        </div>
      </div>

      {/* Features */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {[
          'RPUSH/LPOP 都是 O(1)',
          'BLPOP 支持阻塞',
          '不压缩保证最低延迟',
          '适合高并发场景',
        ].map((feature, i) => (
          <div
            key={i}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#94a3b8',
              fontSize: 11,
            }}
          >
            ✓ {feature}
          </div>
        ))}
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
        消息队列是 QuickList 最经典的场景，头尾操作 O(1) 保证高性能
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </AbsoluteFill>
  );
};
