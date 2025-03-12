import React from 'react';
import { Detail, DetailType, Direction, InsertPositionV2 } from '../types/customContainerV1';
import DraggableContainer from './DraggableContainer';
import ContentDesc from './ContentDesc';
import { ContainerContentTypeV2 } from '../types/container';
import { ResizerV1 } from './ResizerV1';
import { DynamicComponent } from './DynamicComponent';
// import { TableConfig } from '@/types/dynamicTable';
// import DynamicTable from './DynamicTable';
interface DetailV1Props {
  detail: Detail;
  detailIndexInParent: number;//当前detail在父容器中的索引
  className?: string;
  parentDirection: Direction;
  onDrop?: (index: number, insertPositionV2: InsertPositionV2, e: React.DragEvent, parentType: DetailType,referenceDetailId:string) => void;
}

// // Mock 数据示例
// const mockData = Array.from({ length: 100 }).map((_, index) => ({
//   id: index + 1,
//   name: `用户 ${index + 1}`,
//   age: Math.floor(Math.random() * 50) + 20,
//   address: `地址 ${index + 1}`,
// }));

// // Mock 数据源配置示例
// const mockConfig: TableConfig = {
//   columns: [
//     {
//       key: 'id',
//       title: 'ID',
//       sortable: true,
//       width: 80,
//     },
//     {
//       key: 'name',
//       title: '姓名',
//       sortable: true,
//       width: 120,
//     },
//     {
//       key: 'age',
//       title: '年龄',
//       sortable: true,
//       width: 100,
//     },
//     {
//       key: 'address',
//       title: '地址',
//       sortable: false,
//     },
//   ],
//   pagination: {
//     defaultPageSize: 10,
//     pageSizeOptions: [10, 15, 20],
//   },
//   dataSource: {
//     type: 'mock',
//     data: mockData,
//   },
// };

export const DetailV1: React.FC<DetailV1Props> = ({ 
  detail, 
  detailIndexInParent,
  className,
  parentDirection,
  onDrop
}) => {
  const perpDirection = parentDirection === Direction.Horizontal ? 
    Direction.Vertical : Direction.Horizontal;

    const handleDrop = (_index: number, insertPosition: InsertPositionV2, e: React.DragEvent) => {
      // console.log('DetailV1 handleDrop', detailIndexInParent, insertPosition);
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
          <DynamicComponent configId={detail.configId} />
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