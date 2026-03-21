import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const MemoryAllocation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 45) % 5;

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
        QuickList 内存分配
      </div>

      {/* Memory breakdown */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 30,
          background: '#1e293b',
          border: '2px solid #3b82f6',
          borderRadius: 12,
          padding: 16,
          width: 350,
        }}
      >
        <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
          内存构成
        </div>
        {[
          { name: 'QuickList 结构', size: '24B', color: '#3b82f6', width: 60 },
          { name: '节点指针', size: '16B/节点', color: '#dc382d', width: 100 },
          { name: 'ZipList 头', size: '16B/节点', color: '#10b981', width: 80 },
          { name: 'Entry 数据', size: '变长', color: '#f59e0b', width: 140 },
          { name: 'prev/next指针', size: '16B/节点', color: '#ec4899', width: 120 },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
              opacity: phase >= 0 ? 1 : 0.3,
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

      {/* Example calculation */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 30,
          background: '#1e293b',
          border: '2px solid #10b981',
          borderRadius: 12,
          padding: 16,
          width: 350,
        }}
      >
        <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
          示例: 存储 10000 个整数
        </div>
        <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
          {phase >= 1 && (
            <>
              • fill=8KB → 每节点约 2000 元素<br />
              • 需要约 5 个节点<br />
              • 每节点: 16B(prev) + 16B(next) + 16B头 + 4000B数据<br />
              • 总内存 ≈ 5 × (48 + 4000) ≈ <span style={{ color: '#10b981' }}>20KB</span>
            </>
          )}
          {phase < 1 && (
            <span style={{ color: '#64748b' }}>计算中...</span>
          )}
        </div>
      </div>

      {/* Node visualization */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              width: 80,
              height: 100,
              background: '#1e293b',
              border: '2px solid #3b82f6',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: phase >= 2 ? 1 : 0.5,
            }}
          >
            <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 'bold' }}>Node {index}</div>
            <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 4 }}>16B header</div>
            <div style={{ color: '#10b981', fontSize: 9 }}>~2000 entries</div>
            <div style={{ color: '#64748b', fontSize: 8 }}>~4KB</div>
          </div>
        ))}
      </div>

      {/* Optimization tips */}
      {phase >= 3 && (
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
            { tip: '启用压缩', saving: '节省 30-70%' },
            { tip: '合理 fill', saving: '减少分裂' },
            { tip: '定期 LTRIM', saving: '防止增长' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#10b981',
                padding: '6px 12px',
                borderRadius: 8,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{item.tip}</span>
              <span style={{ color: '#d1fae5', fontSize: 10 }}>{item.saving}</span>
            </div>
          ))}
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
        QuickList 通过紧凑的 ZipList 存储 + 链表指针连接，实现性能和内存的平衡
      </div>
    </AbsoluteFill>
  );
};
