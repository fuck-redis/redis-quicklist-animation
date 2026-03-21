import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const LTrimDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 4;

  const entries = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
        LTRIM 截断列表动画
      </div>

      {/* Command */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 8,
            padding: '10px 20px',
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#94a3b8',
          }}
        >
          LTRIM mylist 0 4
        </div>
      </div>

      {/* Before state */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ color: '#94a3b8', fontSize: 12 }}>
          {phase < 2 ? '操作前:' : '操作后:'}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500 }}>
          {entries.map((entry, index) => {
            const isKept = index >= 0 && index <= 4;
            const shouldRemove = index > 4;
            const isRemoved = phase >= 2 && shouldRemove;

            return (
              <div
                key={index}
                style={{
                  width: 44,
                  height: 50,
                  background: isRemoved ? '#334155' : '#1e293b',
                  border: `2px solid ${isRemoved ? '#334155' : isKept ? '#10b981' : '#ef4444'}`,
                  borderRadius: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isRemoved ? 0.2 : 1,
                  transform: isRemoved ? 'scale(0.7)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    color: isRemoved ? '#64748b' : '#f8fafc',
                    fontSize: 12,
                    fontWeight: 'bold',
                    textDecoration: isRemoved ? 'line-through' : 'none',
                  }}
                >
                  {entry}
                </div>
                <div style={{ color: '#64748b', fontSize: 8 }}>[{index}]</div>
                {shouldRemove && !isRemoved && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: '#ef4444',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      fontSize: 8,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 初始状态: 10 个元素'}
        {phase === 1 && '⚡ LTRIM 0 4 → 只保留索引 0-4'}
        {phase === 2 && '🔄 删除索引 5-9 的元素'}
        {phase === 3 && '✅ 完成: 只保留 [A, B, C, D, E]'}
      </div>

      {/* Result list */}
      {phase >= 2 && (
        <div
          style={{
            position: 'absolute',
            top: 350,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {['A', 'B', 'C', 'D', 'E'].map((entry, index) => (
            <div
              key={index}
              style={{
                width: 50,
                height: 50,
                background: '#1e293b',
                border: '2px solid #10b981',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: '#6ee7b7', fontSize: 14, fontWeight: 'bold' }}>{entry}</div>
              <div style={{ color: '#64748b', fontSize: 8 }}>[{index}]</div>
            </div>
          ))}
        </div>
      )}

      {/* Use cases */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {[
          { cmd: 'LTRIM 0 999', desc: '限制最大1000条' },
          { cmd: 'LTRIM -100 -1', desc: '只保留最后100条' },
          { cmd: 'LTRIM 0 49', desc: '分页获取' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '6px 10px',
            }}
          >
            <div style={{ color: '#3b82f6', fontSize: 10, fontFamily: 'monospace' }}>{item.cmd}</div>
            <div style={{ color: '#94a3b8', fontSize: 9 }}>{item.desc}</div>
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
        LTRIM 截断列表，保留指定范围的元素，常用于限制列表长度
      </div>
    </AbsoluteFill>
  );
};
