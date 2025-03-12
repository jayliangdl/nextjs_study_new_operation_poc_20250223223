import React, { useState, useEffect } from 'react';
import { DynamicComponent } from './DynamicComponent';
import { TabContent } from '../types/tabTypes';
import { eventBus, EventType } from '../utils/eventBus';

interface CustomTabsContentProps {
  tabContents: TabContent[];
  activeTabId: string;
}

export const CustomTabsContent: React.FC<CustomTabsContentProps> = ({
  tabContents,
  activeTabId: initialActiveTabId
}) => {
  const [activeTabId, setActiveTabId] = useState(initialActiveTabId);

  useEffect(() => {
    // 使用 eventBus 监听标签页切换事件
    const handleTabChange = (data: any) => {
      setActiveTabId(data.tabId);
    };

    // 添加事件监听器
    eventBus.subscribe(EventType.TAB_CHANGE, handleTabChange);

    // 清理事件监听器
    return () => {
      eventBus.unsubscribe(EventType.TAB_CHANGE, handleTabChange);
    };
  }, []); // 空依赖数组，因为事件监听器只需要设置一次

  // 当外部传入的 activeTabId 改变时，更新内部状态
  useEffect(() => {
    setActiveTabId(initialActiveTabId);
  }, [initialActiveTabId]);

  return (
    <div className="tabs-content">
      {tabContents.map((tab) => (
        <div
          key={tab.id}
          className={`tab-panel ${activeTabId === tab.id ? 'active' : 'hidden'}`}
          style={{ display: activeTabId === tab.id ? 'block' : 'none' }}
        >
          <DynamicComponent configId={tab.content.configId} />
        </div>
      ))}
    </div>
  );
}; 