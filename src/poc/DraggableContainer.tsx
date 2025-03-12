'use client'

import React from 'react';
import DraggableContainer from '@/components/DraggableContainer';
import DynamicTable from '@/components/DynamicTable';
import DynamicSplitter from '@/components/DynamicSplitter';
import { ContainerContentType } from '@/types/container';
import { SplitterConfig } from '@/types/splitter';

// 复用之前的配置
const mockTableConfig = {
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
  ],
  pagination: {
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 15],
  },
  dataSource: {
    type: 'mock' as const,
    data: Array.from({ length: 20 }).map((_, index) => ({
      id: index + 1,
      name: `用户 ${index + 1}`,
    })),
  },
};

const splitterConfig: SplitterConfig = {
  direction: 'horizontal',
  panels: [
    {
      id: 'panel-1',
      defaultSize: '50%',
      content: {
        type: ContainerContentType.ContentDesc,
        props: {
          content: '左侧面板',
          style: { backgroundColor: '#f0f0f0' }
        }
      }
    },
    {
      id: 'panel-2',
      defaultSize: '50%',
      content: {
        type: ContainerContentType.ContentDesc,
        props: {
          content: '右侧面板',
          style: { backgroundColor: '#f5f5f5' }
        }
      }
    }
  ]
};

const DraggableContainerPOC: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h2>可拖拽容器示例</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <DraggableContainer
          contentType={ContainerContentType.DynamicTable}
          instanceId="table-1"
        >
          <DynamicTable config={mockTableConfig} />
        </DraggableContainer>
      </div>

      <div style={{ height: '300px' }}>
        <DraggableContainer
          contentType={ContainerContentType.DynamicSplitter}
          instanceId="splitter-1"
        >
          <DynamicSplitter config={splitterConfig} />
        </DraggableContainer>
      </div>
    </div>
  );
};

export default DraggableContainerPOC; 