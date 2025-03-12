import React, { useEffect, useState, useMemo } from 'react';
import { TabsContainer } from '../types/tabs';
import CustomTabs from './CustomTabs';
import { CustomTabsContent } from './CustomTabsContent';

export interface TabContent {
  id: string;
  label: string;
  content: {
    configId: string;
    [key: string]: any;
  };
}

export interface CustomTabsContainerProps {
  tabContents: TabContent[];
  defaultActiveTabId?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CustomTabsContainer: React.FC<CustomTabsContainerProps> = ({
  tabContents,
  defaultActiveTabId,
  className = '',
  style = {}
}) => {
  // 使用 useMemo 缓存 tabItems，避免每次渲染都创建新数组
  const tabItems = useMemo(() => tabContents.map(tab => ({
    id: tab.id,
    title: tab.label,
    content: tab.content,
    position: 0
  })), [tabContents]);

  const [tabContainer, setTabContainer] = useState(() => new TabsContainer(tabItems, defaultActiveTabId));

  // 只在 tabContents 或 defaultActiveTabId 真正变化时更新 tabContainer
  useEffect(() => {
    setTabContainer(new TabsContainer(tabItems, defaultActiveTabId));
  }, [tabContents, defaultActiveTabId]);

  return (
    <div 
      className={`custom-tabs-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        ...style
      }}
    >
      <CustomTabs 
        tabContainer={tabContainer} 
        defaultActiveTab={tabContainer.getDefaultActiveTabId()}
      />
      
      <CustomTabsContent 
        tabContents={tabContents}
        activeTabId={tabContainer.getDefaultActiveTabId()}
      />
    </div>
  );
}; 