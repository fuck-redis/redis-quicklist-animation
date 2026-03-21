import React, { useState, useEffect, useRef } from 'react';
import styles from './AnimationShowcase.module.css';

interface AnimationShowcaseProps {
	animationType: 'overview' | 'split' | 'compression' | 'merge' | 'lpush' | 'rpush' | 'lpop' | 'rpop' | 'ziplist' | 'comparison' | 'fillconfig' | 'linsert' | 'memory' | 'scenarios' | 'performance';
	title: string;
}

export const AnimationShowcase: React.FC<AnimationShowcaseProps> = ({
	animationType,
	title,
}) => {
	const [frame, setFrame] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const fps = 30;
	const duration = animationType === 'ziplist' ? 180 : 120;

	useEffect(() => {
		if (isPlaying) {
			frameRef.current = setInterval(() => {
				setFrame((f) => (f + 1) % duration);
			}, 1000 / fps);
		} else {
			if (frameRef.current) {
				clearInterval(frameRef.current);
			}
		}
		return () => {
			if (frameRef.current) {
				clearInterval(frameRef.current);
			}
		};
	}, [isPlaying, duration]);

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleReset = () => {
		setFrame(0);
		setIsPlaying(false);
	};

	return (
		<div className={styles.showcase}>
			<div className={styles.header}>
				<h3>{title}</h3>
				<div className={styles.controls}>
					<button onClick={handleReset} title="重播">
						⏮️
					</button>
					<button onClick={handlePlayPause} title={isPlaying ? '暂停' : '播放'}>
						{isPlaying ? '⏸️' : '▶️'}
					</button>
				</div>
			</div>

			<div className={styles.canvas}>
				<AnimationCanvas animationType={animationType} frame={frame} />
			</div>

			<div className={styles.progress}>
				<div
					className={styles.progressBar}
					style={{ width: `${(frame / duration) * 100}%` }}
				/>
			</div>
		</div>
	);
};

interface AnimationCanvasProps {
	animationType: string;
	frame: number;
}

const AnimationCanvas: React.FC<AnimationCanvasProps> = ({ animationType, frame }) => {
	switch (animationType) {
		case 'overview':
			return <QuickListOverviewAnimation frame={frame} />;
		case 'split':
			return <SplitAnimation frame={frame} />;
		case 'compression':
			return <CompressionAnimation frame={frame} />;
		case 'merge':
			return <MergeAnimation frame={frame} />;
		case 'lpush':
		case 'rpush':
		case 'lpop':
		case 'rpop':
			return <QueueOperationAnimation frame={frame} operation={animationType as 'lpush' | 'rpush' | 'lpop' | 'rpop'} />;
		case 'ziplist':
			return <ZipListStructureAnimation frame={frame} />;
		case 'comparison':
			return <ComparisonAnimation frame={frame} />;
		case 'fillconfig':
			return <FillConfigAnimation frame={frame} />;
		case 'linsert':
			return <LInsertAnimation frame={frame} />;
		case 'memory':
			return <MemoryAnimation frame={frame} />;
		case 'scenarios':
			return <ScenariosAnimation frame={frame} />;
		case 'performance':
			return <PerformanceAnimation frame={frame} />;
		default:
			return <QuickListOverviewAnimation frame={frame} />;
	}
};

const QuickListOverviewAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const opacity = Math.min(frame / 30, 1);
	const nodeScale = Math.min(Math.max((frame - 20) / 20, 0), 1);

	return (
		<div className={styles.animation}>
			<div className={styles.overlay} />
			<div className={styles.titleSection} style={{ opacity }}>
				<h1>QuickList</h1>
				<p>双向链表 + ZipList = 高效List实现</p>
			</div>

			<div className={styles.nodesContainer} style={{ opacity: nodeScale }}>
				{[0, 1, 2, 3].map((idx) => (
					<div
						key={idx}
						className={`${styles.node} ${idx === 0 || idx === 3 ? styles.hotNode : styles.coldNode}`}
						style={{
							animationDelay: `${idx * 0.1}s`,
							transform: `scale(${0.8 + nodeScale * 0.2})`,
						}}
					>
						<div className={styles.nodeHeader}>ZipList</div>
						<div className={styles.nodeIndex}>#{idx}</div>
						<div className={styles.nodeEntries}>
							<div className={styles.entry}>[0] A</div>
							<div className={styles.entry}>[1] B</div>
						</div>
					</div>
				))}
				<div className={styles.arrows}>
					<div className={`${styles.arrow} ${styles.nextArrow}`}>NEXT →</div>
					<div className={`${styles.arrow} ${styles.prevArrow}`}>← PREV</div>
				</div>
			</div>

			<div className={styles.labels}>
				<div className={styles.headLabel}>HEAD</div>
				<div className={styles.tailLabel}>TAIL</div>
			</div>
		</div>
	);
};

const SplitAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 30 ? 0 : frame < 60 ? 1 : frame < 90 ? 2 : 3;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 Phase 1: 节点已满 (4/4)'}
				{phase === 1 && '⚡ Phase 2: 触发分裂'}
				{phase === 2 && '🔗 Phase 3: 链接节点'}
				{phase === 3 && '✅ Phase 4: 插入完成'}
			</div>

			<div className={styles.splitContainer}>
				<div
					className={`${styles.node} ${styles.hotNode}`}
					style={{
						transform: phase >= 1 ? 'translateX(-30px)' : 'translateX(0)',
						transition: 'transform 0.5s ease',
					}}
				>
					<div className={styles.nodeHeader}>ZipList</div>
					<div className={styles.nodeIndex}>#0 {phase >= 2 && '(分裂后保留)'}</div>
					<div className={styles.nodeEntries}>
						<div className={styles.entry}>[0] A</div>
						<div className={styles.entry}>[1] B</div>
						{phase === 0 && <div className={styles.entry}>[2] C</div>}
						{phase === 0 && <div className={styles.entry}>[3] D</div>}
					</div>
				</div>

				{phase >= 1 && (
					<div
						className={`${styles.splitArrow} ${phase === 1 ? styles.splitArrowAnimating : ''}`}
					>
						→
					</div>
				)}

				{phase >= 1 && (
					<div
						className={`${styles.node} ${phase >= 2 ? styles.coldNode : styles.splitNewNode}`}
						style={{
							opacity: phase >= 1 ? 1 : 0,
							transform: `scale(${phase >= 1 ? 1 : 0.5})`,
							transition: 'all 0.5s ease',
						}}
					>
						<div className={styles.nodeHeader}>ZipList</div>
						<div className={styles.nodeIndex}>#1 {phase >= 2 && '(新建)'}</div>
						<div className={styles.nodeEntries}>
							{phase >= 1 && <div className={styles.entry}>[0] E</div>}
							{phase >= 3 && <div className={`${styles.entry} ${styles.newEntry}`}>[1] F</div>}
						</div>
					</div>
				)}
			</div>

			<div className={styles.explanation}>
				{phase === 0 && '节点元素数量达到 fill 限制，需要分裂'}
				{phase === 1 && '在中间位置创建新节点，分裂数据...'}
				{phase === 2 && '新节点创建成功，更新双向链表指针'}
				{phase === 3 && '新元素成功写入新节点'}
			</div>
		</div>
	);
};

const CompressionAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 20 ? 0 : frame < 50 ? 1 : frame < 80 ? 2 : 3;
	const compressDepth = 1;
	const nodeCount = 5;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 Phase 1: 初始状态'}
				{phase === 1 && '🔍 Phase 2: 扫描冷热区'}
				{phase === 2 && '🗜️ Phase 3: 执行压缩'}
				{phase === 3 && '✅ Phase 4: 压缩完成'}
			</div>

			<div className={styles.legend}>
				<div className={styles.legendItem}>
					<div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }} />
					<span>热区 (不压缩)</span>
				</div>
				<div className={styles.legendItem}>
					<div className={styles.legendColor} style={{ backgroundColor: '#10b981' }} />
					<span>冷区 (已压缩)</span>
				</div>
			</div>

			<div className={styles.nodesContainer}>
				{Array.from({ length: nodeCount }).map((_, idx) => {
					const isHot = idx < compressDepth || idx >= nodeCount - compressDepth;
					return (
						<div
							key={idx}
							className={`${styles.node} ${isHot ? styles.hotNode : styles.coldNode}`}
							style={{
								borderColor: phase >= 1 && !isHot ? '#f59e0b' : undefined,
							}}
						>
							<div className={styles.nodeHeader}>
								ZipList
								{isHot && <span className={styles.hotBadge}>HOT</span>}
								{phase >= 3 && !isHot && <span className={styles.compressedBadge}>LZF</span>}
							</div>
							<div className={styles.nodeIndex}>#{idx}</div>
							<div className={styles.nodeEntries}>
								<div className={styles.entry}>[0] A</div>
								<div className={styles.entry}>[1] B</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className={styles.explanation}>
				{phase === 0 && 'QuickList 保留首尾节点为热区，中间节点为冷区'}
				{phase === 1 && '扫描节点，识别哪些节点处于冷区可以压缩...'}
				{phase === 2 && '对冷区节点执行 LZF 压缩，节省内存...'}
				{phase === 3 && `压缩完成！冷区 ${nodeCount - compressDepth * 2} 个节点已压缩`}
			</div>
		</div>
	);
};

const MergeAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 20 ? 0 : frame < 40 ? 1 : frame < 60 ? 2 : frame < 90 ? 3 : 4;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 Phase 1: 删除前的状态'}
				{phase === 1 && '🗑️ Phase 2: LPOP 删除元素'}
				{phase === 2 && '🔍 Phase 3: 检查合并条件'}
				{phase === 3 && '🔗 Phase 4: 执行合并'}
				{phase === 4 && '✅ 合并完成'}
			</div>

			<div className={styles.splitContainer}>
				<div className={`${styles.node} ${phase >= 2 ? styles.mergeHighlight : styles.hotNode}`}>
					<div className={styles.nodeHeader}>ZipList</div>
					<div className={styles.nodeIndex}>#0 {phase >= 4 && '(合并后)'}</div>
					<div className={styles.nodeEntries}>
						{phase < 1 && <div className={styles.entry}>[0] A</div>}
						{phase < 2 && <div className={styles.entry}>[1] B</div>}
						{phase >= 2 && <div className={styles.entry}>[0] B</div>}
					</div>
				</div>

				{phase < 4 && (
					<>
						<div
							className={`${styles.node} ${phase >= 2 ? styles.mergeHighlight : styles.hotNode}`}
							style={{
								opacity: phase >= 3 ? 0.3 : 1,
								transform: phase >= 3 ? 'translateX(30px)' : 'translateX(0)',
								transition: 'all 0.5s ease',
							}}
						>
							<div className={styles.nodeHeader}>ZipList</div>
							<div className={styles.nodeIndex}>#1</div>
							<div className={styles.nodeEntries}>
								{phase < 3 && <div className={styles.entry}>[0] C</div>}
							</div>
						</div>

						{phase >= 3 && (
							<div className={styles.mergeArrow}>← 合并</div>
						)}
					</>
				)}
			</div>

			<div className={styles.explanation}>
				{phase === 0 && '删除元素后，两个相邻节点元素都很少'}
				{phase === 1 && 'LPOP 从头部删除元素 A'}
				{phase === 2 && '检查合并条件：节点1(2个) + 节点2(1个) = 3 <= 4，可以合并'}
				{phase === 3 && '将节点2的元素迁移到节点1，删除节点2'}
				{phase >= 4 && '合并完成！节点数量减少，内存利用率提高'}
			</div>
		</div>
	);
};

const QueueOperationAnimation: React.FC<{ frame: number; operation: 'lpush' | 'rpush' | 'lpop' | 'rpop' }> = ({
	frame: _frame,
	operation,
}) => {
	const operationLabels = {
		lpush: '⬆️ LPUSH - 头部插入',
		rpush: '⬇️ RPUSH - 尾部插入',
		lpop: '⬆️ LPOP - 头部弹出',
		rpop: '⬇️ RPOP - 尾部弹出',
	};

	const operationExamples = {
		lpush: 'LPUSH mylist "NEW"  // 插入到头部',
		rpush: 'RPUSH mylist "NEW"  // 插入到尾部',
		lpop: 'LPOP mylist          // 从头部弹出',
		rpop: 'RPOP mylist          // 从尾部弹出',
	};

	return (
		<div className={styles.animation}>
			<div className={styles.operationTitle}>
				{operationLabels[operation]}
				<span className={styles.o1Badge}>O(1)</span>
			</div>

			<div className={styles.commandExample}>
				{operationExamples[operation]}
			</div>

			<div className={styles.queueNode}>
				<div className={styles.nodeHeader}>ZipList</div>
				<div className={styles.headTailLabels}>
					<span className={styles.headLabel}>HEAD →</span>
					<span className={styles.tailLabel}>← TAIL</span>
				</div>
				<div className={styles.nodeEntries}>
					<div className={styles.entry}>[0] A</div>
					<div className={styles.entry}>[1] B</div>
					<div className={styles.entry}>[2] C</div>
				</div>
			</div>

			<div className={styles.operationIndicator}>
				{operation.includes('push') ? '⬆️' : '🗑️'}
			</div>

			<div className={styles.explanation}>
				{operation === 'lpush' && 'LPUSH 在头部插入新元素，O(1) 时间复杂度'}
				{operation === 'rpush' && 'RPUSH 在尾部插入新元素，O(1) 时间复杂度'}
				{operation === 'lpop' && 'LPOP 从头部弹出元素，O(1) 时间复杂度'}
				{operation === 'rpop' && 'RPOP 从尾部弹出元素，O(1) 时间复杂度'}
			</div>

			<div className={styles.performanceNote}>
				✓ 头尾操作是 QuickList 性能最优的场景
			</div>
		</div>
	);
};

const ZipListStructureAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 30 ? 0 : frame < 60 ? 1 : frame < 90 ? 2 : frame < 120 ? 3 : 4;

	return (
		<div className={styles.animation}>
			<div className={styles.ziplistTitle}>📦 ZipList 内存结构</div>
			<div className={styles.ziplistSubtitle}>紧凑的连续内存存储，通过智能编码减少内存占用</div>

			<div className={styles.memoryLayout}>
				<div className={styles.headerBoxes}>
					<div className={styles.headerBox} style={{ backgroundColor: '#3b82f6' }}>
						<div>zlbytes</div>
						<div className={styles.boxSize}>4字节</div>
					</div>
					<div className={styles.headerBox} style={{ backgroundColor: '#dc382d' }}>
						<div>zltail</div>
						<div className={styles.boxSize}>4字节</div>
					</div>
					<div className={styles.headerBox} style={{ backgroundColor: '#ec4899' }}>
						<div>zllen</div>
						<div className={styles.boxSize}>2字节</div>
					</div>
				</div>

				<div className={styles.arrowDown}>↓</div>

				<div className={styles.entryBoxes}>
					<div className={styles.entryBox} style={{ backgroundColor: '#10b981' }}>
						<div>entry0</div>
						<div className={styles.boxSize}>可变长</div>
					</div>
					<div className={styles.entryBox} style={{ backgroundColor: '#10b981' }}>
						<div>entry1</div>
						<div className={styles.boxSize}>可变长</div>
					</div>
					<div className={styles.entryBoxDashed}>...</div>
				</div>

				<div className={styles.arrowDown}>↓</div>

				<div className={styles.endBox} style={{ backgroundColor: '#ef4444' }}>
					<div>zlend</div>
					<div className={styles.boxSize}>1字节</div>
				</div>
			</div>

			{phase >= 4 && (
				<div className={styles.entryDetail}>
					<h4>📝 Entry 结构详解</h4>
					<div className={styles.detailItem}>
						<div className={styles.detailColor} style={{ backgroundColor: '#f59e0b' }} />
						<strong>prevlen</strong> - 前一个 entry 的长度 (1-5字节)
					</div>
					<div className={styles.detailItem}>
						<div className={styles.detailColor} style={{ backgroundColor: '#dc382d' }} />
						<strong>encoding</strong> - 编码类型和长度 (1-5字节)
					</div>
					<div className={styles.detailItem}>
						<div className={styles.detailColor} style={{ backgroundColor: '#10b981' }} />
						<strong>data</strong> - 实际数据 (可变长)
					</div>
				</div>
			)}

			<div className={styles.explanation}>
				{phase === 0 && 'ZipList 头部：zlbytes(总长度)、zltail(尾部偏移)、zllen(元素数量)'}
				{phase === 1 && 'Entry 是 ZipList 的核心存储单元'}
				{phase === 2 && '每个 Entry 包含 prevlen、encoding 和实际数据'}
				{phase === 3 && 'zlend 是结束标记，固定为 0xFF'}
				{phase >= 4 && 'prevlen 支持反向遍历，encoding 实现智能压缩'}
			</div>
		</div>
	);
};

