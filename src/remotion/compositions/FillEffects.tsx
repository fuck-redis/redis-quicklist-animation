import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const FillEffects: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 4;

  const fillConfigs = [
    { value: -1, size: '4KB', elements: '~500', color: '#dc2626', desc: '大元素' },
    { value: -2, size: '8KB', elements: '~1000', color: '#3b82f6', desc: '通用(默认)' },
    { value: -4, size: '32KB', elements: '~4000', color: '#f59e0b', desc: '小元素' },
    { value: -5, size: '64KB', elements: '~8000', color: '#10b981', desc: '批量存储' },
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
        fill 参数效果演示
      </div>

      {/* Config cards */}
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
        {fillConfigs.map((config, index) => (
          <div
            key={config.value}
            style={{
              background: '#1e293b',
              border: `3px solid ${phase === index ? config.color : '#334155'}`,
              borderRadius: 12,
              padding: '12px 24px',
              width: 450,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transform: `scale(${phase === index ? 1.02 : 1})`,
              boxShadow: phase === index ? `0 0 30px ${config.color}66` : 'none',
              opacity: phase >= index ? 1 : 0.5,
            }}
          >
            <div
              style={{
                background: config.color,
                padding: '8px 16px',
                borderRadius: 8,
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                minWidth: 80,
                textAlign: 'center',
              }}
            >
              {config.value}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold' }}>
                {config.size} / {config.elements} 元素
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>{config.desc}</div>
            </div>

            {/* Visual representation */}
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: Math.min(8, Math.floor(8 * (index + 1) / 4)) }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 24 + index * 4,
                    background: config.color,
                    borderRadius: 2,
                    opacity: 0.3 + (phase === index ? 0.7 : 0) * 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 8,
            padding: '8px 16px',
            color: '#94a3b8',
            fontSize: 12,
          }}
        >
          <span style={{ color: '#f8fafc' }}>fill = -2</span> (默认): 平衡性能和内存
          <span style={{ color: '#3b82f6', marginLeft: 16 }}>fill = -5</span>: 小元素批量存储
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
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        fill 参数控制每个 ZipList 节点的大小，影响节点分裂频率
      </div>
    </AbsoluteFill>
  );
};
