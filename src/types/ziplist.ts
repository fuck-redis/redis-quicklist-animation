/**
 * ZipList Entry 编码类型
 */
export type ZipListEncoding =
  | 'INT16'     // 16位整数
  | 'INT32'     // 32位整数
  | 'INT64'     // 64位整数
  | 'STRING'    // 字符串
  | 'BYTES';    // 字节数组

/**
 * ZipList Entry 状态
 */
export interface ZipListEntry {
  id: string;                    // 唯一标识
  index: number;                 // 在ZipList中的位置
  value: string | number;        // 元素值
  encoding: ZipListEncoding;     // 编码类型
  prevLen: number;               // 前一个entry的长度
  encodingSize: number;          // 编码字段大小
  dataSize: number;              // 数据大小
  totalSize: number;             // 总大小
  isHighlighted?: boolean;       // 是否高亮显示
}

/**
 * ZipList 状态
 */
export interface ZipListState {
  id: string;                    // ZipList唯一标识
  entries: ZipListEntry[];       // Entry数组
  zlbytes: number;               // ZipList总字节数
  zltail: number;                // 到尾节点的偏移量
  zllen: number;                 // Entry数量
  headerSize: number;            // 头部大小(zlbytes + zltail + zllen)
  endSize: number;               // 结束标记大小(zlend)
  totalSize: number;             // 总大小
}

/**
 * 创建空的ZipList
 */
export function createEmptyZipList(id?: string): ZipListState {
  const HEADER_SIZE = 10; // 4 + 4 + 2
  const END_SIZE = 1;     // zlend
  
  return {
    id: id || `zl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    entries: [],
    zlbytes: HEADER_SIZE + END_SIZE,
    zltail: HEADER_SIZE,
    zllen: 0,
    headerSize: HEADER_SIZE,
    endSize: END_SIZE,
    totalSize: HEADER_SIZE + END_SIZE,
  };
}

/**
 * 计算Entry的编码和大小
 */
export function calculateEntrySize(value: string | number, prevLen: number): {
  encoding: ZipListEncoding;
  prevLen: number;
  encodingSize: number;
  dataSize: number;
  totalSize: number;
} {
  let encoding: ZipListEncoding;
  let dataSize: number;
  
  if (typeof value === 'number') {
    // 整数编码
    if (value >= -32768 && value <= 32767) {
      encoding = 'INT16';
      dataSize = 2;
    } else if (value >= -2147483648 && value <= 2147483647) {
      encoding = 'INT32';
      dataSize = 4;
    } else {
      encoding = 'INT64';
      dataSize = 8;
    }
  } else {
    // 字符串编码
    encoding = 'STRING';
    dataSize = new TextEncoder().encode(value).length;
  }
  
  // prevLen字段大小：1字节(prevLen<254) 或 5字节(prevLen>=254)
  const prevLenSize = prevLen < 254 ? 1 : 5;
  
  // encoding字段大小：通常1-2字节
  const encodingSize = dataSize < 64 ? 1 : 2;
  
  return {
    encoding,
    prevLen: prevLenSize,
    encodingSize,
    dataSize,
    totalSize: prevLenSize + encodingSize + dataSize,
  };
}
