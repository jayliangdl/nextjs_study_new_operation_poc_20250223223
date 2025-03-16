import React, { useEffect, useState } from 'react';
import { TYPE_OF_VALUE, TypeOfTitleAndControlLayout } from '@/types/form';
import { Container, DetailType, Direction } from '@/types/customContainerV1';
import { ContainerV1 } from '../ContainerV1';
import { eventBus, EventType, getEventTypeWithBusinessId } from '@/utils/eventBus';

interface CustomFormProps {
  formConfig: {
    formId: string;
    title: string;
  },
  formLayoutConfig: {
    direction: Direction;
    details: {
      type: DetailType;
      size: number;
      direction?: Direction;
      details?: any[];
      configId?: string;
      componentType?: string;
      props?: any;
    }[];
  };
  titleAndControlLayout?: TypeOfTitleAndControlLayout;
}

const CustomForm: React.FC<CustomFormProps> = ({
  formConfig,
  formLayoutConfig,
  titleAndControlLayout = TypeOfTitleAndControlLayout.horizontal
}) => {
  const [formContainer, setFormContainer] = useState<Container | null>(null);
  const values: { [key: string]: TYPE_OF_VALUE } = {};
  const handleChangeValue = (fieldId: string, value: TYPE_OF_VALUE) => {
    values[fieldId] = value;
  };

  const handleSubmit = () => {
    console.log(`提交表单:${JSON.stringify(values)}`);
  };

  useEffect(() => {
    // 创建容器配置
    const containerConfig = {
      id: formConfig?.formId,
      type: DetailType.Container,
      direction: formLayoutConfig?.direction,
      size: 100,
      details: formLayoutConfig?.details?.map(detail => ({
        ...detail,
        id: detail.configId || `detail-${Math.random()}`,
        configId: detail.configId,
        props: {
          ...detail.props,
          titleAndControlLayout,
          onChangeValue: handleChangeValue,
          submit: handleSubmit
        }
      }))
    };
    const _formContainer = Container.init(containerConfig);
    setFormContainer(_formContainer);
  }, [formConfig,formLayoutConfig]);

  

  const handleFormFilling = (data:any) => {
    if('fieldId' in data && data['fieldId'] && 'value' in data && data['value']){
      values[data['fieldId']] = data['value'];
    }
  };

  const handleFormSubmit = (data:any) => {
    console.log('表单提交', data);
    console.log(`提交表单:${JSON.stringify(values)}`);
  };

  useEffect(() => {
    if(!formConfig?.formId){
      return;
    }
    const eventTypeFormFilling = getEventTypeWithBusinessId(EventType.FORM_FILLING, formConfig?.formId);
    const eventTypeFormSubmit = getEventTypeWithBusinessId(EventType.FORM_SUBMIT, formConfig?.formId);
    eventBus.subscribe(eventTypeFormFilling, handleFormFilling);
    eventBus.subscribe(eventTypeFormSubmit, handleFormSubmit);
    return () => {
      eventBus.unsubscribe(eventTypeFormFilling, handleFormFilling);
      eventBus.unsubscribe(eventTypeFormSubmit, handleFormSubmit);
    };
  }, [formConfig?.formId]);

  // 使用静态工厂方法初始化容器
  
  return (
    <div>
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333'
        }}
      >
        {formConfig && formConfig.title}
      </div>
      {formContainer && <ContainerV1 container={formContainer} businessProps={formConfig} />}
    </div>
  );
};

export default CustomForm;