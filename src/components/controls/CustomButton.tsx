'use client';

import React from 'react';
import { Button as AntButton } from 'antd';
import { ButtonProps,Button } from '@/types/form';


const CustomButton: React.FC<ButtonProps> = ({
  buttonId,
  type,
  label,
  disabled,
}) => {

  // const type = field instanceof Button ? field.getType(): undefined;
  // const label = field instanceof Button ? field.getLabel(): undefined;
  // const onClick = field instanceof Button ? field.getonClick(): undefined;

  const handleClick = () => {
    console.log('handleClick');
  };

  return (
    <AntButton
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </AntButton>
  );
};

export default CustomButton;