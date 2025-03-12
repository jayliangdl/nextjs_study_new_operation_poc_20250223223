'use client';

import React from 'react';
import './TabsContainerDemo.css';
import { CustomTabsContainer, CustomTabsContainerProps } from '@/components/CustomTabsContainer';

/**
 * 标签页容器演示组件
 */
const TabsContainerDemo: React.FC = () => {
  // 定义标签页配置
  const tabConfig: CustomTabsContainerProps = {
    tabContents: [
      {
        id: 'tab1',
        label: 'Tab1',
        content: {
          configId: 'TabsContainerDemo_ContentDesc_001',
        }
      },
      {
        id: 'tab2',
        label: 'Tab2',
        content: {
          configId: 'TabsContainerDemo_ContentDesc_002',
        }
      },
      {
        id: 'tab3',
        label: 'Tab3',
        content: {
          configId: 'TabsContainerDemo_ContentDesc_003',
        }
      }
    ],
    defaultActiveTabId: 'tab1'
  };

  return (
    <div className="tabs-demo-container">
      <div className="demo-header">
        <h1>多标签页容器演示</h1>
        <p>这个演示展示了如何使用标签页组织不同的容器结构</p>
      </div>

      <div className="tabs-demo-content">
        <CustomTabsContainer {...tabConfig} />
      </div>
    </div>
  );
};

export default TabsContainerDemo;