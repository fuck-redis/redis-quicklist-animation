import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import styles from './Control.module.css';

export const AnimationControls: React.FC = () => {
  const { animation, playAnimation, pauseAnimation, stopAnimation, setAnimationSpeed, stepForward, stepBackward } = useQuickListStore();
  
  const speeds = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1.0 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2.0 },
  ];
  
  return (
    <div className={styles.controlSection}>
      <div className={styles.operationGroup}>
        <h4>🎬 动画控制</h4>
        
        <div className={styles.animationStatus}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>当前步骤:</span>
            <span className={styles.statusValue}>
              {animation.currentStep} / {animation.totalSteps}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: animation.totalSteps > 0 
                  ? `${(animation.currentStep / animation.totalSteps) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            className="btn btn-default"
            onClick={stepBackward}
            disabled={animation.currentStep === 0}
            title="上一步 (←)"
          >
            ⏮️ 上一步
          </button>
          
          {!animation.isPlaying ? (
            <button 
              className="btn btn-success"
              onClick={playAnimation}
              disabled={animation.totalSteps === 0}
              title="播放 (Space)"
            >
              ▶️ 播放
            </button>
          ) : (
            <button 
              className="btn btn-warning"
              onClick={pauseAnimation}
              title="暂停 (Space)"
            >
              ⏸️ 暂停
            </button>
          )}
          
          <button 
            className="btn btn-default"
            onClick={stepForward}
            disabled={animation.currentStep >= animation.totalSteps}
            title="下一步 (→)"
          >
            下一步 ⏭️
          </button>
          
          <button 
            className="btn btn-danger"
            onClick={stopAnimation}
            disabled={animation.currentStep === 0}
            title="停止 (Esc)"
          >
            ⏹️ 停止
          </button>
        </div>
        
        <div className={styles.speedControl}>
          <label className={styles.speedLabel}>播放速度:</label>
          <div className={styles.speedButtons}>
            {speeds.map(speed => (
              <button
                key={speed.value}
                className={`${styles.speedButton} ${animation.speed === speed.value ? styles.active : ''}`}
                onClick={() => setAnimationSpeed(speed.value)}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.helpText}>
          <small>💡 提示: 使用键盘 ← → 控制步进，Space 播放/暂停</small>
        </div>
      </div>
    </div>
  );
};
