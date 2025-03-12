'use client'

import React from 'react';

interface DemoLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const DemoLayout: React.FC<DemoLayoutProps> = ({ title, children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      overflow: 'hidden'  // 防止出现滚动条
    }}>
      <h2 style={{ padding: '20px', margin: 0 }}>{title}</h2>
      <div style={{ 
        padding: '20px', 
        flex: '1 1 auto',
        height: '0',  // 这个很重要，确保flex子项不会超出容器
        minHeight: '0',
        display: 'flex',
        position: 'relative',  // 为绝对定位的子元素提供参考
        overflow: 'hidden'  // 防止内容溢出
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          display: 'flex'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}; 