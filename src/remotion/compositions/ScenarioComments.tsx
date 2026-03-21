import React from 'react';
import { useVideoConfig, AbsoluteFill } from 'remotion';

export const ScenarioComments: React.FC = () => {
  const { fps: _fps } = useVideoConfig();

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
        💬 场景3: 最新评论
      </div>

      {/* Comments list */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* New comment indicator */}
        <div
          style={{
            background: '#3b82f6',
            padding: '8px 16px',
            borderRadius: 20,
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          💬 新评论 LPUSH
        </div>

        {/* Comments */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: 400,
          }}
        >
          {[
            { user: '用户A', comment: '写得真好！', time: '刚刚' },
            { user: '用户B', comment: '学习到了', time: '2分钟前' },
            { user: '用户C', comment: '赞一个', time: '5分钟前' },
            { user: '...', comment: '更早的评论...', time: '1小时前' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                padding: 10,
                opacity: i < 3 ? 1 : 0.5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 'bold' }}>{c.user}</span>
                <span style={{ color: '#64748b', fontSize: 9 }}>{c.time}</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>{c.comment}</div>
            </div>
          ))}
        </div>

        {/* Pagination indicator */}
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 11 }}>分页:</span>
          <span style={{ color: '#3b82f6', fontSize: 11 }}>LRANGE 0 19 (第1页)</span>
          <span style={{ color: '#64748b', fontSize: 11 }}>|</span>
          <span style={{ color: '#3b82f6', fontSize: 11 }}>LRANGE 20 39 (第2页)</span>
        </div>
      </div>

      {/* Config */}
      <div
        style={{
          position: 'absolute',
          top: 340,
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
            border: '2px solid #3b82f6',
            borderRadius: 8,
            padding: '8px 16px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>fill = </span>
          <span style={{ color: '#3b82f6', fontSize: 16, fontWeight: 'bold' }}>-2</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (8KB)</span>
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
          <span style={{ color: '#a855f7', fontSize: 16, fontWeight: 'bold' }}>2</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}> (更多压缩)</span>
        </div>
      </div>

      {/* Operations */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {[
          { op: 'LPUSH', desc: '新评论' },
          { op: 'LRANGE', desc: '分页' },
          { op: 'LTRIM', desc: '限长100' },
          { op: 'LLEN', desc: '计数' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '6px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#3b82f6', fontSize: 10, fontFamily: 'monospace' }}>{item.op}</div>
            <div style={{ color: '#64748b', fontSize: 9 }}>{item.desc}</div>
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
        评论列表：分页获取 + 定期清理，启用 compress=2 节省内存
      </div>
    </AbsoluteFill>
  );
};
