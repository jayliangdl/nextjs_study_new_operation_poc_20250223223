'use client'

import React from 'react';
import { List, Card } from 'antd'; 
import Link from 'next/link';

const pocList = [
  {
    title: '动态分割面板',
    description: '基于 Ant Design Splitter 组件的动态配置示例',
    path: '/poc/dynamic-splitter'
  },
  {
    title: '动态列表',
    description: '可配置的动态数据表格示例',
    path: '/poc/dynamic-table'
  },
  // {
  //   title: '可拖拽容器',
  //   description: '用于包装其他组件的可拖拽容器',
  //   path: '/poc/draggable-container'
  // },
  // {
  //   title: '自定义分割面板',
  //   description: '基于 Ant Design Splitter 的自定义分割面板组件',
  //   path: '/poc/custom-splitter'
  // },
  // {
  //   title: '自定义页面布局',
  //   description: '基于 Ant Design Splitter 的自定义页面布局组件',
  //   path: '/poc/custom-pagelayout'
  // },
  {
    title: 'Container V1 Demo',
    description: '容器布局组件 V1 版本演示',
    path: '/poc/container-demo-v1'
  },
  {
    title: 'Dynamic Component Demo',
    description: '动态组件演示',
    path: '/poc/dynamic-component-demo'
  },
  {
    title: 'Dynamic Container Demo',
    description: '动态组件容器演示',
    path: '/poc/dynamic-container-demo'
  },
  {
    title: 'Tabs Container Demo',
    description: '标签页容器演示',
    path: '/poc/tabs-container-demo'
  },
  // {
  //   title: 'Custom Tabs Demo',
  //   description: '自定义标签页组件演示',
  //   path: '/poc/custom-tabs-demo'
  // },
  {
    title: '悬浮交互组件演示',
    description: '鼠标悬浮时显示操作图标和菜单的组件',
    path: '/poc/hover-interaction-demo'
  },
  {
    title: 'CustomField 组件演示',
    description: '展示自定义表单字段组件的各种使用场景',
    path: '/poc/custom-field'
  }
];

const HomePage: React.FC = () => (
  <div style={{ padding: '24px' }}>
    <h1>POC 示例导航</h1>
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={pocList}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.title} hoverable>
            <p>{item.description}</p>
            <Link href={item.path}>查看示例</Link>
          </Card>
        </List.Item>
      )}
    />
  </div>
);

export default HomePage;