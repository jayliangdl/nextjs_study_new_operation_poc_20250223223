'use client';

import React from 'react';
import { Button } from 'antd';
import { ButtonProps } from '@/types/form';


const CustomButton: React.FC<ButtonProps> = ({
  buttonId,
  type,
  label,
  disabled,
  submit,
}) => {
  
  const handleClick = () => {
    submit();
  };

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default CustomButton;