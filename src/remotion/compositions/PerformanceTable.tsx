import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const PerformanceTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 40) % 3;

  const operations = [
    { name: 'LPUSH', complexity: 'O(1)', desc: '头插', highlight: phase === 0 },
    { name: 'RPUSH', complexity: 'O(1)', desc: '尾插', highlight: phase === 0 },
    { name: 'LPOP', complexity: 'O(1)', desc: '头弹', highlight: phase === 0 },
    { name: 'RPOP', complexity: 'O(1)', desc: '尾弹', highlight: phase === 0 },
    { name: 'LINDEX', complexity: 'O(N)', desc: '随机访问', highlight: phase === 1 },
    { name: 'LRANGE', complexity: 'O(N)', desc: '范围查询', highlight: phase === 1 },
    { name: 'LINSERT', complexity: 'O(N)', desc: '指定插入', highlight: phase === 1 },
    { name: 'LTRIM', complexity: 'O(N)', desc: '截断列表', highlight: phase === 2 },
  ];

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
        QuickList 操作复杂度
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '⚡ O(1) 操作 - 头尾操作高性能'}
        {phase === 1 && '🐌 O(N) 操作 - 中间操作需遍历'}
        {phase === 2 && '✂️ O(N) 操作 - 删除/截断需谨慎'}
      </div>

      {/* Operations table */}
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
          gap: 12,
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            padding: 16,
            width: 500,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ color: '#f8fafc', fontSize: 12, textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #334155' }}>
                  操作
                </th>
                <th style={{ color: '#f8fafc', fontSize: 12, textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #334155' }}>
                  复杂度
                </th>
                <th style={{ color: '#f8fafc', fontSize: 12, textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #334155' }}>
                  说明
                </th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, i) => (
                <tr
                  key={i}
                  style={{
                    background: op.highlight ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  }}
                >
                  <td style={{ color: '#94a3b8', fontSize: 12, padding: '10px 0', borderBottom: '1px solid #334155' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 'bold', fontFamily: 'monospace' }}>{op.name}</span>
                  </td>
                  <td
                    style={{
                      color: op.complexity === 'O(1)' ? '#10b981' : '#f59e0b',
                      fontSize: 13,
                      fontWeight: 'bold',
                      padding: '10px 0',
                      borderBottom: '1px solid #334155',
                    }}
                  >
                    {op.complexity}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: 12, padding: '10px 0', borderBottom: '1px solid #334155' }}>
                    {op.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* O(1) badge */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 260,
          background: '#10b981',
          padding: '8px 16px',
          borderRadius: 20,
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        O(1) 高性能
      </div>

      {/* O(N) badge */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 380,
          background: '#f59e0b',
          padding: '8px 16px',
          borderRadius: 20,
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        O(N) 需注意
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
        头尾操作 O(1) 高性能，中间操作 O(N) 需谨慎使用
      </div>
    </AbsoluteFill>
  );
};
