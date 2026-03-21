import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ZipListStructure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = frame < 36 ? 0 : frame < 72 ? 1 : frame < 108 ? 2 : frame < 144 ? 3 : 4;

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
        ZipList 内部结构
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        紧凑的连续内存存储，通过智能编码减少内存占用
      </div>

      {/* Header boxes */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {[
          { name: 'zlbytes', desc: '4字节', color: '#3b82f6' },
          { name: 'zltail', desc: '4字节', color: '#dc382d' },
          { name: 'zllen', desc: '2字节', color: '#ec4899' },
        ].map((item, _index) => (
          <div
            key={item.name}
            style={{
              width: 100,
              height: 60,
              borderRadius: 8,
              background: item.color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${item.color}66`,
              transform: phase >= 0 ? 'scale(1)' : 'scale(0)',
              transition: 'transform 0.3s ease',
            }}
          >
            <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ color: 'white', fontSize: 10, opacity: 0.8 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Arrow down */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 24,
          opacity: phase >= 1 ? 1 : 0,
        }}
      >
        ↓
      </div>

      {/* Entry boxes */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {[
          { name: 'entry0', color: '#10b981' },
          { name: 'entry1', color: '#10b981' },
          { name: '...', color: '#10b981', dashed: true },
        ].map((item, _index) => (
          <div
            key={item.name}
            style={{
              width: 90,
              height: 60,
              borderRadius: 8,
              background: item.dashed ? 'transparent' : item.color,
              border: item.dashed ? '2px dashed #10b981' : `2px solid ${item.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: item.dashed ? 'none' : `0 0 15px ${item.color}66`,
              opacity: phase >= 1 ? 1 : 0,
              transform: `translateY(${(1 - (phase >= 1 ? 1 : 0)) * 20}px)`,
            }}
          >
            {item.dashed ? (
              <span style={{ color: '#10b981', fontSize: 18 }}>{item.name}</span>
            ) : (
              <>
                <div style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: 'white', fontSize: 10, opacity: 0.8 }}>可变长</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Arrow down */}
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 24,
          opacity: phase >= 2 ? 1 : 0,
        }}
      >
        ↓
      </div>

      {/* End box */}
      <div
        style={{
          position: 'absolute',
          top: 350,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 100,
            height: 60,
            borderRadius: 8,
            background: '#ef4444',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px #ef444466',
            opacity: phase >= 2 ? 1 : 0,
          }}
        >
          <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>zlend</div>
          <div style={{ color: 'white', fontSize: 10, opacity: 0.8 }}>1字节</div>
        </div>
      </div>

      {/* Entry detail panel */}
      {phase >= 4 && (
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h4 style={{ color: '#f8fafc', margin: '0 0 16px', fontSize: 16 }}>📝 Entry 结构详解</h4>
          {[
            { name: 'prevlen', color: '#f59e0b', desc: '前一个entry的长度 (1-5字节)' },
            { name: 'encoding', color: '#dc382d', desc: '编码类型和长度 (1-5字节)' },
            { name: 'data', color: '#10b981', desc: '实际数据 (可变长)' },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: item.color,
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: 12 }}>
                <strong style={{ color: '#f8fafc' }}>{item.name}</strong> - {item.desc}
              </span>
            </div>
          ))}
        </div>
      )}

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
        {phase === 0 && 'ZipList 头部：zlbytes(总长度)、zltail(尾部偏移)、zllen(元素数量)'}
        {phase === 1 && 'Entry 是 ZipList 的核心存储单元'}
        {phase === 2 && '每个 Entry 包含 prevlen、encoding 和实际数据'}
        {phase === 3 && 'zlend 是结束标记，固定为 0xFF'}
        {phase >= 4 && 'prevlen 支持反向遍历，encoding 实现智能压缩'}
      </div>
    </AbsoluteFill>
  );
};
