import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

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
        </div>
      </div>
    </nav>
  );
};
