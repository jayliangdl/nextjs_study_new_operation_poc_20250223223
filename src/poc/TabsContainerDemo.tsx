'use client';

import React, { useEffect } from 'react';
import './TabsContainerDemo.css';
import { CustomTabsContainer } from '@/components/CustomTabsContainer';
import { eventBus, EventType } from '../utils/eventBus';
/**
 * 标签页容器演示组件
 */
const TabsContainerDemo: React.FC = () => {
  const handleTabRename = () => {
    // 重新加载配置的逻辑已经在 CustomTabsContainer 中处理
  };

  // 订阅事件
  useEffect(() => {
    eventBus.subscribe(EventType.TAB_RENAME, handleTabRename);
    return () => {
      eventBus.unsubscribe(EventType.TAB_RENAME, handleTabRename);
    };
  }, []);

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