import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const PerformanceSummary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = frame < 60 ? 0 : frame < 120 ? 1 : 2;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '⚡ O(1) 操作: LPUSH/RPUSH/LPOP/RPOP'}
        {phase === 1 && '🐌 O(N) 操作: LINDEX/LRANGE/LINSERT'}
        {phase === 2 && '✅ 最佳实践: 合理配置参数'}
      </div>

      {/* Performance table */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 40,
          background: '#1e293b',
          border: '2px solid #3b82f6',
          borderRadius: 12,
          padding: 16,
          width: 450,
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
            {[
              { op: 'LPUSH/RPUSH', complexity: 'O(1)', desc: '头尾插入，可能分裂', highlight: phase === 0 },
              { op: 'LPOP/RPOP', complexity: 'O(1)', desc: '头尾弹出，可能合并', highlight: phase === 0 },
              { op: 'LINDEX', complexity: 'O(N)', desc: '遍历节点 + ZipList', highlight: phase === 1 },
              { op: 'LRANGE', complexity: 'O(N)', desc: '遍历收集元素', highlight: phase === 1 },
              { op: 'LINSERT', complexity: 'O(N)', desc: '查找位置 + 插入', highlight: phase === 1 },
              { op: 'LTRIM', complexity: 'O(N)', desc: '删除多余元素', highlight: phase === 1 },
            ].map((row, idx) => (
              <tr
                key={idx}
                style={{
                  background: row.highlight ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                }}
              >
                <td style={{ color: '#94a3b8', fontSize: 12, padding: '8px 0', borderBottom: '1px solid #334155' }}>
                  {row.op}
                </td>
                <td
                  style={{
                    color: row.complexity === 'O(1)' ? '#10b981' : '#f59e0b',
                    fontSize: 12,
                    fontWeight: 'bold',
                    padding: '8px 0',
                    borderBottom: '1px solid #334155',
                  }}
                >
                  {row.complexity}
                </td>
                <td style={{ color: '#94a3b8', fontSize: 12, padding: '8px 0', borderBottom: '1px solid #334155' }}>
                  {row.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best practices */}
      {phase === 2 && (
        <div
          style={{
            position: 'absolute',
            top: 70,
            right: 40,
            background: '#1e293b',
            border: '2px solid #10b981',
            borderRadius: 12,
            padding: 16,
            width: 280,
          }}
        >
          <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
            最佳实践
          </div>
          {[
            '优先使用头尾操作 LPUSH/RPUSH/LPOP/RPOP',
            '避免频繁 LINDEX 随机访问',
            '使用 LTRIM 防止数据无限增长',
            '根据数据类型选择合适 fill 和 compress',
          ].map((practice, idx) => (
            <div
              key={idx}
              style={{
                color: '#94a3b8',
                fontSize: 12,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <span style={{ color: '#10b981' }}>✓</span>
              <span>{practice}</span>
            </div>
          ))}
        </div>
      )}

      {/* Config recommendation */}
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
          { scenario: '消息队列', fill: '-2 (8KB)', compress: '0' },
          { scenario: '时间线', fill: '-1 (4KB)', compress: '1-2' },
          { scenario: '小元素', fill: '-4 (32KB)', compress: '1' },
          { scenario: '大元素', fill: '-1 (4KB)', compress: '0' },
        ].map((config, idx) => (
          <div
            key={idx}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '8px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#f8fafc', fontSize: 11, fontWeight: 'bold' }}>{config.scenario}</div>
            <div style={{ color: '#3b82f6', fontSize: 10 }}>fill={config.fill}</div>
            <div style={{ color: '#10b981', fontSize: 10 }}>compress={config.compress}</div>
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
        {phase === 0 && '头尾操作是 QuickList 性能最优的场景，适合队列和栈'}
        {phase === 1 && '中间操作需要遍历，性能较差，应避免频繁使用'}
        {phase === 2 && '合理配置 fill 和 compress 参数，根据场景优化性能'}
      </div>
    </AbsoluteFill>
  );
};
