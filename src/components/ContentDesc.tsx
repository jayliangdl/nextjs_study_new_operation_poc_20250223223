'use client'

import React, { useEffect,useState } from 'react';
import { Flex, Typography } from 'antd';
import { withComponentRegister } from '@/utils/componentRegistry';
import loadConfig from '@/utils/configLoad';
import { ContentDesc as ContentDescType, ContentDescConfig } from '@/types/contentDesc';

// export interface ContentDescProps {
//   content: React.ReactNode;
//   style?: React.CSSProperties;
// }

export interface ContentDescProps {
  /** configId 和 config 二选一，要么配置从调用者传入，要么仅传入configId，本组件会根据configId去加载配置 */
  configId?: string;// 配置ID 
  config?: any;// 具体配置(json)
  style?: React.CSSProperties;
}

const ContentDesc: React.FC<ContentDescProps> = ({
  configId, config, style 
}: ContentDescProps) => {
  const [content, setContent] = useState<ContentDescType | null>(null);
  const inst = (config: ContentDescConfig) => {
    const contentDesc = new ContentDescType(config);    
    setContent(contentDesc);
  }
  // 使用configId初始化字段
  useEffect(() => {
    if (configId) {
      loadConfig(configId, inst);
    }
  }, [configId]);

  // 使用config初始化字段
  useEffect(() => {
    if (config) {
      inst(config);    
    }
  }, [config]);

  if (!content) {
    return <div>加载中...</div>;
  }else{  
    return (
      <Flex 
        justify="center" 
        align="center" 
        style={{ 
          height: '100%',
          // backgroundColor: '#fafafa',      
          borderRadius: '4px',
          border: '1px solid #ddd',
          ...style 
        }}
      >
        {content ? (
          <Typography.Title level={5} type="secondary">
            {content.getContent()}
          </Typography.Title>
        ) : (
          <div>加载中...</div>
        )}
      </Flex>
    );
  }
}

// 使用高阶组件注册组件
export default withComponentRegister<ContentDescProps>('ContentDesc')(ContentDesc); 