'use client'

import React from 'react';
import { Container, DetailType, Direction } from '../types/customContainerV1';
import { DemoLayout } from '../components/DemoLayout';
import { ContainerV1 } from '../components/ContainerV1';
import { DynamicComponent } from '@/components/DynamicComponent';

/**
 * 动态容器演示
 * 展示如何使用动态容器和动态组件结合
 */
const DynamicContainerDemo: React.FC = () => {
  // 随机背景色函数
  const randomColor = () => {
    const colors = ['#f0f8ff', '#f5f5dc', '#f0fff0', '#fff0f5', '#f0ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 容器配置
  const demoConfig = {
    id: 'demo-container',
    type: DetailType.Container,
    direction: Direction.Vertical,
    size: 100,
    details: [
      {
        id: 'top-container',
        type: DetailType.Container,
        size: 50,
        direction: Direction.Horizontal,
        details: [
          {
            id: 'top-left',
            type: DetailType.Detail,
            size: 50,
            configId: 'dynamicTableConfig_001',
            componentType: 'CustomTable',
            style: {
              backgroundColor: randomColor()
            }
          },
          {
            id: 'top-right',
            type: DetailType.Detail,
            size: 50,
            configId: 'contentDescConfig_001',
            componentType: 'ContentDesc',
            style: {
              backgroundColor: randomColor()
            }
          }
        ]
      },
      {
        id: 'bottom-container',
        type: DetailType.Container,
        size: 50,
        direction: Direction.Horizontal,
        details: [
          {
            id: 'bottom-left',
            type: DetailType.Detail,
            size: 33,
            configId: 'dynamicTableConfig_002',
            componentType: 'CustomTable',
            style: {
              backgroundColor: randomColor()
            }
          },
          {
            id: 'bottom-middle',
            type: DetailType.Detail,
            size: 33,
            configId: 'dynamicTableConfig_003',
            componentType: 'CustomTable',
            style: {
              backgroundColor: randomColor()
            }
          },
          {
            id: 'bottom-right',
            type: DetailType.Detail,
            size: 34,
            configId: 'contentDescConfig_002',
            componentType: 'ContentDesc',
            style: {
              backgroundColor: randomColor()
            }
          }
        ]
      }
    ]
  };

  // 使用静态工厂方法初始化容器
  const demoContainer = Container.init(demoConfig);
  return (
    <DemoLayout title="动态组件容器演示">
      <div style={{ width: '100%', minHeight: '800px', height: 'auto' }}>
        <ContainerV1 container={demoContainer} />
      </div>
    </DemoLayout>
  );
};

export default DynamicContainerDemo;
