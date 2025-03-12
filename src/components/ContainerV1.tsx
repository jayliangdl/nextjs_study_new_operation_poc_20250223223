import React from 'react';
import { Container, Direction, DetailType, Detail, InsertPositionV2, InsertPosition } from '../types/customContainerV1';
import { DetailV1 } from './DetailV1';
import { ResizerV1 } from './ResizerV1';
import { Button } from 'antd';

interface ContainerV1Props {
  container: Container;
  className?: string;
}

// 创建一个全局 Map 来存储容器的更新函数
const containerUpdateMap = new Map<string, (details: Detail[]) => void>();
// 将 containerUpdateMap 添加到 window 对象
(window as any).containerUpdateMap = containerUpdateMap;

export const ContainerV1: React.FC<ContainerV1Props> = ({ container, className }) => {
  const [details, setDetails] = React.useState([...container.details]);

  // 在组件挂载时注册更新函数，卸载时移除
  React.useEffect(() => {
    containerUpdateMap.set(container.id, setDetails);
    return () => {
      containerUpdateMap.delete(container.id);
    };
  }, [container.id]);

  // 监听容器明细的变化
  React.useEffect(() => {
    setDetails([...container.details]);
  }, [container.details]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: container.direction === Direction.Horizontal ? 'row' : 'column',
    width: '100%',
    height: '100%',
    // padding: '30px',//调试代码可放开
    // border: '1px solid #ccc',//调试代码可放开
    boxSizing: 'border-box',
  };

  const handleResize = (index: number, offset: number) => {
    const detail1 = container.details[index - 1];
    const detail2 = container.details[index];
    if (!detail1 || !detail2) return;

    const totalSize = detail1.size + detail2.size;
    const containerWidth = document.getElementById(container.id)?.clientWidth || window.innerWidth;
    const offsetPercent = (offset / containerWidth) * 100;

    const newSize1 = detail1.size + offsetPercent;
    const newSize2 = totalSize - newSize1;

    if (newSize1 >= 10 && newSize2 >= 10) {
      detail1.size = newSize1;
      detail2.size = newSize2;
      // 触发重新渲染
      setDetails([...container.details]);
    }
  };

  const handleDrop = (index: number, insertPositionV2: InsertPositionV2, e: React.DragEvent, 
    parentType: DetailType,referenceDetailId:string) => {
    const movingDetailId = e.dataTransfer.getData('text/plain');
    if (!movingDetailId) return;
    // console.log('ContainerV1 handleDrop',index,  insertPositionV2,  parentType, referenceDetailId,movingDetailId);
    const rootContainer = container.getRootContainer();
    if(parentType === DetailType.Container){
      const insertPosition = insertPositionV2 === InsertPositionV2.Left || insertPositionV2 === InsertPositionV2.Above ? 
        InsertPosition.Before : InsertPosition.After;
      rootContainer.mergeDetailIntoContainer(movingDetailId, referenceDetailId, index, insertPosition);
      rootContainer.commitChange();
    }else{
      rootContainer.mergeDetailIntoDetail(movingDetailId, referenceDetailId, index, insertPositionV2);
      rootContainer.commitChange();
    }

    refreshView(rootContainer);
    // const jsonStr = rootContainer.printStructureFromRootContainer();
    // console.log(jsonStr);
  }

  /**
   * 刷新视图
   * @param container 
   */
  const refreshView = (container:Container):void=>{
    const updateFn = containerUpdateMap.get(container.id);
    if (updateFn) {
      const containerToUpdate = container.findContainer(container.id);
      console.log('ContainerV1 handleDrop updateFn:',containerToUpdate);
      updateFn([...containerToUpdate.details]);
    }

    
  }

  const addDetail = () => {
    const newDetail = new Detail(DetailType.Detail, container);
    
    container.addDetail(newDetail);
    const rootContainer = container.getRootContainer();
    refreshView(rootContainer);
  }

  return (
    <div id={container.id} style={containerStyle} className={className}>
      {/* <div>{container.direction}</div> */}
      {container.needFirstAndLastResizer && (
        <ResizerV1
          direction={container.direction}
          index={0}
          parentType={DetailType.Container}
          totalDetails={container.details.length}
          onDrop={handleDrop}
          draggingDetailIdOfRejectDrop={
            details.length > 0 ? details[0].id :
            ''
          }
          insertPosition={container.direction === Direction.Horizontal ? InsertPositionV2.Left : InsertPositionV2.Above}
          referenceDetailId={details.length>0?details[0].id:''}
        />
      )}
      {details.map((detail, index) => (
        <React.Fragment key={detail.id}>
          <div style={{ flex: `${detail.size}%` }}>
            {detail.type === DetailType.Container ? (
              <ContainerV1 container={detail as Container} key={detail.id} />
            ) : (
              <DetailV1 
              detailIndexInParent={index}                
                detail={detail}
                parentDirection={container.direction}
                onDrop={handleDrop}
              />
            )}
          </div>
          {container.needFirstAndLastResizer && (
            <ResizerV1
              direction={container.direction}
              index={index < details.length - 1 ? index + 1 : index}
              parentType={DetailType.Container}
              totalDetails={container.details.length}
              referenceDetailId={details[index].id}
              insertPosition={index < details.length - 1 ? 
                (container.direction === Direction.Horizontal ? InsertPositionV2.Left : InsertPositionV2.Above) :
                (container.direction === Direction.Horizontal ? InsertPositionV2.Right : InsertPositionV2.Below)
              }
              draggingDetailIdOfRejectDrop={
                details.length > index+1 ? `${details[index].id},${details[index+1].id}` :
                details.length === index+1  ? details[index].id :
                ''
              }
              onResize={
                container.direction === Direction.Horizontal && 
                index < container.details.length - 1 ? 
                handleResize : undefined
              }
              onDrop={handleDrop}
            />
          )}
        </React.Fragment>
      ))}
      {container.availableAddDetail() && <Button type="primary" onClick={addDetail}>Add More</Button>}
    </div>
  );
}; 