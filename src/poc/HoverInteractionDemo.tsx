'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Switch, Radio, Space, Input, Button, Divider, List, Tag } from 'antd';
import HoverInteractionWrapper, { IconConfig } from '../components/HoverInteractionWrapper';
import { eventBus, EventType } from '../utils/eventBus';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const HoverInteractionDemo: React.FC = () => {
  // 默认图标配置 - 纯JSON格式
  const defaultIconsJson = [
    {
      instanceId: 'plus',
      tooltip: 'Children Setting',
      iconName: 'PlusOutlined',
      draggable: false, // 设置为可拖动
      menuItems: [
        {
          instanceId: 'view',
          label: '查看',
          iconName: 'UserOutlined',
        },
        {
          instanceId: 'download',
          label: '下载',
          iconName: 'DownloadOutlined',
        },
        {
          instanceId: 'delete',
          label: '删除',
          iconName: 'DeleteOutlined',
          danger: true,
        },
      ],
    },
    {
      instanceId: 'setting',
      tooltip: 'Setting',
      iconName: 'UnorderedListOutlined',
      draggable: false, // 设置为不可拖动
      menuItems: [
        {
          instanceId: 'share',
          label: '分享',
          iconName: 'ShareAltOutlined',
        },
        {
          instanceId: 'lock',
          label: '锁定',
          iconName: 'LockOutlined',
        },
        {
          instanceId: 'print',
          label: '打印',
          iconName: 'PrinterOutlined',
        },
      ],
    },
    {
      instanceId: 'move',
      tooltip: 'Move',
      iconName: 'DragOutlined',
      draggable: true, // 设置为可拖动
      menuItems: null, // 设置为null而不是空数组
    }
  ];

  // 将纯JSON转换为带有React组件的配置
  const convertJsonToConfig = (jsonConfig: any[]): IconConfig[] => {
    return jsonConfig.map(icon => ({
      ...icon,
      // 不再需要在这里转换图标，HoverInteractionWrapper组件会处理
    }));
  };

  const [icons, setIcons] = useState<IconConfig[]>(convertJsonToConfig(defaultIconsJson));
  const [demoContent, setDemoContent] = useState<string>('这是一个示例内容，将鼠标悬停在此区域查看交互效果。');
  const [showCard, setShowCard] = useState<boolean>(true);

  // 用于存储和展示事件信息
  const [eventLogs, setEventLogs] = useState<Array<{
    type: string;
    data: any;
    time: string;
  }>>([]);

  // 最大显示的事件数量
  const maxEventLogs = 10;

  // 添加事件日志
  const addEventLog = (type: string, data: any) => {
    setEventLogs(prevLogs => {
      const newLog = {
        type,
        data,
        time: new Date().toLocaleTimeString()
      };
      // 保持最新的事件在前面，并限制最大数量
      const updatedLogs = [newLog, ...prevLogs].slice(0, maxEventLogs);
      return updatedLogs;
    });
  };

  // 订阅事件
  useEffect(() => {
    // 图标点击事件
    const handleIconClick = (data: any) => {
      addEventLog('图标点击', data);
    };
    
    // 拖动开始事件
    const handleDragStart = (data: any) => {
      addEventLog('拖动开始', data);
    };
    
    // 拖动结束事件
    const handleDragEnd = (data: any) => {
      addEventLog('拖动结束', data);
    };
    
    // 菜单项点击事件
    const handleMenuItemClick = (data: any) => {
      addEventLog('菜单项点击', data);
    };
    
    // 订阅事件
    eventBus.subscribe(EventType.ICON_CLICK, handleIconClick);
    eventBus.subscribe(EventType.ICON_DRAG_START, handleDragStart);
    eventBus.subscribe(EventType.ICON_DRAG_END, handleDragEnd);
    eventBus.subscribe(EventType.MENU_ITEM_CLICK, handleMenuItemClick);
    
    // 组件卸载时取消订阅
    return () => {
      eventBus.unsubscribe(EventType.ICON_CLICK, handleIconClick);
      eventBus.unsubscribe(EventType.ICON_DRAG_START, handleDragStart);
      eventBus.unsubscribe(EventType.ICON_DRAG_END, handleDragEnd);
      eventBus.unsubscribe(EventType.MENU_ITEM_CLICK, handleMenuItemClick);
    };
  }, []);

  // 清空事件日志
  const clearEventLogs = () => {
    setEventLogs([]);
  };

  // 获取事件类型对应的标签颜色
  const getEventTagColor = (type: string) => {
    switch (type) {
      case '图标点击':
        return 'blue';
      case '拖动开始':
        return 'orange';
      case '拖动结束':
        return 'green';
      case '菜单项点击':
        return 'purple';
      default:
        return 'default';
    }
  };


  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>悬浮交互包装器演示</Title>
      <Paragraph>
        这个组件可以包装任何React元素，当鼠标悬停时显示可配置的图标和下拉菜单。
      </Paragraph>

      <Card title="演示效果" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>将鼠标悬停在下面的元素上查看效果：</Paragraph>
          
          <div style={{ padding: '20px', background: '#f5f5f5' }}>
            {/* 示例1：包装文本 */}
            <HoverInteractionWrapper icons={icons}>
              <span style={{ padding: '8px', display: 'inline-block' }}>{demoContent}</span>
            </HoverInteractionWrapper>
          </div>
          
          <Divider />
          
          <div style={{ padding: '20px', background: '#f5f5f5' }}>
            {/* 示例2：包装卡片 */}
            <HoverInteractionWrapper icons={icons}>
              {showCard ? (
                <Card style={{ width: 300 }}>
                  <Typography.Title level={5}>卡片标题</Typography.Title>
                  <Typography.Paragraph>{demoContent}</Typography.Paragraph>
                  <Button type="primary">操作按钮</Button>
                </Card>
              ) : (
                <div style={{ padding: '16px', width: 300 }}>
                  <Typography.Title level={5}>无卡片背景</Typography.Title>
                  <Typography.Paragraph>{demoContent}</Typography.Paragraph>
                  <Button type="primary">操作按钮</Button>
                </div>
              )}
            </HoverInteractionWrapper>
          </div>
        </Space>
      </Card>

      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <Card title="悬浮交互组件" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <HoverInteractionWrapper icons={convertJsonToConfig(defaultIconsJson)}>
                <div style={{ width: '200px', height: '100px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  悬浮在我上面查看图标
                </div>
              </HoverInteractionWrapper>
            </div>
          </Card>
        </div>
        
        <div style={{ flex: 1 }}>
          <Card 
            title="事件监听" 
            style={{ width: '100%' }}
            extra={<Button size="small" onClick={clearEventLogs}>清空</Button>}
          >
            <List
              size="small"
              bordered
              dataSource={eventLogs}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Tag color={getEventTagColor(item.type)}>{item.type}</Tag>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                    </div>
                    <div style={{ 
                      backgroundColor: '#f5f5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      maxHeight: '80px',
                      overflowY: 'auto'
                    }}>
                      {JSON.stringify(item.data, null, 2)}
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无事件' }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HoverInteractionDemo;
