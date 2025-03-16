'use client'

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { DataFetcher, FetchResult } from '@/services/dataFetcher';
import type { ColumnConfig } from '@/types/dynamicTable';
import { withComponentRegister } from '@/utils/componentRegistry';
import { DynamicTable as DynamicTableType, DynamicTableConfig } from '@/types/dynamicTable';
import loadConfig from '@/utils/configLoad';

export interface DynamicTableProps {
  /** configId 和 config 二选一，要么配置从调用者传入，要么仅传入configId，本组件会根据configId去加载配置 */
  configId?: string;// 配置ID 
  config?: any;// 具体配置(json)
  style?: React.CSSProperties;
}

const defaultPagination = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100']
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  configId, config, style 
  }: DynamicTableProps) => {

  const [dynamicTable, setDynamicTable] = useState<DynamicTableType | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPagination.defaultPageSize);

  const inst = (config: DynamicTableConfig) => {
    const dynamicTable = new DynamicTableType(config);    
    setDynamicTable(dynamicTable);
  }

  useEffect(() => {
    if (configId) {
      loadConfig(configId, inst);    
    }
  }, [configId]);

  useEffect(() => {
    if (config) {
      inst(config);    
    }
  }, [config]);

  useEffect(() => {
    if (dynamicTable) {
      dynamicTable.fetchData(currentPage, setData, setTotal, setLoading);
    }
  }, [dynamicTable, currentPage, pageSize]);

  if (!dynamicTable) {
    return <div>加载中...</div>;
  }

  const tablePagination = {
    ...defaultPagination,
    ...(config.pagination || {})
  };
  const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    const currentPage = pagination.current || 1;
    setCurrentPage(currentPage);
    const pageSize = pagination.pageSize || tablePagination.defaultPageSize;
    dynamicTable.setPageSize(pageSize);
    setPageSize(pageSize);
  };

  return (
    <Table
      columns={dynamicTable.columns}
      dataSource={data}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        pageSizeOptions: dynamicTable.pagination.pageSizeOptions,
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  );
};
// 使用高阶组件注册组件
export default withComponentRegister<DynamicTableProps>('DynamicTable')(DynamicTable);
