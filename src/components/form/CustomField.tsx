'use client';

import React, { Suspense } from 'react';
import { Field, TypeOfTitleAndControlLayout } from '@/types/form';
import { getControl } from './controls';

export interface CustomFieldProps {
  field: Field;
  titleAndControlLayout?: TypeOfTitleAndControlLayout;
}

export const CustomField: React.FC<CustomFieldProps> = ({
  field,
  titleAndControlLayout = TypeOfTitleAndControlLayout.horizontal,
}) => {
  // 渲染字段控件
  const renderFieldControl = () => {
    const fieldType = field.getFieldType();

    // 动态获取控件组件
    const Control = getControl(fieldType);

    // 使用 Suspense 包裹动态组件
    return (
      <Suspense fallback={
        <div style={{ color: '#999' }}>Loading...</div>
      }>
        <Control field={field} />
      </Suspense>
    );
  };

  // 渲染必填标记
  const renderRequiredMark = () => {
    if (field.getRequired()) {
      return <span className="required-mark" style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>;
    }
    return null;
  };

  // 渲染帮助文本
  const renderHelpText = () => {
    const helpText = field.getHelpText();
    if (helpText) {
      return <div className="help-text" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{helpText}</div>;
    }
    return null;
  };

  return (
    <div 
      className={`custom-field ${titleAndControlLayout}`}
      style={{
        display: 'flex',
        flexDirection: titleAndControlLayout === TypeOfTitleAndControlLayout.vertical ? 'column' : 'row',
        alignItems: titleAndControlLayout === TypeOfTitleAndControlLayout.vertical ? 'flex-start' : 'center',
        marginBottom: '16px'
      }}
    >
      <div 
        className="field-title"
        style={{
          marginRight: titleAndControlLayout === TypeOfTitleAndControlLayout.horizontal ? '16px' : '0',
          marginBottom: titleAndControlLayout === TypeOfTitleAndControlLayout.vertical ? '8px' : '0',
          minWidth: titleAndControlLayout === TypeOfTitleAndControlLayout.horizontal ? '120px' : 'auto',
          textAlign: titleAndControlLayout === TypeOfTitleAndControlLayout.horizontal ? 'right' : 'left'
        }}
      >
        {renderRequiredMark()}
        {field.getFieldName()}
      </div>
      <div className="field-control" style={{ flex: 1 }}>
        {renderFieldControl()}
        {renderHelpText()}
      </div>
    </div>
  );
};

export default CustomField;
