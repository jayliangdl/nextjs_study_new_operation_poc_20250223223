'use client';

import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import CustomFieldDemo from '@/poc/CustomFieldDemo';

const CustomFieldDemoPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/poc">
          <Button>返回演示列表</Button>
        </Link>
      </div>
      <h1 style={{ marginBottom: '24px' }}>CustomField 组件演示</h1>
      <CustomFieldDemo />
    </div>
  );
};

export default CustomFieldDemoPage; 