// Step 2: Comparison Animation - 双向链表 vs ZipList vs QuickList
const ComparisonAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 40 ? 0 : frame < 80 ? 1 : frame < 120 ? 2 : 3;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 Phase 1: 传统双向链表'}
				{phase === 1 && '📍 Phase 2: 纯 ZipList'}
				{phase === 2 && '⚡ Phase 3: QuickList 登场'}
				{phase === 3 && '✅ Phase 4: 完美平衡'}
			</div>

			<div className={styles.comparisonContainer}>
				{phase >= 0 && (
					<div className={`${styles.comparisonPanel} ${phase === 0 ? styles.activePanel : ''}`}>
						<h4>传统双向链表</h4>
						<div className={styles.linkedListDemo}>
							<div className={styles.llNode}>
								<div className={styles.llData}>A</div>
								<div className={styles.llPrev}>◀</div>
								<div className={styles.llNext}>▶</div>
							</div>
							<div className={styles.llNode}>
								<div className={styles.llData}>B</div>
								<div className={styles.llPrev}>◀</div>
								<div className={styles.llNext}>▶</div>
							</div>
							<div className={styles.llNode}>
								<div className={styles.llData}>C</div>
								<div className={styles.llPrev}>◀</div>
								<div className={styles.llNext}>▶</div>
							</div>
						</div>
						<div className={styles.prosCons}>
							<div className={styles.cons}>❌ 内存碎片严重</div>
							<div className={styles.cons}>❌ 指针开销大 (16B/节点)</div>
							<div className={styles.cons}>❌ 内存利用率低</div>
						</div>
					</div>
				)}

				{phase >= 1 && (
					<div className={`${styles.comparisonPanel} ${phase === 1 ? styles.activePanel : ''}`}>
						<h4>纯 ZipList</h4>
						<div className={styles.ziplistDemo}>
							<div className={styles.zlBox}>
								<div className={styles.zlHeader}>zlbytes | zltail | zllen</div>
								<div className={styles.zlEntries}>A | B | C | D | E</div>
								<div className={styles.zlEnd}>zlend</div>
							</div>
						</div>
						<div className={styles.prosCons}>
							<div className={styles.cons}>❌ 插入/删除 O(N)</div>
							<div className={styles.cons}>❌ 频繁 realloc</div>
							<div className={styles.cons}>❌ 级联更新</div>
						</div>
					</div>
				)}

				{phase >= 2 && (
					<div className={`${styles.comparisonPanel} ${phase >= 2 ? styles.activePanel : ''}`}>
						<h4>QuickList ✅</h4>
						<div className={styles.quicklistDemo}>
							<div className={styles.qlNode}>
								<div className={styles.qlNodeInner}>A, B</div>
								<div className={styles.qlArrows}>◀ ▶</div>
							</div>
							<div className={styles.qlNode}>
								<div className={styles.qlNodeInner}>C, D</div>
								<div className={styles.qlArrows}>◀ ▶</div>
							</div>
							<div className={styles.qlNode}>
								<div className={styles.qlNodeInner}>E, F</div>
								<div className={styles.qlArrows}>◀ ▶</div>
							</div>
						</div>
						<div className={styles.prosCons}>
							<div className={styles.pros}>✅ 内存紧凑</div>
							<div className={styles.pros}>✅ 头尾操作 O(1)</div>
							<div className={styles.pros}>✅ 平衡性能与内存</div>
						</div>
					</div>
				)}
			</div>

			<div className={styles.explanation}>
				{phase === 0 && '传统双向链表：每个节点独立内存，指针开销大'}
				{phase === 1 && '纯 ZipList：连续内存，但插入删除需要移动大量数据'}
				{phase === 2 && 'QuickList：结合两者优势，链表+压缩列表的混合结构'}
				{phase === 3 && 'QuickList 通过配置参数适应不同场景，实现性能和内存的平衡'}
			</div>
		</div>
	);
};

