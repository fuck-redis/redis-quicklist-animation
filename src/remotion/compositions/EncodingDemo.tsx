import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const EncodingDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const phase = (frame / 30) % 5;

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
        ZipList 智能编码演示
      </div>

      {/* Encoding examples */}
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
        {/* Integer encoding */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 0 ? '#3b82f6' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 500,
            transform: `scale(${phase >= 0 ? 1 : 0.95})`,
            opacity: phase >= 0 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#3b82f6', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
            整数编码示例
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { value: '100', type: 'INT16', bytes: '2B', encoding: '0011' },
              { value: '100000', type: 'INT32', bytes: '4B', encoding: '0100' },
              { value: '10000000000', type: 'INT64', bytes: '8B', encoding: '0101' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: 12,
                  minWidth: 120,
                }}
              >
                <div style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>{item.value}</div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>
                  类型: <span style={{ color: '#3b82f6' }}>{item.type}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11 }}>
                  占用: <span style={{ color: '#f59e0b' }}>{item.bytes}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11 }}>
                  编码: <span style={{ color: '#ec4899' }}>{item.encoding}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* String encoding */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 1 ? '#10b981' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 500,
            transform: `scale(${phase >= 1 ? 1 : 0.95})`,
            opacity: phase >= 1 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#10b981', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
            字符串编码示例
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { value: '"hi"', len: 2, type: 'STRING', bytes: '2B', encoding: '0000' },
              { value: '"hello"', len: 5, type: 'STRING', bytes: '6B', encoding: '0001' },
              { value: '"redis"', len: 6, type: 'STRING', bytes: '7B', encoding: '0100' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: 12,
                  minWidth: 120,
                }}
              >
                <div style={{ color: '#6ee7b7', fontSize: 14, fontWeight: 'bold' }}>{item.value}</div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>
                  长度: <span style={{ color: '#10b981' }}>{item.len}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11 }}>
                  占用: <span style={{ color: '#f59e0b' }}>{item.bytes}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11 }}>
                  编码: <span style={{ color: '#ec4899' }}>{item.encoding}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory comparison */}
        <div
          style={{
            background: '#1e293b',
            border: `2px solid ${phase >= 2 ? '#f59e0b' : '#334155'}`,
            borderRadius: 12,
            padding: 16,
            width: 500,
            transform: `scale(${phase >= 2 ? 1 : 0.95})`,
            opacity: phase >= 2 ? 1 : 0.6,
          }}
        >
          <div style={{ color: '#f59e0b', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
            内存效率对比
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>普通存储</div>
              <div
                style={{
                  width: 120,
                  height: 40,
                  background: '#dc2626',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                }}
              >
                数据 + 指针
              </div>
              <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4 }}>40+ 字节/元素</div>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 24, display: 'flex', alignItems: 'center' }}>
              →
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>ZipList</div>
              <div
                style={{
                  width: 60,
                  height: 40,
                  background: '#10b981',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                }}
              >
                紧凑
              </div>
              <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4 }}>2-8 字节/元素</div>
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
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        ZipList 通过智能编码，小数据可节省 5-20 倍内存
      </div>
    </AbsoluteFill>
  );
};
