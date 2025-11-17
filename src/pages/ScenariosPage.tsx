import React from 'react';
import { ScenarioLab } from '../components/control/ScenarioLab';
import styles from './ScenariosPage.module.css';

export const ScenariosPage: React.FC = () => {
  return (
    <div className={styles.scenariosPage}>
      <div className={styles.pageHeader}>
        <h1>🧪 场景测试实验室</h1>
        <p>在真实应用场景中测试 QuickList 的性能表现，观察不同配置参数的影响</p>
      </div>
      
      <div className={styles.introSection}>
        <div className={styles.introCard}>
          <div className={styles.cardIcon}>🎯</div>
          <h3>测试目标</h3>
          <p>通过模拟真实的业务场景，帮助你理解 QuickList 在不同工作负载下的表现，学会如何选择最优配置参数。</p>
        </div>
        
        <div className={styles.introCard}>
          <div className={styles.cardIcon}>📊</div>
          <h3>性能指标</h3>
          <p>关注操作耗时、内存占用、节点分裂次数等关键指标，深入理解 QuickList 的运行机制。</p>
        </div>
        
        <div className={styles.introCard}>
          <div className={styles.cardIcon}>⚙️</div>
          <h3>参数优化</h3>
          <p>对比不同 fill 和 compress 参数下的表现，找到最适合你业务场景的配置方案。</p>
        </div>
      </div>
      
      <div className={styles.scenariosIntro}>
        <h2>📝 测试场景说明</h2>
        <div className={styles.scenarioList}>
          <div className={styles.scenarioItem}>
            <div className={styles.scenarioHeader}>
              <span className={styles.scenarioIcon}>📨</span>
              <h3>消息队列场景</h3>
            </div>
            <div className={styles.scenarioDesc}>
              <p><strong>模拟场景：</strong>高并发的消息队列系统</p>
              <p><strong>操作模式：</strong>生产者持续向队列尾部插入消息，消费者从头部取出消息</p>
              <p><strong>特点：</strong>
                • 高频头尾操作（RPUSH + LPOP）<br/>
                • 元素生命周期短<br/>
                • 对延迟敏感
              </p>
              <p><strong>优化建议：</strong>不启用压缩，保证最低延迟；使用默认 fill=-2</p>
            </div>
          </div>
          
          <div className={styles.scenarioItem}>
            <div className={styles.scenarioHeader}>
              <span className={styles.scenarioIcon}>📱</span>
              <h3>时间线数据场景</h3>
            </div>
            <div className={styles.scenarioDesc}>
              <p><strong>模拟场景：</strong>用户动态、操作历史等时间线数据</p>
              <p><strong>操作模式：</strong>新数据插入头部，读取最近N条，定期清理旧数据</p>
              <p><strong>特点：</strong>
                • 新数据频繁访问<br/>
                • 旧数据访问少<br/>
                • 数据量大
              </p>
              <p><strong>优化建议：</strong>启用压缩（compress=1或2），中间节点压缩节省内存</p>
            </div>
          </div>
          
          <div className={styles.scenarioItem}>
            <div className={styles.scenarioHeader}>
              <span className={styles.scenarioIcon}>💾</span>
              <h3>大数据量压力测试</h3>
            </div>
            <div className={styles.scenarioDesc}>
              <p><strong>模拟场景：</strong>百万级数据存储和操作</p>
              <p><strong>操作模式：</strong>批量插入大量元素，测试分裂、合并、内存表现</p>
              <p><strong>特点：</strong>
                • 极大数据量<br/>
                • 内存敏感<br/>
                • 考验节点管理
              </p>
              <p><strong>优化建议：</strong>根据元素大小选择合适的 fill 值，小元素用大fill</p>
            </div>
          </div>
          
          <div className={styles.scenarioItem}>
            <div className={styles.scenarioHeader}>
              <span className={styles.scenarioIcon}>🗜️</span>
              <h3>压缩效果测试</h3>
            </div>
            <div className={styles.scenarioDesc}>
              <p><strong>模拟场景：</strong>对比压缩前后的内存占用</p>
              <p><strong>操作模式：</strong>插入各种类型数据，测试不同compress参数的效果</p>
              <p><strong>特点：</strong>
                • 关注内存优化<br/>
                • 测试CPU开销<br/>
                • 对比不同数据类型
              </p>
              <p><strong>优化建议：</strong>字符串数据压缩效果好，小整数压缩效果差</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.howToUse}>
        <h2>💡 如何使用</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div>
              <h4>选择测试场景</h4>
              <p>在下方选择一个感兴趣的业务场景</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div>
              <h4>调整配置参数</h4>
              <p>修改 fill 和 compress 参数，尝试不同配置</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div>
              <h4>运行测试</h4>
              <p>点击运行按钮，观察实时性能指标</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div>
              <h4>分析结果</h4>
              <p>对比不同配置下的表现，找到最优方案</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        <ScenarioLab />
      </div>
      
      <div className={styles.tips}>
        <h3>⚡ 性能调优建议</h3>
        <div className={styles.tipsList}>
          <div className={styles.tip}>
            <strong>消息队列：</strong>
            <span>不压缩 + 默认fill，保证最低延迟</span>
          </div>
          <div className={styles.tip}>
            <strong>时间线数据：</strong>
            <span>启用压缩 + 小fill，平衡内存和性能</span>
          </div>
          <div className={styles.tip}>
            <strong>大数据量：</strong>
            <span>根据元素大小调整fill，小元素用大fill</span>
          </div>
          <div className={styles.tip}>
            <strong>内存敏感：</strong>
            <span>启用compress + 定期清理，最大化内存效率</span>
          </div>
        </div>
      </div>
    </div>
  );
};
