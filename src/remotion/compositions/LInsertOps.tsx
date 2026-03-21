import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const LInsertOps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const cycle = frame % 150;
  const phase = cycle < 30 ? 0 : cycle < 60 ? 1 : cycle < 90 ? 2 : 3;

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
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        LINSERT / LREM / LTRIM 动画
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 55,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 LINSERT - 在指定位置插入'}
        {phase === 1 && '⚡ 查找 pivot 位置'}
        {phase === 2 && '🔄 插入新元素'}
        {phase === 3 && '✅ 操作完成'}
      </div>

      {/* Command display */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 8,
            padding: '10px 20px',
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#94a3b8',
          }}
        >
          LINSERT mylist BEFORE &quot;B&quot; &quot;X&quot;
        </div>
      </div>

      {/* Queue visualization */}
      <div
        style={{
          position: 'absolute',
          top: 150,
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
        {/* Node */}
        <div
          style={{
            width: 350,
            height: 160,
            borderRadius: 16,
            border: '4px solid #3b82f6',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '8px 0',
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            ZipList
          </div>

          {/* Entries row */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: 16,
              justifyContent: 'center',
            }}
          >
            {/* Entry A */}
            <div
              style={{
                background:
                  phase >= 1 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                border: `2px solid ${phase >= 1 ? '#f59e0b' : 'rgba(59, 130, 246, 0.4)'}`,
                borderRadius: 8,
                padding: '10px 14px',
                color: '#fcd34d',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
            >
              [0] A
            </div>

            {/* Entry B (pivot) */}
            {phase < 2 && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.3)',
                  border: '2px solid #3b82f6',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#93c5fd',
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                }}
              >
                [1] B
              </div>
            )}

            {/* New entry X */}
            {phase >= 2 && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.3)',
                  border: '2px solid #10b981',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#6ee7b7',
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
                }}
              >
                [1] X
              </div>
            )}

            {/* Entry B after insert */}
            {phase >= 2 && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.3)',
                  border: '2px solid #3b82f6',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#93c5fd',
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                }}
              >
                [2] B
              </div>
            )}

            {/* Entry C */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#93c5fd',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
            >
              [3] C
            </div>

            {/* Entry D */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#93c5fd',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
            >
              [4] D
            </div>
          </div>
        </div>

        {/* Result */}
        {phase >= 3 && (
          <div
            style={{
              background: '#10b981',
              color: 'white',
              padding: '8px 24px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            ✅ 插入完成: [A, X, B, C, D]
          </div>
        )}
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
        {phase === 0 && 'LINSERT 在指定元素前/后插入，O(N) 复杂度'}
        {phase === 1 && '首先遍历找到 pivot 位置'}
        {phase === 2 && '在 ZipList 中插入，可能触发节点分裂'}
        {phase === 3 && '插入完成，列表长度+1'}
      </div>
    </AbsoluteFill>
  );
};
