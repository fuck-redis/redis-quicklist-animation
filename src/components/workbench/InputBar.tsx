import React from 'react';
import { SCENARIO_PRESETS } from '@/data/scenarios';
import styles from './InputBar.module.css';

interface InputBarProps {
  rawInput: string;
  fillByCount: number;
  fillByBytes: number;
  compressDepth: number;
  queuePopCount: number;
  selectedPresetKey: string;
  validationError: string | null;
  onRawInputChange: (value: string) => void;
  onPresetChange: (presetKey: string) => void;
  onRandomize: () => void;
  onFillByCountChange: (value: number) => void;
  onFillByBytesChange: (value: number) => void;
  onCompressDepthChange: (value: number) => void;
  onQueuePopChange: (value: number) => void;
  onRegenerate: () => void;
}

function toSafeInt(raw: string, fallback: number): number {
  const next = Number(raw);
  if (Number.isNaN(next)) {
    return fallback;
  }
  return Math.round(next);
}

export const InputBar: React.FC<InputBarProps> = ({
  rawInput,
  fillByCount,
  fillByBytes,
  compressDepth,
  queuePopCount,
  selectedPresetKey,
  validationError,
  onRawInputChange,
  onPresetChange,
  onRandomize,
  onFillByCountChange,
  onFillByBytesChange,
  onCompressDepthChange,
  onQueuePopChange,
  onRegenerate,
}) => {
  return (
    <section className={styles.bar}>
      <div className={styles.row}>
        <label className={styles.mainInputLabel}>
          数据输入
          <input
            value={rawInput}
            onChange={(event) => onRawInputChange(event.target.value)}
            className={styles.mainInput}
            placeholder="例如: [1,2,3,4,5]"
          />
        </label>

        <div className={styles.presets}>
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              className={`${styles.presetButton} ${selectedPresetKey === preset.key ? styles.activePreset : ''}`}
              onClick={() => onPresetChange(preset.key)}
              title={preset.hint}
            >
              {preset.label}
            </button>
          ))}
          <button type="button" className={styles.randomButton} onClick={onRandomize}>
            随机数据
          </button>
        </div>

        <label className={styles.compactField}>
          fill(count)
          <input
            value={fillByCount}
            onChange={(event) => onFillByCountChange(toSafeInt(event.target.value, fillByCount))}
            className={styles.compactInput}
          />
        </label>

        <label className={styles.compactField}>
          fill(bytes)
          <input
            value={fillByBytes}
            onChange={(event) => onFillByBytesChange(toSafeInt(event.target.value, fillByBytes))}
            className={styles.compactInput}
          />
        </label>

        <label className={styles.compactField}>
          compress
          <input
            value={compressDepth}
            onChange={(event) => onCompressDepthChange(toSafeInt(event.target.value, compressDepth))}
            className={styles.compactInput}
          />
        </label>

        <label className={styles.compactField}>
          pop次数
          <input
            value={queuePopCount}
            onChange={(event) => onQueuePopChange(toSafeInt(event.target.value, queuePopCount))}
            className={styles.compactInput}
          />
        </label>

        <button type="button" className={styles.generateButton} onClick={onRegenerate}>
          重新生成分镜
        </button>
      </div>
      <div className={styles.errorLine}>{validationError ? `⚠ ${validationError}` : ' '}</div>
    </section>
  );
};
