'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Form } from 'antd';
import { TypeOfTitleAndControlLayout, TYPE_OF_VALUE } from '@/types/form';
import { getControl } from './controls';
import loadConfig from '@/utils/configLoad';
import { InputField, InputNumberField, SelectField, FieldType } from '@/types/form';
import { eventBus, EventType, getEventTypeWithBusinessId } from '@/utils/eventBus';
import { withComponentRegister } from '@/utils/componentRegistry';

export interface CustomFieldProps {
  /** configId 和 config 二选一，要么配置从调用者传入，要么仅传入configId，本组件会根据configId去加载配置 */
  configId?: string;// 配置ID 
  config?: any;// 具体配置(json)
  titleAndControlLayout?: TypeOfTitleAndControlLayout;// 标题和控件布局
  /**
   * 业务属性，
   * 背景：业务属性。
   * 有时候，容器和子容器或子容器下的Detail（例如表单及表单下的字段）需要传递一些业务属性。
   * 比如：formId，这时候可以通过这个属性传递
   */
  businessProps?: any;
}

const CustomField: React.FC<CustomFieldProps> = ({
  configId,
  config,  
  titleAndControlLayout = TypeOfTitleAndControlLayout.horizontal,
  businessProps
}) => {
  const [field, setField] = useState<InputField | InputNumberField | SelectField | null>(null);

  const fieldInst = (config: any) => {
    // 根据配置创建对应的字段实例
    let fieldInstance;
    if (config.fieldType === FieldType.SELECT) {
      fieldInstance = new SelectField(
        config.fieldId,
        config.fieldName,
        config.fieldType,
        config.defaultValue,
        config.required,
        config.readOnly,
        config.disabled,
        config.placeholder,
        config.options,
        config.helpText
      );
    } else if (config.fieldType === FieldType.NUMBER) {
      fieldInstance = new InputNumberField(
        config.fieldId,
        config.fieldName,
        config.fieldType,
        config.defaultValue,
        config.required,
        config.readOnly,
        config.disabled,
        config.placeholder,
        config.min,
        config.max,
        config.step,
        config.precision,
        config.helpText
      );
    } else {
      fieldInstance = new InputField(
        config.fieldId,
        config.fieldName,
        config.fieldType,
        config.defaultValue,
        config.required,
        config.readOnly,
        config.disabled,
        config.placeholder,
        config.maxLength,
        config.helpText
      );
    }
    setField(fieldInstance);
  };

  // 使用configId初始化字段
  useEffect(() => {
    if (configId) {
      loadConfig(configId, fieldInst);
    }
  }, [configId]);

  // 使用config初始化字段
  useEffect(() => {
    if (config) {
      fieldInst(config);    
    }
  }, [config]);

  if (!field) {
    return <div>加载中...</div>;
  }

  // 渲染字段控件
  const renderFieldControl = () => {
    const fieldType = field.getFieldType();
    const eventType = getEventTypeWithBusinessId(EventType.FORM_FILLING, businessProps.formId);
    const handleChangeValue = (value: TYPE_OF_VALUE) => {
      eventBus.publish(eventType, {
        fieldId: field.getFieldId(),
        value: value
      });
    };

    const Control = getControl(fieldType);
    
    return (
      <Suspense fallback={<div style={{ color: '#999' }}>Loading...</div>}>
        <Control field={field} onChangeValue={handleChangeValue} />
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

// 使用高阶组件注册组件
export default withComponentRegister<CustomFieldProps>('CustomField')(CustomField);
