import React, { useState } from 'react';
import styles from './TutorialPage.module.css';
import { MultiAnimationShowcase } from '@/components/RemotionAnimation/MultiAnimationShowcase';
import { CodeBlock } from '@/components/common/CodeBlock';
import './VideoStyles.css';

export type AnimationType =
  | 'overview'
  | 'split'
  | 'compression'
  | 'merge'
  | 'lpush'
  | 'rpush'
  | 'lpop'
  | 'rpop'
  | 'ziplist'
  | 'comparison'
  | 'fillconfig'
  | 'linsert'
  | 'memory'
  | 'scenarios'
  | 'performance'
  // Additional animations
  | 'linkedlist-structure'
  | 'pointer-connections'
  | 'linkedlist-problems'
  | 'ziplist-problems'
  | 'quicklist-advantages'
  | 'entry-structure'
  | 'encoding-demo'
  | 'fill-effects'
  | 'compress-effects'
  | 'linsert-demo'
  | 'lrem-demo'
  | 'ltrim-demo'
  | 'memory-allocation'
  | 'compression-ratio'
  | 'scenario-queue'
  | 'scenario-feed'
  | 'scenario-comments'
  | 'scenario-rate-limit'
  | 'performance-table'
  | 'config-recommendations';

interface VideoItem {
  type: AnimationType;
  title: string;
}

