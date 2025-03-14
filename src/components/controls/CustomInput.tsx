'use client';

import React, { useState } from 'react';
import { Input } from 'antd';
import { InputField, ControlProps } from '@/types/form';

export const CustomInput: React.FC<ControlProps> = ({
  field,
  onChangeValue
}) => {
  const [value, setValue] = useState(String(field.getValue()));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setValue(e.target.value);
    field.setValue(e.target.value);
    onChangeValue?.(e.target.value);
  };

  // 获取长度限制
  const maxLength = field instanceof InputField ? field.getMaxLength() : undefined;

  return (
    <Input
      value={value}
      onChange={handleChange}
      disabled={field.getDisabled()}
      readOnly={field.getReadonly()}
      placeholder={field instanceof InputField ? field.getPlaceholder() : ''}
      maxLength={maxLength}
      className="custom-input"
      style={{ borderRadius: '6px' }}
    />
  );
};

const Password: React.FC<ControlProps> = ({
    field,
    onChangeValue
}) => {
    const [value, setValue] = useState(String(field.getValue()));
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
        setValue(e.target.value);
        field.setValue(e.target.value);
        onChangeValue?.(e.target.value);
    };

  // 获取长度限制
  const maxLength = field instanceof InputField ? field.getMaxLength() : undefined;

  return (
    <Input.Password
      value={value}
      onChange={handleChange}
      disabled={field.getDisabled()}
      readOnly={field.getReadonly()}
      placeholder={field instanceof InputField ? field.getPlaceholder() : ''}
      maxLength={maxLength}
      className="custom-input"
      style={{ borderRadius: '6px' }}
    />
  );
};

const TextArea: React.FC<ControlProps> = ({
    field,
    onChangeValue
}) => {
    const [value, setValue] = useState(String(field.getValue()));
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {    
      setValue(e.target.value);
      field.setValue(e.target.value);
      onChangeValue?.(e.target.value);
    };

  // 获取长度限制
  const maxLength = field instanceof InputField ? field.getMaxLength() : undefined;

  return (
    <Input.TextArea
      value={value}
      onChange={handleChange}
      disabled={field.getDisabled()}
      readOnly={field.getReadonly()}
      placeholder={field instanceof InputField ? field.getPlaceholder() : ''}
      maxLength={maxLength}
      className="custom-input"
      style={{ borderRadius: '6px' }}
    />
  );
};

type CustomInputComponent = React.FC<ControlProps> & {
  Password: React.FC<ControlProps>;
  TextArea: React.FC<ControlProps>;
};

const CustomInputWithVariants = CustomInput as CustomInputComponent;
CustomInputWithVariants.Password = Password;
CustomInputWithVariants.TextArea = TextArea;

export default CustomInputWithVariants;
