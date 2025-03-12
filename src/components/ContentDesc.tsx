'use client'

import React from 'react';
import { Flex, Typography } from 'antd';

interface ContentConfig {
  content: React.ReactNode;
  style?: React.CSSProperties;
}

interface ContentDescProps {
  config: ContentConfig;
}

const ContentDesc: React.FC<ContentDescProps> = ({ config = {} as ContentConfig }) => {
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

export default ContentDesc; 