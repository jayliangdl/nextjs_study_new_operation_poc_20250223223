'use client';

import React, { useState, useEffect } from 'react';
import HoverInteractionWrapper from './HoverInteractionWrapper';
import { eventBus, EventType } from '../utils/eventBus';
import {TabsContainer,TabItem} from '../types/tabs'

// export interface TabItem {
//   id: string;
//   label: string;
// }

export interface CustomTabsProps {
  // tabs: TabItem[];
  tabContainer: TabsContainer;
  defaultActiveTab?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 使用EventType枚举
export const TAB_CHANGE_EVENT = EventType.TAB_CHANGE;

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabContainer,
  defaultActiveTab,
  className = '',
  style = {}
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || (tabContainer.getItems().length > 0 ? tabContainer.getItems()[0].id : ''));
  const [tabContainerItems, setTabContainerItems] = useState(tabContainer.getItems());
  // 图标配置
  const icons = [
    {
      instanceId: 'setting',
      tooltip: 'Tab Settings',
      iconName: 'SettingOutlined',
      draggable: false,
      menuItems: [
        {
          instanceId: 'rename',
          label: '重命名',
          iconName: 'EditOutlined',
        },
        {
          instanceId: 'delete',
          label: '删除',
          iconName: 'DeleteOutlined',
        }
      ],
    },
    {
      instanceId: 'move',
      tooltip: 'Move Tab',
      iconName: 'DragOutlined',
      draggable: true,
      menuItems: [],
    }
  ];

  useEffect(() => {
    console.log('tabContainer', tabContainer);
  }, [tabContainer]);

  // 处理标签页切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // 发布标签页切换事件
    eventBus.publish(EventType.TAB_CHANGE, {
      tabId,
      timestamp: new Date().getTime(),
      previousTabId: activeTab
    });
  };

  // 处理图标点击事件
  useEffect(() => {
    const handleTabPositionChange = (data: any) => {
      
      // 获取被鼠标拖动的实例Id
      const sourceInstanceId = data?.sourceInstanceId;
      // 获取目标实例Id（鼠标放下的位置）
      const targetInstanceId = data?.targetInstanceId;
      if(sourceInstanceId && targetInstanceId){
        // 获取目标实例对象
        const targetInstance = tabContainer.getItemById(targetInstanceId);
        // 移动源实例到目标实例的位置
        const targetPosition = targetInstance?.position!;
        tabContainer.moveItem(sourceInstanceId, targetPosition);
      }
      // 更新标签页容器实例
      setTabContainerItems(tabContainer.getItems());
    };

    // 订阅标签页位置变化事件
    eventBus.subscribe(EventType.COMPONENT_POSITON_CHANGE, handleTabPositionChange);

    // 组件卸载时取消订阅
    return () => {
      eventBus.unsubscribe(EventType.COMPONENT_POSITON_CHANGE, handleTabPositionChange);
    };
  }, []);

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
      <div 
        className="tabs-header"
        style={{
          display: 'flex',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#fafafa',
        }}
      >
        {tabContainerItems.map((item:TabItem) => (
          <HoverInteractionWrapper 
            key={item.id}
            icons={icons}
            instanceId={item.id}
          >
            <div 
              className={`tab-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                borderBottom: activeTab === item.id ? '2px solid #1890ff' : '2px solid transparent',
                color: activeTab === item.id ? '#1890ff' : 'inherit',
                transition: 'all 0.3s',
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
              }}
            >
              {item.title}
            </div>
          </HoverInteractionWrapper>
        ))}
      </div>
    </div>
  );
};

export default CustomTabs;