// Step 4: Fill Config Animation - fill 和 compress 参数演示
const FillConfigAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 30 ? 0 : frame < 60 ? 1 : frame < 90 ? 2 : 3;
	const fillValue = phase < 1 ? -2 : phase < 2 ? -5 : phase < 3 ? -1 : 2;
	const compressDepth = phase >= 2 ? 1 : 0;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 fill = -2 (默认 8KB)'}
				{phase === 1 && '📍 fill = -5 (64KB 大节点)'}
				{phase === 2 && '⚡ fill = -1 (4KB 小节点)'}
				{phase === 3 && '✅ compress = 1 压缩策略'}
			</div>

			<div className={styles.configDisplay}>
				<div className={styles.configItem}>
					<span className={styles.configLabel}>list-max-ziplist-size:</span>
					<span className={styles.configValue}>{fillValue}</span>
				</div>
				{phase >= 3 && (
					<div className={styles.configItem}>
						<span className={styles.configLabel}>list-compress-depth:</span>
						<span className={styles.configValue}>{compressDepth}</span>
					</div>
				)}
			</div>

			<div className={styles.nodesContainer}>
				{[0, 1, 2, 3, 4].map((idx) => {
					const isHot = compressDepth > 0 && (idx < compressDepth || idx >= 5 - compressDepth);
					return (
						<div
							key={idx}
							className={`${styles.node} ${isHot ? styles.hotNode : styles.coldNode}`}
						>
							<div className={styles.nodeHeader}>
								ZipList {isHot && <span className={styles.hotBadge}>HOT</span>}
								{!isHot && compressDepth > 0 && <span className={styles.compressedBadge}>LZF</span>}
							</div>
							<div className={styles.nodeIndex}>#{idx}</div>
							<div className={styles.nodeEntries}>
								<div className={styles.entry}>[0] item</div>
								<div className={styles.entry}>[1] item</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className={styles.explanation}>
				{phase === 0 && 'fill=-2: 每个节点最大 8KB，适合通用场景'}
				{phase === 1 && 'fill=-5: 每个节点最大 64KB，适合小元素批量存储'}
				{phase === 2 && 'fill=-1: 每个节点最大 4KB，适合大元素场景'}
				{phase === 3 && 'compress=1: 头尾各1个节点不压缩，中间节点启用 LZF 压缩'}
			</div>
		</div>
	);
};

// Step 9: LINSERT/LREM/LTRIM Animation
const LInsertAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 30 ? 0 : frame < 60 ? 1 : frame < 90 ? 2 : 3;
	const showLrem = frame >= 90 && frame < 120;
	const showLtrim = frame >= 120;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 LINSERT - 在指定位置插入'}
				{phase === 1 && '⚡ 查找 pivot 位置'}
				{phase === 2 && '🔄 插入新元素'}
				{phase === 3 && showLrem ? '🗑️ LREM - 删除匹配元素' : showLtrim ? '✂️ LTRIM - 截断列表' : '✅ 插入完成'}
			</div>

			<div className={styles.linsertDemo}>
				<div className={styles.commandBox}>
					{phase === 0 && 'LINSERT mylist BEFORE "B" "X"'}
					{phase === 1 && '→ 查找 pivot "B"'}
					{phase === 2 && '→ 在 B 前插入 X'}
					{phase === 3 && !showLrem && !showLtrim && '→ [A, X, B, C, D]'}
					{showLrem && 'LREM mylist 1 "X" → 删除1个X'}
					{showLtrim && 'LTRIM mylist 0 2 → 只保留[0,2]'}
				</div>

				<div className={styles.queueNode}>
					<div className={styles.nodeHeader}>ZipList</div>
					<div className={styles.nodeEntries}>
						<div className={`${styles.entry} ${phase >= 1 ? styles.highlightEntry : ''}`}>[0] A</div>
						{phase < 2 && <div className={`${styles.entry} ${phase >= 1 ? styles.pivotEntry : ''}`}>[1] B</div>}
						{phase >= 2 && !showLrem && !showLtrim && <div className={`${styles.entry} ${styles.newEntry}`}>[1] X</div>}
						{phase >= 2 && !showLrem && !showLtrim && <div className={`${styles.entry} ${styles.pivotEntry}`}>[2] B</div>}
						<div className={`${styles.entry} ${showLrem ? styles.deletedEntry : ''}`}>[3] C</div>
						<div className={`${styles.entry} ${showLtrim ? styles.trimmedEntry : ''}`}>[4] D</div>
					</div>
				</div>
			</div>

			<div className={styles.explanation}>
				{phase === 0 && 'LINSERT 在指定元素前/后插入，O(N) 复杂度'}
				{phase === 1 && '首先遍历找到 pivot 位置'}
				{phase === 2 && '在 ZipList 中插入，可能触发节点分裂'}
				{phase === 3 && !showLrem && !showLtrim && '插入完成，列表长度+1'}
				{showLrem && 'LREM 删除匹配元素，可能触发节点合并'}
				{showLtrim && 'LTRIM 截断列表，删除多余元素'}
			</div>
		</div>
	);
};

