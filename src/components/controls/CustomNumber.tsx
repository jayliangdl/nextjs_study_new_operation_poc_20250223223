'use client';

import React, { useState } from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { Field, InputNumberField, ControlProps } from '@/types/form';

const CustomNumber: React.FC<ControlProps> = ({
  field,
  onChangeValue,
}) => {
  const [value, setValue] = useState<number | null>(Number(field.getValue()) || null);
  
  const handleChange = (newValue:number|null) =>  {
      setValue(newValue);
      field.setValue(newValue);
      onChangeValue?.(newValue);
  };

  // 确保字段是 InputNumberField 类型
  if (!(field instanceof InputNumberField)) {
    console.warn('CustomNumber: field is not instance of InputNumberField');
    return null;
  }

  return (
    <InputNumber
      value={value}
      onChange={handleChange}
      disabled={field.getDisabled()}
      readOnly={field.getReadonly()}
      placeholder={field.getPlaceholder()}
      min={field.getMin()}
      max={field.getMax()}
      step={field.getStep()}
      precision={field.getPrecision()}
      className="custom-input"
      style={{ width: '100%', borderRadius: '6px' }}
    />
  );
};

export default CustomNumber; 