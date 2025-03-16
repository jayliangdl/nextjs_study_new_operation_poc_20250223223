import { DataFetcher, FetchResult } from '@/services/dataFetcher';
// 列定义
export interface ColumnConfig {
  key: string;          // 字段键名
  title: string;        // 显示标题
  sortable?: boolean;   // 是否可排序
  width?: number;       // 列宽
  fixed?: 'left' | 'right';  // 是否固定列
  dataIndex: string;    // 数据索引
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
// export interface DynamicTableProps {
//   columns: ColumnConfig[];
//   pagination: PaginationConfig;
//   dataSource: DataSourceConfig;
// } 

export interface DynamicTableConfig {
  columns: ColumnConfig[];
  pagination: PaginationConfig;
  dataSource: DataSourceConfig;
} 

class DynamicTable{
  private _columns: ColumnConfig[];
  private _pagination: PaginationConfig;
  private _dataSource: DataSourceConfig;
  constructor(config: DynamicTableConfig){
    this._columns = config.columns;
    this._pagination = config.pagination;
    this._dataSource = config.dataSource;
  }

  get columns(): ColumnConfig[]{
    return this._columns;
  }

  get pagination(): PaginationConfig{
    return this._pagination;
  }

  get dataSource(): DataSourceConfig{
    return this._dataSource;
  }

  setPageSize(pageSize: number){
    this._pagination.defaultPageSize = pageSize;
  }

  toConfigJSON(): DynamicTableConfig{
    return {
      columns: this._columns,
      pagination: this._pagination, 
      dataSource: this._dataSource
    };
  }

  async fetchData(page: number, setData: (data: any[]) => void, setTotal: (total: number) => void, setLoading: (loading: boolean) => void): Promise<any>{
    const dataFetcher = new DataFetcher(this.dataSource || []);
    try {
      const result: FetchResult = await dataFetcher.fetch({ page, pageSize: this.pagination?.defaultPageSize });      
      // 确保每条数据都有唯一的 key
      const dataWithKeys = result.data.map((item: any, index: number) => ({
        ...item,
        key: item.id || `item-${index}`,
      }));
      setData(dataWithKeys);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }
}

export { DynamicTable };

