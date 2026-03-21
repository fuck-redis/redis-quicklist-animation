import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const CompressionRatio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 36) % 4;

  const dataTypes = [
    { type: '小整数', before: 100, after: 85, ratio: '15%', color: '#3b82f6' },
    { type: '大整数', before: 100, after: 55, ratio: '45%', color: '#10b981' },
    { type: '短字符串', before: 100, after: 40, ratio: '60%', color: '#f59e0b' },
    { type: 'JSON数据', before: 100, after: 30, ratio: '70%', color: '#ec4899' },
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
        LZF 压缩效果对比
      </div>

      {/* Data type comparison */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          bottom: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {dataTypes.map((data, index) => {
          const afterWidth = (data.after / 100) * 200;
          const beforeWidth = (data.before / 100) * 200;

          return (
            <div
              key={data.type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: phase >= 0 ? 1 : 0.5,
                transform: `scale(${phase === index ? 1.05 : 1})`,
              }}
            >
              <div
                style={{
                  width: 80,
                  textAlign: 'right',
                  color: '#94a3b8',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              >
                {data.type}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Before bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: beforeWidth,
                      height: 24,
                      background: '#ef4444',
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                  />
                  <span style={{ color: '#ef4444', fontSize: 10 }}>压缩前</span>
                </div>

                {/* After bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: afterWidth,
                      height: 24,
                      background: data.color,
                      borderRadius: 4,
                      transition: 'width 0.5s ease',
                    }}
                  />
                  <span style={{ color: data.color, fontSize: 10 }}>
                    压缩后 ({data.ratio} 节省)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CPU cost note */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #f59e0b',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            gap: 16,
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 11 }}>
            <span style={{ color: '#f59e0b' }}>⚡ CPU 开销:</span> 略有增加，但值得
          </span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>
            <span style={{ color: '#10b981' }}>💾 内存节省:</span> 30-70%
          </span>
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
        LZF 算法对重复模式多的数据压缩效果好，JSON/字符串效果最佳
      </div>
    </AbsoluteFill>
  );
};
