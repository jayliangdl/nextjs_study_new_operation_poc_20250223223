'use client';

import React, { useState } from 'react';
import { Space, Radio, message } from 'antd';
// import { CustomField } from '@/components/form/CustomField';
import { InputField, InputNumberField, SelectField, TypeOfTitleAndControlLayout, 
  FieldType,Button,ButtonProps,TYPE_OF_VALUE } from '@/types/form';
// import CustomButton from '@/components/controls/CustomButton';
import CustomForm from '@/components/form/CustomForm'

// 字段配置的 JSON 定义
const fieldsConfig = `{
  "fields": [
    {
      "fieldId": "username",
      "fieldName": "用户名",
      "fieldType": "text",
      "defaultValue": "",
      "required": true,
      "readOnly": false,
      "disabled": false,
      "placeholder": "请输入用户名",
      "maxLength": 5,
      "helpText": "请输入您的用户名"
    },
    {
      "fieldId": "password",
      "fieldName": "密码",
      "fieldType": "password",
      "defaultValue": "",
      "required": true,
      "readOnly": false,
      "disabled": false,
      "placeholder": "请输入密码",
      "maxLength": 20,
      "helpText": "请输入6-20位密码"
    },
    {
      "fieldId": "age",
      "fieldName": "年龄",
      "fieldType": "number",
      "defaultValue": "",
      "required": true,
      "readOnly": false,
      "disabled": false,
      "placeholder": "请输入年龄",
      "min": 0,
      "max": 150,
      "step": 1,
      "precision": 0,
      "helpText": "请输入您的年龄"
    },
    {
      "fieldId": "gender",
      "fieldName": "性别",
      "fieldType": "select",
      "defaultValue": "",
      "required": true,
      "readOnly": false,
      "disabled": false,
      "placeholder": "请选择性别",
      "options": [
        { "label": "男", "value": "male" },
        { "label": "女", "value": "female" },
        { "label": "其他", "value": "other" }
      ],
      "helpText": "请选择您的性别"
    },
    {
      "fieldId": "education",
      "fieldName": "学历",
      "fieldType": "select",
      "defaultValue": "",
      "required": false,
      "readOnly": false,
      "disabled": false,
      "placeholder": "请选择学历",
      "options": [
        { "label": "高中", "value": "high_school" },
        { "label": "专科", "value": "college" },
        { "label": "本科", "value": "bachelor" },
        { "label": "硕士", "value": "master" },
        { "label": "博士", "value": "phd" }
      ],
      "helpText": "请选择您的最高学历"
    },
    {
      "fieldId": "remark",
      "fieldName": "备注",
      "fieldType": "textarea",
      "defaultValue": "",
      "required": false,
      "readOnly": false,
      "disabled": false,
      "placeholder": "请输入备注信息",
      "maxLength": 100,
      "minLength": 0,
      "helpText": "选填项，请输入备注信息",
      "rows": 4
    },
    {
      "fieldId": "readonly",
      "fieldName": "只读字段",
      "fieldType": "text",
      "defaultValue": "这是一个只读字段",
      "required": false,
      "readOnly": true,
      "disabled": false,
      "placeholder": "",
      "maxLength": 50,
      "minLength": 0,
      "helpText": "这是一个只读字段示例"
    },
    {
      "fieldId": "disabled",
      "fieldName": "禁用字段",
      "fieldType": "text",
      "defaultValue": "这是一个禁用字段",
      "required": false,
      "readOnly": false,
      "disabled": true,
      "placeholder": "",
      "maxLength": 50,
      "minLength": 0,
      "helpText": "这是一个禁用字段示例"
    }
  ]
}`;

const buttonsConfig = `{
  "buttons": [
    {
      "buttonId": "myButton",
      "label": "Custom Button",
      "type": "button",
      "disabled": false
    }
  ]
}`;

const CustomFieldDemo: React.FC = () => {
  // 用于切换布局方式
  const [layout, setLayout] = useState<TypeOfTitleAndControlLayout>(
    TypeOfTitleAndControlLayout.horizontal
  );

  // 从 JSON 配置创建字段实例
  const createFieldsFromConfig = () => {
    try {
      const config = JSON.parse(fieldsConfig);
      return config.fields.map((fieldConfig: any) => {
        if (fieldConfig.fieldType === FieldType.SELECT) {
          return new SelectField(
            fieldConfig.fieldId,
            fieldConfig.fieldName,
            fieldConfig.fieldType,
            fieldConfig.defaultValue,
            fieldConfig.required,
            fieldConfig.readonly,
            fieldConfig.disabled,
            fieldConfig.placeholder,
            fieldConfig.options,
            fieldConfig.helpText
          );
        }

        else if (fieldConfig.fieldType === FieldType.NUMBER) {
          return new InputNumberField(
            fieldConfig.fieldId,
            fieldConfig.fieldName,
            fieldConfig.fieldType,
            fieldConfig.defaultValue,
            fieldConfig.required,
            fieldConfig.readonly,
            fieldConfig.disabled,
            fieldConfig.placeholder,
            fieldConfig.min,
            fieldConfig.max,
            fieldConfig.step,
            fieldConfig.precision,
            fieldConfig.helpText
          );
        }
        
        else if (fieldConfig.fieldType === FieldType.TEXT || fieldConfig.fieldType === FieldType.PASSWORD || fieldConfig.fieldType === FieldType.TEXTAREA) {
          return new InputField(
            fieldConfig.fieldId,
            fieldConfig.fieldName,
            fieldConfig.fieldType as FieldType,
            fieldConfig.defaultValue,
            fieldConfig.required,
            fieldConfig.readonly,
            fieldConfig.disabled,
            fieldConfig.placeholder,
            fieldConfig.maxLength
          );
        }

        else {
          throw new Error(`类型错误，没有对应的字段类型: ${fieldConfig.fieldType}`);
        }
      });
    } catch (error) {
      console.error('解析字段配置失败:', error);
      return [];
    }
  };


  const createButtonsFromConfig = ():Button[] => {
    try {
      const config = JSON.parse(buttonsConfig);
      return config.buttons.map((buttonConfig: ButtonProps) => {
          return new Button(
            buttonConfig.buttonId,
            buttonConfig.label,
            buttonConfig.type,
            buttonConfig.disabled
          );
      });
    } catch (error) {
      console.error('解析字段配置失败:', error);
      return [];
    }
  };

  // 创建字段实例
  const fields = createFieldsFromConfig();

  // 创建按钮实例
  const buttons = createButtonsFromConfig();


  return (
    <div style={{ padding: '24px' }}>
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
          <CustomForm fields={fields} buttons={buttons} titleAndControlLayout={layout}/>
        </div>

        {/* 说明文本 */}
        <div style={{ color: '#666' }}>
          <h3>演示说明：</h3>
          <ul>
            <li>可以切换水平/垂直布局方式</li>
            <li>展示了必填字段、选填字段、只读字段和禁用字段</li>
            <li>每个字段都包含标题、控件和帮助文本</li>
            <li>字段值变化时会在控制台打印日志</li>
            <li>字段配置使用 JSON 格式，方便从数据库读取</li>
          </ul>
        </div>

        {/* JSON 配置预览 */}
        <div>
          <h3>字段配置 JSON：</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {fieldsConfig}
          </pre>
        </div>
      </Space>
    </div>
  );
};

export default CustomFieldDemo; 