import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Control.module.css';

export const ConfigPanel: React.FC = () => {
  const { quickList, updateConfig } = useQuickListStore();
  const config = quickList.config;
  
  return (
    <div className={styles.controlSection}>
      <div className={styles.operationGroup}>
        <h4>⚙️ QuickList 配置</h4>
        
        <div className={styles.configItem}>
          <label>
            Fill (节点最大元素数): 
            <span className={styles.rangeValue}>{config.fill}</span>
          </label>
          <input
            type="range"
            min="4"
            max="50"
            value={config.fill}
            onChange={(e) => updateConfig({ fill: Number(e.target.value) })}
          />
        </div>
        
        <div className={styles.configItem}>
          <label>
            Compress (压缩深度): 
            <span className={styles.rangeValue}>{config.compress}</span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            value={config.compress}
            onChange={(e) => updateConfig({ compress: Number(e.target.value) })}
          />
        </div>
        
        <div className={styles.configItem}>
          <label>
            <input
              type="checkbox"
              checked={config.autoRebalance}
              onChange={(e) => updateConfig({ autoRebalance: e.target.checked })}
            />
            {' '}自动重新平衡
          </label>
        </div>
        
        <div className={styles.configItem}>
          <label>
            <input
              type="checkbox"
              checked={config.enableCompression}
              onChange={(e) => updateConfig({ enableCompression: e.target.checked })}
            />
            {' '}启用压缩
          </label>
        </div>
      </div>
    </div>
  );
};
