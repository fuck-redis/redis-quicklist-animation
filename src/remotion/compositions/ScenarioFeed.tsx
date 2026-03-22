import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ScenarioFeed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 36) % 3;

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
        📱 场景2: 时间线/Feed
      </div>

      {/* Feed visualization */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* New post indicator */}
        <div
          style={{
            background: '#10b981',
            padding: '8px 16px',
            borderRadius: 20,
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          + 新帖子 LPUSH
        </div>

        {/* Feed items */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: 350,
          }}
        >
          {[
            { content: '最新帖子 #N', time: '刚刚', hot: true },
            { content: '热门内容', time: '5分钟前', hot: phase >= 1 },
            { content: '早期帖子', time: '1小时前', hot: false },
          ].map((post, i) => (
            <div
              key={i}
              style={{
                background: '#1e293b',
                border: `2px solid ${post.hot ? '#a855f7' : '#334155'}`,
                borderRadius: 10,
                padding: 12,
                opacity: post.hot ? 1 : 0.7,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#f8fafc', fontSize: 13, fontWeight: 'bold' }}>
                  {post.content}
                </span>
                <span style={{ color: '#64748b', fontSize: 10 }}>{post.time}</span>
              </div>
              {post.hot && (
                <div style={{ color: '#a855f7', fontSize: 9, marginTop: 4 }}>
                  🔒 已压缩节省内存
                </div>
              )}
            </div>
          ))}
        </div>

        {/* LTRIM indicator */}
        <div
          style={{
            background: '#dc382d',
            padding: '8px 16px',
            borderRadius: 20,
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          LTRIM 0 999 ← 定期清理
        </div>
      </div>

      {/* Config */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #f59e0b',
            borderRadius: 8,
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>fill = </span>
          <span style={{ color: '#f59e0b', fontSize: 16, fontWeight: 'bold' }}>-1</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (4KB 小节点)</span>
        </div>
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #a855f7',
            borderRadius: 8,
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>compress = </span>
          <span style={{ color: '#a855f7', fontSize: 16, fontWeight: 'bold' }}>1-2</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (压缩中间)</span>
        </div>
      </div>

      {/* Features */}
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
        {['LPUSH 写入新内容', 'LRANGE 分页获取', 'LTRIM 限制长度', '中间节点压缩'].map((feature, i) => (
          <div
            key={i}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '6px 10px',
              color: '#94a3b8',
              fontSize: 10,
            }}
          >
            ✓ {feature}
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
        时间线场景：写多读少，启用压缩节省内存，定期 LTRIM 控制大小
      </div>
    </AbsoluteFill>
  );
};
