import { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import { TabsProps } from 'antd';
// 容器内容类型枚举
export enum ContainerContentType {
  DynamicSplitter = 'DynamicSplitter',
  DynamicTable = 'DynamicTable',
  ContentDesc = 'ContentDesc',
}

export enum ContainerContentTypeV2 {
  DynamicTable = 'DynamicTable',
  ContentDesc = 'ContentDesc',
  CustomSplitterV2 = 'CustomSplitterV2',
  DynamicSplitter = 'DynamicSplitter'
}

// 容器属性接口
export interface ContainerProps {
  contentType: ContainerContentType;  // 容器内容类型
  instanceId: string;                 // 容器实例编号
  children: ReactNode;                // 子组件
} 

export interface ContainerPropsV2 {
  contentType: ContainerContentTypeV2;  // 容器内容类型
  instanceId: string;                 // 容器实例编号
  children: ReactNode;                // 子组件
}