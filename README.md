# Redis QuickList 可视化演示系统

一个交互式的Redis QuickList数据结构可视化教育平台，通过动画演示其作为ZipList双向链表的混合结构、节点分裂合并机制和内存效率优化策略。

## 功能特点

- 🎨 **直观可视化**: 实时展示QuickList的内部结构和操作过程
- 🎬 **动画演示**: 详细的节点分裂、合并、压缩动画
- ⚙️ **配置实验**: 调整fill、compress等参数观察影响
- 📊 **性能分析**: 实时监控内存使用和操作性能
- 🧪 **场景测试**: 预设多种工作负载场景
- 📚 **教育内容**: 详细的设计原理和最佳实践指南

## 技术栈

- **TypeScript**: 类型安全开发
- **React**: 组件化UI
- **D3.js**: 数据可视化
- **Framer Motion**: 流畅动画
- **Zustand**: 状态管理
- **Vite**: 快速构建工具

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── layout/         # 布局组件
│   ├── visualization/  # 可视化组件
│   ├── control/        # 控制面板组件
│   └── common/         # 通用组件
├── types/              # TypeScript类型定义
├── store/              # Zustand状态管理
├── hooks/              # 自定义React Hooks
├── utils/              # 工具函数
└── styles/             # 全局样式
```

## 核心概念

### QuickList结构

QuickList是Redis中List类型的底层实现之一，它巧妙地结合了：
- **ZipList**: 紧凑的内存表示，适合小数据量
- **双向链表**: 灵活的结构，支持快速头尾操作

### 关键参数

- **fill**: 每个节点的最大元素数量，影响节点分裂时机
- **compress**: 压缩深度，0表示不压缩，N表示头尾各N个节点不压缩

### 操作类型

- 基础操作: pushFront, pushBack, popFront, popBack
- 高级操作: insertAt, deleteAt, 节点分裂/合并
- 优化操作: 压缩/解压、重新平衡

## 学习路径

1. 从基础的创建和插入操作开始
2. 观察节点分裂和合并的触发条件
3. 实验不同的fill和compress配置
4. 运行预设的性能测试场景
5. 分析不同工作负载下的最优配置

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
