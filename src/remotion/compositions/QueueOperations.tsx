import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

interface QueueOperationsProps {
  operation?: 'lpush' | 'rpush' | 'lpop' | 'rpop';
}

export const QueueOperations: React.FC<QueueOperationsProps> = ({ operation = 'lpush' }) => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = frame < 30 ? 0 : frame < 90 ? 1 : 2;
  const pushProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });
  const popProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });

  const isPush = operation === 'lpush' || operation === 'rpush';
  const isLeft = operation === 'lpush' || operation === 'lpop';

  const entries = isPush ? [1, 2, 3] : [1, 2, 3, 4];
  const newEntry = 99;

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
          top: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f8fafc',
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        {operation.toUpperCase()} 动画演示
      </div>

      {/* Operation badge */}
      <div
        style={{
          position: 'absolute',
          top: 75,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            background: '#10b981',
            color: 'white',
            padding: '8px 24px',
            borderRadius: 20,
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          O(1) 时间复杂度
        </span>
      </div>

      {/* Command example */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
          fontFamily: 'monospace',
        }}
      >
        {operation.toUpperCase()} mylist &quot;{newEntry}&quot;
      </div>

      {/* Queue visualization */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Arrow indicator for push/pop side */}
        <div
          style={{
            position: 'absolute',
            left: isLeft ? 180 : 620,
            top: 200,
            fontSize: 40,
            color: '#f59e0b',
            animation: phase === 1 ? 'bounce 0.5s ease-in-out infinite' : 'none',
          }}
        >
          {isLeft ? (isPush ? '←' : '→') : isPush ? '→' : '←'}
        </div>

        {/* Main queue node */}
        <div
          style={{
            width: 350,
            height: 180,
            borderRadius: 16,
            border: '4px solid #3b82f6',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '10px 0',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            ZipList
          </div>

          {/* Head/Tail labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 16px 0',
            }}
          >
            <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 'bold' }}>HEAD</span>
            <span style={{ color: '#f472b6', fontSize: 12, fontWeight: 'bold' }}>TAIL</span>
          </div>

          {/* Entries */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 16px',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {isPush ? (
              <>
                {/* Before push: show existing entries */}
                {phase === 0 &&
                  entries.map((num, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '2px solid rgba(59, 130, 246, 0.4)',
                        borderRadius: 8,
                        padding: '12px 16px',
                        color: '#93c5fd',
                        fontSize: 16,
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                      }}
                    >
                      {num}
                    </div>
                  ))}

                {/* During/after push: show new entry being added */}
                {phase >= 1 && (
                  <>
                    <div
                      style={{
                        background: `rgba(16, 185, 129, ${0.2 + pushProgress * 0.3})`,
                        border: `2px solid #10b981`,
                        borderRadius: 8,
                        padding: '12px 16px',
                        color: '#6ee7b7',
                        fontSize: 16,
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        transform: `scale(${0.5 + pushProgress * 0.5})`,
                        opacity: pushProgress,
                      }}
                    >
                      {newEntry}
                    </div>
                    {entries.map((num, index) => (
                      <div
                        key={`existing-${index}`}
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '2px solid rgba(59, 130, 246, 0.4)',
                          borderRadius: 8,
                          padding: '12px 16px',
                          color: '#93c5fd',
                          fontSize: 16,
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                        }}
                      >
                        {num}
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <>
                {/* For pop: show entries being removed */}
                {entries.map((num, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        phase >= 1 && index === 0
                          ? `rgba(239, 68, 68, ${0.3 + popProgress * 0.3})`
                          : 'rgba(59, 130, 246, 0.2)',
                      border:
                        phase >= 1 && index === 0
                          ? `2px solid #ef4444`
                          : '2px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      color: phase >= 1 && index === 0 ? '#fca5a5' : '#93c5fd',
                      fontSize: 16,
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      transform:
                        phase >= 1 && index === 0 ? `scale(${1 - popProgress * 0.5})` : 'scale(1)',
                      opacity: phase >= 1 && index === 0 ? 1 - popProgress * 0.5 : 1,
                    }}
                  >
                    {num}
                  </div>
                ))}
                {phase >= 2 && (
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '2px dashed rgba(59, 130, 246, 0.4)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      color: '#64748b',
                      fontSize: 16,
                      fontStyle: 'italic',
                    }}
                  >
                    ?
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {phase === 0 && '📍 初始状态'}
        {phase === 1 && (isPush ? '⚡ 插入新元素' : '⚡ 弹出元素')}
        {phase === 2 && (isPush ? '✅ 插入完成' : '✅ 弹出完成')}
      </div>

      {/* Explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        {isPush
          ? isLeft
            ? 'LPUSH: 在头部插入元素，可能触发节点分裂'
            : 'RPUSH: 在尾部插入元素，可能触发节点分裂'
          : isLeft
          ? 'LPOP: 从头部弹出元素，节点为空时删除'
          : 'RPOP: 从尾部弹出元素，节点为空时删除'}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(-60%); }
        }
      `}</style>
    </AbsoluteFill>
  );
};
