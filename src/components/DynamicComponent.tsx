'use client';

import React, { useEffect, useState } from 'react';
import DynamicTable from './DynamicTable';
import ContentDesc from './ContentDesc';
import loadConfig from '@/utils/configLoad';
import CustomField from '@/components/form/CustomField';
import CustomButton from '@/components/controls/CustomButton';
// 组件映射表
const componentMap = {
  DynamicTable,
  ContentDesc,
  CustomField,
  CustomButton,
};

interface DynamicComponentProps {
  configId?: string;
  config?: any;
  /**
   * 业务属性，
   * 背景：业务属性。
   * 有时候，容器和子容器或子容器下的Detail（例如表单及表单下的字段）需要传递一些业务属性。
   * 比如：formId，这时候可以通过这个属性传递
   */
  businessProps?: any;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ configId, config, businessProps }) => {
  const [componentConfig, setComponentConfig] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if(!configId && !config){
      console.error('configId和config不能同时为空');
      return;
    }
    
    // 如果直接传入配置，使用该配置
    if (config) {
      setComponentConfig(config);
      return;
    }
    if(configId){
      loadConfig(configId!, setComponentConfig);
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
    return <ComponentType {...componentConfig.props} businessProps={businessProps} />;
  }
  
} 