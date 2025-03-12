import { Container, Detail, DetailType, Direction, InsertPosition, InsertPositionV2, Status } from "./customContainerV1";
describe('Container.optimizeStructure', () => {
    let rootContainer: Container;
    let container0_0: Container;
    let container0_0_0: Container;
    let detail0_0_0_0: Detail;
    let detail0_0_0_1: Detail;
    let detail0_0_1: Detail;
  
    beforeEach(() => {
      // 创建根容器 container_0 (纵向)
      rootContainer = new Container(Direction.Vertical, undefined, "container0");
      
      // 创建子容器 container_0_0 (横向)
      container0_0 = new Container(Direction.Horizontal, rootContainer, "container0_0");
      rootContainer.addDetail(container0_0, 0);
      
      // 创建子容器 container_0_0_0 (纵向)
      container0_0_0 = new Container(Direction.Vertical, container0_0, "container0_0_0");
      container0_0.addDetail(container0_0_0, 0);
      
      // 在 container_0_0_0 中添加两个 Detail
      detail0_0_0_0 = new Detail(DetailType.Detail, container0_0_0, "detail0_0_0_0");
      detail0_0_0_1 = new Detail(DetailType.Detail, container0_0_0, "detail0_0_0_1");
      container0_0_0.addDetail(detail0_0_0_0, 0);
      container0_0_0.addDetail(detail0_0_0_1, 1);
      
      // 在 container_0_0 中添加另一个 Detail
      detail0_0_1 = new Detail(DetailType.Detail, container0_0, "detail_0_0_1");
      container0_0.addDetail(detail0_0_1, 1);
    });
test('当父容器和子容器方向相同时，子容器会被消除，其中的所有元素会被提取到父容器中', () => {
    // 创建一个新的测试场景，父容器和子容器方向相同
    // const parentContainer = new Container(Direction.Vertical, undefined, "container0_0");
    // const childContainer = new Container(Direction.Vertical, parentContainer, "container0_0_0");
    // parentContainer.addDetail(childContainer, 0);
    
    // // 在子容器中添加两个 Detail
    // const detail0_0_0_0 = new Detail(DetailType.Detail, childContainer, "detail0_0_0_0");
    // const detail0_0_0_1 = new Detail(DetailType.Detail, childContainer, "detail0_0_0_1");
    // childContainer.addDetail(detail0_0_0_0, 0);
    // childContainer.addDetail(detail0_0_0_1, 1);
    
    // // 在父容器中添加另一个 Detail
    // const detail0_0_1 = new Detail(DetailType.Detail, parentContainer, "detail0_0_1");
    // parentContainer.addDetail(detail0_0_1, 1);
    
    // // 初始状态验证
    // expect(parentContainer.details.length).toBe(2);
    // expect(parentContainer.details[0].id).toBe("container0_0_0");
    // expect(parentContainer.details[1].id).toBe("detail0_0_1");
    
    // expect(childContainer.details.length).toBe(2);
    // expect(childContainer.details[0].id).toBe("detail0_0_0_0");
    // expect(childContainer.details[1].id).toBe("detail0_0_0_1");
    
    // 调用 mergeDetailIntoContainer 方法，这会触发 optimizeStructure
    // 由于父容器和子容器方向相同，子容器应该被消除，其中的元素应该被提取到父容器中
    rootContainer.mergeDetailIntoContainer("detail0_0_0_1", "container0_0_0", 0, InsertPosition.After);
    
    // 提交更改
    rootContainer.commitChange();
    
    // 验证优化后的结构
    // 父容器现在应该有三个元素：detail0_0_0_0, detail0_0_1, detail0_0_0_1
    expect(rootContainer.details.length).toBe(1);
    
    // 验证元素顺序和类型
    expect(rootContainer.details[0].id).toBe("detail0_0_0_0");
    expect(rootContainer.details[0].type).toBe(DetailType.Detail);
    
    expect(rootContainer.details[1].id).toBe("detail0_0_0_1");
    expect(rootContainer.details[1].type).toBe(DetailType.Detail);

    expect(rootContainer.details[2].id).toBe("detail0_0_1");
    expect(rootContainer.details[2].type).toBe(DetailType.Detail);
rootContainer
    
    // 验证所有元素状态都是 Normal
    expect(rootContainer.details[0].status).toBe(Status.Normal);
    expect(rootContainer.details[1].status).toBe(Status.Normal);
    expect(rootContainer.details[2].status).toBe(Status.Normal);
  });

  test('当父容器和子容器方向相同时，使用 mergeDetailIntoDetail 方法也会触发优化', () => {
    // 创建一个新的测试场景，父容器和子容器方向相同
    const parentContainer = new Container(Direction.Vertical, undefined, "container0_0");
    const childContainer = new Container(Direction.Vertical, parentContainer, "container0_0_0");
    parentContainer.addDetail(childContainer, 0);
    
    // 在子容器中添加两个 Detail
    const detail0_0_0_0 = new Detail(DetailType.Detail, childContainer, "detail0_0_0_0");
    const detail0_0_0_1 = new Detail(DetailType.Detail, childContainer, "detail0_0_0_1");
    childContainer.addDetail(detail0_0_0_0, 0);
    childContainer.addDetail(detail0_0_0_1, 1);
    
    // 在父容器中添加另一个 Detail

    const detail0_0_1 = new Detail(DetailType.Detail, parentContainer, "detail0_0_1");
    parentContainer.addDetail(detail0_0_1, 1);
    
    // 初始状态验证
    expect(parentContainer.details.length).toBe(2);
    expect(parentContainer.details[0].id).toBe("container0_0_0");
    expect(parentContainer.details[1].id).toBe("detail0_0_1");
    
    expect(childContainer.details.length).toBe(2);
    expect(childContainer.details[0].id).toBe("detail0_0_0_0");
    expect(childContainer.details[1].id).toBe("detail0_0_0_1");
    
    // 调用 mergeDetailIntoDetail 方法，这会触发 optimizeStructure
    // 由于父容器和子容器方向相同，子容器应该被消除，其中的元素应该被提取到父容器中
    parentContainer.mergeDetailIntoDetail("detail0_0_0_1", "detail0_0_1", 1, InsertPositionV2.Above);
    
    // 提交更改
    parentContainer.commitChange();
    
    // 验证优化后的结构
    // 父容器现在应该有三个元素：detail0_0_0_0, detail0_0_0_1, detail0_0_1
    expect(parentContainer.details.length).toBe(3);
    
    // 验证元素顺序和类型
    expect(parentContainer.details[0].id).toBe("detail0_0_0_0");
    expect(parentContainer.details[0].type).toBe(DetailType.Detail);
    expect(parentContainer.details[1].id).toBe("detail0_0_0_1");
    expect(parentContainer.details[1].type).toBe(DetailType.Detail);
    expect(parentContainer.details[2].id).toBe("detail0_0_1");
    expect(parentContainer.details[2].type).toBe(DetailType.Detail);
    
    // 验证所有元素状态都是 Normal
    expect(parentContainer.details[0].status).toBe(Status.Normal);
    expect(parentContainer.details[1].status).toBe(Status.Normal);
    expect(parentContainer.details[2].status).toBe(Status.Normal);
  })
});