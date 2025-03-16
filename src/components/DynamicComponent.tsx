'use client';

import React, { useEffect, useState } from 'react';
import { componentRegistry } from '@/utils/componentRegistry';
import loadConfig from '@/utils/configLoad';

// 配置类型
interface DynamicComponentConfig {
  componentType: string;  // 改回 string 类型，因为现在是动态注册
  props: any;
}

interface DynamicComponentProps {
  configId?: string;
  config?: DynamicComponentConfig;
  businessProps?: any;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ configId, config, businessProps }) => {
  const [componentConfig, setComponentConfig] = useState<DynamicComponentConfig | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if(!configId && !config){
      console.error('configId和config不能同时为空');
      setError('错误：需要提供 configId 或 config 参数');
      return;
    }
    
    // 如果直接传入配置，验证并使用该配置
    if (config) {
      if (!config.componentType || !componentRegistry.hasComponent(config.componentType)) {
        const error = `错误：无效的组件类型 ${config.componentType}。可用类型：${componentRegistry.getRegisteredTypes().join(', ')}`;
        console.error(error);
        setError(error);
        return;
      }
      setComponentConfig(config);
      return;
    }

    if(configId){
      loadConfig(configId!, (loadedConfig) => {
        if (!loadedConfig.componentType || !componentRegistry.hasComponent(loadedConfig.componentType)) {
          const error = `错误：配置文件 ${configId} 包含无效的组件类型 ${loadedConfig.componentType}。可用类型：${componentRegistry.getRegisteredTypes().join(', ')}`;
          console.error(error);
          setError(error);
          return;
        }
        setComponentConfig(loadedConfig);
      });
    }
  }, [configId, config]);

  if (error) {
    return <div className="error" style={{ color: 'red', padding: '8px' }}>{error}</div>;
  }

  if (!componentConfig) {
    return <div>加载中...</div>;
  }  
  // 获取组件类型
  const componentEntry = componentRegistry.getComponent(componentConfig.componentType);
  
  if (!componentEntry) {
    return <div className="error" style={{ color: 'red', padding: '8px' }}>
      错误：未找到组件类型 {componentConfig.componentType}
    </div>;
  }

  const Component = componentEntry.component;

  // 合并 businessProps 到组件 props
  const componentProps = {
    ...componentConfig.props,
    businessProps
  };
  return <Component {...componentProps} />;
}; 