import React from 'react';
import { useQuickListStore } from '@/store/quicklistStore';
import { SCENARIOS } from '@/utils/scenarios';
import styles from './Control.module.css';

export const ScenarioLab: React.FC = () => {
  const { runScenario } = useQuickListStore();
  
  return (
    <div className={styles.controlSection}>
      <div className={styles.operationGroup}>
        <h4>🧪 预设场景</h4>
        {SCENARIOS.map((scenario, index) => (
          <div
            key={index}
            className={styles.scenarioCard}
            onClick={() => runScenario(scenario)}
          >
            <div className={styles.scenarioTitle}>{scenario.name}</div>
            <div className={styles.scenarioDesc}>{scenario.description}</div>
            <div className={styles.scenarioMetrics}>
              {scenario.metrics.map((metric, i) => (
                <span key={i} className={styles.metricTag}>{metric}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
