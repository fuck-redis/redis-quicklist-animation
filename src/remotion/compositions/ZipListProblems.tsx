import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ZipListProblems: React.FC = () => {
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
          color: '#f59e0b',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        纯 ZipList 的问题
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
          gap: 20,
        }}
      >
        {/* Problem 1: Insert/Delete Performance */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 0 ? '#f59e0b' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 0 ? 1 : 0.95})`,
            opacity: phase >= 0 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ❌ 问题 1: 插入/删除 O(N)
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            连续内存存储，插入/删除需要移动后续所有元素
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              marginTop: 12,
              fontFamily: 'monospace',
              fontSize: 11,
            }}
          >
            {['A', 'B', 'C', 'D', 'E'].map((char, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    background: '#10b981',
                    padding: '6px 10px',
                    borderRadius: 4,
                    color: 'white',
                  }}
                >
                  {char}
                </div>
                {i < 4 && <span style={{ color: '#64748b' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ color: '#f59e0b', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
            插入 X 到位置 2: 需要移动 C, D, E
          </div>
        </div>

        {/* Problem 2: Frequent Realloc */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 1 ? '#f59e0b' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 1 ? 1 : 0.95})`,
            opacity: phase >= 1 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ❌ 问题 2: 频繁 realloc
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            连续内存扩展需要重新分配整个数组，代价高昂
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
            {[4, 8, 16, 32].map((size, i) => (
              <div
                key={i}
                style={{
                  background: '#334155',
                  width: size * 3,
                  height: 30,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: 10,
                }}
              >
                {size}
              </div>
            ))}
          </div>
          <div style={{ color: '#f59e0b', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
            每次扩容需要复制所有数据
          </div>
        </div>

        {/* Problem 3: Cascade Update */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 2 ? '#f59e0b' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 2 ? 1 : 0.95})`,
            opacity: phase >= 2 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ❌ 问题 3: 级联更新
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            entry 的 prevlen 字段存储前一个 entry 的长度，插入/删除可能导致后续所有 entry 的 prevlen 变化
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              marginTop: 12,
              fontFamily: 'monospace',
              fontSize: 10,
            }}
          >
            {[
              { prevlen: '3B', data: 'A' },
              { prevlen: '5B', data: 'B' },
              { prevlen: '?', data: 'C' },
              { prevlen: '?', data: 'D' },
            ].map((entry, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    background: '#1e293b',
                    border: '1px solid #f59e0b',
                    borderRadius: 4,
                    padding: '4px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#f59e0b', fontSize: 8 }}>{entry.prevlen}</span>
                  <span style={{ color: '#10b981' }}>{entry.data}</span>
                </div>
                {i < 3 && <span style={{ color: '#64748b' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ color: '#f59e0b', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
            B 变化后，C、D、E 的 prevlen 都需要更新
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
          color: '#f59e0b',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        纯 ZipList 虽然内存紧凑，但操作性能差，不适合频繁修改的场景
      </div>
    </AbsoluteFill>
  );
};
