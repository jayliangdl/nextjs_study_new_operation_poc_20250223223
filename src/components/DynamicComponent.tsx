'use client';

import React, { useEffect, useState } from 'react';
import DynamicTable from './DynamicTable';
import ContentDesc from './ContentDesc';

// 组件映射表
const componentMap = {
  DynamicTable,
  ContentDesc
};

interface DynamicComponentProps {
  configId?: string;
  config?: any;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ configId, config }) => {
  const [componentConfig, setComponentConfig] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    
    // 如果直接传入配置，使用该配置
    if (config) {
      setComponentConfig(config);
      return;
    }

    // 如果传入configId，从API获取配置
    if (configId) {
      fetch(`/api/config?configId=${configId}`)
        .then(res => res.json())
        .then(data => {
          if (data.result === 1) {
            setComponentConfig(data.data);
          } else {
            setError(data.message || '加载配置失败');
          }
        })
        .catch(err => {
          setError('加载配置出错: ' + err.message);
        });
    }
  }, [configId, config]);

  if (!configId && !config) {
    return <div className="error">错误：需要提供 configId 或 config 参数</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!componentConfig) {
    return <div>加载中...</div>;
  } else{
    // console.log('componentConfig', JSON.stringify(componentConfig));
  }

  // 获取组件类型
  const ComponentType = componentMap[componentConfig.componentType as keyof typeof componentMap];
  
  if (!ComponentType) {
    return <div className="error">错误：未找到组件类型 {componentConfig.componentType}</div>;
  }

  // 统一使用 config 属性传递配置
  // 使用类型断言确保类型安全
  // return React.createElement(
  //   ComponentType as React.ComponentType<any>, 
  //   { config: componentConfig.props }
  // );
  return <ComponentType config={componentConfig.props} />;
} 