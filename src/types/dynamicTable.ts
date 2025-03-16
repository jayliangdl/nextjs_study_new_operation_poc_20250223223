// 列定义
export interface ColumnConfig {
  key: string;          // 字段键名
  title: string;        // 显示标题
  sortable?: boolean;   // 是否可排序
  width?: number;       // 列宽
  fixed?: 'left' | 'right';  // 是否固定列
}

// 分页配置
export interface PaginationConfig {
  defaultPageSize: number;        // 默认每页条数
  pageSizeOptions: number[];     // 可选的每页条数
}

// API 数据源配置
export interface ApiDataSourceConfig {
  type: 'api';
  method: 'GET' | 'POST';
  url: string;
  headers?: Record<string, string>;
  body?: any;                    // POST 请求体
}

// Mock 数据源配置
export interface MockDataSourceConfig {
  type: 'mock';
  data: any[];                   // 模拟数据
}

// 数据源配置联合类型
export type DataSourceConfig = ApiDataSourceConfig | MockDataSourceConfig;

// 完整的表格配置
export interface DynamicTableProps {
  columns: ColumnConfig[];
  pagination: PaginationConfig;
  dataSource: DataSourceConfig;
} 