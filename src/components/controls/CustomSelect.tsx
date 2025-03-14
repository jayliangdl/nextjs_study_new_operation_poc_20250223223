'use client';

import React, { useState } from 'react';
import { Select } from 'antd';
import { Field, SelectField, ControlProps } from '@/types/form';

const CustomSelect: React.FC<ControlProps> = ({
  field,
  onChangeValue
}) => {
  const [value, setValue] = useState<string | number>(field.getValue() as string | number);
  
  const handleChange = (newValue: string | number) => {    
    setValue(newValue);
    field.setValue(newValue);
    onChangeValue?.(newValue);
  };

  // 确保字段是 SelectField 类型
  if (!(field instanceof SelectField)) {
    console.warn('CustomSelect: field is not instance of SelectField');
    return null;
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      disabled={field.getDisabled()}
      placeholder={field.getPlaceholder()}
      options={field.getOptions()}
      className="custom-select"
      style={{ width: '100%', borderRadius: '6px' }}
    />
  );
};

export default CustomSelect; 