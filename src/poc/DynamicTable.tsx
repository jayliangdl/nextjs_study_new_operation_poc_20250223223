'use client'

import React from 'react';
import DynamicTable from '@/components/DynamicTable';
import type { DynamicTableConfig } from '@/types/dynamicTable';

// Mock 数据示例
const mockData = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
  age: Math.floor(Math.random() * 50) + 20,
  address: `地址 ${index + 1}`,
}));

// Mock 数据源配置示例
const mockConfig: DynamicTableConfig = {
  columns: [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      width: 80,
    },
    {
      key: 'name',
      title: '姓名',
      sortable: true,
      width: 120,
    },
    {
      key: 'age',
      title: '年龄',
      sortable: true,
      width: 100,
    },
    {
      key: 'address',
      title: '地址',
      sortable: false,
    },
  ],
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 15, 20],
  },
  dataSource: {
    type: 'mock',
    data: mockData,
  },
};

const DynamicTablePOC: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h2>Mock 数据示例</h2>
      <DynamicTable config={mockConfig} />
    </div>
  );
};

export default DynamicTablePOC;