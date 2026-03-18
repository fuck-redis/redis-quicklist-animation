import React from 'react';
import { SOLUTION_CODES } from '@/data/quicklistCode';
import { SolutionId } from '@/types/quicklistViz';
import styles from './SolutionTabs.module.css';

interface SolutionTabsProps {
  active: SolutionId;
  onChange: (solution: SolutionId) => void;
}

const ORDERED_SOLUTIONS: SolutionId[] = ['countFill', 'byteFill'];

export const SolutionTabs: React.FC<SolutionTabsProps> = ({ active, onChange }) => {
  return (
    <div className={styles.tabs}>
      {ORDERED_SOLUTIONS.map((solutionId) => (
        <button
          key={solutionId}
          type="button"
          className={`${styles.tab} ${active === solutionId ? styles.active : ''}`}
          onClick={() => onChange(solutionId)}
        >
          <span className={styles.tabTitle}>{SOLUTION_CODES[solutionId].title}</span>
          <span className={styles.tabDesc}>{SOLUTION_CODES[solutionId].summary}</span>
        </button>
      ))}
    </div>
  );
};
