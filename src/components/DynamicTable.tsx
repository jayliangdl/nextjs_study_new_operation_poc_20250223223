'use client'

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { DataFetcher, FetchResult } from '@/services/dataFetcher';
import type { TableConfig, ColumnConfig } from '@/types/dynamicTable';

interface DynamicTableProps {
  config: TableConfig;
}

const defaultPagination = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100']
};

const DynamicTable: React.FC<DynamicTableProps> = ({ config = {} as TableConfig }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const tablePagination = {
    ...defaultPagination,
    ...(config.pagination || {})
  };
  
  const [pageSize, setPageSize] = useState(tablePagination.defaultPageSize);

  console.log('config', JSON.stringify(config));
  const dataFetcher = new DataFetcher(config.dataSource || []);

  // 转换列配置为 Ant Design Table 需要的格式
  const columns = (config.columns || []).map((col: ColumnConfig) => ({
    key: col.key,
    dataIndex: col.key,
    title: col.title,
    width: col.width,
    fixed: col.fixed,
    sorter: col.sortable ? true : false,
  }));

  const fetchData = async (page: number, size: number) => {
    setLoading(true);
    try {
      console.log('Fetching data with config:', config);
      const result: FetchResult = await dataFetcher.fetch({ page, pageSize: size });
      console.log('Fetch result:', result);
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
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || tablePagination.defaultPageSize);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        pageSizeOptions: tablePagination.pageSizeOptions,
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default DynamicTable; 