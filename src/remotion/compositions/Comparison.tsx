import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Comparison: React.FC = () => {
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
        {phase === 0 && '📍 Phase 1: 传统双向链表'}
        {phase === 1 && '📍 Phase 2: 纯 ZipList'}
        {phase === 2 && '⚡ Phase 3: QuickList 登场'}
        {phase === 3 && '✅ Phase 4: 完美平衡'}
      </div>

      {/* Comparison panels */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          bottom: 80,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          padding: '0 20px',
        }}
      >
        {/* Panel 1: Linked List */}
        <div
          style={{
            width: 220,
            height: 320,
            background: '#1e293b',
            border: `3px solid ${phase === 0 ? '#3b82f6' : '#334155'}`,
            borderRadius: 16,
            padding: 16,
            opacity: phase >= 0 ? 1 : 0.3,
            boxShadow: phase === 0 ? '0 0 30px rgba(59, 130, 246, 0.4)' : 'none',
            transform: `scale(${phase === 0 ? 1 : 0.95})`,
            transition: 'all 0.3s ease',
          }}
        >
          <h4 style={{ color: '#f8fafc', margin: '0 0 16px', textAlign: 'center', fontSize: 16 }}>
            传统双向链表
          </h4>

          {/* Linked list visualization */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            {['A', 'B', 'C'].map((letter) => (
              <div
                key={letter}
                style={{
                  width: 44,
                  height: 56,
                  background: '#334155',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#f8fafc', fontSize: 16, fontWeight: 'bold' }}>{letter}</span>
                <div style={{ display: 'flex', gap: 4, fontSize: 8, color: '#94a3b8' }}>
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pros/Cons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ color: '#ef4444', fontSize: 11 }}>❌ 内存碎片严重</div>
            <div style={{ color: '#ef4444', fontSize: 11 }}>❌ 指针开销大 (16B/节点)</div>
            <div style={{ color: '#ef4444', fontSize: 11 }}>❌ 内存利用率低</div>
          </div>
        </div>

        {/* Panel 2: ZipList */}
        <div
          style={{
            width: 220,
            height: 320,
            background: '#1e293b',
            border: `3px solid ${phase === 1 ? '#3b82f6' : '#334155'}`,
            borderRadius: 16,
            padding: 16,
            opacity: phase >= 1 ? 1 : 0.3,
            boxShadow: phase === 1 ? '0 0 30px rgba(59, 130, 246, 0.4)' : 'none',
            transform: `scale(${phase === 1 ? 1 : 0.95})`,
            transition: 'all 0.3s ease',
          }}
        >
          <h4 style={{ color: '#f8fafc', margin: '0 0 16px', textAlign: 'center', fontSize: 16 }}>
            纯 ZipList
          </h4>

          {/* ZipList visualization */}
          <div
            style={{
              background: '#334155',
              borderRadius: 8,
              padding: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ color: '#3b82f6', fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>
              zlbytes | zltail | zllen
            </div>
            <div style={{ color: '#10b981', fontSize: 12, fontFamily: 'monospace' }}>A | B | C | D | E</div>
            <div style={{ color: '#ef4444', fontSize: 10, marginTop: 4 }}>zlend</div>
          </div>

          {/* Pros/Cons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ color: '#ef4444', fontSize: 11 }}>❌ 插入/删除 O(N)</div>
            <div style={{ color: '#ef4444', fontSize: 11 }}>❌ 频繁 realloc</div>
            <div style={{ color: '#ef4444', fontSize: 11 }}>❌ 级联更新</div>
          </div>
        </div>

        {/* Panel 3: QuickList */}
        <div
          style={{
            width: 220,
            height: 320,
            background: '#1e293b',
            border: `3px solid ${phase >= 2 ? '#10b981' : '#334155'}`,
            borderRadius: 16,
            padding: 16,
            opacity: phase >= 2 ? 1 : 0.3,
            boxShadow: phase >= 2 ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none',
            transform: `scale(${phase >= 2 ? 1 : 0.95})`,
            transition: 'all 0.3s ease',
          }}
        >
          <h4 style={{ color: '#f8fafc', margin: '0 0 16px', textAlign: 'center', fontSize: 16 }}>
            QuickList ✅
          </h4>

          {/* QuickList visualization */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            {[
              { items: ['A', 'B'] },
              { items: ['C', 'D'] },
              { items: ['E', 'F'] },
            ].map((node, idx) => (
              <div
                key={idx}
                style={{
                  width: 50,
                  height: 70,
                  background: 'linear-gradient(135deg, #1e293b, #334155)',
                  border: '2px solid #3b82f6',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <span style={{ color: '#10b981', fontSize: 10, fontWeight: 'bold' }}>
                  {node.items.join(',')}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 8 }}>◀ ▶</span>
              </div>
            ))}
          </div>

          {/* Pros/Cons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ color: '#10b981', fontSize: 11 }}>✅ 内存紧凑</div>
            <div style={{ color: '#10b981', fontSize: 11 }}>✅ 头尾操作 O(1)</div>
            <div style={{ color: '#10b981', fontSize: 11 }}>✅ 平衡性能与内存</div>
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
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        {phase === 0 && '传统双向链表：每个节点独立内存，指针开销大'}
        {phase === 1 && '纯 ZipList：连续内存，但插入删除需要移动大量数据'}
        {phase === 2 && 'QuickList：结合两者优势，链表+压缩列表的混合结构'}
        {phase === 3 && 'QuickList 通过配置参数适应不同场景，实现性能和内存的平衡'}
      </div>
    </AbsoluteFill>
  );
};
