'use client'

import React from 'react';
import { Flex, Typography } from 'antd';
import { withComponentRegister } from '@/utils/componentRegistry';

export interface ContentDescProps {
  content: React.ReactNode;
  style?: React.CSSProperties;
}

const ContentDesc: React.FC<ContentDescProps> = (config: ContentDescProps) => {
  const { content, style } = config;
  
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
      {typeof content === 'string' ? (
        <Typography.Title level={5} type="secondary">
          {content}
        </Typography.Title>
      ) : (
        content
      )}
    </Flex>
  );
}

// 使用高阶组件注册组件
export default withComponentRegister<ContentDescProps>('ContentDesc')(ContentDesc); 