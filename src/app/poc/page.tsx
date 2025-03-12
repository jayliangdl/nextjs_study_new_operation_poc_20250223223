'use client';

import React from 'react';
import { Card, Space } from 'antd';
import Link from 'next/link';

const PocPage: React.FC = () => {
  const demos = [
    {
      title: 'CustomField 组件演示',
      description: '展示自定义表单字段组件的各种使用场景',
      path: '/poc/custom-field'
    },
    // 这里可以添加更多的演示组件
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>POC 演示</h1>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        {demos.map((demo) => (
          <Link key={demo.path} href={demo.path} style={{ textDecoration: 'none' }}>
            <Card 
              hoverable
              title={demo.title}
              style={{ width: '100%' }}
            >
              <p>{demo.description}</p>
            </Card>
          </Link>
        ))}
      </Space>
    </div>
  );
};

export default PocPage; 