import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const MemoryOptimization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = frame < 45 ? 0 : frame < 90 ? 1 : frame < 135 ? 2 : 3;

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
        {phase === 0 && '📍 Phase 1: 内存构成分析'}
        {phase === 1 && '📍 Phase 2: 节点内存计算'}
        {phase === 2 && '⚡ Phase 3: 启用压缩'}
        {phase === 3 && '✅ Phase 4: 优化效果'}
      </div>

      {/* Memory breakdown panel */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 40,
          background: '#1e293b',
          border: '2px solid #3b82f6',
          borderRadius: 12,
          padding: 16,
          width: 280,
        }}
      >
        <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
          QuickList 内存构成
        </div>
        {[
          { name: 'QuickList 结构', size: '24B', color: '#3b82f6', width: 60 },
          { name: '节点指针', size: '16B×N', color: '#dc382d', width: 100 },
          { name: 'ZipList 头', size: '16B×N', color: '#10b981', width: 80 },
          { name: 'Entry 数据', size: '变长', color: '#f59e0b', width: 120 },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: item.width,
                height: 18,
                background: item.color,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            >
              {item.size}
            </div>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Calculation panel */}
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
          示例：10000个整数
        </div>
        <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
          {phase === 0 && '1万元素 → 约5个节点 → 总内存 ≈ 20KB'}
          {phase === 1 && 'fill=8KB → 每节点2000元素 → 5节点 × (16+16+2000×2)B ≈ 20KB'}
          {phase === 2 && '启用 compress=1 → 中间节点压缩 30-70% → 节省约 6-14KB'}
          {phase === 3 && '优化后总内存 ≈ 6-14KB，内存效率提升 30-70%'}
        </div>
      </div>

      {/* Compression effect visualization */}
      {phase >= 2 && (
        <div
          style={{
            position: 'absolute',
            top: 280,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold' }}>压缩效果</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 120,
                  height: 40,
                  background: '#ef4444',
                  borderRadius: 6,
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: 12 }}>压缩前</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 24 }}>→</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 50,
                  height: 40,
                  background: '#10b981',
                  borderRadius: 6,
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: 12 }}>压缩后</span>
            </div>
          </div>
        </div>
      )}

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
        {phase === 0 && 'QuickList 内存 = 结构体 + 节点指针 + ZipList头 + Entry数据'}
        {phase === 1 && 'fill 参数影响节点数量和大小'}
        {phase === 2 && '启用 compress 可以节省 30-70% 内存'}
        {phase === 3 && '根据数据类型选择合适的配置可以最大化内存效率'}
      </div>
    </AbsoluteFill>
  );
};
