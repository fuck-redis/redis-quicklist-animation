import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const QuickListAdvantages: React.FC = () => {
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
          color: '#10b981',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        QuickList 的优势
      </div>

      {/* Advantages */}
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
        {/* Advantage 1 */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 0 ? '#10b981' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 0 ? 1 : 0.95})`,
            opacity: phase >= 0 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ✅ 优势 1: 内存紧凑
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            ZipList 连续内存存储，无指针开销，小数据内存利用率高
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
            <div
              style={{
                background: '#10b981',
                padding: '8px 12px',
                borderRadius: 8,
                color: 'white',
                fontSize: 12,
              }}
            >
              数据: 4B
            </div>
            <div style={{ color: '#10b981', fontSize: 20 }}>+</div>
            <div
              style={{
                background: '#065f46',
                padding: '8px 12px',
                borderRadius: 8,
                color: '#6ee7b7',
                fontSize: 12,
              }}
            >
              ZipList: 紧凑
            </div>
            <div style={{ color: '#10b981', fontSize: 20 }}>=</div>
            <div
              style={{
                background: '#10b981',
                padding: '8px 12px',
                borderRadius: 8,
                color: 'white',
                fontSize: 12,
              }}
            >
              效率: 高
            </div>
          </div>
        </div>

        {/* Advantage 2 */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 1 ? '#10b981' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 1 ? 1 : 0.95})`,
            opacity: phase >= 1 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ✅ 优势 2: 头尾操作 O(1)
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            双向链表结构，头尾插入/删除只需要修改相邻节点，无需移动数据
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              marginTop: 12,
            }}
          >
            <div
              style={{
                background: '#dc2626',
                padding: '8px 12px',
                borderRadius: 8,
                color: 'white',
                fontSize: 12,
              }}
            >
              LPUSH
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    background: '#1e293b',
                    border: '2px solid #3b82f6',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#93c5fd',
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginLeft: i > 0 ? -8 : 0,
                    zIndex: 2 - i,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div style={{ color: '#10b981', fontSize: 11 }}>
              O(1)
            </div>
          </div>
        </div>

        {/* Advantage 3 */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 2 ? '#10b981' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 2 ? 1 : 0.95})`,
            opacity: phase >= 2 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ✅ 优势 3: 可配置压缩
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            根据 compress 参数，中间节点启用 LZF 压缩，节省 30-70% 内存
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
            {[
              { label: 'HOT', color: '#3b82f6' },
              { label: 'COLD', color: '#a855f7' },
              { label: 'COLD', color: '#a855f7' },
              { label: 'HOT', color: '#3b82f6' },
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    padding: '8px 12px',
                    background: node.color,
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  {node.label}
                </div>
                {i < 3 && (
                  <div style={{ color: '#64748b', fontSize: 12 }}>↔</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Advantage 4 */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 3 ? '#10b981' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 420,
            transform: `scale(${phase >= 3 ? 1 : 0.95})`,
            opacity: phase >= 3 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ✅ 优势 4: 避免大规模数据移动
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            节点分裂只在单个 ZipList 内部移动数据，影响范围小
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 60,
                  height: 40,
                  background: '#1e293b',
                  border: '2px solid #f59e0b',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fcd34d',
                  fontSize: 11,
                }}
              >
                Node 1
              </div>
              <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 4 }}>分裂</div>
            </div>
            <div style={{ color: '#f59e0b', fontSize: 20 }}>→</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: '#1e293b',
                  border: '2px solid #3b82f6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#93c5fd',
                  fontSize: 10,
                }}
              >
                Node 1
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: '#1e293b',
                  border: '2px solid #10b981',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6ee7b7',
                  fontSize: 10,
                }}
              >
                Node 2
              </div>
            </div>
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
          color: '#10b981',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        QuickList 结合双向链表和 ZipList 的优势，平衡性能和内存
      </div>
    </AbsoluteFill>
  );
};
