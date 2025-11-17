import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.highlight}>Redis QuickList</span>
            <br />
            交互式学习平台
          </h1>
          <p className={styles.heroSubtitle}>
            通过可视化、互动教程和实战场景，深入理解 Redis 中最重要的数据结构之一
          </p>
          <div className={styles.heroActions}>
            <Link to="/tutorial" className={styles.primaryButton}>
              开始学习 →
            </Link>
            <Link to="/playground" className={styles.secondaryButton}>
              在线演示
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>学习路径</h2>
        <div className={styles.featureGrid}>
          <Link to="/tutorial" className={styles.featureCard}>
            <div className={styles.featureIcon}>📖</div>
            <h3>第一步：互动教程</h3>
            <p>从零开始，逐步理解 QuickList 的设计原理和实现细节</p>
            <ul className={styles.featurePoints}>
              <li>✓ 什么是 QuickList？</li>
              <li>✓ 为什么需要 QuickList？</li>
              <li>✓ QuickList vs 双向链表 vs ZipList</li>
              <li>✓ 节点分裂、合并和压缩机制</li>
            </ul>
            <span className={styles.cardAction}>开始学习 →</span>
          </Link>

          <Link to="/playground" className={styles.featureCard}>
            <div className={styles.featureIcon}>🎮</div>
            <h3>第二步：可视化演示</h3>
            <p>亲手操作，实时观察 QuickList 的内部结构变化</p>
            <ul className={styles.featurePoints}>
              <li>✓ 实时可视化节点结构</li>
              <li>✓ 插入、删除、分裂操作</li>
              <li>✓ 内存分布和使用情况</li>
              <li>✓ 性能指标实时分析</li>
            </ul>
            <span className={styles.cardAction}>开始演示 →</span>
          </Link>

          <Link to="/comparison" className={styles.featureCard}>
            <div className={styles.featureIcon}>⚖️</div>
            <h3>第三步：对比实验</h3>
            <p>通过对比实验，理解不同数据结构的优劣</p>
            <ul className={styles.featurePoints}>
              <li>✓ QuickList vs 双向链表</li>
              <li>✓ QuickList vs ZipList</li>
              <li>✓ 不同配置参数的影响</li>
              <li>✓ 性能和内存对比分析</li>
            </ul>
            <span className={styles.cardAction}>开始对比 →</span>
          </Link>

          <Link to="/scenarios" className={styles.featureCard}>
            <div className={styles.featureIcon}>🧪</div>
            <h3>第四步：场景实战</h3>
            <p>在真实场景中测试 QuickList 的表现</p>
            <ul className={styles.featurePoints}>
              <li>✓ 消息队列场景</li>
              <li>✓ 时间线数据场景</li>
              <li>✓ 大数据量压力测试</li>
              <li>✓ 压缩效果测试</li>
            </ul>
            <span className={styles.cardAction}>开始测试 →</span>
          </Link>
        </div>
      </section>

      <section className={styles.quickStart}>
        <div className={styles.quickStartContent}>
          <h2 className={styles.sectionTitle}>快速上手</h2>
          <div className={styles.quickStartSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>了解基础概念</h3>
                <p>学习 QuickList 的设计思想和核心原理</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>动手实践</h3>
                <p>在可视化演示中亲自操作，观察结构变化</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>深入理解</h3>
                <p>通过对比实验理解设计决策的权衡</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>实战应用</h3>
                <p>在真实场景中测试并优化配置参数</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.whyQuicklist}>
        <h2 className={styles.sectionTitle}>为什么要学习 QuickList？</h2>
        <div className={styles.reasonGrid}>
          <div className={styles.reasonCard}>
            <div className={styles.reasonIcon}>🔥</div>
            <h3>Redis 核心数据结构</h3>
            <p>QuickList 是 Redis List 类型的底层实现，是 Redis 最常用的数据结构之一</p>
          </div>
          <div className={styles.reasonCard}>
            <div className={styles.reasonIcon}>🎯</div>
            <h3>优秀的设计范例</h3>
            <p>结合双向链表和 ZipList 的优势，是数据结构设计的经典案例</p>
          </div>
          <div className={styles.reasonCard}>
            <div className={styles.reasonIcon}>💼</div>
            <h3>面试高频考点</h3>
            <p>深入理解 QuickList 有助于应对 Redis 相关的面试问题</p>
          </div>
          <div className={styles.reasonCard}>
            <div className={styles.reasonIcon}>🚀</div>
            <h3>性能优化基础</h3>
            <p>理解底层实现有助于在实际应用中做出更好的性能优化决策</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>准备好开始学习了吗？</h2>
          <p>通过互动式教程，一步步掌握 Redis QuickList</p>
          <Link to="/tutorial" className={styles.ctaButton}>
            立即开始 →
          </Link>
        </div>
      </section>
    </div>
  );
};
