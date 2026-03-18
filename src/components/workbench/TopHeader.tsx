import React from 'react';
import { REPO_META } from '@/utils/githubRepo';
import styles from './TopHeader.module.css';

interface TopHeaderProps {
  stars: number;
  onOpenIdea: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ stars, onOpenIdea }) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <a
          href="https://github.com/fuck-redis/fuck-redis"
          target="_blank"
          rel="noreferrer"
          className={styles.backLink}
        >
          ← 返回 fuck-redis
        </a>
      </div>

      <div className={styles.center}>
        <a
          href="https://redis.io/docs/latest/develop/data-types/lists/"
          target="_blank"
          rel="noreferrer"
          className={styles.title}
        >
          Redis QuickList 机制演示与分镜教学
        </a>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.ideaButton} onClick={onOpenIdea}>
          算法思路
        </button>
        <a
          href={REPO_META.repoUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.githubLink}
          title="单击前往 GitHub 仓库，欢迎 Star 支持"
          aria-label="Open GitHub repository"
        >
          <svg viewBox="0 0 24 24" className={styles.githubIcon} aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .5A11.5 11.5 0 0 0 .5 12.15c0 5.16 3.3 9.53 7.87 11.07.58.11.79-.26.79-.56 0-.28-.01-1.2-.02-2.18-3.2.71-3.88-1.39-3.88-1.39-.52-1.36-1.28-1.71-1.28-1.71-1.05-.74.08-.73.08-.73 1.16.08 1.77 1.22 1.77 1.22 1.03 1.8 2.7 1.28 3.35.98.1-.77.4-1.28.74-1.58-2.55-.3-5.23-1.31-5.23-5.82 0-1.29.46-2.35 1.2-3.18-.12-.3-.52-1.52.11-3.16 0 0 .98-.32 3.2 1.22a10.95 10.95 0 0 1 5.82 0c2.22-1.54 3.2-1.22 3.2-1.22.63 1.64.23 2.86.12 3.16.74.83 1.19 1.89 1.19 3.18 0 4.52-2.69 5.52-5.25 5.82.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.2.68.8.56A11.67 11.67 0 0 0 23.5 12.15 11.5 11.5 0 0 0 12 .5Z"
            />
          </svg>
          <span className={styles.starCount}>★ {stars}</span>
        </a>
      </div>
    </header>
  );
};
