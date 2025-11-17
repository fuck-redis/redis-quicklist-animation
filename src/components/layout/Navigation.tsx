import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>📚</span>
          <span className={styles.logoText}>Redis QuickList 学习平台</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🏠</span>
            <span>首页</span>
          </Link>
          
          <Link 
            to="/tutorial" 
            className={`${styles.navLink} ${isActive('/tutorial') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>📖</span>
            <span>互动教程</span>
          </Link>
          
          <Link 
            to="/playground" 
            className={`${styles.navLink} ${isActive('/playground') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🎮</span>
            <span>可视化演示</span>
          </Link>
          
          <Link 
            to="/comparison" 
            className={`${styles.navLink} ${isActive('/comparison') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>⚖️</span>
            <span>数据结构对比</span>
          </Link>
          
          <Link 
            to="/scenarios" 
            className={`${styles.navLink} ${isActive('/scenarios') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🧪</span>
            <span>场景测试</span>
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
