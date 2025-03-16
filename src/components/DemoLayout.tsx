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
      overflow: 'auto'  // 允许滚动
    }}>
      <h2 style={{ padding: '20px', margin: 0 }}>{title}</h2>
      <div style={{ 
        padding: '20px', 
        flex: '1 1 auto',
        minHeight: '0',
        display: 'flex',
        position: 'relative',  // 为绝对定位的子元素提供参考
        overflow: 'auto'  // 允许滚动
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: 'auto',          
          display: 'flex'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}; 