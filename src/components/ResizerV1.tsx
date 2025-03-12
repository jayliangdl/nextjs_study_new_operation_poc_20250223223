import React, { useState, useEffect, useCallback } from 'react';
import { DetailType, Direction, InsertPositionV2 } from '../types/customContainerV1';

interface ResizerV1Props {
  direction: Direction;
  index: number;
  parentType: DetailType;
  totalDetails: number;
  referenceDetailId:string;
  insertPosition: InsertPositionV2;
  draggingDetailIdOfRejectDrop?: string;
  onResize?: (index: number, offset: number) => void;
  onDrop?: (index: number, insertPosition: InsertPositionV2, e: React.DragEvent, 
    parentType:DetailType,targetDetailId:string) => void;
}

export const ResizerV1: React.FC<ResizerV1Props> = ({
  direction,
  index,
  parentType,
  totalDetails,
  insertPosition,
  /**
   * 如果拖拽的detailId在此列表中，则不在本resizer实例上进行drop
   * 背景：
   * 如果拖拽的detailId到它附近的resizer实例上（例如：在本detail邻近的左侧、右侧、上方、下方），则不允许drop
   * 所以需要传入需要拒绝drop的detailId列表（draggingDetailIdOfRejectDrop）
   * 如果判断到拖拽的detailId在此列表中，则设置rejectDrop为true，不出现可drop的背景色，也不能drop
   */
  draggingDetailIdOfRejectDrop = '',
  referenceDetailId,
  onResize,
  onDrop
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [rejectDrop, setRejectDrop] = useState(false);

  const isEdgeResizer = index === 0 || index === totalDetails;
  const canResize = direction === Direction.Horizontal && !isEdgeResizer;
  const isResizable = !!onResize && canResize;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !onResize) return;
    
    const offset = e.clientX - startPosition;
    onResize(index, offset);
    setStartPosition(e.clientX);
  }, [isDragging, onResize, index, startPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = canResize ? 'col-resize' : 'default';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, canResize]);

  const resizerStyle: React.CSSProperties = {
    ...(direction === Direction.Horizontal ? {
      width: '20px',
      height: '100%',
      cursor: isResizable ? 'col-resize' : 'default',
    } : {
      width: '100%',
      height: '20px',
      cursor: 'default',
    }),
    backgroundColor: !rejectDrop && ((isResizable && (isHovered || isDragging)) || isDragOver) 
      ? 'rgba(255, 165, 0, 0.3)' 
      : 'transparent',
    transition: isDragging ? 'none' : 'background-color 0.2s',
    touchAction: 'none',
  };

  return (
    <div
      style={resizerStyle}
      onMouseEnter={() => {isResizable && setIsHovered(true)}}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDragging) setIsDragging(false);
      }}
      onMouseDown={(e) => {
        if (!isResizable) return;
        e.preventDefault();
        setIsDragging(true);
        setStartPosition(e.clientX);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        const movingDetailId = (window as any).currentDraggingId;
        if(draggingDetailIdOfRejectDrop.split(',').includes(movingDetailId)){
          setRejectDrop(true);
        }else{
          setRejectDrop(false);
        }
        setIsDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => {
        setRejectDrop(false);
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if(rejectDrop){
          return;
        }
        onDrop?.(index, insertPosition, e, parentType, referenceDetailId);
      }}
    >
        {/**以下为调试代码*/}
        {/* <div style={{ fontSize: '9px', color: 'gray' }}>{insertPosition}</div> */}
        {/**以上为调试代码*/}
    </div>
  );
}; 