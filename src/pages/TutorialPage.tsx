import React, { useState } from 'react';
import styles from './TutorialPage.module.css';

interface TutorialStep {
  id: number;
  title: string;
  content: React.ReactNode;
  keyPoints: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: '什么是 QuickList？',
    content: (
      <>
        <p>QuickList 是 Redis 3.2 版本引入的一种<strong>混合数据结构</strong>，它是 Redis List 类型的底层实现。</p>
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
        <p>每个<strong>节点</strong>是一个双向链表节点，节点内部存储一个 <strong>ZipList</strong>，ZipList 中可以存储多个元素。</p>
      </>
    ),
    keyPoints: [
      'QuickList 是双向链表和 ZipList 的组合',
      '每个节点包含一个 ZipList',
      'ZipList 是连续内存块，存储多个元素',
      '节点之间通过指针连接成双向链表'
    ]
  },
  {
    id: 2,
    title: '为什么需要 QuickList？',
    content: (
      <>
        <h4>传统双向链表的问题</h4>
        <ul>
          <li><strong>内存碎片严重</strong>：每个元素单独分配内存</li>
          <li><strong>指针开销大</strong>：每个节点需要 prev 和 next 指针（16字节）</li>
          <li><strong>内存利用率低</strong>：小数据的指针开销占比很大</li>
        </ul>
        
        <h4>纯 ZipList 的问题</h4>
        <ul>
          <li><strong>插入/删除性能差</strong>：需要移动大量数据</li>
          <li><strong>频繁 realloc</strong>：连续内存扩展代价高</li>
          <li><strong>级联更新</strong>：可能触发整个列表的重新编码</li>
        </ul>
        
        <h4>QuickList 的优势</h4>
        <div className={styles.advantage}>
          <p>✅ <strong>平衡性能与内存</strong></p>
          <ul>
            <li>小规模 ZipList 保证内存紧凑</li>
            <li>链表结构支持快速头尾操作</li>
            <li>避免了纯 ZipList 的大规模数据移动</li>
            <li>避免了纯链表的高内存开销</li>
          </ul>
        </div>
      </>
    ),
    keyPoints: [
      '双向链表：指针开销大，但操作灵活',
      'ZipList：内存紧凑，但操作性能差',
      'QuickList：结合两者优势，平衡性能和内存',
      '通过配置参数适应不同场景'
    ]
  },
  {
    id: 3,
    title: 'ZipList 内部结构',
    content: (
      <>
        <p>在理解 QuickList 之前，我们需要先了解 <strong>ZipList</strong>。</p>
        
        <h4>ZipList 是什么？</h4>
        <p>ZipList 是一种<strong>紧凑的连续内存存储结构</strong>，通过特殊的编码方式减少内存占用。</p>
        
        <div className={styles.diagram}>
          <pre>{`
ZipList 内存布局：
┌────────┬────────┬─────────┬─────────┬─────────┬────────┐
│ zlbytes│ zltail │ zllen   │ entry1  │ entry2  │ zlend  │
│ (4字节)│ (4字节)│ (2字节) │         │         │ (1字节)│
└────────┴────────┴─────────┴─────────┴─────────┴────────┘`}</pre>
        </div>
        
        <h4>每个 Entry 的结构</h4>
        <pre className={styles.codeBlock}>{`
┌──────────────┬──────────┬─────────┐
│ prevlen      │ encoding │ data    │
│ (1或5字节)   │ (1-5字节)│ (变长)  │
└──────────────┴──────────┴─────────┘

• prevlen: 前一个entry的长度
• encoding: 当前entry的编码类型和长度
• data: 实际存储的数据`}</pre>
        
        <h4>智能编码</h4>
        <p>ZipList 会根据数据类型和大小选择最优编码：</p>
        <ul>
          <li><code>INT16</code>：小整数（-32768 ~ 32767）</li>
          <li><code>INT32</code>：中等整数</li>
          <li><code>INT64</code>：大整数</li>
          <li><code>STRING</code>：字符串，分多种长度编码</li>
        </ul>
      </>
    ),
    keyPoints: [
      'ZipList 是连续内存块',
      '通过智能编码减少内存占用',
      'Entry 之间紧密排列，无浪费',
      'prevlen 字段支持双向遍历'
    ]
  },
  {
    id: 4,
    title: '关键配置参数',
    content: (
      <>
        <h4>list-max-ziplist-size (fill)</h4>
        <p>控制每个 QuickList 节点中 ZipList 的大小限制。</p>
        
        <div className={styles.configTable}>
          <table>
            <thead>
              <tr>
                <th>配置值</th>
                <th>含义</th>
                <th>适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>fill = -1</code></td>
                <td>每个 ZipList 最大 4KB</td>
                <td>大元素场景</td>
              </tr>
              <tr>
                <td><code>fill = -2</code></td>
                <td>每个 ZipList 最大 8KB（默认）</td>
                <td>通用场景</td>
              </tr>
              <tr>
                <td><code>fill = -5</code></td>
                <td>每个 ZipList 最大 64KB</td>
                <td>小元素场景</td>
              </tr>
              <tr>
                <td><code>fill &gt; 0</code></td>
                <td>每个 ZipList 最多 N 个元素</td>
                <td>元素数量控制</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4>list-compress-depth (compress)</h4>
        <p>控制 QuickList 两端不压缩的节点个数。</p>
        
        <div className={styles.compressDemo}>
          <pre>{`
compress = 0: 全部不压缩
[Node0] <-> [Node1] <-> [Node2] <-> [Node3]

compress = 1: 头尾各1个不压缩
[Node0] <-> [Node1*] <-> [Node2*] <-> [Node3]
          (压缩)      (压缩)

compress = 2: 头尾各2个不压缩  
[Node0] <-> [Node1] <-> [Node2*] <-> [Node3] <-> [Node4]
                      (压缩)`}</pre>
        </div>
        
        <h4>为什么这样设计？</h4>
        <p>💡 <strong>List 常用于队列</strong>：频繁访问头尾，中间数据访问少。中间节点压缩可以节省内存，而不影响性能。</p>
      </>
    ),
    keyPoints: [
      'fill 参数控制节点大小，影响分裂频率',
      'compress 参数控制压缩策略',
      '小元素用大 fill，大元素用小 fill',
      '队列场景建议启用 compress'
    ]
  },
  {
    id: 5,
    title: '核心操作：节点分裂',
    content: (
      <>
        <h4>什么时候分裂？</h4>
        <p>当向节点插入元素，导致 ZipList 超过 <code>fill</code> 限制时触发分裂。</p>
        
        <h4>分裂过程</h4>
        <div className={styles.operationSteps}>
          <div className={styles.step}>
            <strong>Step 1</strong>
            <p>检测到节点元素数量超过 fill 限制</p>
            <pre>{`Node: [1,2,3,4,5,6,7,8,9,10,11] (fill=10, 超限！)`}</pre>
          </div>
          
          <div className={styles.step}>
            <strong>Step 2</strong>
            <p>在中间位置分裂</p>
            <pre>{`分裂点: 第5个元素后`}</pre>
          </div>
          
          <div className={styles.step}>
            <strong>Step 3</strong>
            <p>创建新节点，转移后半部分</p>
            <pre>{`
Node1: [1,2,3,4,5]
Node2: [6,7,8,9,10,11]`}</pre>
          </div>
          
          <div className={styles.step}>
            <strong>Step 4</strong>
            <p>更新链表指针</p>
            <pre>{`Node1 <-> Node2`}</pre>
          </div>
        </div>
        
        <h4>性能影响</h4>
        <ul>
          <li><strong>时间</strong>：O(n)，n 为被分裂节点的元素数</li>
          <li><strong>空间</strong>：新增一个节点的内存开销</li>
          <li><strong>优化</strong>：fill 值越大，分裂越少，但单次分裂代价越高</li>
        </ul>
      </>
    ),
    keyPoints: [
      '超过 fill 限制时触发分裂',
      '通常在中间位置分裂',
      '需要移动部分数据到新节点',
      'fill 值需要权衡分裂频率和代价'
    ]
  },
  {
    id: 6,
    title: '核心操作：节点合并',
    content: (
      <>
        <h4>什么时候合并？</h4>
        <p>当删除元素后，相邻两个节点的元素总数不超过 <code>fill</code> 限制时，可以合并。</p>
        
        <h4>合并过程</h4>
        <div className={styles.operationSteps}>
          <div className={styles.step}>
            <strong>Step 1</strong>
            <p>删除元素后，检查相邻节点</p>
            <pre>{`
Node1: [1,2,3]        (3个元素)
Node2: [4,5]          (2个元素)
总计: 5个元素 (小于 fill=10)`}</pre>
          </div>
          
          <div className={styles.step}>
            <strong>Step 2</strong>
            <p>将 Node2 的元素追加到 Node1</p>
            <pre>{`Node1: [1,2,3,4,5]`}</pre>
          </div>
          
          <div className={styles.step}>
            <strong>Step 3</strong>
            <p>删除 Node2，更新指针</p>
            <pre>{`Node1 <-> Node3`}</pre>
          </div>
        </div>
        
        <h4>为什么要合并？</h4>
        <ul>
          <li>✅ 减少节点数量，降低链表遍历开销</li>
          <li>✅ 提高内存利用率</li>
          <li>✅ 减少指针内存开销</li>
        </ul>
        
        <h4>合并时机</h4>
        <p>Redis 不会主动合并，只在以下情况考虑：</p>
        <ul>
          <li>执行 <code>LPOP</code> / <code>RPOP</code> 删除元素后</li>
          <li>节点元素很少时</li>
        </ul>
      </>
    ),
    keyPoints: [
      '删除元素后可能触发合并',
      '相邻节点总元素数需小于 fill',
      '合并减少节点数，提升遍历性能',
      'Redis 采用被动合并策略'
    ]
  },
  {
    id: 7,
    title: '核心操作：节点压缩',
    content: (
      <>
        <h4>压缩机制</h4>
        <p>QuickList 使用 <strong>LZF 算法</strong>压缩中间节点的 ZipList 数据。</p>
        
        <h4>压缩策略</h4>
        <p>根据 <code>compress</code> 参数，决定哪些节点需要压缩：</p>
        
        <div className={styles.compressStrategy}>
          <pre>{`
compress = 0: 不压缩
[N0] <-> [N1] <-> [N2] <-> [N3] <-> [N4]
 ❌      ❌       ❌       ❌       ❌

compress = 1: 头尾各1个不压缩
[N0] <-> [N1] <-> [N2] <-> [N3] <-> [N4]
 ❌      ✅        ✅       ✅       ❌

compress = 2: 头尾各2个不压缩
[N0] <-> [N1] <-> [N2] <-> [N3] <-> [N4]
 ❌      ❌       ✅        ❌       ❌`}</pre>
        </div>
        
        <h4>压缩效果</h4>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>数据类型</th>
              <th>压缩率</th>
              <th>CPU开销</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小整数</td>
              <td>低（已经很紧凑）</td>
              <td>低</td>
            </tr>
            <tr>
              <td>大整数</td>
              <td>中等（30-50%）</td>
              <td>中等</td>
            </tr>
            <tr>
              <td>字符串</td>
              <td>高（40-70%）</td>
              <td>较高</td>
            </tr>
            <tr>
              <td>JSON数据</td>
              <td>很高（60-80%）</td>
              <td>高</td>
            </tr>
          </tbody>
        </table>
        
        <h4>权衡考虑</h4>
        <ul>
          <li>💾 <strong>内存</strong>：压缩可节省 30-70% 内存</li>
          <li>⚡ <strong>性能</strong>：访问时需要解压，增加 CPU 开销</li>
          <li>🎯 <strong>策略</strong>：队列场景，中间数据访问少，适合压缩</li>
        </ul>
      </>
    ),
    keyPoints: [
      '使用 LZF 算法压缩 ZipList',
      '只压缩中间节点，保持头尾高性能',
      '压缩率通常 30-70%',
      '权衡内存节省与 CPU 开销'
    ]
  },
  {
    id: 8,
    title: 'Redis 命令实战',
    content: (
      <>
        <h4>常用 List 命令</h4>
        
        <div className={styles.commandSection}>
          <h5>1. 头尾插入（O(1)）</h5>
          <pre className={styles.codeBlock}>{`LPUSH mylist "element1"    # 头部插入
RPUSH mylist "element2"    # 尾部插入

# 插入到 QuickList 头/尾节点的 ZipList
# 可能触发节点分裂`}</pre>
        </div>
        
        <div className={styles.commandSection}>
          <h5>2. 头尾弹出（O(1)）</h5>
          <pre className={styles.codeBlock}>{`LPOP mylist     # 从头部弹出
RPOP mylist     # 从尾部弹出

# 从头/尾节点弹出元素
# 节点为空时删除节点
# 可能触发节点合并`}</pre>
        </div>
        
        <div className={styles.commandSection}>
          <h5>3. 按索引访问（O(N)）</h5>
          <pre className={styles.codeBlock}>{`LINDEX mylist 10    # 获取第10个元素

# 需要遍历 QuickList 节点
# 找到包含目标索引的节点
# 再在 ZipList 中定位元素`}</pre>
        </div>
        
        <div className={styles.commandSection}>
          <h5>4. 范围查询（O(N)）</h5>
          <pre className={styles.codeBlock}>{`LRANGE mylist 0 9    # 获取前10个元素

# 遍历节点，收集元素
# 可能跨越多个节点`}</pre>
        </div>
        
        <div className={styles.commandSection}>
          <h5>5. 插入元素（O(N)）</h5>
          <pre className={styles.codeBlock}>{`LINSERT mylist BEFORE "pivot" "new"

# 查找 pivot 位置
# 在 ZipList 中插入元素
# 可能触发节点分裂`}</pre>
        </div>
        
        <h4>性能建议</h4>
        <ul>
          <li>✅ <strong>推荐</strong>：LPUSH、RPUSH、LPOP、RPOP（O(1)）</li>
          <li>⚠️ <strong>慎用</strong>：LINDEX、LRANGE（O(N)）</li>
          <li>❌ <strong>避免</strong>：中间位置频繁 LINSERT</li>
        </ul>
      </>
    ),
    keyPoints: [
      '头尾操作是 O(1)，性能优秀',
      '随机访问是 O(N)，性能较差',
      'QuickList 适合队列、栈场景',
      '不适合随机访问场景'
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
