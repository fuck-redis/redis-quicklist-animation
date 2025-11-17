import React, { useState } from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Control.module.css';

export const OperationSelector: React.FC = () => {
  const { pushFrontValue, pushBackValue, createList } = useQuickListStore();
  const [inputValue, setInputValue] = useState('');
  
  const handlePushFront = () => {
    if (inputValue.trim()) {
      const value = isNaN(Number(inputValue)) ? inputValue : Number(inputValue);
      pushFrontValue(value);
      setInputValue('');
    }
  };
  
  const handlePushBack = () => {
    if (inputValue.trim()) {
      const value = isNaN(Number(inputValue)) ? inputValue : Number(inputValue);
      pushBackValue(value);
      setInputValue('');
    }
  };
  
  const handleCreate = () => {
    createList();
  };
  
  return (
    <div className={styles.controlSection}>
      <div className={styles.operationGroup}>
        <h4>🆕 创建操作</h4>
        <button className="btn btn-primary" onClick={handleCreate}>
          创建新QuickList
        </button>
      </div>
      
      <div className={styles.operationGroup}>
        <h4>📝 元素操作</h4>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className="input"
            placeholder="输入元素值..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePushBack()}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className="btn btn-success" onClick={handlePushFront}>
            ⬅️ 头部插入
          </button>
          <button className="btn btn-success" onClick={handlePushBack}>
            尾部插入 ➡️
          </button>
        </div>
      </div>
      
      <div className={styles.operationGroup}>
        <h4>🚀 快速测试</h4>
        <div className={styles.buttonGroup}>
          <button 
            className="btn btn-default"
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                setTimeout(() => pushBackValue(i), i * 200);
              }
            }}
          >
            插入5个元素
          </button>
          <button 
            className="btn btn-default"
            onClick={() => {
              for (let i = 1; i <= 15; i++) {
                setTimeout(() => pushBackValue(i), i * 100);
              }
            }}
          >
            插入15个元素
          </button>
        </div>
      </div>
    </div>
  );
};
