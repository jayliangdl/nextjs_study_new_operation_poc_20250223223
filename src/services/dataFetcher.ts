import { DataSourceConfig } from '@/types/dynamicTable';

export interface FetchResult {
  data: any[];
  total: number;
}

export class DataFetcher {
  private config: DataSourceConfig;

  constructor(config: DataSourceConfig) {
    this.config = config;
  }

  async fetch(params: { page: number; pageSize: number }): Promise<FetchResult> {
    if (this.config.type === 'mock') {
      return this.fetchMockData(params);
    } else {
      return this.fetchApiData(params);
    }
  }

  private async fetchMockData({ page, pageSize }: { page: number; pageSize: number }): Promise<FetchResult> {
    const { data } = this.config as { type: 'mock'; data: any[] };
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    // 确保返回正确的分页数据
    return {
      data: data.slice(start, end),
      total: data.length
    };
  }

  private async fetchApiData({ page, pageSize }: { page: number; pageSize: number }): Promise<FetchResult> {
    const { method, url, headers, body } = this.config as any;
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (method === 'POST' && body) {
      requestOptions.body = JSON.stringify({
        ...body,
        page,
        pageSize
      });
    }

    const queryParams = method === 'GET' 
      ? `?page=${page}&pageSize=${pageSize}` 
      : '';

    try {
      const response = await fetch(`${url}${queryParams}`, requestOptions);
      const result = await response.json();
      
      return {
        data: result.data || [],
        total: result.total || 0
      };
    } catch (error) {
      console.error('API fetch error:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
} 