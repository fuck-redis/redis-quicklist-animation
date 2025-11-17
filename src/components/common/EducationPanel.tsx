import React from 'react';
import styles from './EducationPanel.module.css';

export const EducationPanel: React.FC = () => {
  return (
    <div className={styles.educationPanel}>
      <h2 className={styles.title}>📚 Redis QuickList 数据结构详解</h2>
      
      <section className={styles.section}>
        <h3>💡 什么是QuickList？</h3>
        <p>
          QuickList是Redis 3.2版本引入的一种混合数据结构，它是Redis List类型的底层实现之一。
          QuickList巧妙地结合了<strong>双向链表</strong>和<strong>ZipList（压缩列表）</strong>的优势，
          在内存效率和操作性能之间取得了最佳平衡。
        </p>
        <div className={styles.highlight}>
          <strong>核心思想：</strong>用双向链表连接多个ZipList节点，每个节点存储多个元素。
        </div>
      </section>

      <section className={styles.section}>
        <h3>🎯 为什么需要QuickList？</h3>
        <div className={styles.comparison}>
          <div className={styles.comparisonItem}>
            <h4>🔴 传统双向链表的问题</h4>
            <ul>
              <li>每个节点需要prev和next指针（16字节）</li>
              <li>每个元素独立分配内存，碎片多</li>
              <li>指针开销占比大，内存利用率低</li>
            </ul>
          </div>
          <div className={styles.comparisonItem}>
            <h4>🟡 ZipList的问题</h4>
            <ul>
              <li>连续内存存储，插入删除需要大量数据移动</li>
              <li>数据量大时，O(n)操作性能差</li>
              <li>需要频繁realloc，影响性能</li>
            </ul>
          </div>
          <div className={styles.comparisonItem}>
            <h4>🟢 QuickList的优势</h4>
            <ul>
              <li>小规模ZipList保证内存紧凑</li>
              <li>链表结构支持快速头尾操作</li>
              <li>可配置参数适应不同场景</li>
              <li>支持LZF压缩进一步节省内存</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>⚙️ 关键配置参数</h3>
        <div className={styles.configExplain}>
          <div className={styles.paramItem}>
            <h4>list-max-ziplist-size (fill)</h4>
            <p>控制每个QuickList节点中ZipList的最大大小：</p>
            <ul>
              <li><code>fill = -1</code>: 每个ZipList最大4KB</li>
              <li><code>fill = -2</code>: 每个ZipList最大8KB（默认）</li>
              <li><code>fill = -3</code>: 每个ZipList最大16KB</li>
              <li><code>fill = -4</code>: 每个ZipList最大32KB</li>
              <li><code>fill = -5</code>: 每个ZipList最大64KB</li>
              <li><code>fill &gt; 0</code>: 表示每个ZipList最多包含的元素个数</li>
            </ul>
            <div className={styles.tip}>
              💡 <strong>建议：</strong>小元素用较大的fill值，大元素用较小的fill值
            </div>
          </div>

          <div className={styles.paramItem}>
            <h4>list-compress-depth (compress)</h4>
            <p>控制QuickList两端不压缩的节点个数：</p>
            <ul>
              <li><code>compress = 0</code>: 不压缩（默认）</li>
              <li><code>compress = 1</code>: 头尾各1个节点不压缩</li>
              <li><code>compress = 2</code>: 头尾各2个节点不压缩</li>
            </ul>
            <div className={styles.tip}>
              💡 <strong>原理：</strong>List常用于队列，频繁访问头尾，中间数据可压缩节省内存
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>🔧 Redis中的使用</h3>
        <div className={styles.codeBlock}>
          <h4>常见List命令如何使用QuickList：</h4>
          <pre>{`# LPUSH/RPUSH - 头尾插入
LPUSH mylist "element1"    # 在QuickList头部节点插入
RPUSH mylist "element2"    # 在QuickList尾部节点插入

# LPOP/RPOP - 头尾弹出  
LPOP mylist                # 从头部节点弹出
RPOP mylist                # 从尾部节点弹出

# LINDEX - 按索引访问
LINDEX mylist 10           # QuickList遍历节点找到第10个元素

# LINSERT - 插入元素
LINSERT mylist BEFORE "pivot" "new"  # 可能触发节点分裂

# 查看内存使用
MEMORY USAGE mylist        # 查看QuickList实际内存占用`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h3>🎬 核心操作机制</h3>
        <div className={styles.mechanism}>
          <div className={styles.mechanismItem}>
            <h4>🔄 节点分裂（Split）</h4>
            <p><strong>触发条件：</strong>当向节点插入元素导致超过fill限制时</p>
            <p><strong>操作流程：</strong></p>
            <ol>
              <li>选择分裂点（通常在中间）</li>
              <li>创建新节点，转移后半部分元素</li>
              <li>更新链表指针关系</li>
              <li>重新计算节点内存大小</li>
            </ol>
          </div>

          <div className={styles.mechanismItem}>
            <h4>🔗 节点合并（Merge）</h4>
            <p><strong>触发条件：</strong>删除元素后，相邻节点可合并且不超过fill限制</p>
            <p><strong>操作流程：</strong></p>
            <ol>
              <li>检查相邻节点元素总数</li>
              <li>将一个节点的元素转移到另一个</li>
              <li>删除空节点，更新指针</li>
              <li>减少节点数量，提高遍历效率</li>
            </ol>
          </div>

          <div className={styles.mechanismItem}>
            <h4>🗜️ 节点压缩（Compress）</h4>
            <p><strong>触发条件：</strong>根据compress配置，对非头尾节点压缩</p>
            <p><strong>压缩方式：</strong>使用LZF算法压缩ZipList数据</p>
            <p><strong>效果：</strong>通常可节省30%-70%内存，访问时需要解压</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>📊 性能特性</h3>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th>操作</th>
              <th>时间复杂度</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>LPUSH/RPUSH</td>
              <td>O(1)</td>
              <td>直接在头尾节点操作，可能触发分裂</td>
            </tr>
            <tr>
              <td>LPOP/RPOP</td>
              <td>O(1)</td>
              <td>直接从头尾节点弹出，可能触发合并</td>
            </tr>
            <tr>
              <td>LINDEX</td>
              <td>O(N)</td>
              <td>需要遍历节点和节点内元素</td>
            </tr>
            <tr>
              <td>LINSERT</td>
              <td>O(N)</td>
              <td>定位+插入，可能触发分裂</td>
            </tr>
            <tr>
              <td>LLEN</td>
              <td>O(1)</td>
              <td>QuickList维护总元素计数</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h3>🎯 最佳实践</h3>
        <div className={styles.bestPractices}>
          <div className={styles.practice}>
            <h4>✅ 推荐场景</h4>
            <ul>
              <li>消息队列：频繁的头尾操作</li>
              <li>时间线列表：按时间排序的数据</li>
              <li>任务队列：FIFO或LIFO模式</li>
              <li>最近访问记录：固定大小的滑动窗口</li>
            </ul>
          </div>

          <div className={styles.practice}>
            <h4>⚡ 性能优化建议</h4>
            <ul>
              <li>根据元素大小调整fill参数</li>
              <li>队列场景考虑启用compress</li>
              <li>避免频繁的中间位置插入删除</li>
              <li>大数据集考虑使用Stream类型</li>
            </ul>
          </div>

          <div className={styles.practice}>
            <h4>⚠️ 注意事项</h4>
            <ul>
              <li>压缩会增加CPU开销，权衡内存和性能</li>
              <li>LINDEX等随机访问操作性能较差</li>
              <li>fill值过大会影响分裂合并效率</li>
              <li>fill值过小会增加内存开销</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>🔍 实际应用示例</h3>
        <div className={styles.example}>
          <h4>场景1：消息队列</h4>
          <pre className={styles.code}>{`# 生产者：向队列尾部推送消息
RPUSH message_queue "task1"
RPUSH message_queue "task2"

# 消费者：从队列头部取消息
BLPOP message_queue 0    # 阻塞式弹出

# 配置建议：
list-max-ziplist-size -2  # 8KB节点
list-compress-depth 0     # 不压缩，保证性能`}</pre>
        </div>

        <div className={styles.example}>
          <h4>场景2：用户操作历史（启用压缩）</h4>
          <pre className={styles.code}>{`# 记录用户操作
LPUSH user:1001:history "login"
LPUSH user:1001:history "view_page"
LPUSH user:1001:history "purchase"

# 获取最近10条
LRANGE user:1001:history 0 9

# 配置建议：
list-max-ziplist-size -1  # 4KB节点
list-compress-depth 2     # 头尾各2个不压缩`}</pre>
        </div>
      </section>
    </div>
  );
};
