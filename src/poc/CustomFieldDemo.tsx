'use client';

import React, { useState, useEffect } from 'react';
import { Space, Radio } from 'antd';
import { TypeOfTitleAndControlLayout } from '@/types/form';
import CustomForm from '@/components/form/CustomForm';
import loadConfig from '@/utils/configLoad';

const CustomFieldDemo: React.FC = () => {
  const [layout, setLayout] = useState<TypeOfTitleAndControlLayout>(
    TypeOfTitleAndControlLayout.horizontal
  );
  const [formLayoutConfig, setFormLayoutConfig] = useState<any>(null);
  const [formConfig, setFormConfig] = useState<any>(null);

  useEffect(() => {
    loadConfig('CustomFieldDemo/formLayoutConfig', setFormLayoutConfig);
    loadConfig('CustomFieldDemo/formConfig', setFormConfig);
  }, []);

  if (!formLayoutConfig) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '8px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 布局切换控件 */}
        <div>
          <Radio.Group
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value={TypeOfTitleAndControlLayout.horizontal}>
              水平布局
            </Radio.Button>
            <Radio.Button value={TypeOfTitleAndControlLayout.vertical}>
              垂直布局
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* 字段展示区域 */}
        <div style={{ 
          maxWidth: layout === TypeOfTitleAndControlLayout.horizontal ? '600px' : '400px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          padding: '24px',
          backgroundColor: '#fff'
        }}>
          <CustomForm 
            formConfig={formConfig}            
            formLayoutConfig={formLayoutConfig}
            titleAndControlLayout={layout}
          />
        </div>
      </Space>
    </div>
  );
};

export default CustomFieldDemo; 