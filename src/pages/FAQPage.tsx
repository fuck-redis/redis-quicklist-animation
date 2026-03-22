import React, { useState } from 'react';
import styles from './FAQPage.module.css';
import { CodeBlock } from '@/components/common/CodeBlock';

interface FAQ {
  id: number;
  question: string;
  answer: React.ReactNode;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: '基础概念',
    question: 'QuickList 和普通的双向链表有什么区别？',
    answer: (
      <>
        <p>QuickList 不是纯粹的双向链表，而是<strong>双向链表 + ZipList 的混合结构</strong>：</p>
        <ul>
          <li><strong>普通双向链表</strong>：每个元素单独一个节点，有 prev 和 next 指针</li>
          <li><strong>QuickList</strong>：每个节点是一个双向链表节点，但节点内部存储一个 ZipList，ZipList 可以包含多个元素</li>
        </ul>
        <p>这种设计的优势是：</p>
        <ol>
          <li>减少指针数量，降低内存开销</li>
          <li>小规模的 ZipList 保证内存紧凑</li>
          <li>节点数量少，遍历链表更快</li>
        </ol>
      </>
    )
  },
  {
    id: 2,
    category: '基础概念',
    question: '为什么Redis要用QuickList而不是其他数据结构？',
    answer: (
      <>
        <p>Redis 选择 QuickList 是经过深思熟虑的权衡：</p>
        <h4>纯双向链表的问题：</h4>
        <ul>
          <li>内存开销大：每个元素需要 16 字节指针</li>
          <li>内存碎片严重</li>
          <li>缓存不友好</li>
        </ul>
        <h4>纯 ZipList 的问题：</h4>
        <ul>
          <li>插入/删除需要移动大量数据</li>
          <li>大数据集性能急剧下降</li>
          <li>可能触发级联更新</li>
        </ul>
        <h4>QuickList 的优势：</h4>
        <ul>
          <li>兼顾内存效率和操作性能</li>
          <li>头尾操作仍是 O(1)</li>
          <li>可通过参数调优适应不同场景</li>
          <li>支持压缩进一步节省内存</li>
        </ul>
      </>
    )
  },
  {
    id: 3,
    category: '配置参数',
    question: 'fill 参数应该设置多大？',
    answer: (
      <>
        <p><code>fill</code> 参数控制每个 QuickList 节点中 ZipList 的大小限制。选择合适的值需要考虑：</p>
        <h4>元素大小：</h4>
        <ul>
          <li><strong>小元素（&lt;100字节）</strong>：可以用 fill = -3 或 -4（16-32KB）</li>
          <li><strong>中等元素（100-1000字节）</strong>：用 fill = -2（8KB，默认值）</li>
          <li><strong>大元素（&gt;1000字节）</strong>：用 fill = -1（4KB）</li>
        </ul>
        <h4>权衡考虑：</h4>
        <ul>
          <li><strong>fill 值越大</strong>：分裂越少，但单次分裂代价越高</li>
          <li><strong>fill 值越小</strong>：节点数越多，遍历开销越大</li>
        </ul>
        <p>💡 <strong>建议</strong>：大多数情况使用默认的 -2（8KB）即可，除非有特殊性能需求。</p>
      </>
    )
  },
  {
    id: 4,
    category: '配置参数',
    question: '什么时候应该启用压缩（compress）？',
    answer: (
      <>
        <p>启用压缩的判断标准：</p>
        <h4>✅ 适合启用压缩的场景：</h4>
        <ul>
          <li><strong>队列场景</strong>：频繁访问头尾，中间数据访问少</li>
          <li><strong>历史记录</strong>：旧数据很少访问</li>
          <li><strong>内存敏感</strong>：内存紧张需要节省空间</li>
          <li><strong>大字符串</strong>：压缩效果好（40-70%）</li>
        </ul>
        <h4>❌ 不适合启用压缩的场景：</h4>
        <ul>
          <li><strong>随机访问</strong>：需要频繁访问中间元素</li>
          <li><strong>小整数</strong>：已经很紧凑，压缩效果差</li>
          <li><strong>CPU敏感</strong>：压缩/解压增加CPU开销</li>
        </ul>
        <h4>推荐配置：</h4>
        <CodeBlock language="bash" code={`list-compress-depth 1    # 头尾各1个不压缩
# 或
list-compress-depth 2    # 头尾各2个不压缩`} />
      </>
    )
  },
  {
    id: 5,
    category: '性能优化',
    question: 'QuickList 的性能瓶颈在哪里？',
    answer: (
      <>
        <p>QuickList 的主要性能瓶颈：</p>
        <h4>1. 随机访问（O(N)）</h4>
        <ul>
          <li>需要遍历链表节点</li>
          <li>然后在 ZipList 内查找</li>
          <li><strong>优化</strong>：避免使用 LINDEX，改用 LPOP/RPOP</li>
        </ul>
        <h4>2. 中间位置插入/删除（O(N)）</h4>
        <ul>
          <li>需要先定位到目标位置</li>
          <li>可能触发 ZipList 数据移动</li>
          <li>可能触发节点分裂/合并</li>
          <li><strong>优化</strong>：尽量使用头尾操作</li>
        </ul>
        <h4>3. 节点分裂</h4>
        <ul>
          <li>需要复制数据到新节点</li>
          <li>fill 值过小会频繁分裂</li>
          <li><strong>优化</strong>：根据元素大小调整 fill 参数</li>
        </ul>
        <h4>4. 压缩节点访问</h4>
        <ul>
          <li>访问时需要解压</li>
          <li>增加 CPU 开销</li>
          <li><strong>优化</strong>：只压缩中间节点（设置 compress depth）</li>
        </ul>
      </>
    )
  },
  {
    id: 6,
    category: '性能优化',
    question: '如何优化 QuickList 的内存使用？',
    answer: (
      <>
        <h4>内存优化策略：</h4>
        <ol>
          <li>
            <strong>启用压缩</strong>
            <CodeBlock language="bash" code={`list-compress-depth 1    # 可节省 30-70% 内存`} />
          </li>
          <li>
            <strong>调整 fill 参数</strong>
            <ul>
              <li>小元素用大 fill（减少节点数）</li>
              <li>大元素用小 fill（避免浪费）</li>
            </ul>
          </li>
          <li>
            <strong>定期清理</strong>
            <ul>
              <li>使用 LTRIM 删除不需要的元素</li>
              <li>避免 List 无限增长</li>
            </ul>
          </li>
          <li>
            <strong>监控内存</strong>
            <CodeBlock language="bash" code={`MEMORY USAGE mylist    # 查看实际内存占用`} />
          </li>
        </ol>
      </>
    )
  },
  {
    id: 7,
    category: '实战应用',
    question: '消息队列应该如何配置 QuickList？',
    answer: (
      <>
        <p>消息队列是 QuickList 的典型应用场景，推荐配置：</p>
        <h4>配置建议：</h4>
        <CodeBlock language="bash" code={`# Redis配置文件
list-max-ziplist-size -2      # 8KB节点（默认）
list-compress-depth 0         # 不压缩，保证性能`} />
        <h4>使用模式：</h4>
        <CodeBlock language="redis" code={`# 生产者：尾部入队
RPUSH message_queue "task1"
RPUSH message_queue "task2"

# 消费者：头部出队（阻塞式）
BLPOP message_queue 0         # 阻塞等待

# 或者批量消费
LPOP message_queue
LPOP message_queue`} />
        <h4>性能特点：</h4>
        <ul>
          <li>RPUSH 和 LPOP 都是 O(1)，性能优秀</li>
          <li>只操作头尾节点，不会触发中间节点操作</li>
          <li>不压缩保证访问性能最优</li>
        </ul>
      </>
    )
  },
  {
    id: 8,
    category: '实战应用',
    question: '时间线数据应该如何使用 QuickList？',
    answer: (
      <>
        <p>时间线数据（如用户动态、操作历史）适合用 QuickList存储：</p>
        <h4>配置建议：</h4>
        <CodeBlock language="bash" code={`list-max-ziplist-size -1      # 4KB节点（小一点）
list-compress-depth 2         # 头尾各2个不压缩`} />
        <h4>使用模式：</h4>
        <CodeBlock language="redis" code={`# 新动态插入到头部
LPUSH user:1001:timeline "post_123"

# 获取最近N条
LRANGE user:1001:timeline 0 19    # 最近20条

# 定期清理旧数据
LTRIM user:1001:timeline 0 999    # 只保留最近1000条`} />
        <h4>优化要点：</h4>
        <ul>
          <li>新数据在头部，旧数据在尾部</li>
          <li>启用压缩节省内存（旧数据访问少）</li>
          <li>定期 LTRIM 防止无限增长</li>
          <li>最近的数据访问频繁，保持在未压缩节点</li>
        </ul>
      </>
    )
  },
  {
    id: 9,
    category: '常见错误',
    question: '为什么我的 QuickList 占用内存很大？',
    answer: (
      <>
        <p>可能的原因和解决方法：</p>
        <h4>1. 元素过大</h4>
        <ul>
          <li><strong>问题</strong>：存储大对象（如大JSON、图片）</li>
          <li><strong>解决</strong>：大对象单独存储，List只存ID</li>
        </ul>
        <h4>2. fill 参数不合适</h4>
        <ul>
          <li><strong>问题</strong>：fill 值过大导致节点浪费空间</li>
          <li><strong>解决</strong>：根据实际元素大小调整 fill</li>
        </ul>
        <h4>3. 未启用压缩</h4>
        <ul>
          <li><strong>问题</strong>：大量历史数据未压缩</li>
          <li><strong>解决</strong>：启用 list-compress-depth</li>
        </ul>
        <h4>4. List 无限增长</h4>
        <ul>
          <li><strong>问题</strong>：只插入不删除</li>
          <li><strong>解决</strong>：定期 LTRIM 或设置过期时间</li>
        </ul>
        <h4>排查命令：</h4>
        <CodeBlock language="redis" code={`MEMORY USAGE mylist           # 查看内存占用
LLEN mylist                   # 查看元素数量
DEBUG OBJECT mylist           # 查看内部编码`} />
      </>
    )
  },
  {
    id: 10,
    category: '常见错误',
    question: '为什么 LINDEX 很慢？',
    answer: (
      <>
        <p>LINDEX 性能差是 QuickList 的天生特性：</p>
        <h4>原因分析：</h4>
        <ol>
          <li><strong>需要遍历节点</strong>：找到包含目标索引的节点</li>
          <li><strong>节点内查找</strong>：在 ZipList 内遍历到目标位置</li>
          <li><strong>可能需要解压</strong>：如果节点被压缩了</li>
        </ol>
        <p>整体时间复杂度是 <strong>O(N)</strong>，N 是元素总数。</p>
        <h4>优化方案：</h4>
        <ul>
          <li>
            <strong>方案1：改用头尾操作</strong>
            <CodeBlock language="redis" code={`# 不要用
LINDEX mylist 0

# 改用
LPOP mylist          # 或 LINDEX mylist -1`} />
          </li>
          <li>
            <strong>方案2：使用 LRANGE</strong>
            <CodeBlock language="redis" code={`# 批量获取，比多次 LINDEX 快
LRANGE mylist 0 99`} />
          </li>
          <li>
            <strong>方案3：换数据结构</strong>
            <span>如果需要频繁随机访问，考虑用 Hash 或 Sorted Set</span>
          </li>
        </ul>
      </>
    )
  }
];

export const FAQPage: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  
  const categories = ['全部', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFAQs = selectedCategory === '全部' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);
  
  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };
  
  return (
    <div className={styles.faqPage}>
      <div className={styles.pageHeader}>
        <h1>❓ 常见问题</h1>
        <p>关于 Redis QuickList 的常见疑问解答</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className={styles.faqList}>
          {filteredFAQs.map(faq => (
            <div key={faq.id} className={styles.faqItem}>
              <button 
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className={styles.questionText}>
                  <span className={styles.categoryBadge}>{faq.category}</span>
                  {faq.question}
                </span>
                <span className={styles.toggleIcon}>
                  {openId === faq.id ? '−' : '+'}
                </span>
              </button>
              
              {openId === faq.id && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
