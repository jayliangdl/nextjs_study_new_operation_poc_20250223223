import React, { useEffect, useState, useMemo } from 'react';
import { TabsContainer } from '../types/tabs';
import CustomTabs from './CustomTabs';
import { CustomTabsContent } from './CustomTabsContent';
import loadConfig from '@/utils/configLoad';

export interface TabContent {
  id: string;
  label: string;
  content: {
    configId: string;
    [key: string]: any;
  };
}

export interface CustomTabsContainerProps {
  configId: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CustomTabsContainer: React.FC<CustomTabsContainerProps> = ({
  configId,
  className = '',
  style = {}
}) => {
  const [tabConfig, setTabConfig] = useState<any>(null);
  const [tabContainer, setTabContainer] = useState<TabsContainer | null>(null);

  // 使用 useMemo 缓存 tabItems，避免每次渲染都创建新数组
  const tabItems = useMemo(() => {
    if (!tabConfig) return [];
    return tabConfig.tabContents.map((tab: TabContent) => ({
      id: tab.id,
      title: tab.label,
      content: tab.content,
      position: 0
    }));
  }, [tabConfig]);

  // 加载配置
  useEffect(() => {
    loadConfig(configId, setTabConfig);
  }, [configId]);

  // 更新 tabContainer
  useEffect(() => {
    if (tabConfig && tabItems.length > 0) {
      setTabContainer(new TabsContainer(tabItems, tabConfig.defaultActiveTabId));
    }
  }, [tabConfig, tabItems]);

  if (!tabConfig || !tabContainer) {
    return <div>加载中...</div>;
  }

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
        tabContents={tabConfig.tabContents}
        activeTabId={tabContainer.getDefaultActiveTabId()}
      />
    </div>
  );
}; 