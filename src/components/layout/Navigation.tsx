import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

const GITHUB_REPO = 'https://github.com/fuck-redis/redis-quicklist-animation';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>📚</span>
          <span className={styles.logoText}>Redis QuickList</span>
        </Link>

        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🏠</span>
            <span>知识概览</span>
          </Link>

          <Link
            to="/tutorial"
            className={`${styles.navLink} ${isActive('/tutorial') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>📖</span>
            <span>完整教程</span>
          </Link>

          <Link
            to="/playground"
            className={`${styles.navLink} ${isActive('/playground') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🎮</span>
            <span>动画演示</span>
          </Link>

          <Link
            to="/scenarios"
            className={`${styles.navLink} ${isActive('/scenarios') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🧪</span>
            <span>场景实验室</span>
          </Link>

          <Link
            to="/comparison"
            className={`${styles.navLink} ${isActive('/comparison') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>⚖️</span>
            <span>对比分析</span>
          </Link>

          <Link
            to="/faq"
            className={`${styles.navLink} ${isActive('/faq') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>❓</span>
            <span>常见问题</span>
          </Link>

          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            title="GitHub 仓库"
          >
            <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};
