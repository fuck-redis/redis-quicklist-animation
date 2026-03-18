import { ScenarioPreset } from '@/types/quicklistViz';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    key: 'split-heavy',
    label: '分裂密集',
    hint: '小 fill 下持续写入，观察节点分裂',
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    queuePopCount: 0,
  },
  {
    key: 'queue-mode',
    label: '队列模式',
    hint: '先入后出，展示 head 弹出与合并',
    values: [11, 12, 13, 14, 15, 16, 17, 18],
    queuePopCount: 4,
  },
  {
    key: 'compression',
    label: '压缩观察',
    hint: '字符串 payload 触发中段压缩',
    values: ['msg-A', 'msg-B', 'msg-C', 'msg-D', 'msg-E', 'msg-F', 'msg-G', 'msg-H', 'msg-I'],
    queuePopCount: 2,
  },
];

export function parseValuesInput(raw: string): Array<number | string> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  const normalized = trimmed
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return normalized.map((token) => {
    const numeric = Number(token);
    if (!Number.isNaN(numeric) && token !== '') {
      return numeric;
    }
    return token.replace(/^['"]|['"]$/g, '');
  });
}

export function validateValues(values: Array<number | string>): string | null {
  if (values.length === 0) {
    return '请输入至少一个元素。';
  }
  if (values.length > 40) {
    return '演示模式建议最多 40 个元素，避免信息过载。';
  }

  for (const item of values) {
    if (typeof item === 'number' && (!Number.isFinite(item) || Math.abs(item) > 1_000_000)) {
      return '数值元素必须是有限数字，且绝对值不超过 1,000,000。';
    }
    if (typeof item === 'string' && item.length > 24) {
      return '字符串元素长度建议不超过 24 个字符。';
    }
  }

  return null;
}

export function randomValues(count = 12): Array<number | string> {
  const target = Math.max(6, Math.min(24, count));
  const values: Array<number | string> = [];

  for (let i = 0; i < target; i += 1) {
    const kind = Math.random();
    if (kind < 0.68) {
      values.push(Math.floor(Math.random() * 120) - 20);
    } else {
      values.push(`s${Math.floor(Math.random() * 90 + 10)}`);
    }
  }

  return values;
}
