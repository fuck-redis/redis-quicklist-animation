import React from 'react';
import { Link } from 'react-router-dom';
import { HeroAnimation } from '@/components/HeroAnimation';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const knowledgePoints = [
    {
      id: 'concept',
      title: '核心概念',
      icon: '💡',
      items: [
        { title: '什么是 QuickList', desc: '双向链表 + ZipList 的混合结构', link: '/tutorial' },
        { title: '为什么需要 QuickList', desc: '解决纯链表和纯 ZipList 的问题', link: '/tutorial' },
        { title: 'QuickList vs 其他结构', desc: '与 LinkedList、ZipList 的对比', link: '/comparison' },
      ]
    },
    {
      id: 'structure',
      title: '数据结构',
      icon: '🏗️',
      items: [
        { title: 'ZipList 内存结构', desc: 'zlbytes、zltail、zllen、entries、zlend', link: '/tutorial' },
        { title: 'Entry 编码方式', desc: '整数编码、字符串编码、LZF压缩', link: '/tutorial' },
        { title: '节点与链表', desc: 'prev/next 指针、head/tail', link: '/tutorial' },
      ]
    },
    {
      id: 'config',
      title: '配置参数',
      icon: '⚙️',
      items: [
        { title: 'fill 参数', desc: '控制每个节点的元素数量/大小', link: '/tutorial' },
        { title: 'compress 参数', desc: '控制哪些节点需要 LZF 压缩', link: '/tutorial' },
        { title: '参数配置建议', desc: '不同场景下的最优配置', link: '/faq' },
      ]
    },
    {
      id: 'operations',
      title: '核心操作',
      icon: '🔧',
      items: [
        { title: '节点分裂', desc: '当节点满了时分拆为两个节点', link: '/playground' },
        { title: '节点合并', desc: '删除元素后相邻节点可能合并', link: '/playground' },
        { title: '节点压缩', desc: 'LZF 算法压缩冷数据节点', link: '/playground' },
      ]
    },
    {
      id: 'commands',
      title: '常用命令',
      icon: '⌨️',
      items: [
        { title: 'LPUSH/RPUSH', desc: '头尾插入，O(1)', link: '/tutorial' },
        { title: 'LPOP/RPOP', desc: '头尾弹出，O(1)', link: '/tutorial' },
        { title: 'LINDEX/LRANGE', desc: '随机访问，O(N)', link: '/tutorial' },
      ]
    },
    {
      id: 'scenarios',
      title: '应用场景',
      icon: '🎯',
      items: [
        { title: '消息队列', desc: 'RPUSH + LPOP，高性能', link: '/tutorial' },
        { title: '时间线/Feed', desc: 'LPUSH + LTRIM，定期清理', link: '/tutorial' },
        { title: '最新评论', desc: '分页展示，定期截断', link: '/tutorial' },
      ]
    },
    {
      id: 'memory',
      title: '内存优化',
      icon: '💾',
      items: [
        { title: '内存构成分析', desc: '节点指针、ZipList 头部、Entry 数据', link: '/tutorial' },
        { title: '压缩效果', desc: 'LZF 压缩率 30-70%', link: '/tutorial' },
        { title: '优化策略', desc: '选择合适的 fill 和 compress', link: '/faq' },
      ]
    },
    {
      id: 'performance',
      title: '性能特点',
      icon: '⚡',
      items: [
        { title: '时间复杂度', desc: '头尾 O(1)，中间 O(N)', link: '/tutorial' },
        { title: '性能瓶颈', desc: '随机访问、中间操作', link: '/faq' },
        { title: '调优建议', desc: '避免 LINDEX，使用批量操作', link: '/faq' },
      ]
    },
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>📚</div>
          <h1 className={styles.heroTitle}>
            Redis <span className={styles.highlight}>QuickList</span>
          </h1>
          <p className={styles.heroSubtitle}>
            深入理解 Redis List 类型的底层数据结构<br />
            掌握 QuickList 的设计思想与实战技巧
          </p>
          <div className={styles.heroActions}>
            <Link to="/tutorial" className={styles.primaryButton}>
              📖 开始学习教程
            </Link>
            <Link to="/playground" className={styles.secondaryButton}>
              🎮 查看动画演示
            </Link>
          </div>
        </div>
        <HeroAnimation />
      </section>

      {/* Quick Summary */}
      <section className={styles.quickSummary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>🔗</div>
          <div className={styles.summaryText}>
            <strong>QuickList = 双向链表 + ZipList</strong>
            <span>每个节点是一个 ZipList，多个节点组成双向链表</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>⚡</div>
          <div className={styles.summaryText}>
            <strong>头尾操作 O(1)</strong>
            <span>LPUSH、RPUSH、LPOP、RPOP 都是常数时间</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>🗜️</div>
          <div className={styles.summaryText}>
            <strong>支持 LZF 压缩</strong>
            <span>中间冷数据节点可压缩，节省 30-70% 内存</span>
          </div>
        </div>
      </section>

      {/* Knowledge Points Grid */}
      <section className={styles.knowledgeSection}>
        <h2 className={styles.sectionTitle}>知识点速览</h2>
        <p className={styles.sectionDesc}>点击任意模块，深入学习相关知识</p>

        <div className={styles.knowledgeGrid}>
          {knowledgePoints.map((group) => (
            <div key={group.id} className={styles.knowledgeGroup}>
              <div className={styles.groupHeader}>
                <span className={styles.groupIcon}>{group.icon}</span>
                <h3>{group.title}</h3>
              </div>
              <div className={styles.groupItems}>
                {group.items.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className={styles.knowledgeItem}
                  >
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemDesc}>{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className={styles.architectureSection}>
        <h2 className={styles.sectionTitle}>数据结构图示</h2>
        <div className={styles.diagram}>
          <pre className={styles.diagramCode}>{`
┌─────────────────────────────────────────────────────────────────────┐
│                        QuickList 整体结构                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  HEAD                                                              │
│    ↓                                                               │
│  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐                  │
│  │ Node │ ←→ │ Node │ ←→ │ Node │ ←→ │ Node │ ←→ ...          │
│  │  #0  │    │  #1  │    │  #2  │    │  #3  │                  │
│  └──┬───┘    └──┬───┘    └──┬───┘    └──┬───┘                  │
│     │           │           │           │                          │
│     ↓           ↓           ↓           ↓                          │
│  ┌─────────────────────────────────────────────┐                  │
│  │              ZipList #0                     │                  │
│  ├─────────────────────────────────────────────┤                  │
│  │ entry0 │ entry1 │ entry2 │ ... │ entryN    │                  │
│  └─────────────────────────────────────────────┘                  │
│                                                                     │
│  - 每个 Node 包含一个 ZipList                                      │
│  - Node 之间通过 prev/next 指针连接成双向链表                      │
│  - 头尾节点通常不压缩（compress-depth），中间节点可压缩              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

ZipList 内部结构：
┌────────┬────────┬─────────┬─────────┬─────────┬────────┐
│zlbytes │ zltail │  zllen  │ entry0  │ entry1  │ zlend  │
│ (4B)   │  (4B)  │  (2B)   │ 可变    │ 可变    │  (1B)  │
└────────┴────────┴─────────┴─────────┴─────────┴────────┘
  `}</pre>
        </div>
      </section>

      {/* Learning Path */}
      <section className={styles.learningPath}>
        <h2 className={styles.sectionTitle}>推荐学习路径</h2>
        <div className={styles.pathSteps}>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>📖 完整教程</h4>
              <p>12 步学习 QuickList 的所有知识点</p>
              <Link to="/tutorial">开始学习 →</Link>
            </div>
          </div>
          <div className={styles.pathArrow}>→</div>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>🎮 动画演示</h4>
              <p>可视化查看插入、删除、分裂、压缩操作</p>
              <Link to="/playground">查看演示 →</Link>
            </div>
          </div>
          <div className={styles.pathArrow}>→</div>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>⚖️ 对比分析</h4>
              <p>理解 QuickList vs LinkedList vs ZipList</p>
              <Link to="/comparison">开始对比 →</Link>
            </div>
          </div>
          <div className={styles.pathArrow}>→</div>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h4>❓ 常见问题</h4>
              <p>FAQ 解答面试和实战中的疑问</p>
              <Link to="/faq">查看 FAQ →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>准备好深入理解 QuickList 了吗？</h2>
        <p>通过互动式教程和可视化演示，全面掌握 Redis 核心数据结构</p>
        <Link to="/tutorial" className={styles.ctaButton}>
          🚀 立即开始学习
        </Link>
      </section>
    </div>
  );
};
