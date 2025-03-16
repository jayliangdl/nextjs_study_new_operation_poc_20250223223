'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Button as ButtonClass } from '@/types/form';
import loadConfig from '@/utils/configLoad';
import { eventBus, EventType, getEventTypeWithBusinessId } from '@/utils/eventBus';
import { withComponentRegister } from '@/utils/componentRegistry';

export interface CustomButtonProps {
  /** configId 和 config 二选一，要么配置从调用者传入，要么仅传入configId，本组件会根据configId去加载配置 */
  configId?: string;// 配置ID 
  config?: any;// 具体配置(json)
  /**
   * 业务属性，
   * 背景：业务属性。
   * 有时候，容器和子容器或子容器下的Detail（例如表单及表单下的字段）需要传递一些业务属性。
   * 比如：formId，这时候可以通过这个属性传递
   */
  businessProps?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  configId,
  config,
  businessProps
}) => {
  const [button, setButton] = useState<ButtonClass | null>(null);

  useEffect(() => {
    if (configId) {
      loadConfig(configId, (config) => {
        const buttonInstance = new ButtonClass(
          config.buttonId,
          config.label,
          config.type,
          config.disabled
        );
        setButton(buttonInstance);
      });
    }
  }, [configId]);

  useEffect(() => {
    if (config) {
      const buttonInstance = new ButtonClass(
        config.buttonId,
        config.label,
        config.type,
        config.disabled
      );
      setButton(buttonInstance);
    }
  }, [config]);

  if (!button) {
    return <div>加载中...</div>;
  }

  const handleSubmit = () => {
    const eventType = getEventTypeWithBusinessId(EventType.FORM_SUBMIT, businessProps.formId);
    eventBus.publish(eventType, {
      buttonId: button.getButtonId()
    });
  };

  return (
    <Button
      type={button.getType()}
      disabled={button.getDisabled()}
      onClick={handleSubmit}
    >
      {button.getLabel()}
    </Button>
  );
};

// 使用高阶组件注册组件
export default withComponentRegister<CustomButtonProps>('CustomButton')(CustomButton);