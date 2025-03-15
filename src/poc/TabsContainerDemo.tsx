'use client';

import React, { useEffect } from 'react';
import './TabsContainerDemo.css';
import { CustomTabsContainer } from '@/components/CustomTabsContainer';
import { eventBus, EventType } from '../utils/eventBus';
/**
 * 标签页容器演示组件
 */
const TabsContainerDemo: React.FC = () => {
  

  return (
    <div className="tabs-demo-container">
      <div className="demo-header">
        <h1>多标签页容器演示</h1>
        <p>这个演示展示了如何使用标签页组织不同的容器结构</p>
      </div>
      <div className="tabs-demo-content">
        <CustomTabsContainer configId="tabsContainerDemo" />
      </div>
    </div>
  );
};

export default TabsContainerDemo;