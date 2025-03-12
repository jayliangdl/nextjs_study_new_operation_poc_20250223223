'use client'

import React, { useState } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { ContainerPropsV2 } from '@/types/container';
import styled from '@emotion/styled';
import { DraggableContentProps } from '@/types/customContainerV1';

// 定义主题颜色变量
const theme = {
  primary: 'orange',      // 主色调（橙色背景和边框）
  textOnPrimary: 'white', // 在主色调上的文字颜色
};

// 添加类型定义
interface ContainerWrapperProps {
  isHovered: boolean;
  isParent?: boolean;
}

interface StyledProps {
  isVisible: boolean;
}

// 使用 emotion 创建样式化组件
const ContainerWrapper = styled.div<ContainerWrapperProps>`
  position: relative;
  height: 100%;
  padding: ${(props: ContainerWrapperProps) => props.isParent ? '12px' : '4px'}; // 父容器有更大的内边距
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-color: ${(props: ContainerWrapperProps) => props.isParent ? '#fafafa' : 'transparent'}; // 父容器有浅灰背景
`;

const ContentTypeLabel = styled.div<StyledProps>`
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: ${theme.primary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: ${theme.textOnPrimary};
  font-weight: 500;
  opacity: ${(props: StyledProps) => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DragHandle = styled.div<StyledProps>`
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 4px 8px;
  cursor: move;
  opacity: ${(props: StyledProps) => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 1;
  background-color: ${theme.primary};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .anticon {
    color: ${theme.textOnPrimary};
    font-size: 14px;
  }
  
  &:hover {
    .anticon {
      display: none;
    }
    
    &::after {
      content: "✥";
      font-size: 16px;
      color: ${theme.textOnPrimary};
    }
  }
`;

interface ExtendedContainerProps extends ContainerPropsV2, DraggableContentProps {
  isParent?: boolean;
  onDragStart?: (instanceId: string) => void;  // 添加拖拽开始回调
  onDragEnd?: (info: { sourceId: string; targetId: string }) => void;    // 添加拖拽结束回调
}

// 添加全局变量
(window as any).currentDraggingId = '';

export const DraggableContainer: React.FC<ExtendedContainerProps> = ({
  contentType,
  instanceId,
  children,
  isParent = false,
  onDragStart,
  onDragEnd
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    // 设置 data-instance-id 属性
    e.currentTarget.setAttribute('data-instance-id', instanceId);
    // 设置全局变量
    (window as any).currentDraggingId = instanceId;
    console.log('DraggableContainer handleDragStart:', instanceId);
    // 设置拖拽数据
    e.dataTransfer.setData('text/plain', instanceId);
    console.log('开始拖动组件:', instanceId);
    onDragStart?.(instanceId);
  };

  const handleDragEnd = () => {
    // 清除全局变量
    (window as any).currentDraggingId = '';
    onDragEnd?.({
      sourceId: instanceId,
      targetId: ''  // 实际的 targetId 会在 CustomSplitter 的 handleDrop 中设置
    });
  };

  return (
    <ContainerWrapper
      id={`container-${instanceId}`}
      isHovered={isHovered}
      isParent={isParent}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isParent && (  // 只在非父容器时显示标签和拖拽图标
        <>
          <ContentTypeLabel isVisible={isHovered}>
            {contentType}
          </ContentTypeLabel>
          
          <DragHandle 
            isVisible={isHovered}
            draggable
            data-instance-id={instanceId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <HolderOutlined />
          </DragHandle>
        </>
      )}
      {/* {instanceId} */}
      {children}
    </ContainerWrapper>
  );
};

export default DraggableContainer; 