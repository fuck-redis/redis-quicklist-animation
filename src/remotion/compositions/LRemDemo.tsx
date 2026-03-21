import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const LRemDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 4;

  const entries = ['A', 'hello', 'B', 'hello', 'C', 'hello', 'D'];

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
        LREM 删除元素动画
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
          LREM mylist 2 &quot;hello&quot;
        </div>
      </div>

      {/* List visualization */}
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
        {entries.map((entry, index) => {
          const isHello = entry === 'hello';
          const shouldDelete = isHello && phase >= 1 && index < entries.length - 2;
          const isDeleted = shouldDelete && phase >= 2;

          return (
            <div
              key={index}
              style={{
                width: 60,
                height: 70,
                background: isDeleted ? '#334155' : isHello ? '#fef3c7' : '#1e293b',
                border: `2px solid ${isDeleted ? '#334155' : isHello ? '#f59e0b' : '#3b82f6'}`,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isDeleted ? 0.3 : 1,
                transform: isDeleted ? 'scale(0.8)' : 'scale(1)',
                transition: 'all 0.3s ease',
                textDecoration: isDeleted ? 'line-through' : 'none',
              }}
            >
              <div
                style={{
                  color: isDeleted ? '#64748b' : isHello ? '#b45309' : '#f8fafc',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                {entry}
              </div>
              <div style={{ color: '#64748b', fontSize: 9, marginTop: 4 }}>[{index}]</div>
            </div>
          );
        })}
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 初始状态: 列表中有 3 个 "hello"'}
        {phase === 1 && '⚡ 找到第一个 "hello" (索引1)'}
        {phase === 2 && '🔄 删除前2个 "hello"'}
        {phase === 3 && '✅ 删除完成: [A, B, C, D]'}
      </div>

      {/* Result */}
      {phase >= 3 && (
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
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            返回值: 2 (删除了2个元素)
          </div>
        </div>
      )}

      {/* Count explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {[
          { count: 'count > 0', desc: '从头部开始删' },
          { count: 'count < 0', desc: '从尾部开始删' },
          { count: 'count = 0', desc: '删除所有匹配' },
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
            <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 'bold' }}>{item.count}</div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>{item.desc}</div>
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
        LREM 删除列表中指定数量的匹配元素，O(N) 复杂度
      </div>
    </AbsoluteFill>
  );
};