// Step 10: Memory Animation
const MemoryAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 40 ? 0 : frame < 80 ? 1 : frame < 120 ? 2 : 3;
	const showCompression = phase >= 2;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📍 Phase 1: 内存构成分析'}
				{phase === 1 && '📍 Phase 2: 节点内存计算'}
				{phase === 2 && '⚡ Phase 3: 启用压缩'}
				{phase === 3 && '✅ Phase 4: 优化效果'}
			</div>

			<div className={styles.memoryBreakdown}>
				<div className={styles.memoryTitle}>QuickList 内存构成</div>
				<div className={styles.memoryItems}>
					<div className={styles.memoryItem}>
						<div className={styles.memoryBar} style={{ width: '60px', backgroundColor: '#3b82f6' }}>24B</div>
						<span>QuickList 结构</span>
					</div>
					<div className={styles.memoryItem}>
						<div className={styles.memoryBar} style={{ width: '100px', backgroundColor: '#dc382d' }}>16B×N</div>
						<span>节点指针</span>
					</div>
					<div className={styles.memoryItem}>
						<div className={styles.memoryBar} style={{ width: '80px', backgroundColor: '#10b981' }}>16B×N</div>
						<span>ZipList 头</span>
					</div>
					<div className={styles.memoryItem}>
						<div className={styles.memoryBar} style={{ width: '120px', backgroundColor: '#f59e0b' }}>变长</div>
						<span>Entry 数据</span>
					</div>
				</div>
			</div>

			<div className={styles.memoryCalc}>
				<div className={styles.calcTitle}>示例：10000个整数</div>
				<div className={styles.calcFormula}>
					{phase === 0 && '1万元素 → 约5个节点 → 总内存 ≈ 20KB'}
					{phase === 1 && 'fill=8KB → 每节点2000元素 → 5节点 × (16+16+2000×2)B ≈ 20KB'}
					{phase === 2 && '启用 compress=1 → 中间节点压缩 30-70% → 节省约 6-14KB'}
					{phase === 3 && '优化后总内存 ≈ 6-14KB，内存效率提升 30-70%'}
				</div>
			</div>

			{showCompression && (
				<div className={styles.compressionEffect}>
					<div className={styles.effectTitle}>压缩效果</div>
					<div className={styles.effectBars}>
						<div className={styles.effectBar}>
							<div className={styles.beforeBar} />
							<span>压缩前</span>
						</div>
						<div className={styles.effectBar}>
							<div className={styles.afterBar} />
							<span>压缩后</span>
						</div>
					</div>
				</div>
			)}

			<div className={styles.explanation}>
				{phase === 0 && 'QuickList 内存 = 结构体 + 节点指针 + ZipList头 + Entry数据'}
				{phase === 1 && 'fill 参数影响节点数量和大小'}
				{phase === 2 && '启用 compress 可以节省 30-70% 内存'}
				{phase === 3 && '根据数据类型选择合适的配置可以最大化内存效率'}
			</div>
		</div>
	);
};

// Step 11: Scenarios Animation
const ScenariosAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = Math.floor(frame / 30) % 4;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '📨 场景1: 消息队列'}
				{phase === 1 && '📱 场景2: 时间线/Feed'}
				{phase === 2 && '💬 场景3: 最新评论'}
				{phase === 3 && '⏱️ 场景4: 限流滑动窗口'}
			</div>

			<div className={styles.scenarioDemo}>
				{phase === 0 && (
					<div className={styles.scenarioContent}>
						<div className={styles.scenarioCommand}>
							<pre>{`RPUSH queue:tasks "task_001"
RPUSH queue:tasks "task_002"
BLPOP queue:tasks 0`}</pre>
						</div>
						<div className={styles.scenarioConfig}>
							<div className={styles.configBadge}>fill = -2 (8KB)</div>
							<div className={styles.configBadge}>compress = 0</div>
						</div>
						<div className={styles.scenarioDesc}>RPUSH/LPOP 都是 O(1)，适合高并发队列</div>
					</div>
				)}

				{phase === 1 && (
					<div className={styles.scenarioContent}>
						<div className={styles.scenarioCommand}>
							<pre>{`LPUSH user:feed:123 "new_post"
LRANGE user:feed:123 0 49
LTRIM user:feed:123 0 999`}</pre>
						</div>
						<div className={styles.scenarioConfig}>
							<div className={styles.configBadge}>fill = -1 (4KB)</div>
							<div className={styles.configBadge}>compress = 1-2</div>
						</div>
						<div className={styles.scenarioDesc}>LPUSH 写入，LTRIM 限制长度，启用压缩</div>
					</div>
				)}

				{phase === 2 && (
					<div className={styles.scenarioContent}>
						<div className={styles.scenarioCommand}>
							<pre>{`LPUSH post:comments "评论..."
LRANGE post:comments 0 19
LTRIM post:comments 0 99`}</pre>
						</div>
						<div className={styles.scenarioConfig}>
							<div className={styles.configBadge}>fill = -2</div>
							<div className={styles.configBadge}>compress = 2</div>
						</div>
						<div className={styles.scenarioDesc}>分页获取评论，定期清理旧内容</div>
					</div>
				)}

				{phase === 3 && (
					<div className={styles.scenarioContent}>
						<div className={styles.scenarioCommand}>
							<pre>{`LPUSH rate:limit:user:123 TIMESTAMP
LTRIM rate:limit:user:123 0 99
# 统计窗口内请求数`}</pre>
						</div>
						<div className={styles.scenarioConfig}>
							<div className={styles.configBadge}>fill = -5 (64KB)</div>
							<div className={styles.configBadge}>compress = 0</div>
						</div>
						<div className={styles.scenarioDesc}>小元素大节点，保证性能</div>
					</div>
				)}
			</div>

			<div className={styles.explanation}>
				{phase === 0 && '消息队列：推荐不压缩，保证最低延迟'}
				{phase === 1 && '时间线：启用压缩，中间数据访问少'}
				{phase === 2 && '评论列表：更多压缩节省内存空间'}
				{phase === 3 && '限流窗口：小元素用大 fill，定期清理'}
			</div>
		</div>
	);
};

