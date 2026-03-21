import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ScenarioRateLimit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 30) % 4;

  const timestamps = ['12:00:01', '12:00:03', '12:00:07', '12:00:12', '12:00:15'];

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
        ⏱️ 场景4: 限流滑动窗口
      </div>

      {/* Sliding window visualization */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Timeline */}
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            padding: 16,
            width: 450,
          }}
        >
          <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 'bold', marginBottom: 12 }}>
            时间窗口 (最近100条)
          </div>

          {/* Timeline bar */}
          <div style={{ position: 'relative', height: 40, marginBottom: 8 }}>
            {/* Window indicator */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                height: '100%',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 6,
              }}
            />
            {/* Timestamps */}
            <div style={{ display: 'flex', gap: 8, padding: '8px 0', position: 'relative' }}>
              {timestamps.map((ts, i) => (
                <div
                  key={i}
                  style={{
                    background: '#334155',
                    padding: '4px 8px',
                    borderRadius: 4,
                    color: '#93c5fd',
                    fontSize: 10,
                    fontFamily: 'monospace',
                  }}
                >
                  {ts}
                </div>
              ))}
              {phase >= 1 && (
                <div
                  style={{
                    background: '#10b981',
                    padding: '4px 8px',
                    borderRadius: 4,
                    color: 'white',
                    fontSize: 10,
                    fontFamily: 'monospace',
                    animation: 'pulse 0.5s ease-in-out infinite',
                  }}
                >
                  {phase >= 2 ? '12:00:18' : '12:00:16'}
                </div>
              )}
            </div>
          </div>

          <div style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center' }}>
            时间窗口内请求数: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{5 + (phase >= 1 ? (phase >= 2 ? 2 : 1) : 0)}</span>
          </div>
        </div>

        {/* Operations */}
        <div
          style={{
            display: 'flex',
            gap: 12,
          }}
        >
          {[
            { op: 'LPUSH timestamp', desc: '记录请求' },
            { op: 'LTRIM 0 99', desc: '保持100条' },
            { op: 'LRANGE 0 -1 | wc -l', desc: '统计数量' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                padding: '8px 12px',
              }}
            >
              <div style={{ color: '#3b82f6', fontSize: 10, fontFamily: 'monospace' }}>{item.op}</div>
              <div style={{ color: '#64748b', fontSize: 9 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Config */}
      <div
        style={{
          position: 'absolute',
          top: 280,
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
            border: '2px solid #10b981',
            borderRadius: 8,
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>fill = </span>
          <span style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>-5</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (64KB 大节点)</span>
        </div>
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 8,
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>compress = </span>
          <span style={{ color: '#3b82f6', fontSize: 16, fontWeight: 'bold' }}>0</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (不压缩)</span>
        </div>
      </div>

      {/* Benefits */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {[
          '小元素用大节点',
          '时间戳占用小',
          'O(1) 写入',
          '精确计数',
        ].map((benefit, i) => (
          <div
            key={i}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '6px 10px',
              color: '#94a3b8',
              fontSize: 10,
            }}
          >
            ✓ {benefit}
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
        限流滑动窗口：LPUSH 记录时间，LTRIM 保持窗口大小，O(1) 性能优秀
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
