import React from 'react';
import { Detail, DetailType, Direction, InsertPositionV2 } from '../types/customContainerV1';
import DraggableContainer from './DraggableContainer';
import { ContainerContentTypeV2 } from '../types/container';
import { ResizerV1 } from './ResizerV1';
import { DynamicComponent } from './DynamicComponent';
interface DetailV1Props {
  detail: Detail;
  detailIndexInParent: number;//当前detail在父容器中的索引
  className?: string;
  parentDirection: Direction;
  onDrop?: (index: number, insertPositionV2: InsertPositionV2, e: React.DragEvent, parentType: DetailType,referenceDetailId:string) => void;
  /**
   * 业务属性，
   * 背景：业务属性。
   * 有时候，容器和子容器或子容器下的Detail（例如表单及表单下的字段）需要传递一些业务属性。
   * 比如：formId，这时候可以通过这个属性传递
   */
  businessProps?: any;
}

export const DetailV1: React.FC<DetailV1Props> = ({ 
  detail, 
  detailIndexInParent,
  className,
  parentDirection,
  onDrop,
  businessProps
}) => {
  const perpDirection = parentDirection === Direction.Horizontal ? 
    Direction.Vertical : Direction.Horizontal;

    const handleDrop = (_index: number, insertPosition: InsertPositionV2, e: React.DragEvent) => {
      onDrop?.(detailIndexInParent, insertPosition, e, DetailType.Detail,detail.id);
    }

  return (
    <div className={className} style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: perpDirection === Direction.Horizontal ? 'row' : 'column'
    }}>
      {detail.needFirstAndLastResizer && (
        <ResizerV1
          direction={perpDirection}
          index={0}          
          parentType={DetailType.Detail}
          totalDetails={1}
          onDrop={handleDrop}
          draggingDetailIdOfRejectDrop={detail.id}
          referenceDetailId={detail.id}
          insertPosition={perpDirection === Direction.Horizontal ? InsertPositionV2.Left : InsertPositionV2.Above}
        />
      )}
      <div style={{ flex: 1 }}>
        <DraggableContainer
          contentType={ContainerContentTypeV2.ContentDesc}
          instanceId={detail.id}
        >
          {/* <ContentDesc config={{
            content: detail.id,
            style: detail.style
          }}/> */}
          {detail.configId && <DynamicComponent configId={detail.configId} businessProps={businessProps}/>}
        </DraggableContainer>
      </div>
      {detail.needFirstAndLastResizer && (
        <ResizerV1
          direction={perpDirection}
          index={1}
          parentType={DetailType.Detail}
          totalDetails={1}
          onDrop={handleDrop}
          draggingDetailIdOfRejectDrop={detail.id}
          insertPosition={perpDirection === Direction.Horizontal ? InsertPositionV2.Right : InsertPositionV2.Below}
          referenceDetailId={detail.id}
        />
      )}
    </div>
  );
}; 