interface TutorialStep {
  id: number;
  title: string;
  content: React.ReactNode;
  keyPoints: string[];
  videos?: VideoItem[];
  videoTitle?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: '什么是 QuickList？',
    videos: [
      { type: 'overview', title: 'QuickList 结构概述' },
      { type: 'linkedlist-structure', title: '双向链表结构' },
      { type: 'pointer-connections', title: '节点指针连接' },
      { type: 'entry-structure', title: 'Entry 存储结构' },
      { type: 'encoding-demo', title: 'ZipList 编码演示' },
    ],
    content: (
      <>
        <h4>概述</h4>
        <p>QuickList 是 Redis 3.2 版本（2016年）引入的一种<strong>混合数据结构</strong>，它是 Redis List 类型的底层实现。在 Redis 7.0 中，List 类型完全由 QuickList 承担。</p>

        <h4>核心设计思想</h4>
        <p>QuickList = <strong>双向链表</strong> + <strong>ZipList（压缩列表）</strong></p>
        <div className={styles.diagram}>
          <pre>{`
┌──────────────────────────────────────────┐
│          QuickList 结构示意图             │
├──────────────────────────────────────────┤
│                                          │
│  Node 1      Node 2      Node 3         │
│  ┌────┐     ┌────┐      ┌────┐         │
│  │Zip │ <-> │Zip │ <->  │Zip │         │
│  │List│     │List│      │List│         │
│  │[...]│    │[...]│     │[...]│        │
│  └────┘     └────┘      └────┘         │
│    ↑          ↑           ↑            │
│   prev       prev        prev          │
│   next       next        next          │
│                                          │
└──────────────────────────────────────────┘`}</pre>
        </div>

        <h4>为什么需要混合设计？</h4>
        <p>每个<strong>节点</strong>是一个双向链表节点，节点内部存储一个 <strong>ZipList</strong>，ZipList 中可以存储多个元素。这种设计结合了两种数据结构的优势：</p>
        <ul>
          <li>双向链表：支持 O(1) 的头尾操作</li>
          <li>ZipList：紧凑的内存布局，减少指针开销</li>
        </ul>

        <h4>实际案例：存储用户浏览历史</h4>
        <CodeBlock language="redis" code={`# 存储用户最近浏览的100个商品
redis> LPUSH user:view:123 "product:999"
redis> LPUSH user:view:123 "product:888"
redis> LTRIM user:view:123 0 99  # 只保留最近100条

# 获取最近浏览的10个商品
redis> LRANGE user:view:123 0 9

# 查看列表编码（验证是 QuickList）
redis> OBJECT ENCODING user:view:123
"quicklist"`} />

        <h4>内存效率对比</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>数据结构</th>
              <th>100万元素内存</th>
              <th>头插性能</th>
              <th>随机访问</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>纯双向链表</td>
              <td>~32MB</td>
              <td>O(1)</td>
              <td>O(N)</td>
            </tr>
            <tr>
              <td>纯 ZipList</td>
              <td>~6MB</td>
              <td>O(N)*</td>
              <td>O(N)</td>
            </tr>
            <tr>
              <td>QuickList</td>
              <td>~7MB</td>
              <td>O(1)</td>
              <td>O(N)</td>
            </tr>
          </tbody>
        </table>
        <p>* ZipList 头插需要移动所有元素</p>
      </>
    ),
    keyPoints: [
      'QuickList = 双向链表 + ZipList，兼顾性能和内存',
      '每个节点是一个 ZipList，存储多个元素',
      '头尾操作 O(1)，保持高性能',
      'ZipList 减少指针开销，提高内存效率'
    ]
  },
  {
    id: 2,
    title: '为什么需要 QuickList？',
    videos: [
      { type: 'comparison', title: '三种数据结构对比' },
      { type: 'linkedlist-problems', title: '双向链表问题详解' },
      { type: 'ziplist-problems', title: 'ZipList问题详解' },
      { type: 'quicklist-advantages', title: 'QuickList优势总结' },
      { type: 'memory-allocation', title: '内存分配对比' },
    ],
    content: (
      <>
        <h4>历史背景</h4>
        <p>Redis List 类型的底层实现经历了三次演进：</p>
        <ul>
          <li><strong>Redis 2.2 之前</strong>：纯双向链表实现</li>
          <li><strong>Redis 2.4-3.1</strong>：纯 ZipList 实现（小列表）</li>
          <li><strong>Redis 3.2 至今</strong>：QuickList 混合实现</li>
        </ul>

        <h4>传统双向链表的问题</h4>
        <ul>
          <li><strong>内存碎片严重</strong>：每个元素单独分配内存，100万个元素需要100万次内存分配</li>
          <li><strong>指针开销大</strong>：每个节点需要 prev 和 next 指针（16字节），对于小数据指针开销可能占50%以上</li>
          <li><strong>内存利用率低</strong>：小数据的指针开销占比很大</li>
        </ul>

        <h4>纯 ZipList 的问题</h4>
        <ul>
          <li><strong>插入/删除性能差</strong>：需要移动大量数据，O(N) 复杂度</li>
          <li><strong>频繁 realloc</strong>：连续内存扩展代价高，可能触发多次内存拷贝</li>
          <li><strong>级联更新</strong>：entry 长度变化会导致后续所有 entry 的 prevlen 字段需要更新</li>
        </ul>

        <h4>实际内存计算示例</h4>
        <CodeBlock language="bash" code={`# 场景：存储100万个整数 "1"

# 纯双向链表：
# - 每个节点：16B (prev/next) + 8B (数据指针) + 8B (元数据) = 32B
# - 总计：100万 × 32B = 32MB

# 纯 ZipList：
# - 每个 entry：1B (prevlen) + 1B (encoding) + 1B (数据) = 3B
# - ZipList 头部：16B
# - 总计：约 3MB

# QuickList (fill=-2, 即8KB节点)：
# - 每个节点约2000个元素，共500个节点
# - 节点指针：16B × 500 = 8KB
# - ZipList 头部：16B × 500 = 8KB
# - Entry 数据：约 3MB × 500 / 2000 ≈ 3MB
# - 总计：约 7-8MB`} />

        <h4>QuickList 的优势</h4>
        <div className={styles.advantage}>
          <p>✅ <strong>平衡性能与内存</strong></p>
          <ul>
            <li>小规模 ZipList 保证内存紧凑（每个节点 4-64KB）</li>
            <li>链表结构支持快速头尾操作（O(1)）</li>
            <li>避免了纯 ZipList 的大规模数据移动</li>
            <li>避免了纯链表的高内存开销</li>
            <li>可配置节点大小适应不同场景</li>
          </ul>
        </div>
      </>
    ),
    keyPoints: [
      '双向链表：O(1)操作，但指针开销大(16B/节点)，内存碎片多',
      'ZipList：内存紧凑，但中间操作 O(N)，级联更新风险大',
      'QuickList：结合两者优势，O(1)头尾操作 + 紧凑内存',
      '通过 fill 参数控制节点大小，平衡性能和内存'
    ]
  },
  {
    id: 3,
    title: 'ZipList 内部结构',
    videos: [
      { type: 'ziplist', title: 'ZipList 内部结构详解' },
      { type: 'entry-structure', title: 'Entry 结构详解' },
      { type: 'encoding-demo', title: '智能编码演示' },
      { type: 'compression-ratio', title: '编码压缩率对比' },
      { type: 'memory-allocation', title: '内存布局详解' },
    ],
    content: (
      <>
        <h4>为什么需要了解 ZipList？</h4>
        <p>ZipList 是 QuickList 的<strong>核心存储单元</strong>。每个 QuickList 节点内部都是一个 ZipList，存储多个元素。理解 ZipList 的内部机制，对于调优 QuickList 至关重要。</p>

        <h4>ZipList 完整内存布局</h4>
        <div className={styles.diagram}>
          <pre>{`
┌────────┬────────┬─────────┬────────────┬────────────┬────────────┬───────┐
│zlbytes │ zltail │ zllen   │  entry1    │  entry2    │  entryN    │zlend │
│ 4字节  │ 4字节  │ 2字节   │ 可变长度   │ 可变长度   │ 可变长度   │ 1字节 │
└────────┴────────┴─────────┴────────────┴────────────┴────────────┴───────┘
   │        │        │           │            │            │            │
   │        │        │           │            │            │            └── 0xFF (结束标记)
   │        │        │           │            │            │
   │        │        │           │            │            └── entryN: [prevlen][encoding][data]
   │        │        │           │            │
   │        │        │           │            └── entry2: [prevlen][encoding][data]
   │        │        │           │
   │        │        │           └── entry1: [prevlen][encoding][data]
   │        │        │
   │        │        └── 列表长度（元素个数）
   │        │
   │        └── 最后一个元素的偏移量（快速找到尾部）
   │
   └── 整个 ZipList 的总字节数（用于内存重分配）`}</pre>
        </div>

        <h4>每个 Entry 的详细结构</h4>
        <CodeBlock language="text" code={`┌─────────────────────────────────────────────────────────────┐
│                        Entry 结构                           │
├──────────────┬──────────────────────────────────────────────┤
│   prevlen    │              content                         │
│  (1-5字节)   │  ┌──────────┬─────────────────────────┐   │
│              │  │ encoding │          data             │   │
│ 前一个entry  │  │ 1-5字节  │        可变长度          │   │
│ 的长度       │  │ 类型+长度 │        实际数据          │   │
└──────────────┴──┴──────────┴─────────────────────────┴───┘`} />

        <h4>prevlen 字段：级联更新的根源</h4>
        <p>prevlen 存储<strong>前一个 entry 的字节长度</strong>：</p>
        <ul>
          <li>如果前一个 entry 长度 &lt; 254 字节：使用 1 字节存储</li>
          <li>否则：使用 5 字节（1 字节 0xFE + 4 字节实际长度）</li>
        </ul>
        <div className={styles.advantage}>
          <p>⚠️ <strong>级联更新问题</strong>：当在某个 entry 前插入新元素时，如果该 entry 的 prevlen 从 1 字节变成 5 字节（或反过来），会导致后续所有 entry 的位置移动，需要更新它们的 prevlen 字段！</p>
        </div>

        <h4>encoding 字段：智能压缩</h4>
        <p>encoding 采用变长编码，根据数据类型和大小选择最优方案：</p>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>encoding 值</th>
              <th>数据类型</th>
              <th>数据长度</th>
              <th>示例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>00xxxxxx</code></td>
              <td>字符串</td>
              <td>&lt; 64 字节</td>
              <td>"hello"</td>
            </tr>
            <tr>
              <td><code>01xxxxxx</code></td>
              <td>字符串</td>
              <td>&lt; 16384 字节</td>
              <td>长字符串</td>
            </tr>
            <tr>
              <td><code>10000000</code></td>
              <td>INT</td>
              <td>int16</td>
              <td>32767</td>
            </tr>
            <tr>
              <td><code>11000000</code></td>
              <td>INT</td>
              <td>int32</td>
              <td>2147483647</td>
            </tr>
            <tr>
              <td><code>11110000</code></td>
              <td>INT</td>
              <td>int64</td>
              <td>9223372036854775807</td>
            </tr>
          </tbody>
        </table>

        <h4>实战：查看 ZipList 内部结构</h4>
        <CodeBlock language="redis" code={`# 创建一个 ZipList（Redis 自动选择 ZipList 或 QuickList）
redis> RPUSH mylist 1 2 3 4 5

# 查看底层编码
redis> OBJECT ENCODING mylist
"quicklist"

# DEBUG 命令查看详细信息
redis> DEBUG OBJECT ENCODING mylist
# Output: at 0x7f9c5c000b20连锁表节点数: 1, ziplist 个数: 1

# 使用 DEBUG ZIPLIST 命令查看 ZipList 详情（需要 Redis 源码调试）
# 或者通过 Redis Insight 等工具可视化查看`} />

        <h4>内存占用计算示例</h4>
        <CodeBlock language="bash" code={`# 场景：存储 5 个整数 [1, 2, 3, 4, 5]

# ZipList 头部：
# - zlbytes: 4 字节
# - zltail: 4 字节
# - zllen: 2 字节
# - zlend: 1 字节
# 小计：11 字节

# 每个 Entry（以整数 1 为例）：
# - prevlen: 1 字节（如果是第一个则为0）
# - encoding: 1 字节（11110000 = int64）
# - data: 1 字节
# 每个 entry 约：3 字节

# 5 个 entry 总计：约 15 字节

# 理论总大小：11 + 15 = 26 字节
# 实际可能略有差异（内存对齐等）`} />

        <h4>为什么 ZipList 这么快？</h4>
        <ul>
          <li>🚀 <strong>CPU 缓存友好</strong>：连续内存布局，预加载多个 entry 到缓存</li>
          <li>📦 <strong>内存紧凑</strong>：变长编码，无指针开销</li>
          <li>🔍 <strong>快速定位</strong>：zltail 直接指向尾部，无需遍历</li>
          <li>🔄 <strong>双向遍历</strong>：prevlen 支持反向遍历</li>
        </ul>
      </>
    ),
    keyPoints: [
      'ZipList 是连续内存块，CPU 缓存友好',
      '每个 entry 由 prevlen + encoding + data 组成',
      'prevlen 字段是级联更新的根源（重要！）',
      'encoding 采用变长编码，最大化节省空间',
      '连续内存布局是高性能的关键'
    ]
  },
  {
    id: 4,
    title: '关键配置参数',
    videos: [
      { type: 'fillconfig', title: 'fill 和 compress 配置详解' },
      { type: 'fill-effects', title: 'fill 参数效果演示' },
      { type: 'compress-effects', title: 'compress 参数效果演示' },
      { type: 'config-recommendations', title: '场景化配置推荐' },
      { type: 'performance-table', title: '配置与性能关系' },
    ],
    content: (
      <>
        <h4>为什么配置参数很重要？</h4>
        <p>QuickList 的性能取决于两个核心参数：<code>fill</code> 和 <code>compress</code>。这两个参数直接影响：</p>
        <ul>
          <li>📊 <strong>内存占用</strong>：节点越小，碎片越少但指针开销越大</li>
          <li>⚡ <strong>操作性能</strong>：节点越大，分裂/合并代价越高</li>
          <li>🗜️ <strong>压缩效果</strong>：中间节点越多，压缩收益越大</li>
        </ul>

        <h4>list-max-ziplist-size (fill) 参数详解</h4>
        <p>fill 参数有两种模式：<strong>正数模式</strong>（元素数量）和<strong>负数模式</strong>（字节大小）。</p>

        <div className={styles.configTable}>
          <table>
            <thead>
              <tr>
                <th>配置值</th>
                <th>含义</th>
                <th>节点大小</th>
                <th>适用场景</th>
                <th>优缺点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>fill = -1</code></td>
                <td>最大 4KB</td>
                <td>~4KB</td>
                <td>大元素（&gt;1KB）</td>
                <td>分裂频繁但单次代价低</td>
              </tr>
              <tr>
                <td><code>fill = -2</code></td>
                <td>最大 8KB</td>
                <td>~8KB</td>
                <td>通用场景（默认）</td>
                <td>平衡之选</td>
              </tr>
              <tr>
                <td><code>fill = -3</code></td>
                <td>最大 16KB</td>
                <td>~16KB</td>
                <td>中等元素</td>
                <td>节点数减少</td>
              </tr>
              <tr>
                <td><code>fill = -4</code></td>
                <td>最大 32KB</td>
                <td>~32KB</td>
                <td>小元素（&lt;100B）</td>
                <td>内存效率高</td>
              </tr>
              <tr>
                <td><code>fill = -5</code></td>
                <td>最大 64KB</td>
                <td>~64KB</td>
                <td>小元素批量存储</td>
                <td>最高内存效率</td>
              </tr>
              <tr>
                <td><code>fill = 1</code></td>
                <td>最多 1 个元素</td>
                <td>最小</td>
                <td>每个节点单独存储</td>
                <td>类似纯链表，高指针开销</td>
              </tr>
              <tr>
                <td><code>fill = 1000</code></td>
                <td>最多 1000 个元素</td>
                <td>可变</td>
                <td>固定元素数量</td>
                <td>元素数量可控</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>fill 参数对内存和性能的影响</h4>
        <CodeBlock language="bash" code={`# 场景：存储 100 万个小字符串（每个约 50 字节）

# fill = -1 (4KB 节点)
# 每个节点约 4000/50 = 80 个元素
# 需要节点数：1000000 / 80 = 12500 个节点
# 节点指针：12500 × 16B = 200KB
# 节点头：12500 × 16B = 200KB
# ZipList 头部：12500 × 16B = 200KB
# Entry 数据：1000000 × 52B = 52MB
# 总计：约 53MB

# fill = -5 (64KB 节点)
# 每个节点约 64000/50 = 1280 个元素
# 需要节点数：1000000 / 1280 = 782 个节点
# 节点指针：782 × 16B = 12.5KB
# 节点头：782 × 16B = 12.5KB
# ZipList 头部：782 × 16B = 12.5KB
# Entry 数据：1000000 × 52B = 52MB
# 总计：约 52MB
# 节省内存：~1MB（节点指针和头部开销减少）`} />

        <h4>list-compress-depth (compress) 参数详解</h4>
        <p>compress 参数控制从列表<strong>两端</strong>开始，有多少个节点不压缩。中间节点都会被 LZF 算法压缩。</p>

        <div className={styles.compressDemo}>
          <pre>{`
compress = 0: 全部不压缩（默认）
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1  │ ◀─ ▶│ N2  │ ◀─ ▶│ N3  │ ◀─ ▶│ N4  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  不压缩    不压缩     不压缩     不压缩     不压缩

compress = 1: 头尾各 1 个不压缩
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1* │ ◀─ ▶│ N2* │ ◀─ ▶│ N3* │ ◀─ ▶│ N4  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  不压缩    压缩       压缩        压缩        不压缩

compress = 2: 头尾各 2 个不压缩
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1  │ ◀─ ▶│ N2* │ ◀─ ▶│ N3  │ ◀─ ▶│ N4  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  不压缩    不压缩     压缩        不压缩      不压缩

compress = 3: 头尾各 3 个不压缩（适合超长列表）
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1  │ ◀─ ▶│ N2  │ ◀─ ▶│ N3  │ ◀─ ▶│ N4  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  不压缩    不压缩     不压缩       不压缩     不压缩
（如果列表足够长，中间节点会被压缩）`}</pre>
        </div>

        <h4>压缩的实际效果</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>数据类型</th>
              <th>未压缩大小</th>
              <th>压缩后大小</th>
              <th>压缩率</th>
              <th>CPU 开销</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>短字符串</td>
              <td>100 字节</td>
              <td>60 字节</td>
              <td>40%</td>
              <td>低</td>
            </tr>
            <tr>
              <td>长字符串</td>
              <td>10KB</td>
              <td>3KB</td>
              <td>70%</td>
              <td>中等</td>
            </tr>
            <tr>
              <td>JSON 数据</td>
              <td>1KB</td>
              <td>300 字节</td>
              <td>70%</td>
              <td>中等</td>
            </tr>
            <tr>
              <td>重复数据</td>
              <td>5KB</td>
              <td>500 字节</td>
              <td>90%</td>
              <td>低</td>
            </tr>
          </tbody>
        </table>

        <h4>Redis 配置示例</h4>
        <CodeBlock language="bash" code={`# Redis 配置文件 redis.conf

# 方式 1：使用字节大小（推荐）
list-max-ziplist-size -2    # 每个节点最大 8KB（默认）
list-compress-depth 1        # 两端各 1 个节点不压缩

# 方式 2：使用元素数量
list-max-ziplist-size 512   # 每个节点最多 512 个元素

# 场景化配置
# 小元素场景（存储用户 ID、时间戳等）
list-max-ziplist-size -4     # 32KB 节点
list-compress-depth 1        # 启用压缩

# 大元素场景（存储大字符串、序列化对象）
list-max-ziplist-size -1    # 4KB 节点，避免空间浪费
list-compress-depth 0        # 不压缩，CPU 开销最小

# 消息队列场景（需要最低延迟）
list-max-ziplist-size -2    # 默认 8KB
list-compress-depth 0        # 不压缩，所有节点快速访问`} />

        <h4>在线调整参数</h4>
        <CodeBlock language="bash" code={`# 使用 CONFIG SET 在线调整（不需要重启）
CONFIG SET list-max-ziplist-size -4
CONFIG SET list-compress-depth 1

# 查看当前配置
CONFIG GET list-max-ziplist-size
CONFIG GET list-compress-depth

# 注意：在线修改只对新创建的 QuickList 生效
# 已有列表需要重新创建才能应用新参数`} />

        <h4>配置选择决策树</h4>
        <div className={styles.diagram}>
          <pre>{`
选择 fill 参数：
├── 元素大小 &gt; 1KB？
│   └── 是 → fill = -1 (4KB)，避免单节点过大
├── 元素大小 100B ~ 1KB？
│   └── 是 → fill = -2 (8KB)，默认配置
├── 元素大小 &lt; 100B？
│   └── 是 → fill = -4 或 -5，批量存储更高效
└── 需要精确控制节点元素数量？
    └── 是 → fill = N（具体数量）

选择 compress 参数：
├── 需要最低延迟（消息队列）？
│   └── 是 → compress = 0，不压缩
├── 中间节点很少被访问（时间线、归档）？
│   └── 是 → compress = 1 或 2，启用压缩
└── 超长列表（&gt;1000 节点）？
    └── 是 → compress = 3，保护更多热点数据`}</pre>
        </div>
      </>
    ),
    keyPoints: [
      'fill 参数控制节点大小：负数为字节大小，正数为元素数量',
      '小元素用大 fill（-4/-5），大元素用小 fill（-1）',
      'compress 参数控制两端不压缩的节点数',
      '消息队列场景：fill=-2, compress=0',
      '时间线场景：fill 根据元素大小调整，compress=1-2',
      '在线修改只对新列表生效，老列表需要重建'
    ]
  },
  {
    id: 5,
    title: '核心操作：节点分裂',
    videos: [
      { type: 'split', title: '节点分裂完整过程' },
      { type: 'fill-effects', title: 'fill 对分裂的影响' },
      { type: 'memory-allocation', title: '分裂时内存变化' },
      { type: 'pointer-connections', title: '指针重连过程' },
    ],
    content: (
      <>
        <h4>节点分裂的触发条件</h4>
        <p>节点分裂发生在向 QuickList 插入元素时，当目标节点的 ZipList 超过 <code>fill</code> 限制就会触发分裂。</p>

        <div className={styles.advantage}>
          <p>📍 <strong>触发时机</strong>：</p>
          <ul>
            <li>LPUSH/RPUSH 头尾插入时</li>
            <li>LINSERT 中间插入时</li>
            <li>任何导致 ZipList 大小超标的操作</li>
          </ul>
        </div>

        <h4>分裂位置选择策略</h4>
        <p>Redis 选择分裂点的策略是<strong>尽量保持两个节点平衡</strong>：</p>
        <CodeBlock language="text" code={`
分裂位置计算：
- 如果 fill=-2 (8KB)，每个节点目标约 4000 字节
- 分裂点 = ceil(current_size / 2)
- 确保两个节点都不会立即再次分裂

例如：节点有 20 个元素需要分裂
- 分裂后：Node1 10个元素，Node2 10个元素
- 如果 fill=10，则 Node1 刚好达到限制，Node2 稍小`} />

        <h4>分裂过程详解</h4>
        <div className={styles.operationSteps}>
          <div className={styles.step}>
            <strong>Step 1：检测限制</strong>
            <p>LPUSH "new_element" 到已有 10 个元素的节点（fill=10）</p>
            <CodeBlock language="text" code={`当前节点: [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10]
节点大小: 4200 字节（超过 fill=-2 的 8KB 限制中的元素数量限制）`} />
          </div>

          <div className={styles.step}>
            <strong>Step 2：计算分裂点</strong>
            <p>计算中间位置，确定哪些元素留在原节点</p>
            <CodeBlock language="text" code={`分裂点计算: ceil(11/2) = 6
原节点保留: 前 6 个元素 [e1, e2, e3, e4, e5, e6]
新节点包含: 后 5 个元素 + 新插入元素 [e7, e8, e9, e10, new]`} />
          </div>

          <div className={styles.step}>
            <strong>Step 3：分配新节点</strong>
            <p>创建新的 ZipList 节点</p>
            <CodeBlock language="text" code={`分配新节点内存：
- 节点结构: 16 字节
- ZipList 头部: 16 字节
- 初始容量: 根据 fill 配置`} />
          </div>

          <div className={styles.step}>
            <strong>Step 4：数据迁移</strong>
            <p>将后半部分元素移动到新节点</p>
            <CodeBlock language="text" code={`数据迁移过程：
1. 扩展原节点 ZipList 尾部空间
2. 将 [e7,e8,e9,e10] 复制/移动到新节点
3. 更新原节点的 zltail 偏移量

注意：这是 O(N) 操作，元素越多代价越高`} />
          </div>

          <div className={styles.step}>
            <strong>Step 5：链表重连</strong>
            <p>更新双向链表指针</p>
            <CodeBlock language="text" code={`重连指针：
Node1.next = Node2
Node2.prev = Node1

同时更新：
- 新增节点的 prev/next 指针
- 如果是中间位置，还需要处理与前后节点的关系`} />
          </div>
        </div>

        <h4>实际 Redis 命令模拟</h4>
        <CodeBlock language="redis" code={`# 初始状态：一个节点存储所有元素
redis> RPUSH mylist 1 2 3 4 5 6 7 8 9 10
(integer) 10

# 查看节点数量（使用 DEBUG 命令）
redis> DEBUG OBJECT ENCODING mylist
连锁表节点数: 1

# 继续插入，触发分裂
redis> RPUSH mylist 11 12 13 14 15 16 17 18 19 20 21
(integer) 21

# 再次查看，节点已经分裂
redis> DEBUG OBJECT ENCODING mylist
连锁表节点数: 2  # 分裂成了 2 个节点

# 查看节点信息
redis> DEBUG OBJECT mylist
# Output 示例:
# quicklistNodes:2, num_elements:21`} />

        <h4>fill 值对分裂频率的影响</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>fill 配置</th>
              <th>节点容量</th>
              <th>10万元素需要节点数</th>
              <th>分裂触发次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fill = 1</td>
              <td>1 个元素</td>
              <td>10 万节点</td>
              <td>约 10 万次</td>
            </tr>
            <tr>
              <td>fill = -2</td>
              <td>8KB</td>
              <td>约 15-20 节点</td>
              <td>约 15-20 次</td>
            </tr>
            <tr>
              <td>fill = -5</td>
              <td>64KB</td>
              <td>约 2-3 节点</td>
              <td>约 2-3 次</td>
            </tr>
          </tbody>
        </table>

        <h4>分裂的性能开销</h4>
        <ul>
          <li>⏱️ <strong>时间复杂度</strong>：O(N)，N 为被分裂节点的元素数</li>
          <li>💾 <strong>空间开销</strong>：新分配一个节点（16B + ZipList 头部）</li>
          <li>📝 <strong>数据移动</strong>：需要移动约一半的元素到新节点</li>
          <li>🔗 <strong>指针更新</strong>：更新链表指针（O(1)）</li>
        </ul>

        <div className={styles.advantage}>
          <p>💡 <strong>优化建议</strong>：</p>
          <ul>
            <li>如果插入频繁，选择较大的 fill 值减少分裂次数</li>
            <li>如果内存敏感，选择较小的 fill 值提高压缩效果</li>
            <li>批量插入时，fill 值过小会导致频繁分裂，性能下降</li>
          </ul>
        </div>
      </>
    ),
    keyPoints: [
      '超过 fill 限制时触发分裂，通常在中间位置分裂',
      '分裂时需要移动约一半的元素到新节点',
      'fill 值越小，分裂越频繁，单次代价低',
      'fill 值越大，分裂越少，但单次分裂代价高',
      '分裂是 O(N) 操作，是 QuickList 最昂贵的操作之一'
    ]
  },
  {
    id: 6,
    title: '核心操作：节点合并',
    videos: [
      { type: 'merge', title: '节点合并完整过程' },
      { type: 'fill-effects', title: 'fill 对合并的影响' },
      { type: 'memory-allocation', title: '合并时内存变化' },
      { type: 'pointer-connections', title: '合并后指针连接' },
    ],
    content: (
      <>
        <h4>合并 vs 分裂：两种相反的操作</h4>
        <p>节点合并是节点分裂的<strong>逆操作</strong>。当删除元素后，如果相邻节点的元素总数可以放入一个节点，就会触发合并。</p>

        <h4>合并的触发条件</h4>
        <p>合并不会主动发生，只在特定删除操作后<strong>被动检查</strong>：</p>
        <ul>
          <li>✅ <strong>LPOP/RPOP</strong>：弹出元素后检查是否需要合并</li>
          <li>✅ <strong>LREM</strong>：删除元素后检查是否需要合并</li>
          <li>❌ <strong>不会主动合并</strong>：Redis 不会后台定期合并节点</li>
        </ul>

        <h4>合并的判断条件</h4>
        <CodeBlock language="text" code={`
合并条件（fill = 10 为例）：
┌─────────────────────────────────────────────────────┐
│ 条件1: NodeA 的元素数 + NodeB 的元素数 <= fill     │
│ 条件2: NodeA 和 NodeB 必须是相邻节点               │
│                                                     │
│ 示例：                                              │
│ NodeA: [1,2,3] (3个元素)                          │
│ NodeB: [4,5] (2个元素)                            │
│ 总计: 5 <= 10 → 可以合并！                         │
└─────────────────────────────────────────────────────┘`} />

        <h4>合并过程详解</h4>
        <div className={styles.operationSteps}>
          <div className={styles.step}>
            <strong>Step 1：触发检查</strong>
            <p>LPOP 删除 NodeA 的尾部元素后，NodeA 元素变少</p>
            <CodeBlock language="text" code={`操作前：
NodeA: [1, 2, 3, 4, 5]    # 5个元素
NodeB: [6, 7]              # 2个元素
NodeC: [...]

LPOP mylist  # 删除 5

操作后：
NodeA: [1, 2, 3, 4]        # 4个元素
NodeB: [6, 7]              # 2个元素（不变）
NodeC: [...]`} />
          </div>

          <div className={styles.step}>
            <strong>Step 2：检查合并条件</strong>
            <p>检查 NodeA + NodeB 的元素数是否 &lt;= fill</p>
            <CodeBlock language="text" code={`NodeA 元素数: 4
NodeB 元素数: 2
总计: 6

fill = 10
6 <= 10 → 可以合并！`} />
          </div>

          <div className={styles.step}>
            <strong>Step 3：数据合并</strong>
            <p>将 NodeB 的元素追加到 NodeA</p>
            <CodeBlock language="text" code={`合并前内存布局：
NodeA ZipList: [1, 2, 3, 4]
NodeB ZipList: [6, 7]

合并后：
NodeA ZipList: [1, 2, 3, 4, 6, 7]
NodeB ZipList: (待删除)`} />
          </div>

          <div className={styles.step}>
            <strong>Step 4：释放 NodeB</strong>
            <p>删除 NodeB 节点，更新指针</p>
            <CodeBlock language="text" code={`重连指针：
NodeA.next = NodeC
NodeC.prev = NodeA

释放内存：
- NodeB 的 prev/next 指针
- NodeB 的 ZipList 数据（realloc 或直接 free）`} />
          </div>
        </div>

        <h4>实际 Redis 命令模拟</h4>
        <CodeBlock language="redis" code={`# 创建会产生多个节点的列表
redis> RPUSH mylist 1 2 3 4 5 6 7 8 9 10
(integer) 10

# 继续插入，触发分裂
redis> RPUSH mylist 11 12 13 14 15 16 17 18 19 20
(integer) 20

# 查看节点数量
redis> DEBUG OBJECT mylist
quicklistNodes:2, num_elements:20

# 删除元素，触发合并（如果符合条件）
redis> LPOP mylist
"1"
redis> LPOP mylist
"2"
# ... 删除更多元素后，可能会触发合并

# 最终状态
redis> LLEN mylist
(integer) 18`} />

        <h4>合并的代价</h4>
        <ul>
          <li>⏱️ <strong>数据移动</strong>：将 NodeB 的元素复制/追加到 NodeA</li>
          <li>💾 <strong>内存操作</strong>：可能需要扩展 NodeA 的 ZipList</li>
          <li>🔗 <strong>指针更新</strong>：更新链表指针（O(1)）</li>
          <li>🗑️ <strong>内存释放</strong>：释放 NodeB 的内存</li>
        </ul>

        <h4>为什么不主动合并？</h4>
        <div className={styles.advantage}>
          <p>💡 <strong>设计哲学：惰性策略</strong></p>
          <ul>
            <li>Redis 追求<strong>写操作高性能</strong>，不在后台做额外工作</li>
            <li>合并需要遍历和移动数据，有 O(N) 开销</li>
            <li>数据可能很快又被插入，合并是徒劳的</li>
            <li>被动合并在删除时自然发生，不影响插入性能</li>
          </ul>
        </div>

        <h4>合并 vs 不合并的场景</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>场景</th>
              <th>合并效果</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>消费者处理队列</td>
              <td>频繁 LPOP，合并可以减少节点</td>
              <td>自动合并，有益</td>
            </tr>
            <tr>
              <td>生产者持续写入</td>
              <td>很快又会分裂，合并浪费</td>
              <td>不合并，避免无用功</td>
            </tr>
            <tr>
              <td>固定长度时间线</td>
              <td>LPUSH + LTRIM，合并有益</td>
              <td>合并有益</td>
            </tr>
          </tbody>
        </table>

        <h4>fill 值对合并的影响</h4>
        <CodeBlock language="text" code={`
fill 值对合并的影响：

fill = -2 (8KB，约 2000 个小元素)：
- 合并阈值很高，需要两个节点都很空才能合并
- 合并触发频率较低
- 合并收益更大（减少更多节点）

fill = 1 (每个节点 1 个元素)：
- 合并阈值很低（1+1=2 <= 1? 不成立！）
- 实际上 fill=1 时不会发生合并
- 这种配置下节点基本不会合并（类似纯链表）

fill = 10 (10 个元素)：
- 合并阈值：2 个相邻节点元素和 <= 10
- 例如：4+5=9 <= 10 → 可以合并
- 合并触发频率适中`} />
      </>
    ),
    keyPoints: [
      '合并只在删除操作后被动触发（LPOP/RPOP/LREM）',
      '合并条件：相邻节点元素总数 <= fill',
      'Redis 采用惰性策略，不会主动合并',
      '合并收益：减少节点数，提高遍历效率',
      'fill 值越大，合并阈值越高，合并越难触发'
    ]
  },
  {
    id: 7,
    title: '核心操作：节点压缩',
    videos: [
      { type: 'compression', title: 'LZF 压缩原理演示' },
      { type: 'compression-ratio', title: '不同数据类型压缩率' },
      { type: 'compress-effects', title: 'compress 参数效果详解' },
      { type: 'memory-allocation', title: '压缩前后内存对比' },
      { type: 'performance-table', title: '压缩对性能的影响' },
    ],
    content: (
      <>
        <h4>为什么需要压缩？</h4>
        <p>QuickList 节点之间的<strong>中间节点</strong>通常访问频率较低（尤其是消息队列、时间线等场景）。对这些节点进行压缩，可以：</p>
        <ul>
          <li>💾 <strong>节省内存</strong>：压缩率可达 30-70%</li>
          <li>🧊 <strong>提高缓存效率</strong>：压缩数据更紧凑，缓存命中率更高</li>
          <li>📉 <strong>减少内存带宽</strong>：传输压缩数据消耗更少带宽</li>
        </ul>

        <h4>LZF 压缩算法原理</h4>
        <p>Redis 使用 <strong>LZF 算法</strong>（Lempel-Ziv-Free）进行压缩，这是一种基于词典的无损压缩算法：</p>
        <CodeBlock language="text" code={`
LZF 压缩核心思想：
┌────────────────────────────────────────────────────────┐
│ 1. 建立词典：记录已见过的子串和位置                      │
│ 2. 匹配替换：用短引用替换重复出现的子串                  │
│ 3. 原始输出：对于无法匹配的内容，原样输出                │
└────────────────────────────────────────────────────────┘

压缩示例：
原始数据: "hello world, hello redis, hello quicklist"
         ↓
词典构建: { "hello": 0, "world": 6, "redis": 14, ... }
         ↓
压缩输出: [ref hello] world, [ref hello] redis, [ref hello] quicklist
         ↓
实际编码: \x84\x05hello world, \x84\x05redis, \x84\x05quicklist
         (其中 \x84 是压缩标记，表示后面跟一个引用)`} />

        <h4>压缩时机</h4>
        <p>节点压缩发生在以下时刻：</p>
        <ul>
          <li>📝 <strong>节点创建时</strong>：如果 compress &gt; 0，中间节点会被压缩</li>
          <li>🔄 <strong>节点移出压缩区时</strong>：例如 compress 减少后，原来压缩的节点需要解压</li>
          <li>📖 <strong>访问时不解压</strong>：压缩节点在被访问时会自动解压</li>
        </ul>

        <h4>compress 参数详细策略</h4>
        <div className={styles.compressStrategy}>
          <pre>{`
compress = 0: 不压缩任何节点
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1  │ ◀─ ▶│ N2  │ ◀─ ▶│ N3  │ ◀─ ▶│ N4  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  RAW       RAW        RAW        RAW        RAW

compress = 1: 两端各 1 个节点不压缩
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1  │ ◀─ ▶│ N2  │ ◀─ ▶│ N3  │ ◀─ ▶│ N4  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  RAW       LZF        LZF        LZF        RAW
           ↑                         ↑
        不压缩                      不压缩

compress = 2: 两端各 2 个节点不压缩
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│ N0  │ ◀─ ▶│ N1  │ ◀─ ▶│ N2  │ ◀─ ▶│ N3  │ ◀─ ▶│ N4  │ ◀─ ▶│ N5  │
└─────┘    └─────┘    └─────┘    └─────┘    └─────┘    └─────┘
  RAW        RAW        LZF        LZF        RAW        RAW
                        ↑
                   唯一压缩的节点`}</pre>
        </div>

        <h4>不同数据类型的压缩效果</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>数据类型</th>
              <th>原始大小</th>
              <th>压缩后</th>
              <th>压缩率</th>
              <th>解压性能</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小整数 (1, 2, 3...)</td>
              <td>1-2 字节</td>
              <td>2-3 字节</td>
              <td>负优化</td>
              <td>无</td>
            </tr>
            <tr>
              <td>递增序列</td>
              <td>100 字节</td>
              <td>20 字节</td>
              <td>80%</td>
              <td>快速</td>
            </tr>
            <tr>
              <td>短字符串</td>
              <td>50 字节</td>
              <td>30 字节</td>
              <td>40%</td>
              <td>快速</td>
            </tr>
            <tr>
              <td>长字符串</td>
              <td>10KB</td>
              <td>3KB</td>
              <td>70%</td>
              <td>中等</td>
            </tr>
            <tr>
              <td>JSON 对象</td>
              <td>1KB</td>
              <td>300 字节</td>
              <td>70%</td>
              <td>中等</td>
            </tr>
            <tr>
              <td>重复数据</td>
              <td>5KB</td>
              <td>500 字节</td>
              <td>90%</td>
              <td>快速</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.advantage}>
          <p>⚠️ <strong>重要发现</strong>：对于已经高度压缩的数据（如小整数），压缩反而会增加大小！这是因为 LZF 的压缩标记和引用本身也有开销。</p>
        </div>

        <h4>压缩对性能的影响</h4>
        <CodeBlock language="text" code={`
访问压缩节点的性能开销：

1. 头尾节点访问（O(1)）：
   - 不压缩，直接访问
   - 性能：无额外开销

2. 中间节点首次访问：
   ┌────────────────────────────────────────────┐
   │ 1. 解压 LZF 数据到临时缓冲区                 │
   │ 2. 在解压数据上执行操作                      │
   │ 3. 如果是写操作，重新压缩并存回              │
   └────────────────────────────────────────────┘
   额外开销：解压/压缩 CPU 时间 + 临时内存分配

3. 批量访问中间节点：
   - 每次访问都需要解压
   - 如果频繁访问中间节点，压缩反而降低性能`} />

        <h4>实际配置建议</h4>
        <CodeBlock language="bash" code={`# 场景 1：消息队列（低延迟优先）
list-max-ziplist-size -2    # 默认 8KB
list-compress-depth 0         # 不压缩，保证最低延迟

# 场景 2：时间线/Feed（内存优先）
list-max-ziplist-size -4    # 32KB 大节点
list-compress-depth 1         # 两端各 1 个不压缩，其余压缩
# 理由：中间节点访问少，压缩节省内存

# 场景 3：最新评论列表（平衡）
list-max-ziplist-size -2    # 8KB
list-compress-depth 2         # 两端各 2 个不压缩
# 理由：最近评论可能被翻页访问，不能全压

# 场景 4：超长列表（高效压缩）
list-max-ziplist-size -5    # 64KB 最大节点
list-compress-depth 3         # 两端各 3 个不压缩
# 理由：节点少但大，压缩效果显著`} />

        <h4>压缩内存计算示例</h4>
        <CodeBlock language="bash" code={`# 场景：100 万个短字符串，每个约 50 字节

# 未压缩情况：
# 原始数据：100万 × 50B = 50MB
# ZipList 开销：约 5MB
# 总计：约 55MB

# 启用压缩（compress=1）后：
# 中间节点（假设 90% 是中间节点）
# 压缩率 40%（短字符串）
# 压缩数据：50MB × 90% × 40% = 18MB
# 未压缩数据（头尾 10%）：50MB × 10% = 5MB
# ZipList 开销：约 2MB
# 总计：约 25MB

# 内存节省：55MB → 25MB，节省约 55%`} />
      </>
    ),
    keyPoints: [
      '使用 LZF 无损压缩算法，压缩率通常 30-70%',
      '只压缩中间节点，头尾节点保持不压缩以保证性能',
      '小整数等已压缩数据不建议压缩（反而增加大小）',
      '压缩需要 CPU 开销，适合中间节点访问少的场景',
      '根据场景选择合适的 compress 值，平衡内存和性能'
    ]
  },
  {
    id: 8,
    title: 'Redis 命令实战',
    videos: [
      { type: 'lpush', title: 'LPUSH 头插操作' },
      { type: 'rpush', title: 'RPUSH 尾插操作' },
      { type: 'lpop', title: 'LPOP 头弹操作' },
      { type: 'rpop', title: 'RPOP 尾弹操作' },
      { type: 'performance-table', title: '所有操作复杂度对比' },
      { type: 'overview', title: '命令执行完整流程' },
    ],
    content: (
      <>
        <h4>命令分类概览</h4>
        <p>Redis List 命令按照性能特点可以分为三类：</p>
        <ul>
          <li>🚀 <strong>高频 O(1)</strong>：LPUSH、RPUSH、LPOP、RPOP - 日常使用的主力</li>
          <li>⚠️ <strong>中频 O(N)</strong>：LRANGE、LINDEX、LINSERT - 需要谨慎使用</li>
          <li>🔧 <strong>管理命令</strong>：LTRIM、LREM、LLEN - 配合主命令使用</li>
        </ul>

        <h4>1. 头尾插入：LPUSH / RPUSH（O(1)）</h4>
        <p>这是 QuickList 最核心的操作，保持 O(1) 的高性能。</p>
        <CodeBlock language="redis" code={`# LPUSH：从头部插入，新元素变成第一个
redis> LPUSH mylist "world"
(integer) 1
redis> LPUSH mylist "hello"
(integer) 2

# 查看结果
redis> LRANGE mylist 0 -1
1) "hello"
2) "world"

# 内部执行过程：
# 1. 定位到 HEAD 节点（Node0）
# 2. 在 Node0 的 ZipList 头部插入新元素
# 3. 如果 Node0 超过 fill 限制，触发分裂
# 4. 更新链表头部指针`} />

        <div className={styles.diagram}>
          <pre>{`
LPUSH 执行示意图：

操作前：                    操作后：
[mylist]                    [mylist]
  │                           │
  ▼                           ▼
┌─────────┐                 ┌─────────┐
│ [hello] │  ──LPUSH──►     │ [world] │  ◄─ 新的 HEAD
│  (N0)   │                 │  (N0)   │
└─────────┘                 └─────────┘

如果 N0 满了（超过 fill）：
┌─────────┐    ┌─────────┐
│ [a,b,c] │    │ [d,e,f] │    ──►    ┌─────────┐    ┌─────────┐
│  (N0)   │    │  (N1)   │           │ [new,a] │    │ [b,c,d] │
└─────────┘    └─────────┘           │  (N0)   │    │  (N1)   │
                                     └─────────┘    └─────────┘`}</pre>
        </div>

        <h4>2. 头尾弹出：LPOP / RPOP（O(1)）</h4>
        <p>与插入对应，弹出操作也是 O(1) 高性能。</p>
        <CodeBlock language="redis" code={`# LPOP：从头部弹出，返回第一个元素并删除
redis> LPOP mylist
"hello"

# RPOP：从尾部弹出
redis> RPOP mylist
"world"

# 内部执行过程：
# 1. 定位到 HEAD/TAIL 节点
# 2. 读取并删除 ZipList 头部/尾部元素`} />

        <div className={styles.diagram}>
          <pre>{`# 3. 如果节点变空，删除节点并更新指针
# 4. 如果相邻节点可以合并，执行合并

# 弹出后节点为空的情况：
# ┌─────────┐    ┌─────────┐
# │ [a,b,c] │    │ [d,e,f] │
# └─────────┘    └─────────┘
#      │
#      ▼ LPOP 3次
# ┌─────────┐    (空) 删除
# │ [a,b,c] │ ──────────► (节点被删除，N1 成为新的 HEAD)`}</pre>
        </div>

        <h4>3. 按索引访问：LINDEX（O(N)）</h4>
        <p><strong>性能杀手</strong>：需要遍历多个节点才能定位元素。</p>
        <CodeBlock language="redis" code={`# LINDEX：获取指定索引位置的元素
redis> LINDEX mylist 0     # 获取第一个元素
"hello"
redis> LINDEX mylist -1    # 获取最后一个元素
"world"

# 内部执行过程：
# 1. 如果 index >= 0，从 HEAD 遍历
# 2. 如果 index < 0，从 TAIL 遍历（更快找到）
# 3. 遍历每个节点的 ZipList，累计偏移量
# 4. 找到目标位置后读取元素

# ⚠️ 性能陷阱示例：
# ┌─────────┐    ┌─────────┐    ┌─────────┐
# │ [0-99]  │    │ [100-199] │   │ [200-299] │
# └─────────┘    └─────────┘    └─────────┘
#       │              │              │
#       ▼ LINDEX 150   ▼              ▼
#   遍历 2 个节点才能找到！需要移动 100 个元素的指针`} />

        <h4>4. 范围查询：LRANGE（O(N)）</h4>
        <p>遍历收集指定范围的元素，范围越大越慢。</p>
        <CodeBlock language="redis" code={`# LRANGE：获取指定范围的元素
redis> LRANGE mylist 0 9     # 获取前 10 个元素
redis> LRANGE mylist -10 -1  # 获取最后 10 个元素

# 内部执行过程：
# 1. 定位起始索引所在的节点
# 2. 从起始位置开始，遍历节点收集元素
# 3. 直到收集完请求的数量或到达列表尾部

# 💡 优化建议：尽量使用负索引访问尾部元素
# 访问前 10 个元素需要从 HEAD 遍历
# 访问后 10 个元素从 TAIL 倒序遍历更快（如果有双向指针）`} />

        <h4>5. 插入元素：LINSERT（O(N)）</h4>
        <p>在 pivot 前后插入新元素，需要先找到 pivot 位置。</p>
        <CodeBlock language="redis" code={`# LINSERT：在 pivot 前后插入新元素
redis> LINSERT mylist BEFORE "pivot" "new_element"
(integer) 5
redis> LINSERT mylist AFTER "pivot" "after_pivot"
(integer) 6

# 返回值：插入后的列表长度，-1 表示 pivot 不存在

# 内部执行过程：
# 1. 遍历查找 pivot 元素所在的节点
# 2. 在该节点的 ZipList 中找到精确位置
# 3. 插入新元素
# 4. 如果节点超过 fill，触发分裂

# ⚠️ 注意：LINSERT 在中间插入时效率最低
# - 需要遍历可能所有的节点
# - 插入点可能在 ZipList 中间位置
# - 大量元素需要移动`} />

        <h4>完整操作复杂度表</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>命令</th>
              <th>复杂度</th>
              <th>说明</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>LPUSH</td>
              <td>O(1)</td>
              <td>头插，可能分裂</td>
              <td>✅ 放心使用</td>
            </tr>
            <tr>
              <td>RPUSH</td>
              <td>O(1)</td>
              <td>尾插，可能分裂</td>
              <td>✅ 放心使用</td>
            </tr>
            <tr>
              <td>LPOP</td>
              <td>O(1)</td>
              <td>头弹，可能合并</td>
              <td>✅ 放心使用</td>
            </tr>
            <tr>
              <td>RPOP</td>
              <td>O(1)</td>
              <td>尾弹，可能合并</td>
              <td>✅ 放心使用</td>
            </tr>
            <tr>
              <td>LINDEX</td>
              <td>O(N)</td>
              <td>遍历节点定位</td>
              <td>⚠️ 限制使用</td>
            </tr>
            <tr>
              <td>LRANGE</td>
              <td>O(N)</td>
              <td>遍历收集元素</td>
              <td>⚠️ 范围别太大</td>
            </tr>
            <tr>
              <td>LINSERT</td>
              <td>O(N)</td>
              <td>查找 + 插入</td>
              <td>⚠️ 尽量避免</td>
            </tr>
          </tbody>
        </table>

        <h4>实际使用建议</h4>
        <CodeBlock language="redis" code={`# ✅ 正确示范：利用 O(1) 操作构建高性能队列
# 生产者：RPUSH 入队
redis> RPUSH queue:tasks "task_001"
redis> RPUSH queue:tasks "task_002"

# 消费者：LPOP 出队
redis> LPOP queue:tasks
"task_001"

# ✅ 正确示范：利用 LTRIM 限制长度
# 只保留最近 1000 条
redis> LTRIM mylist 0 999

# ❌ 错误示范：频繁 LINDEX
# 查找第 10000 个元素需要遍历很多节点
redis> LINDEX mylist 10000

# ❌ 错误示范：在中间位置频繁 LINSERT
# 每次都需要遍历查找位置
redis> LINSERT mylist BEFORE "element_5000" "new"`} />
      </>
    ),
    keyPoints: [
      'LPUSH/RPUSH/LPOP/RPOP 都是 O(1)，是 QuickList 的核心操作',
      'LINDEX/LRANGE 是 O(N)，需要遍历节点，适合偶尔使用',
      'LINSERT 是 O(N) 且需要查找 pivot，避免频繁使用',
      '结合 LTRIM 限制列表长度，防止无限增长'
    ]
  },
  {
    id: 9,
    title: '更多 Redis List 命令',
    videos: [
      { type: 'linsert', title: 'LINSERT 指定位置插入' },
      { type: 'linsert-demo', title: 'LINSERT 详细演示' },
      { type: 'lrem-demo', title: 'LREM 删除元素详解' },
      { type: 'ltrim-demo', title: 'LTRIM 截断列表详解' },
      { type: 'split', title: 'LINSERT 触发分裂' },
      { type: 'merge', title: 'LREM 触发合并' },
    ],
    content: (
      <>
        <h4>高级操作命令详解</h4>
        <p>这些命令用于更精细化地管理 List，虽然性能不如 O(1) 命令，但在大数据量下仍然很有用。</p>

        <h4>1. LINSERT - 精确位置插入（O(N)）</h4>
        <p>LINSERT 允许在 pivot 元素的前后插入新元素，是 List 中最灵活但最昂贵的操作。</p>
        <CodeBlock language="redis" code={`# LINSERT 语法
LINSERT key BEFORE|AFTER pivot element

# 示例：在 "world" 前插入 "beautiful"
redis> RPUSH mylist "hello" "world" "!"
redis> LINSERT mylist BEFORE "world" "beautiful"
(integer) 4

redis> LRANGE mylist 0 -1
1) "hello"
2) "beautiful"
3) "world"
4) "!"

# 返回值：
# - 新列表长度（插入成功）
# - -1（pivot 不存在）
# - 0（key 不存在）`} />

        <div className={styles.diagram}>
          <pre>{`
LINSERT 执行过程：

原始列表：["hello", "world", "!"]
              │
              ▼ LINSERT BEFORE "world" "beautiful"

查找 pivot "world"：        ┌─────────┐
  从 HEAD 遍历              │ [hello] │  Node0
  找到后计算偏移量    ──►   ├─────────┤
                            │ [world] │  ◄── pivot
                            ├─────────┤
                            │   [!]   │
                            └─────────┘
                                 │
                                 ▼
插入后：["hello", "beautiful", "world", "!"]
              ┌─────────┐
              │ [hello] │
              ├─────────┤
              │[beauti] │  ◄── 新插入元素
              ├─────────┤
              │ [world] │
              ├─────────┤
              │   [!]   │
              └─────────┘

⚠️ 如果 Node0 满了，插入会触发分裂！`}</pre>
        </div>

        <h4>2. LREM - 精确删除元素（O(N)）</h4>
        <p>LREM 根据 count 参数决定从哪个方向删除多少个匹配元素。</p>
        <CodeBlock language="redis" code={`# LREM 语法
LREM key count element

# count 的三种语义：
# count > 0：从 HEAD 向 TAIL 方向，删除最多 count 个匹配元素
# count < 0：从 TAIL 向 HEAD 方向，删除最多 |count| 个匹配元素
# count = 0：删除所有匹配元素

redis> RPUSH mylist "a" "b" "c" "a" "d" "a"
redis> LREM mylist 2 "a"     # 从头部删除前2个 "a"
(integer) 2

redis> LRANGE mylist 0 -1
1) "b"
2) "c"
3) "d"
4) "a"

redis> LREM mylist -1 "a"    # 从尾部删除1个 "a"
(integer) 1

redis> LRANGE mylist 0 -1
1) "b"
2) "c"
3) "d"

redis> LREM mylist 0 "d"     # 删除所有 "d"
(integer) 1

redis> LRANGE mylist 0 -1
1) "b"
2) "c"`} />

        <h4>3. LTRIM - 范围裁剪（O(N)）</h4>
        <p>LTRIM 是一个<strong>数据治理神器</strong>，用于保持 List 长度，防止无限增长。</p>
        <CodeBlock language="redis" code={`# LTRIM 语法
LTRIM key start stop

# 保留索引 start 到 stop 之间的元素，删除其余

redis> RPUSH mylist 1 2 3 4 5 6 7 8 9 10
(integer) 10

# 保留前 5 个
redis> LTRIM mylist 0 4
OK

redis> LLEN mylist
(integer) 5

redis> LRANGE mylist 0 -1
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"

# 常用模式：结合 LPUSH/RPUSH 实现固定大小队列
# 每当添加新元素时，裁剪到固定长度
redis> LPUSH mylist "new_item"
redis> LTRIM mylist 0 999   # 只保留最新 1000 条`} />

        <div className={styles.advantage}>
          <p>💡 <strong>LTRIM 的特点</strong>：</p>
          <ul>
            <li>LTRIM 是 O(N) 操作，但只执行一次删除</li>
            <li>不会像循环 LPOP 那样产生多次网络往返</li>
            <li>是保持列表长度的推荐方式</li>
          </ul>
        </div>

        <h4>4. LSET - 索引更新（O(N)）</h4>
        <p>LSET 直接修改指定索引位置的元素值。</p>
        <CodeBlock language="redis" code={`# LSET 语法
LSET key index element

redis> RPUSH mylist "hello" "world"
redis> LSET mylist 0 "HELLO"    # 修改第一个元素
OK

redis> LSET mylist -1 "WORLD"   # 修改最后一个元素
OK

redis> LRANGE mylist 0 -1
1) "HELLO"
2) "WORLD"

# 错误情况：索引超出范围
redis> LSET mylist 10 "invalid"
(error) ERR index out of range`} />

        <h4>5. LLEN - 长度获取（O(1)）</h4>
        <p>LLEN 直接从 QuickList 头部读取 zllen 字段，是真正的 O(1) 操作。</p>
        <CodeBlock language="redis" code={`# LLEN 语法
LLEN key

redis> RPUSH mylist 1 2 3 4 5
(integer) 5

redis> LLEN mylist
(integer) 5

# 为什么不遍历？
# QuickList 结构中直接存储了列表长度（zllen）
# 每次 LPUSH/RPUSH 时更新，LPOP/RPOP 时也更新
# 所以 LLEN 不需要遍历就能返回长度`} />

        <h4>高级使用模式</h4>
        <CodeBlock language="lua" code={`# 模式 1：实现发布-订阅系统（简易版）
# 发布者
redis> LPUSH channel:news "Breaking news..."
redis> LPUSH channel:news "More updates..."
redis> LTRIM channel:news 0 99   # 只保留最近 100 条

# 订阅者
redis> LRANGE channel:news 0 9   # 获取最新 10 条

# 模式 2：实现限流滑动窗口
# 记录每次请求的时间戳
redis> LPUSH rate:limit:user:123 TIMESTAMP
redis> LTRIM rate:limit:user:123 0 99   # 只保留最近 100 条

# 计算时间窗口内的请求数
# 需要配合 Lua 脚本实现原子操作
local now = redis.call('TIME')
local window_start = now - 60  -- 60 秒窗口
redis.call('LTRIM', KEYS[1], 0, 99)

# 模式 3：实现最近评论列表
redis> LPUSH post:123:comments "great post!"
redis> LREM post:123:comments 0 "spam comment"  # 删除垃圾评论
redis> LTRIM post:123:comments 0 99   # 只保留最新 100 条
redis> LRANGE post:123:comments 0 19   # 分页获取（第 1 页）`} />
      </>
    ),
    keyPoints: [
      'LINSERT 是 O(N) 操作，查找 pivot 需要遍历',
      'LREM 根据 count 方向不同，从不同方向删除匹配元素',
      'LTRIM 是保持列表长度的推荐方式（O(N) 但只执行一次）',
      'LLEN 是真正的 O(1)，从 QuickList 头部直接读取',
      '结合 LTRIM 可以实现固定大小队列，防止内存无限增长'
    ]
  },
  {
    id: 10,
    title: '内存优化实战',
    videos: [
      { type: 'memory', title: '内存占用分析' },
      { type: 'memory-allocation', title: '内存分配详解' },
      { type: 'compression-ratio', title: '压缩节省内存对比' },
      { type: 'fill-effects', title: 'fill 与内存关系' },
      { type: 'compress-effects', title: 'compress 与内存关系' },
    ],
    content: (
      <div>
        <h4>QuickList 内存构成详解</h4>
        <p>理解 QuickList 的内存构成是优化的基础。每一部分都有其独特的开销和优化空间。</p>

        <CodeBlock language="text" code={`
QuickList 内存全景图：

┌─────────────────────────────────────────────────────────────┐
│                      QuickList 结构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Node 0 (HEAD)                    │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │              ZipList 头部 (16B)               │  │  │
│  │  ├───────────────────────────────────────────────┤  │  │
│  │  │  Entry1: [prevlen][encoding][data]            │  │  │
│  │  │  Entry2: [prevlen][encoding][data]            │  │  │
│  │  │  ...                                          │  │  │
│  │  │  EntryN: [prevlen][encoding][data]            │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│         │                                    │           │
│         ▼ prev ◀────────────────────────▶ next ▼          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Node 1                           │  │
│  │  ...                                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

内存计算公式：
Total = QuickList(24B)
       + Σ Node(16B + 16B + ZipList数据)
       + 指针(16B/节点 × 节点数)

每个 Entry 的内存：
Entry = prevlen(1-5B) + encoding(1-5B) + data(变长)`} />

        <h4>实际内存计算示例</h4>
        <CodeBlock language="bash" code={`# 场景：存储 100 万个小字符串（每个约 50 字节）

# 配置：fill=-2 (8KB)，compress=0

# Step 1: 计算每个节点的元素数
# 每个 entry = prevlen(1B) + encoding(1B) + data(50B) = 52B
# 每个节点可存储：8KB / 52B ≈ 157 个元素

# Step 2: 计算节点数
# 总节点数：1000000 / 157 ≈ 6370 个节点

# Step 3: 计算各项内存
# QuickList 结构：24B
# 节点指针：6370 × 16B = 102KB
# ZipList 头部：6370 × 16B = 102KB
# Entry 数据：1000000 × 52B = 52MB
# 总计：约 52.2MB

# 对比：纯双向链表需要约 64MB（每个节点 64B）`} />

        <h4>优化策略一：启用压缩</h4>
        <p>压缩可以显著减少中间节点的内存占用，特别是对于重复性高的数据。</p>
        <CodeBlock language="bash" code={`# 启用压缩：两端各 1 个节点不压缩
list-compress-depth 1

# 内存节省效果：
# - 假设 90% 的节点是中间节点（可压缩）
# - 压缩率约 50%（中等重复数据）
# - 原始中间节点数据：52MB × 90% = 46.8MB
# - 压缩后：46.8MB × 50% = 23.4MB
# - 头尾节点（不压缩）：52MB × 10% = 5.2MB
# - 总计：23.4 + 5.2 = 28.6MB
# - 节省：52.2 - 28.6 = 23.6MB (约 45%)`} />

        <h4>优化策略二：选择合适的 fill</h4>
        <p>fill 参数直接影响节点数量和分裂/合并频率。</p>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>fill 值</th>
              <th>节点大小</th>
              <th>100万元素需要节点数</th>
              <th>指针开销</th>
              <th>适用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-1 (4KB)</td>
              <td>~4KB</td>
              <td>~12500</td>
              <td>200KB</td>
              <td>大元素（&gt;1KB）</td>
            </tr>
            <tr>
              <td>-2 (8KB)</td>
              <td>~8KB</td>
              <td>~6370</td>
              <td>102KB</td>
              <td>中等元素</td>
            </tr>
            <tr>
              <td>-4 (32KB)</td>
              <td>~32KB</td>
              <td>~1600</td>
              <td>25KB</td>
              <td>小元素（&lt;100B）</td>
            </tr>
            <tr>
              <td>-5 (64KB)</td>
              <td>~64KB</td>
              <td>~800</td>
              <td>12.5KB</td>
              <td>批量存储</td>
            </tr>
          </tbody>
        </table>

        <h4>优化策略三：定期清理和数据归档</h4>
        <CodeBlock language="lua" code={`# 定期清理防止无限增长
# 每次 LPUSH 后执行 LTRIM
redis> LPUSH mylist "new_item"
redis> LTRIM mylist 0 9999   # 只保留 10000 条

# 更好的方式：使用 Lua 脚本原子执行
# 这样可以避免竞争条件
local key = KEYS[1]
local max_len = tonumber(ARGV[1])
local new_item = ARGV[2]

redis.call('LPUSH', key, new_item)
redis.call('LTRIM', key, 0, max_len - 1)
return redis.call('LLEN', key)

# 数据归档策略
# 将冷数据迁移到另一个 List 或持久化存储
redis> LRANGE mylist 0 999        # 读取前 1000 条
redis> LRANGE mylist 1000 -1      # 剩余的归档
redis> LTRIM mylist 0 999          # 删除已归档的数据`} />

        <h4>监控和分析工具</h4>
        <CodeBlock language="redis" code={`# 查看单个 key 的内存占用
redis> MEMORY USAGE mylist
(integer) 52428800   # 50MB

# 查看详细的编码信息
redis> DEBUG OBJECT mylist
# Output:
# quicklistNodes:6370
# num_elements:1000000
# ql_compressed:0
# ql_ziplist_head:-1
# ql_ziplist_tail:-1
# ql_compress:0
# ql_uncompressed_fields:6370

# 实时监控 Redis 内存
redis> INFO memory
# used_memory: 104857600
# used_memory_human: 100.00M
# used_memory_rss: 115700000

# 使用 Redis CLI 分析大 List
redis-cli --biglists
# 扫描并报告大 List 的统计信息`} />

        <h4>内存优化效果对比</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>优化策略</th>
              <th>原始内存</th>
              <th>优化后</th>
              <th>节省比例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>无优化</td>
              <td>52.2MB</td>
              <td>52.2MB</td>
              <td>-</td>
            </tr>
            <tr>
              <td>+ compress=1</td>
              <td>52.2MB</td>
              <td>28.6MB</td>
              <td>45%</td>
            </tr>
            <tr>
              <td>+ fill=-4</td>
              <td>52.2MB</td>
              <td>~26MB</td>
              <td>50%</td>
            </tr>
            <tr>
              <td>+ 双重优化</td>
              <td>52.2MB</td>
              <td>~15MB</td>
              <td>71%</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    keyPoints: [
      'QuickList 内存 = QuickList结构 + 节点指针 + ZipList头部 + Entry数据',
      '启用压缩可节省 30-70% 内存，取决于数据类型',
      '小元素用大 fill（-4/-5），减少指针开销',
      '定期 LTRIM 防止内存无限增长',
      'MEMORY USAGE 命令可以精确测量单个 key 的内存'
    ]
  },
  {
    id: 11,
    title: '典型应用场景',
    videos: [
      { type: 'scenarios', title: '四大应用场景总览' },
      { type: 'scenario-queue', title: '消息队列实战' },
      { type: 'scenario-feed', title: '时间线/Feed实战' },
      { type: 'scenario-comments', title: '最新评论实战' },
      { type: 'scenario-rate-limit', title: '限流滑动窗口实战' },
      { type: 'config-recommendations', title: '场景化配置推荐' },
    ],
    content: (
      <>
        <h4>场景选择指南</h4>
        <p>QuickList 的 O(1) 头尾操作特性使其非常适合以下场景。不同的场景有不同的访问模式，需要不同的配置策略。</p>

        <h4>场景 1：消息队列（高性能优先）</h4>
        <p>消息队列是 QuickList 最经典的应用场景，需要最低的延迟和最高的吞吐量。</p>
        <CodeBlock language="redis" code={`# 生产者：持续写入任务
redis> RPUSH queue:tasks '{"id": 1, "type": "email", "to": "user@example.com"}'
redis> RPUSH queue:tasks '{"id": 2, "type": "sms", "to": "13800138000"}'
redis> RPUSH queue:tasks '{"id": 3, "type": "push", "to": "device_token"}'

# 消费者：阻塞读取（BRPOP 是 RPOP 的阻塞版本）
redis> BLPOP queue:tasks 0   # 0 表示永久阻塞
# 返回：'{"id": 1, "type": "email", "to": "user@example.com"}'

# 消费者处理完成后确认（可选）
redis> LPUSH queue:processed "task_1_done"`} />

        <div className={styles.diagram}>
          <pre>{`
消息队列数据流：

  生产者                     Redis                      消费者
    │                         │                         │
    │  RPUSH queue:tasks      │                         │
    ├────────────────────────►│                         │
    │                         │                         │
    │                         │   BLPOP queue:tasks     │
    │                         │◄────────────────────────┤
    │                         │                         │
    │                         │   返回任务数据          │
    │                         ├────────────────────────►│
    │                         │                         │
    │                         │                         ▼
    │                         │                    处理任务
    │                         │                         │
    │                         │                         │`}</pre>
        </div>

        <h4>场景 2：用户时间线/Feed（内存优化优先）</h4>
        <p>时间线场景特点是写入频繁（LPUSH），读取相对较少，适合启用压缩节省内存。</p>
        <CodeBlock language="redis" code={`# 用户浏览记录时间线
redis> LPUSH user:feed:12345 "2024-01-15:visited:/products/123"
redis> LPUSH user:feed:12345 "2024-01-15:visited:/cart"
redis> LPUSH user:feed:12345 "2024-01-15:searched:iphone"

# 获取最近浏览的 20 条
redis> LRANGE user:feed:12345 0 19

# 定期归档：只保留最近 7 天的记录
# 假设每天最多 100 条，7 天最多 700 条
redis> LTRIM user:feed:12345 0 699

# 推荐 Redis 配置：
# list-max-ziplist-size -4  (32KB 节点，存储更多小元素)
# list-compress-depth 1     (两端各 1 个不压缩，访问头部快)`} />

        <h4>场景 3：最新评论列表（分页友好）</h4>
        <p>评论列表需要支持分页浏览，LRANGE 是主要读取方式。</p>
        <CodeBlock language="redis" code={`# 发布新评论（插入到头部）
redis> LPUSH post:5678:comments '{"user": "alice", "content": "写得真好！", "time": 1705312200}'
redis> LPUSH post:5678:comments '{"user": "bob", "content": "学到了", "time": 1705312300}'
redis> LPUSH post:5678:comments '{"user": "charlie", "content": "赞一个", "time": 1705312400}'

# 分页获取（第 1 页，每页 20 条）
redis> LRANGE post:5678:comments 0 19

# 分页获取（第 2 页）
redis> LRANGE post:5678:comments 20 39

# 用户删除自己的评论（需要 LREM）
redis> LREM post:5678:comments 1 '{"user": "alice", "content": "写得真好！", "time": 1705312200}'

# 定期清理：只保留最新 500 条评论
redis> LTRIM post:5678:comments 0 499

# 推荐 Redis 配置：
# list-max-ziplist-size -2  (8KB 节点，平衡性能)
# list-compress-depth 2      (两端各 2 个不压缩，方便分页访问)`} />

        <h4>场景 4：限流滑动窗口（精确控制）</h4>
        <p>滑动窗口限流需要精确的时间控制，通常使用时间戳作为元素。</p>
        <CodeBlock language="redis" code={`# 记录用户请求时间戳
redis> LPUSH rate:limit:user:8888 "1705312400000"  # 当前毫秒时间戳
redis> LPUSH rate:limit:user:8888 "1705312399000"
redis> LPUSH rate:limit:user:8888 "1705312398000"

# 定期清理：只保留最近 60 秒的记录
redis> LTRIM rate:limit:user:8888 0 99

# 统计时间窗口内的请求数
redis> LRANGE rate:limit:user:8888 0 -1
1) "1705312400000"
2) "1705312399000"
3) "1705312398000"

# 计算实际请求数（需要在应用层处理）
# 当前时间：1705312400000
# 60 秒前：1705312340000
# 过滤出 > 1705312340000 的记录 = 3 个请求`} />

        <div className={styles.advantage}>
          <p>💡 <strong>完整的限流 Lua 脚本</strong>（原子操作，保证并发安全）：</p>
          <CodeBlock language="lua" code={`-- 滑动窗口限流 Lua 脚本
local key = KEYS[1]           -- rate limit key
local window = tonumber(ARGV[1])  -- 窗口大小（毫秒）
local limit = tonumber(ARGV[2])   -- 限制次数
local now = tonumber(ARGV[3])     -- 当前时间戳

-- 删除窗口外的旧记录
local window_start = now - window
redis.call('LTRIM', key, 0, limit - 1)

-- 获取当前请求数
local count = redis.call('LLEN', key)

if count < limit then
    -- 未超限，记录请求
    redis.call('LPUSH', key, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000) + 1)
    return 1  -- 允许
else
    return 0  -- 拒绝
end`} />
        </div>

        <h4>场景 5：实时排行榜（有序需求）</h4>
        <p>虽然 List 不如 Sorted Set 适合排行榜，但可以实现简单的 TOP N 功能。</p>
        <CodeBlock language="redis" code={`# 更新用户得分
redis> LPUSH leaderboard:game1 '{"user_id": 123, "score": 9500}'
redis> LPUSH leaderboard:game1 '{"user_id": 456, "score": 8700}'
redis> LPUSH leaderboard:game1 '{"user_id": 789, "score": 9200}'

# 获取 TOP 10
redis> LRANGE leaderboard:game1 0 9

# 注意：List 本身不排序，需要应用层处理
# 更推荐使用 Sorted Set：ZADD + ZREVRANGE`} />

        <h4>配置推荐总结表</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>场景</th>
              <th>fill</th>
              <th>compress</th>
              <th>理由</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>消息队列</td>
              <td>-2 (8KB)</td>
              <td>0</td>
              <td>不压缩保证最低延迟</td>
            </tr>
            <tr>
              <td>用户时间线</td>
              <td>-4 (32KB)</td>
              <td>1</td>
              <td>小元素批量存储 + 中间压缩</td>
            </tr>
            <tr>
              <td>最新评论</td>
              <td>-2 (8KB)</td>
              <td>2</td>
              <td>需要访问中间节点，不压缩头部</td>
            </tr>
            <tr>
              <td>限流滑动窗口</td>
              <td>-5 (64KB)</td>
              <td>0</td>
              <td>极小元素，最大节点</td>
            </tr>
            <tr>
              <td>任务队列</td>
              <td>-2 (8KB)</td>
              <td>0</td>
              <td>高性能优先</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
    keyPoints: [
      '消息队列：RPUSH + LPOP/BLPOP，O(1) 高性能，不压缩',
      '时间线：LPUSH + LTRIM + compress，小元素启用压缩',
      '分页列表：LRANGE 分页 + LTRIM 限制长度',
      '限流滑动窗口：时间戳 + Lua 脚本实现原子限流',
      '场景化配置：高频访问不压缩，冷数据启用压缩'
    ]
  },
  {
    id: 12,
    title: '性能调优总结',
    videos: [
      { type: 'performance', title: '性能调优核心要点' },
      { type: 'performance-table', title: '操作复杂度完整表' },
      { type: 'config-recommendations', title: '配置推荐总结' },
      { type: 'comparison', title: '三种数据结构性能对比' },
      { type: 'memory', title: '内存与性能权衡' },
    ],
    content: (
      <>
        <h4>QuickList 完整性能图谱</h4>
        <p>理解 QuickList 的性能特点是调优的基础。不同的操作有不同的复杂度，选择合适的操作可以显著提升性能。</p>

        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>操作</th>
              <th>复杂度</th>
              <th>触发分裂/合并</th>
              <th>性能影响</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>LPUSH</td>
              <td>O(1)</td>
              <td>可能分裂</td>
              <td>极快</td>
            </tr>
            <tr>
              <td>RPUSH</td>
              <td>O(1)</td>
              <td>可能分裂</td>
              <td>极快</td>
            </tr>
            <tr>
              <td>LPOP</td>
              <td>O(1)</td>
              <td>可能合并</td>
              <td>极快</td>
            </tr>
            <tr>
              <td>RPOP</td>
              <td>O(1)</td>
              <td>可能合并</td>
              <td>极快</td>
            </tr>
            <tr>
              <td>LLEN</td>
              <td>O(1)</td>
              <td>无</td>
              <td>极快</td>
            </tr>
            <tr>
              <td>LINDEX</td>
              <td>O(N)</td>
              <td>无</td>
              <td>慢</td>
            </tr>
            <tr>
              <td>LRANGE</td>
              <td>O(N)</td>
              <td>无</td>
              <td>慢</td>
            </tr>
            <tr>
              <td>LINSERT</td>
              <td>O(N)</td>
              <td>可能分裂</td>
              <td>很慢</td>
            </tr>
            <tr>
              <td>LREM</td>
              <td>O(N)</td>
              <td>可能合并</td>
              <td>很慢</td>
            </tr>
            <tr>
              <td>LTRIM</td>
              <td>O(N)</td>
              <td>可能合并</td>
              <td>慢</td>
            </tr>
          </tbody>
        </table>

        <h4>fill 和 compress 配置决策树</h4>
        <div className={styles.diagram}>
          <pre>{`
配置参数选择决策树：

根据元素大小选择 fill：
│
├─ 元素 &gt; 1KB（大元素）
│   └─ fill = -1 (4KB)
│       原因：大元素占用空间大，小节点可避免空间浪费
│
├─ 元素 100B ~ 1KB（中等元素）
│   └─ fill = -2 (8KB) 默认
│       原因：平衡分裂频率和内存效率
│
└─ 元素 &lt; 100B（小元素）
    ├─ 存储少量（&lt;10000）
    │   └─ fill = -2 (8KB)
    │
    └─ 存储大量（&gt;100000）
        └─ fill = -4 或 -5 (32KB/64KB)
            原因：小元素批量存储，大节点减少指针开销


根据访问模式选择 compress：
│
├─ 频繁访问中间节点（如分页浏览）
│   └─ compress = 0 或 compress = 2
│       原因：保护热点数据不被压缩/解压
│
├─ 中间节点访问少（如消息队列）
│   └─ compress = 0
│       原因：所有节点都是热点，不压缩保证性能
│
└─ 中间节点几乎不访问（如时间线归档）
    └─ compress = 1 或 compress = 2
        原因：最大化压缩节省内存`}</pre>
        </div>

        <h4>Redis 配置完整推荐</h4>
        <CodeBlock language="bash" code={`# redis.conf 全局配置

# 默认配置（适合大多数场景）
list-max-ziplist-size -2
list-compress-depth 0

# 针对特定场景的配置
# 场景 1：高性能消息队列
list-max-ziplist-size -2
list-compress-depth 0

# 场景 2：内存优化型时间线
list-max-ziplist-size -4
list-compress-depth 1

# 场景 3：大元素队列
list-max-ziplist-size -1
list-compress-depth 0

# 场景 4：超长列表（>100万元素）
list-max-ziplist-size -5
list-compress-depth 2

# 注意：CONFIG SET 只对新创建的列表生效
# 已有列表需要重新创建才能应用新参数
redis> CONFIG SET list-max-ziplist-size -4
redis> DEL old_list
redis> LPUSH old_list ...  # 重新创建`} />

        <h4>性能问题排查清单</h4>
        <CodeBlock language="bash" code={`# 问题 1：LPUSH/RPOP 突然变慢
可能原因：节点分裂/合并
排查：
  redis> DEBUG OBJECT mylist
  # 查看 quicklistNodes 数量是否异常多

解决方案：
  - 检查 fill 参数是否合适
  - 考虑增加 fill 值减少节点数

# 问题 2：内存占用过高
可能原因：节点数过多或未压缩
排查：
  redis> MEMORY USAGE mylist
  redis> DEBUG OBJECT mylist

解决方案：
  - 启用 compress
  - 调整 fill 参数
  - 执行 LTRIM 清理多余元素

# 问题 3：列表增长失控
可能原因：未设置长度限制
排查：
  redis> LLEN mylist

解决方案：
  - 结合 LTRIM 限制长度
  - 使用 EXPIRE 设置过期时间`} />

        <h4>QuickList vs 其他数据结构对比</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>特性</th>
              <th>QuickList</th>
              <th>纯 ZipList</th>
              <th>纯 LinkedList</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>头插 O(1)</td>
              <td>✅</td>
              <td>❌ O(N)</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>尾插 O(1)</td>
              <td>✅</td>
              <td>✅</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>内存效率</td>
              <td>高</td>
              <td>最高</td>
              <td>低</td>
            </tr>
            <tr>
              <td>中间插入</td>
              <td>O(N)</td>
              <td>O(N)</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>节点分裂</td>
              <td>有</td>
              <td>N/A</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>节点合并</td>
              <td>有</td>
              <td>N/A</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>适用场景</td>
              <td>通用</td>
              <td>小列表</td>
              <td>大元素列表</td>
            </tr>
          </tbody>
        </table>

        <h4>最佳实践总结</h4>
        <ul>
          <li>✅ <strong>优先使用 O(1) 操作</strong>：LPUSH/RPUSH/LPOP/RPOP/LLEN 都是常量时间</li>
          <li>✅ <strong>避免 LINDEX 随机访问</strong>：如果需要频繁随机访问，考虑 Sorted Set</li>
          <li>✅ <strong>合理设置 fill</strong>：大元素用小 fill，小元素用大 fill</li>
          <li>✅ <strong>启用 compress 节省内存</strong>：中间节点不常访问时效果显著</li>
          <li>✅ <strong>使用 LTRIM 防止无限增长</strong>：结合 LPUSH/RPUSH 实现固定大小队列</li>
          <li>✅ <strong>监控 MEMORY USAGE</strong>：定期检查内存占用，及时优化</li>
          <li>⚠️ <strong>慎用 LINSERT</strong>：中间插入是 O(N) + 查找开销，尽量避免</li>
          <li>⚠️ <strong>慎用 LRANGE 大范围</strong>：范围过大会导致长时间阻塞</li>
        </ul>

        <h4>学习路径建议</h4>
        <CodeBlock language="text" code={`深入学习 QuickList 的路径：

1. 入门：理解 QuickList = 双向链表 + ZipList
2. 进阶：掌握 fill 和 compress 参数的作用
3. 实践：在真实项目中选择合适的场景使用
4. 优化：根据数据特点调优配置参数
5. 深入：理解分裂/合并的触发条件和代价
6. 精通：能够在生产环境排查和解决 QuickList 相关问题`} />
      </>
    ),
    keyPoints: [
      'LPUSH/RPUSH/LPOP/RPOP/LLEN 都是 O(1)，应优先使用',
      'LINDEX/LRANGE/LINSERT/LREM/LTRIM 都是 O(N)，应限制使用频率',
      'fill 参数根据元素大小选择：大元素用小 fill，小元素用大 fill',
      'compress 参数根据访问模式选择：热点数据不压缩，冷数据启用压缩',
      '定期使用 MEMORY USAGE 监控内存，LTRIM 控制长度'
    ]
  }
];

export const TutorialPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      goToStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };
  
  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  
  return (
    <div className={styles.tutorialPage}>
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>教程目录</h3>
        <div className={styles.stepList}>
          {tutorialSteps.map((s, index) => (
            <div
              key={s.id}
              className={`${styles.sidebarStep} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''}`}
              onClick={() => goToStep(index)}
            >
              <div className={styles.stepNumber}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className={styles.stepTitle}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        
        <div className={styles.stepHeader}>
          <div className={styles.stepBadge}>第 {currentStep + 1} 步 / 共 {tutorialSteps.length} 步</div>
          <h1 className={styles.stepTitle}>{step.title}</h1>
        </div>
        
        <div className={styles.stepContent}>
          {step.content}
        </div>

        {step.videos && step.videos.length > 0 && (
          <div className={styles.videoSection}>
            <MultiAnimationShowcase
              videos={step.videos}
              defaultTitle={step.videoTitle}
            />
          </div>
        )}

        <div className={styles.keyPoints}>
          <h4>🎯 关键要点</h4>
          <ul>
            {step.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
        
        <div className={styles.navigation}>
          <button 
            className={styles.prevButton} 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← 上一步
          </button>
          
          {currentStep === tutorialSteps.length - 1 ? (
            <a href="/playground" className={styles.finishButton}>
              完成教程，开始实践 →
            </a>
          ) : (
            <button className={styles.nextButton} onClick={nextStep}>
              下一步 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
