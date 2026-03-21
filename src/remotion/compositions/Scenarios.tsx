import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Scenarios: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const scenarioCycle = Math.floor(frame / 38) % 4;

  const scenarios = [
    {
      title: '📨 场景1: 消息队列',
      code: `RPUSH queue:tasks "task_001"
RPUSH queue:tasks "task_002"
BLPOP queue:tasks 0`,
      fill: '-2 (8KB)',
      compress: '0',
      desc: 'RPUSH/LPOP 都是 O(1)，适合高并发队列',
    },
    {
      title: '📱 场景2: 时间线/Feed',
      code: `LPUSH user:feed:123 "new_post"
LRANGE user:feed:123 0 49
LTRIM user:feed:123 0 999`,
      fill: '-1 (4KB)',
      compress: '1-2',
      desc: 'LPUSH 写入，LTRIM 限制长度，启用压缩',
    },
    {
      title: '💬 场景3: 最新评论',
      code: `LPUSH post:comments "评论..."
LRANGE post:comments 0 19
LTRIM post:comments 0 99`,
      fill: '-2',
      compress: '2',
      desc: '分页获取评论，定期清理旧内容',
    },
    {
      title: '⏱️ 场景4: 限流滑动窗口',
      code: `LPUSH rate:limit:user:123 TIMESTAMP
LTRIM rate:limit:user:123 0 99
# 统计窗口内请求数`,
      fill: '-5 (64KB)',
      compress: '0',
      desc: '小元素大节点，保证性能',
    },
  ];

  const current = scenarios[scenarioCycle];

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
        典型应用场景
      </div>

      {/* Scenario display */}
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
          gap: 20,
        }}
      >
        {/* Scenario title */}
        <div
          style={{
            color: '#f59e0b',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {current.title}
        </div>

        {/* Code block */}
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            padding: 16,
            maxWidth: 400,
          }}
        >
          <pre
            style={{
              color: '#94a3b8',
              fontSize: 12,
              fontFamily: 'monospace',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {current.code}
          </pre>
        </div>

        {/* Config badges */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 'bold',
            }}
          >
            fill = {current.fill}
          </div>
          <div
            style={{
              background: '#10b981',
              color: 'white',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 'bold',
            }}
          >
            compress = {current.compress}
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {current.desc}
        </div>
      </div>

      {/* Scenario indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {scenarios.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: idx === scenarioCycle ? '#3b82f6' : '#334155',
              transition: 'background 0.2s ease',
            }}
          />
        ))}
      </div>

      {/* Explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        {scenarioCycle === 0 && '消息队列：推荐不压缩，保证最低延迟'}
        {scenarioCycle === 1 && '时间线：启用压缩，中间数据访问少'}
        {scenarioCycle === 2 && '评论列表：更多压缩节省内存空间'}
        {scenarioCycle === 3 && '限流窗口：小元素用大 fill，定期清理'}
      </div>
    </AbsoluteFill>
  );
};
