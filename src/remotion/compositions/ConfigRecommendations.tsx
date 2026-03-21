import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ConfigRecommendations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 4;

  const scenarios = [
    {
      name: '消息队列',
      fill: '-2 (8KB)',
      compress: '0',
      reason: '头尾频繁访问，不压缩保证最低延迟',
      color: '#10b981',
    },
    {
      name: '时间线/Feed',
      fill: '-1 (4KB)',
      compress: '1-2',
      reason: '中间数据访问少，压缩节省内存',
      color: '#3b82f6',
    },
    {
      name: '小元素批量存储',
      fill: '-4 (32KB)',
      compress: '1',
      reason: '大节点减少节点数量，提升遍历效率',
      color: '#f59e0b',
    },
    {
      name: '大元素队列',
      fill: '-1 (4KB)',
      compress: '0',
      reason: '小节点避免空间浪费，不压缩保证性能',
      color: '#ec4899',
    },
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
        配置推荐
      </div>

      {/* Scenarios */}
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
          gap: 16,
        }}
      >
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            style={{
              background: '#1e293b',
              border: `2px solid ${phase >= index ? scenario.color : '#334155'}`,
              borderRadius: 12,
              padding: '12px 20px',
              width: 480,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transform: `scale(${phase >= index ? 1 : 0.98})`,
              opacity: phase >= index ? 1 : 0.5,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Scenario name */}
            <div
              style={{
                background: scenario.color,
                padding: '6px 12px',
                borderRadius: 8,
                color: 'white',
                fontSize: 13,
                fontWeight: 'bold',
                minWidth: 100,
                textAlign: 'center',
              }}
            >
              {scenario.name}
            </div>

            {/* Config */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  fill: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{scenario.fill}</span>
                </span>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  compress: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{scenario.compress}</span>
                </span>
              </div>
              <div style={{ color: '#64748b', fontSize: 10 }}>{scenario.reason}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Best practices summary */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {[
          'fill 越大 → 节点越少，分裂少',
          'compress 越大 → 压缩越多，内存省',
        ].map((tip, i) => (
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
            💡 {tip}
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
        根据实际场景选择合适的 fill 和 compress 配置，平衡性能和内存
      </div>
    </AbsoluteFill>
  );
};
