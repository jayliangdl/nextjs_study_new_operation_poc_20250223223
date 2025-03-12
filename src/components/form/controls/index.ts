import { FieldType } from '@/types/form';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { ControlProps } from '@/components/controls/CustomInput';

type ControlMap = {
  [key in FieldType]?: () => Promise<ComponentType<ControlProps>>;
};

// 控件映射表
const controlMap: ControlMap = {
  [FieldType.TEXT]: () => import('../../controls/CustomInput').then(mod => mod.default),
  [FieldType.TEXTAREA]: () => import('../../controls/CustomInput').then(mod => mod.default.TextArea),
  [FieldType.PASSWORD]: () => import('../../controls/CustomInput').then(mod => mod.default.Password),
  [FieldType.NUMBER]: () => import('../../controls/CustomNumber').then(mod => mod.default),
  [FieldType.SELECT]: () => import('../../controls/CustomSelect').then(mod => mod.default),
//   [FieldType.DATE]: () => dynamic(() => import('./DateControl')),
//   [FieldType.TIME]: () => dynamic(() => import('./TimeControl')),
//   [FieldType.RADIO]: () => dynamic(() => import('./RadioControl')),
//   [FieldType.CHECKBOX]: () => dynamic(() => import('./CheckboxControl')),
};

export const getControl = (type: FieldType) => {
  return dynamic(() => controlMap[type]?.() || controlMap[FieldType.TEXT]!());
}; 