import React, { useState, useEffect } from 'react';
import {DynamicComponent} from './DynamicComponent';

/**
 * 自定义Detail内容渲染组件
 * 根据configId动态加载配置并渲染对应的组件
 */
const CustomDetailContent: React.FC<{ configId: string }> = ({ configId }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        // 从本地配置文件获取配置
        const response = await fetch(`/configs/${configId}.json`);
        
        if (!response.ok) {
          throw new Error(`配置加载失败: ${response.status}`);
        }
        
        const configData = await response.json();
        setConfig(configData);
        setError(null);
      } catch (err) {
        console.error('加载配置出错:', err);
        setError(`加载配置出错: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (configId) {
      fetchConfig();
    }
  }, [configId]);
  
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>加载配置中...</div>;
  }
  
  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;
  }
  
  if (!config) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>未找到配置: {configId}</div>;
  }
  
  return <DynamicComponent config={config} />;
};

export default CustomDetailContent;