// Step 12: Performance Animation
const PerformanceAnimation: React.FC<{ frame: number }> = ({ frame }) => {
	const phase = frame < 40 ? 0 : frame < 80 ? 1 : 2;
	const highlightRow = phase;

	return (
		<div className={styles.animation}>
			<div className={styles.phaseIndicator}>
				{phase === 0 && '⚡ O(1) 操作: LPUSH/RPUSH/LPOP/RPOP'}
				{phase === 1 && '🐌 O(N) 操作: LINDEX/LRANGE/LINSERT'}
				{phase === 2 && '✅ 最佳实践: 合理配置参数'}
			</div>

			<div className={styles.perfTable}>
				<table>
					<thead>
						<tr>
							<th>操作</th>
							<th>复杂度</th>
							<th>说明</th>
						</tr>
					</thead>
					<tbody>
						<tr className={highlightRow === 0 ? styles.highlightRow : ''}>
							<td>LPUSH/RPUSH</td>
							<td className={styles.o1}>O(1)</td>
							<td>头尾插入，可能分裂</td>
						</tr>
						<tr className={highlightRow === 0 ? styles.highlightRow : ''}>
							<td>LPOP/RPOP</td>
							<td className={styles.o1}>O(1)</td>
							<td>头尾弹出，可能合并</td>
						</tr>
						<tr className={highlightRow === 1 ? styles.highlightRow : ''}>
							<td>LINDEX</td>
							<td className={styles.on}>O(N)</td>
							<td>遍历节点 + ZipList</td>
						</tr>
						<tr className={highlightRow === 1 ? styles.highlightRow : ''}>
							<td>LRANGE</td>
							<td className={styles.on}>O(N)</td>
							<td>遍历收集元素</td>
						</tr>
						<tr className={highlightRow === 1 ? styles.highlightRow : ''}>
							<td>LINSERT</td>
							<td className={styles.on}>O(N)</td>
							<td>查找位置 + 插入</td>
						</tr>
						<tr className={highlightRow === 2 ? styles.highlightRow : ''}>
							<td>LTRIM</td>
							<td className={styles.on}>O(N)</td>
							<td>删除多余元素</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className={styles.bestPractices}>
				<div className={styles.practiceTitle}>最佳实践</div>
				<div className={styles.practiceList}>
					<div className={styles.practiceItem}>✅ 优先使用头尾操作 LPUSH/RPUSH/LPOP/RPOP</div>
					<div className={styles.practiceItem}>✅ 避免频繁 LINDEX 随机访问</div>
					<div className={styles.practiceItem}>✅ 使用 LTRIM 防止数据无限增长</div>
					<div className={styles.practiceItem}>✅ 根据数据类型选择合适 fill 和 compress</div>
				</div>
			</div>

			<div className={styles.explanation}>
				{phase === 0 && '头尾操作是 QuickList 性能最优的场景，适合队列和栈'}
				{phase === 1 && '中间操作需要遍历，性能较差，应避免频繁使用'}
				{phase === 2 && '合理配置 fill 和 compress 参数，根据场景优化性能'}
			</div>
		</div>
	);
};

export default AnimationShowcase;
