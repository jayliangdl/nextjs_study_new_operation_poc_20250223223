'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import * as AntIcons from '@ant-design/icons';
import { eventBus, EventType } from '../utils/eventBus';

// 定义菜单项接口
export interface MenuItemConfig {
  instanceId: string;
  label: string;
  icon?: ReactNode;
  iconName?: string; 
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItemConfig[];
}

// 定义图标配置接口
export interface IconConfig {
  tooltip?: string;
  iconName: string; 
  instanceId: string;
  draggable?: boolean; // 是否可拖动
  menuItems?: MenuItemConfig[];
}

// 组件属性接口
export interface HoverInteractionWrapperProps {
  children: ReactNode;
  icons: IconConfig[];
  className?: string;
  style?: React.CSSProperties;
  instanceId?: string; // 添加实例ID，用于标识组件
}

const HoverInteractionWrapper: React.FC<HoverInteractionWrapperProps> = ({
  children,
  icons = [],
  className = '',
  style = {},
  instanceId = '', // 默认为空字符串
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false); // 添加拖动悬停状态

  // 动态获取Ant Design图标组件
  const getAntIcon = (iconName: string, iconInstanceId: string, isMenuItem: boolean = false, draggable: boolean = false): ReactNode => {
    // @ts-ignore - 忽略类型检查，因为我们是动态访问
    const IconComponent = AntIcons[iconName];
    if (IconComponent) {
      // 为菜单项图标设置不同的样式
      if (isMenuItem) {
        return React.createElement(IconComponent, { 
          style: { color: '#1890ff', fontSize: '14px' }
        });
      } else {
        // 保持原有的图标样式，并根据配置添加draggable属性
        const props: any = { 
          style: { 
            color: '#fff', 
            fontSize: '14px',
            cursor: draggable ? 'move' : 'pointer', // 根据是否可拖动设置不同的鼠标指针样式
          },
          onClick: (e: React.MouseEvent) => {
            // 发布图标点击事件
            eventBus.publish(EventType.ICON_CLICK, {
              iconName,
              instanceId: iconInstanceId,
              timestamp: new Date().getTime(),
              position: { x: e.clientX, y: e.clientY },
              altKey: e.altKey,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey
            });
          }
        };
        
        // 只有当draggable为true时，才添加拖动相关属性
        if (draggable) {
          props.draggable = true;
          props.onDragStart = (e: React.DragEvent) => {
            // 设置拖动数据 - 图标名称
            e.dataTransfer.setData('text/plain', instanceId);
            
            // 设置拖动数据 - 实例ID和其他信息（JSON格式）
            const dragData = {
              iconName,
              instanceId
            };
            e.dataTransfer.setData('application/json', JSON.stringify(dragData));
            
            // 创建一个显示"拖动中"文字的元素
            const dragElement = document.createElement('div');
            dragElement.textContent = '拖动中';
            dragElement.style.backgroundColor = 'orange';
            dragElement.style.color = 'white';
            dragElement.style.padding = '5px 10px';
            dragElement.style.borderRadius = '4px';
            dragElement.style.position = 'absolute';
            dragElement.style.top = '-1000px'; // 先放在不可见的位置
            document.body.appendChild(dragElement);
            
            // 设置拖动时的图像为"拖动中"文字
            e.dataTransfer.setDragImage(dragElement, 40, 15);
            
            // 拖动结束后移除临时元素
            setTimeout(() => {
              document.body.removeChild(dragElement);
            }, 0);
            
            // 发布拖动开始事件
            eventBus.publish(EventType.ICON_DRAG_START, {
              iconName,
              instanceId,
              timestamp: new Date().getTime(),
              position: { x: e.clientX, y: e.clientY }
            });
          };
          
          // 添加拖动结束事件
          props.onDragEnd = (e: React.DragEvent) => {
            // 发布拖动结束事件
            eventBus.publish(EventType.ICON_DRAG_END, {
              iconName,
              instanceId,
              timestamp: new Date().getTime(),
              position: { x: e.clientX, y: e.clientY },
              success: e.dataTransfer.dropEffect !== 'none'
            });
          };
        }
        
        return React.createElement(IconComponent, props);
      }
    }else{
      throw new Error(`Invalid icon name: ${iconName}`);
    }
  };

  // 获取图标组件
  const getIconComponent = (iconName: string, iconInstanceId: string, draggable?: boolean): ReactNode => {
    // 如果提供了iconName，优先使用iconName
    if (iconName && iconName.trim() !== '') {
      const icon = getAntIcon(iconName, iconInstanceId, false, draggable);
      if (icon) return icon;
    }
    return null;
  };

  // 将MenuItemConfig转换为antd的MenuProps['items']
  const convertToMenuItems = (menuItems: MenuItemConfig[] = []): MenuProps['items'] => {
    return menuItems.map(item => {
      const menuItem: any = {
        key: item.instanceId, // 修改这里，使用instanceId作为key
        label: item.label,
        disabled: item.disabled,
        danger: item.danger,
      };

      if (item.icon) {
        menuItem.icon = item.icon;
      } else if (item.iconName) {
        // 为菜单项图标传入isMenuItem=true
        const icon = getAntIcon(item.iconName, item.instanceId, true);
        if (icon) {
          menuItem.icon = icon;
        }
      }

      if (item.children && item.children.length > 0) {
        menuItem.children = convertToMenuItems(item.children);
      }

      return menuItem;
    });
  };

  // 渲染图标
  const renderIcons = () => {
    const visibleIcons = icons;

    return (
      <div className="hover-icons">
        {visibleIcons.map((icon, index) => {
          const IconComponent = getIconComponent(icon.iconName, icon.instanceId, icon.draggable);
          
          // 如果有菜单项，渲染带下拉菜单的图标
          if (icon.menuItems && icon.menuItems.length > 0) {
            return (
              <Dropdown 
                key={index}
                menu={{ 
                  items: convertToMenuItems(icon.menuItems),
                  onClick: (e) => {
                    // 发布菜单项点击事件
                    eventBus.publish(EventType.MENU_ITEM_CLICK, {
                      iconName: icon.iconName,
                      instanceId: icon.instanceId,
                      timestamp: new Date().getTime()
                    });
                  }
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <span className="icon-wrapper" title={icon.tooltip} 
                style={
                    { 
                      backgroundColor: 'orange', //图标背景色
                      margin: '0px 3px', //图标之间的间距
                      padding: '0px' //图标内边距
                    }
                  }
                >
                  {IconComponent}
                </span>
              </Dropdown>
            );
          }
          
          // 否则渲染普通图标
          return (
            <span 
              key={index} 
              className="icon-wrapper" 
              title={icon.tooltip}
              style={
                { 
                  backgroundColor: 'orange', //图标背景色
                  margin: '0px 3px', //图标之间的间距
                  padding: '0px' //图标内边距
                }
              }
            >
              {IconComponent}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`hover-interaction-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        border: isDragOver 
          ? '2px dashed #1890ff' // 拖动悬停时显示虚线边框
          : isHovered 
            ? '2px solid orange' 
            : '2px solid transparent',
        transition: 'border-color 0.3s',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // 添加拖放相关事件处理
      onDragOver={(e) => {
        // 阻止默认行为以允许放置
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        // 阻止默认行为
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        // 获取拖动源的数据
        const sourceInstanceId = e.dataTransfer.getData('text/plain');
        
        // 从dataTransfer中获取拖动源的实例ID
        const sourceData = e.dataTransfer.getData('application/json');
        let sourceInfo = null;
        try {
          if (sourceData) {
            sourceInfo = JSON.parse(sourceData);
          }
        } catch (error) {
          console.error('Failed to parse drag source data', error);
        }
        
        // 发布拖放事件
        eventBus.publish(EventType.COMPONENT_POSITON_CHANGE, {
          sourceInstanceId: sourceInstanceId,
          sourceData: sourceInfo,
          targetInstanceId: instanceId,
          timestamp: new Date().getTime(),
          position: { x: e.clientX, y: e.clientY }
        });
      }}
    >
      {isHovered && icons && icons.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '1px', //图标到容器的上部间距
            right: '1px', //图标到容器的右部间距
            zIndex: 1000,
            display: 'flex',
            gap: '12px',
          }}
        >
          {renderIcons()}
        </div>
      )}
      {children}
      <style jsx>{`
        .hover-interaction-wrapper {
          padding: 2px;
        }
        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background-color: orange;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin: 2px; /* 图标与容器边框的距离 */
          
        }
        .icon-wrapper:hover {
          background-color: #ff8c00;//
        }
        .hover-icons {
          display: flex;
          gap: 10px;//图标之间的内部间距
          margin: 0 10px;//图标容器的外部间距
        }
      `}</style>
    </div>
  );
};

export default HoverInteractionWrapper;
