import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const EntryStructure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 36) % 5;

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
        Entry 结构详解
      </div>

      {/* Entry visualization */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            transform: `scale(${phase >= 0 ? 1 : 0.8})`,
            opacity: phase >= 0 ? 1 : 0.5,
          }}
        >
          {/* prevlen */}
          <div
            style={{
              background: '#f59e0b',
              padding: '20px 16px',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
            }}
          >
            <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>prevlen</div>
            <div style={{ color: 'white', fontSize: 10, opacity: 0.8, marginTop: 4 }}>
              1-5字节
            </div>
          </div>

          {/* encoding */}
          <div
            style={{
              background: '#dc382d',
              padding: '20px 16px',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 0 20px rgba(220, 56, 45, 0.4)',
            }}
          >
            <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>encoding</div>
            <div style={{ color: 'white', fontSize: 10, opacity: 0.8, marginTop: 4 }}>
              1-5字节
            </div>
          </div>

          {/* data */}
          <div
            style={{
              background: '#10b981',
              padding: '20px 24px',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            }}
          >
            <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>data</div>
            <div style={{ color: 'white', fontSize: 10, opacity: 0.8, marginTop: 4 }}>
              可变长
            </div>
          </div>
        </div>
      </div>

      {/* Field explanations */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '2px solid #334155',
            borderRadius: 12,
            padding: 16,
            width: 220,
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            prevlen
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
            存储前一个 entry 的长度，支持反向遍历。如果前一个 entry 长度 &lt; 254 字节，使用 1 字节；否则使用 5 字节。
          </div>
        </div>

        <div
          style={{
            background: '#1e293b',
            border: '2px solid #334155',
            borderRadius: 12,
            padding: 16,
            width: 220,
          }}
        >
          <div style={{ color: '#dc382d', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            encoding
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
            编码类型和长度。INT16/INT32/INT64 用于整数，STRING 用于字符串。根据数据大小选择最优编码。
          </div>
        </div>

        <div
          style={{
            background: '#1e293b',
            border: '2px solid #334155',
            borderRadius: 12,
            padding: 16,
            width: 220,
          }}
        >
          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            data
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
            实际存储的数据。整数直接存储，字符串根据长度使用不同编码。小整数可完全包含在 encoding 中。
          </div>
        </div>
      </div>

      {/* Encoding types */}
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
          { type: 'INT16', range: '-32768 ~ 32767', bytes: '2B' },
          { type: 'INT32', range: '-2³¹ ~ 2³¹-1', bytes: '4B' },
          { type: 'INT64', range: '-2⁶³ ~ 2⁶³-1', bytes: '8B' },
          { type: 'STRING', range: '变长', bytes: '1-5B+' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '8px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 'bold' }}>{item.type}</div>
            <div style={{ color: '#94a3b8', fontSize: 9 }}>{item.range}</div>
            <div style={{ color: '#10b981', fontSize: 10 }}>{item.bytes}</div>
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
        Entry 通过 prevlen 支持反向遍历，encoding 实现智能压缩
      </div>
    </AbsoluteFill>
  );
};
