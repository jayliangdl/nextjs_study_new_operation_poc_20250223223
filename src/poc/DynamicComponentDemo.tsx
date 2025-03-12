'use client';

import React, { useState } from 'react';
import { DynamicComponent } from '../components/DynamicComponent';
import { Button, Space } from 'antd';

// 配置类型定义
type ComponentConfig = {
  componentType: string;
  props: Record<string, any>;
};

// DynamicTable 配置
const directTableConfig: ComponentConfig = {
  componentType: "DynamicTable",
  props: {
    title: "直接配置的表格",
    columns: [
      {
        title: "产品",
        dataIndex: "product",
        key: "product"
      },
      {
        title: "价格",
        dataIndex: "price",
        key: "price"
      }
    ],
    dataSource: {
      type: 'mock',
      data: [
        {
          product: "产品A",
          price: "¥100"
        },
        {
          product: "产品B",
          price: "¥200"
        }
      ]
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100']
    }
  }
};

// ContentDesc 配置
const directContentConfig: ComponentConfig = {
  componentType: "ContentDesc",
  props: {
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>动态内容描述示例</h3>
        <p>这是一个使用 ContentDesc 组件的示例</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✨ 支持自定义样式</li>
          <li>📝 支持 HTML 内容</li>
          <li>🎨 支持 React 组件</li>
        </ul>
      </div>
    ),
    style: {
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      minHeight: '200px'
    }
  }
};

const DynamicComponentDemo = () => {
  const [currentConfig, setCurrentConfig] = useState<ComponentConfig>(directContentConfig);

  const handleConfigSwitch = () => {
    setCurrentConfig(prev => 
      prev.componentType === "ContentDesc" ? directTableConfig : directContentConfig
    );
  };

  return (
    <div className="dynamic-component-demo">
      <h1>动态组件演示</h1>
      <section className="demo-section">
        <Space style={{ marginBottom: '20px' }}>
          <h2>通过直接配置加载组件</h2>
          <Button 
            type="primary"
            onClick={handleConfigSwitch}
          >
            切换到{currentConfig.componentType === "ContentDesc" ? "表格" : "内容描述"}组件
          </Button>
        </Space>
        <div className="component-wrapper">
          <DynamicComponent config={currentConfig} />
        </div>
      </section>

      <style jsx>{`
        .dynamic-component-demo {
          padding: 20px;
        }
        .demo-section {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 4px;
        }
        .component-wrapper {
          margin: 20px 0;
          padding: 20px;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default DynamicComponentDemo; 