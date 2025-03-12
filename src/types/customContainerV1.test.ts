import { Container, ContainerConfig, Detail, DetailConfig, DetailType, Direction, InsertPosition, InsertPositionV2, Status } from './customContainerV1';

describe('Container.elimateDetail', () => {
  let container: Container;
  let detail0: Detail;
  let detail1: Detail;
  let detail2: Detail;
  beforeEach(() => {
    // 每个测试前重置数据
    container = new Container(Direction.Horizontal,undefined,"container0");
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-0"));
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-1"));
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-2"));
    detail0 = container.details[0];
    detail1 = container.details[1];
    detail2 = container.details[2];
  });

  describe('删除一个detail', () => {
    test('删除一个detail', () => {
      container.elimateDetail(detail1.id);
      
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0.id);
      expect(container.details[1].id).toBe(detail1.id);
      expect(container.details[2].id).toBe(detail2.id);

      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.WillRemove);
      expect(container.details[2].status).toBe(Status.Normal);

    });

  });
});

describe('Container.mergeDetailIntoDetail-0', () => {
  let container: Container;
  let detail0_0: Detail;
  let detail0_1: Detail;
  let detail0_2: Detail;
  beforeEach(() => {
    container = new Container(Direction.Horizontal,undefined,"container0");
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-0"));
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-1"));
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-2"));
    detail0_0 = container.details[0];
    detail0_1 = container.details[1];
    detail0_2 = container.details[2];
  });

  describe('同一个纵向容器中，将一个detail合并到另一个detail中', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素合并到同容器第2个元素的左方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-1",1,InsertPositionV2.Left);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(2);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      
      expect((container.details[0] as Container).details[0].id).toBe(detail0_0.id);
      expect((container.details[0] as Container).details[1].id).toBe(detail0_1.id);
      
      expect((container.details[0] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[1].type).toBe(DetailType.Detail);
      expect(container.details[1].status).toBe(Status.Normal);

    });

    test('模拟纵向容器，包含三个元素，将第1个元素合并到同容器第2个元素的右方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-1",1,InsertPositionV2.Right);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(2);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      
      expect((container.details[0] as Container).details[1].id).toBe(detail0_0.id);
      expect((container.details[0] as Container).details[0].id).toBe(detail0_1.id);
      
      expect((container.details[0] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[1].type).toBe(DetailType.Detail);
      expect(container.details[1].status).toBe(Status.Normal);

    });

    test('模拟纵向容器，包含三个元素，将第1个元素合并到同容器第3个元素的左方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-2",2,InsertPositionV2.Left);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(2);
      expect(container.details[1].type).toBe(DetailType.Container);
      expect(container.details[1].status).toBe(Status.Normal);
      
      expect((container.details[1] as Container).details[0].id).toBe(detail0_0.id);
      expect((container.details[1] as Container).details[1].id).toBe(detail0_2.id);
      
      expect((container.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[1] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[0].id).toBe(detail0_1.id);
      expect(container.details[0].type).toBe(DetailType.Detail);
      expect(container.details[0].status).toBe(Status.Normal);

    });

    test('模拟纵向容器，包含三个元素，将第1个元素合并到同容器第3个元素的右方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-2",2,InsertPositionV2.Right);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(2);
      expect(container.details[1].type).toBe(DetailType.Container);
      expect(container.details[1].status).toBe(Status.Normal);
      
      expect((container.details[1] as Container).details[0].id).toBe(detail0_2.id);
      expect((container.details[1] as Container).details[1].id).toBe(detail0_0.id);
      
      expect((container.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[1] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[0].id).toBe(detail0_1.id);
      expect(container.details[0].type).toBe(DetailType.Detail);
      expect(container.details[0].status).toBe(Status.Normal);

    });


    test('模拟纵向容器，包含三个元素，将第2个元素合并到同容器第1个元素的左方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-0",0,InsertPositionV2.Left);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(2);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      
      expect((container.details[0] as Container).details[0].id).toBe(detail0_1.id);
      expect((container.details[0] as Container).details[1].id).toBe(detail0_0.id);
      
      expect((container.details[0] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[1].type).toBe(DetailType.Detail);
      expect(container.details[1].status).toBe(Status.Normal);

    });

    test('模拟纵向容器，包含三个元素，将第2个元素合并到同容器第1个元素的右方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-0",0,InsertPositionV2.Right);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(2);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      
      expect((container.details[0] as Container).details[0].id).toBe(detail0_0.id);
      expect((container.details[0] as Container).details[1].id).toBe(detail0_1.id);
      
      expect((container.details[0] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[1].type).toBe(DetailType.Detail);
      expect(container.details[1].status).toBe(Status.Normal);

    });

    test('模拟纵向容器，包含三个元素，将第2个元素合并到同容器第3个元素的左方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-2",2,InsertPositionV2.Left);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(2);
      expect(container.details[1].type).toBe(DetailType.Container);
      expect(container.details[1].status).toBe(Status.Normal);
      
      expect((container.details[1] as Container).details[0].id).toBe(detail0_1.id);
      expect((container.details[1] as Container).details[1].id).toBe(detail0_2.id);
      
      expect((container.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[1] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[0].type).toBe(DetailType.Detail);
      expect(container.details[0].status).toBe(Status.Normal);
    });

    test('模拟纵向容器，包含三个元素，将第2个元素合并到同容器第3个元素的右方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-2",2,InsertPositionV2.Right);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(2);
      expect(container.details[1].type).toBe(DetailType.Container);
      expect(container.details[1].status).toBe(Status.Normal);
      
      expect((container.details[1] as Container).details[0].id).toBe(detail0_2.id);
      expect((container.details[1] as Container).details[1].id).toBe(detail0_1.id);
      
      expect((container.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[1] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[0].type).toBe(DetailType.Detail);
      expect(container.details[0].status).toBe(Status.Normal);
    });

    test('模拟纵向容器，包含三个元素，将第3个元素合并到同容器第1个元素的左方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-0",0,InsertPositionV2.Left);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(2);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      
      expect((container.details[0] as Container).details[0].id).toBe(detail0_2.id);
      expect((container.details[0] as Container).details[1].id).toBe(detail0_0.id);
      
      expect((container.details[0] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[1].type).toBe(DetailType.Detail);
      expect(container.details[1].status).toBe(Status.Normal);
    });

    test('模拟纵向容器，包含三个元素，将第3个元素合并到同容器第1个元素的右方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-0",0,InsertPositionV2.Right);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(2);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      
      expect((container.details[0] as Container).details[0].id).toBe(detail0_0.id);
      expect((container.details[0] as Container).details[1].id).toBe(detail0_2.id);
      
      expect((container.details[0] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[1].type).toBe(DetailType.Detail);
      expect(container.details[1].status).toBe(Status.Normal);
    });

    test('模拟纵向容器，包含三个元素，将第3个元素合并到同容器第2个元素的左方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-1",1,InsertPositionV2.Left);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(2);
      expect(container.details[1].type).toBe(DetailType.Container);
      expect(container.details[1].status).toBe(Status.Normal);
      
      expect((container.details[1] as Container).details[0].id).toBe(detail0_2.id);
      expect((container.details[1] as Container).details[1].id).toBe(detail0_1.id);
      
      expect((container.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[1] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[0].type).toBe(DetailType.Detail);
      expect(container.details[0].status).toBe(Status.Normal);
    });

    test('模拟纵向容器，包含三个元素，将第3个元素合并到同容器第2个元素的右方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-1",1,InsertPositionV2.Right);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(2);
      expect(container.details[1].type).toBe(DetailType.Container);
      expect(container.details[1].status).toBe(Status.Normal);
      
      expect((container.details[1] as Container).details[0].id).toBe(detail0_1.id);
      expect((container.details[1] as Container).details[1].id).toBe(detail0_2.id);
      
      expect((container.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container.details[1] as Container).details[1].status).toBe(Status.Normal);

      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[0].type).toBe(DetailType.Detail);
      expect(container.details[0].status).toBe(Status.Normal);
    });
  });
});

describe('Container.mergeDetailIntoDetail-1', () => {
  let container: Container;
  let container0: Container;
  let detail0_0: Detail;
  let detail0_1: Detail;
  let detail0_2: Detail;
  beforeEach(() => {
    container = new Container(Direction.Horizontal,undefined,"container0");
    container0 = new Container(Direction.Vertical,container,"container0-0");

    container0.addDetail(new Detail(DetailType.Detail,container,"detail0-0"));
    container0.addDetail(new Detail(DetailType.Detail,container,"detail0-1"));
    container0.addDetail(new Detail(DetailType.Detail,container,"detail0-2"));
    detail0_0 = container0.details[0];
    detail0_1 = container0.details[1];
    detail0_2 = container0.details[2]; 
    container.addDetail(container0,0);
  });

  describe('同一个横向容器中，将一个detail合并到另一个detail中', () => {
    test('模拟横向容器，包含三个元素，将第1个元素合并到同容器第2个元素的上方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-1",1,InsertPositionV2.Above);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[0].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_0 = (container.details[0] as Container).details[0] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_0.details.length).toBe(2);
      expect(subContainer0_0.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[0].id).toBe(detail0_0.id);
      expect(subContainer0_0.details[1].id).toBe(detail0_1.id);
      expect(subContainer0_0.details[0].status).toBe(Status.Normal);
      expect(subContainer0_0.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[1]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[1]).id).toBe(detail0_2.id);
    });

    test('模拟横向容器，包含三个元素，将第1个元素合并到同容器第2个元素的下方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-1",1,InsertPositionV2.Below);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[0].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_0 = (container.details[0] as Container).details[0] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_0.details.length).toBe(2);
      expect(subContainer0_0.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[0].id).toBe(detail0_1.id);
      expect(subContainer0_0.details[1].id).toBe(detail0_0.id);
      expect(subContainer0_0.details[0].status).toBe(Status.Normal);
      expect(subContainer0_0.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[1]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[1]).id).toBe(detail0_2.id);
    });

    test('模拟横向容器，包含三个元素，将第1个元素合并到同容器第3个元素的上方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-2",2,InsertPositionV2.Above);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[1].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_1 = (container.details[0] as Container).details[1] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_1.details.length).toBe(2);
      expect(subContainer0_1.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[0].id).toBe(detail0_0.id);
      expect(subContainer0_1.details[1].id).toBe(detail0_2.id);
      expect(subContainer0_1.details[0].status).toBe(Status.Normal);
      expect(subContainer0_1.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[0]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[0]).id).toBe(detail0_1.id);
    });

    test('模拟横向容器，包含三个元素，将第1个元素合并到同容器第3个元素的下方', () => {      
      container.mergeDetailIntoDetail("detail0-0","detail0-2",2,InsertPositionV2.Below);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[1].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_1 = (container.details[0] as Container).details[1] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_1.details.length).toBe(2);
      expect(subContainer0_1.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[0].id).toBe(detail0_2.id);
      expect(subContainer0_1.details[1].id).toBe(detail0_0.id);
      expect(subContainer0_1.details[0].status).toBe(Status.Normal);
      expect(subContainer0_1.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[0]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[0]).id).toBe(detail0_1.id);
    });

    test('模拟横向容器，包含三个元素，将第2个元素合并到同容器第1个元素的上方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-0",0,InsertPositionV2.Above);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[0].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_0 = (container.details[0] as Container).details[0] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_0.details.length).toBe(2);
      expect(subContainer0_0.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[0].id).toBe(detail0_1.id);
      expect(subContainer0_0.details[1].id).toBe(detail0_0.id);
      expect(subContainer0_0.details[0].status).toBe(Status.Normal);
      expect(subContainer0_0.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[1]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[1]).id).toBe(detail0_2.id);
    });

    test('模拟横向容器，包含三个元素，将第2个元素合并到同容器第1个元素的下方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-0",0,InsertPositionV2.Below);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[0].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_0 = (container.details[0] as Container).details[0] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_0.details.length).toBe(2);
      expect(subContainer0_0.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[0].id).toBe(detail0_0.id);
      expect(subContainer0_0.details[1].id).toBe(detail0_1.id);
      expect(subContainer0_0.details[0].status).toBe(Status.Normal);
      expect(subContainer0_0.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[1]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[1]).id).toBe(detail0_2.id);
    });

    test('模拟横向容器，包含三个元素，将第2个元素合并到同容器第3个元素的上方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-2",2,InsertPositionV2.Above);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[1].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_1 = (container.details[0] as Container).details[1] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_1.details.length).toBe(2);
      expect(subContainer0_1.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[0].id).toBe(detail0_1.id);
      expect(subContainer0_1.details[1].id).toBe(detail0_2.id);
      expect(subContainer0_1.details[0].status).toBe(Status.Normal);
      expect(subContainer0_1.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[0]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[0]).id).toBe(detail0_0.id);
    });

    test('模拟横向容器，包含三个元素，将第2个元素合并到同容器第3个元素的下方', () => {      
      container.mergeDetailIntoDetail("detail0-1","detail0-2",2,InsertPositionV2.Below);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[1].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_1 = (container.details[0] as Container).details[1] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_1.details.length).toBe(2);
      expect(subContainer0_1.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[0].id).toBe(detail0_2.id);
      expect(subContainer0_1.details[1].id).toBe(detail0_1.id);
      expect(subContainer0_1.details[0].status).toBe(Status.Normal);
      expect(subContainer0_1.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[0]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[0]).id).toBe(detail0_0.id);
    });

    test('模拟横向容器，包含三个元素，将第3个元素合并到同容器第1个元素的上方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-0",0,InsertPositionV2.Above);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[0].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_0 = (container.details[0] as Container).details[0] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_0.details.length).toBe(2);
      expect(subContainer0_0.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[0].id).toBe(detail0_2.id);
      expect(subContainer0_0.details[1].id).toBe(detail0_0.id);
      expect(subContainer0_0.details[0].status).toBe(Status.Normal);
      expect(subContainer0_0.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[1]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[1]).id).toBe(detail0_1.id);
    });

    test('模拟横向容器，包含三个元素，将第3个元素合并到同容器第1个元素的下方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-0",0,InsertPositionV2.Below);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[0].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_0 = (container.details[0] as Container).details[0] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_0.details.length).toBe(2);
      expect(subContainer0_0.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_0.details[0].id).toBe(detail0_0.id);
      expect(subContainer0_0.details[1].id).toBe(detail0_2.id);
      expect(subContainer0_0.details[0].status).toBe(Status.Normal);
      expect(subContainer0_0.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[1]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[1]).id).toBe(detail0_1.id);
    });

    test('模拟横向容器，包含三个元素，将第3个元素合并到同容器第2个元素的上方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-1",1,InsertPositionV2.Above);
      //提交改动
      container.commitChange();

      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[1].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_1 = (container.details[0] as Container).details[1] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_1.details.length).toBe(2);
      expect(subContainer0_1.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[0].id).toBe(detail0_2.id);
      expect(subContainer0_1.details[1].id).toBe(detail0_1.id);
      expect(subContainer0_1.details[0].status).toBe(Status.Normal);
      expect(subContainer0_1.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[0]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[0]).id).toBe(detail0_0.id);
    });

    test('模拟横向容器，包含三个元素，将第3个元素合并到同容器第2个元素的下方', () => {      
      container.mergeDetailIntoDetail("detail0-2","detail0-1",1,InsertPositionV2.Below);
      //提交改动
      container.commitChange();
      
      expect(container.details.length).toBe(1);
      expect(container.details[0].type).toBe(DetailType.Container);
      expect(container.details[0].status).toBe(Status.Normal);
      expect((container.details[0] as Container).details.length).toBe(2);
      expect((container.details[0] as Container).details[1].type).toBe(DetailType.Container);
      const subContainer0 = (container.details[0] as Container);
      
      const subContainer0_1 = (container.details[0] as Container).details[1] as Container;
      expect(subContainer0.details.length).toBe(2);
      expect(subContainer0_1.details.length).toBe(2);
      expect(subContainer0_1.details[0].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[1].type).toBe(DetailType.Detail);
      expect(subContainer0_1.details[0].id).toBe(detail0_1.id);
      expect(subContainer0_1.details[1].id).toBe(detail0_2.id);
      expect(subContainer0_1.details[0].status).toBe(Status.Normal);
      expect(subContainer0_1.details[1].status).toBe(Status.Normal);

      expect((subContainer0.details[0]).type).toBe(DetailType.Detail);
      expect((subContainer0.details[0]).id).toBe(detail0_0.id);
    });
  });
});


describe('Container.mergeDetailIntoContainer-1', () => {
  let container: Container;
  let detail0_0: Detail;
  let detail0_1: Detail;
  let detail0_2: Detail;
  beforeEach(() => {
    container = new Container(Direction.Vertical,undefined,"container0");
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-0"));
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-1"));
    container.addDetail(new Detail(DetailType.Detail,container,"detail0-2"));
    detail0_0 = container.details[0];
    detail0_1 = container.details[1];
    detail0_2 = container.details[2];
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素移动到第1个元素的上方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-0","detail0-1",0,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素移动到第1个元素的下方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-0","detail0-1",0,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素移动到第2个元素的上方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-0","detail0-1",1,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素移动到第2个元素的下方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-0","detail0-1",1,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_1.id);
      expect(container.details[1].id).toBe(detail0_0.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素移动到第3个元素的上方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-0","detail0-2",2,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_1.id);
      expect(container.details[1].id).toBe(detail0_0.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第1个元素移动到第3个元素的下方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-0","detail0-1",2,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_1.id);
      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[2].id).toBe(detail0_0.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第2个元素移动到第1个元素的上方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-1","detail0-0",0,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_1.id);
      expect(container.details[1].id).toBe(detail0_0.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第2个元素移动到第1个元素的下方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-1","detail0-0",0,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第2个元素移动到第2个元素的上方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-1","detail0-1",1,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第2个元素移动到第2个元素的下方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-1","detail0-1",1,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第2个元素移动到第3个元素的上方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-1","detail0-2",2,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第2个元素移动到第3个元素的下方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-1","detail0-2",2,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[2].id).toBe(detail0_1.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第3个元素移动到第1个元素的上方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-2","detail0-0",0,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_2.id);
      expect(container.details[1].id).toBe(detail0_0.id);
      expect(container.details[2].id).toBe(detail0_1.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第3个元素移动到第1个元素的下方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-2","detail0-0",0,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[2].id).toBe(detail0_1.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第3个元素移动到第2个元素的上方，位置会改变', () => {      
      container.mergeDetailIntoContainer("detail0-2","detail0-1",1,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_2.id);
      expect(container.details[2].id).toBe(detail0_1.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第3个元素移动到第2个元素的下方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-2","detail0-1",1,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第3个元素移动到第3个元素的上方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-2","detail0-2",2,InsertPosition.Before);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });

  describe('同一个纵向容器中，将一个detail挪动到另一个detail的上方或下方', () => {
    test('模拟纵向容器，包含三个元素，将第3个元素移动到第3个元素的下方，位置和结构都不会改变', () => {      
      container.mergeDetailIntoContainer("detail0-2","detail0-2",2,InsertPosition.After);
      //提交改动
      container.commitChange();
      expect(container.details.length).toBe(3);
      expect(container.details[0].id).toBe(detail0_0.id);
      expect(container.details[1].id).toBe(detail0_1.id);
      expect(container.details[2].id).toBe(detail0_2.id);
      expect(container.details[0].status).toBe(Status.Normal);
      expect(container.details[1].status).toBe(Status.Normal);
      expect(container.details[2].status).toBe(Status.Normal);
      expect(container.details[0].size.toFixed(2)).toBe('33.33');
      expect(container.details[1].size.toFixed(2)).toBe('33.33');
      expect(container.details[2].size.toFixed(2)).toBe('33.33');
    })
  });
});

describe('Container.optimizeStructure', () => {
  let rootContainer: Container;
  let container0_0: Container;
  let container0_0_0: Container;
  let detail0_0_0_0: Detail;
  let detail0_0_0_1: Detail;
  let detail0_0_1: Detail;

  beforeEach(() => {
    // 创建根容器 container_0 (纵向)
    rootContainer = new Container(Direction.Vertical, undefined, "container_0");
    
    // 创建子容器 container_0_0 (横向)
    container0_0 = new Container(Direction.Horizontal, rootContainer, "container_0_0");
    rootContainer.addDetail(container0_0, 0);
    
    // 创建子容器 container_0_0_0 (纵向)
    container0_0_0 = new Container(Direction.Vertical, container0_0, "container_0_0_0");
    container0_0.addDetail(container0_0_0, 0);
    
    // 在 container_0_0_0 中添加两个 Detail
    detail0_0_0_0 = new Detail(DetailType.Detail, container0_0_0, "detail_0_0_0_0");
    detail0_0_0_1 = new Detail(DetailType.Detail, container0_0_0, "detail_0_0_0_1");
    container0_0_0.addDetail(detail0_0_0_0, 0);
    container0_0_0.addDetail(detail0_0_0_1, 1);
    
    // 在 container_0_0 中添加另一个 Detail
    detail0_0_1 = new Detail(DetailType.Detail, container0_0, "detail_0_0_1");
    container0_0.addDetail(detail0_0_1, 1);
  });

  test('当移动一个元素到其他容器后，如果原容器只剩一个元素，则原容器会被消除，其中的元素会被提取到父容器中', () => {
    // 初始状态验证
    expect(rootContainer.details.length).toBe(1);
    expect(rootContainer.details[0].id).toBe("container_0_0");
    
    expect(container0_0.details.length).toBe(2);
    expect(container0_0.details[0].id).toBe("container_0_0_0");
    expect(container0_0.details[1].id).toBe("detail_0_0_1");
    
    expect(container0_0_0.details.length).toBe(2);
    expect(container0_0_0.details[0].id).toBe("detail_0_0_0_0");
    expect(container0_0_0.details[1].id).toBe("detail_0_0_0_1");
    
    // 使用 mergeDetailIntoContainer 方法将 detail_0_0_0_1 移动到 container_0_0 中（移动container_0_0.details中第1个元素与第2个元素之间）
    // 这会导致 container_0_0_0 只剩下一个元素 detail_0_0_0_0
    rootContainer.mergeDetailIntoContainer("detail_0_0_0_1", "container_0_0_0", 0, InsertPosition.After);
    
    // 提交更改
    rootContainer.commitChange();
    
    // 验证移动后的结构
    // container_0_0 现在应该有三个元素：detail_0_0_0_0, detail_0_0_1, detail_0_0_0_1
    // 其中 detail_0_0_0_0 是从 container_0_0_0 提取出来的
    expect(container0_0.details.length).toBe(3);
    
    // 验证元素顺序和类型
    expect(container0_0.details[0].id).toBe("detail_0_0_0_0");
    expect(container0_0.details[0].type).toBe(DetailType.Detail);
    expect(container0_0.details[1].id).toBe("detail_0_0_0_1");
    expect(container0_0.details[1].type).toBe(DetailType.Detail);
    expect(container0_0.details[2].id).toBe("detail_0_0_1");
    expect(container0_0.details[2].type).toBe(DetailType.Detail);
    
    // 验证所有元素状态都是 Normal
    expect(container0_0.details[0].status).toBe(Status.Normal);
    expect(container0_0.details[1].status).toBe(Status.Normal);
    expect(container0_0.details[2].status).toBe(Status.Normal);
  });

  test('当移动一个元素到其他容器后，如果原容器只剩一个元素，则原容器会被消除，其中的元素会被提取到父容器中', () => {
      // 初始状态验证
      expect(rootContainer.details.length).toBe(1);
      expect(rootContainer.details[0].id).toBe("container_0_0");
      
      expect(container0_0.details.length).toBe(2);
      expect(container0_0.details[0].id).toBe("container_0_0_0");
      expect(container0_0.details[1].id).toBe("detail_0_0_1");
      
      expect(container0_0_0.details.length).toBe(2);
      expect(container0_0_0.details[0].id).toBe("detail_0_0_0_0");
      expect(container0_0_0.details[1].id).toBe("detail_0_0_0_1");
      
      // 使用 mergeDetailIntoContainer 方法将 detail_0_0_0_1 移动到 detail_0_0_1的下方
      // 这会导致 container_0_0_0 只剩下一个元素 detail_0_0_0_0
      rootContainer.mergeDetailIntoDetail("detail_0_0_0_1", "detail_0_0_1", 1, InsertPositionV2.Below);
      
      // 提交更改
      rootContainer.commitChange();
      
      // 验证移动后的结构
      // container_0_0 现在应该有三个元素：detail_0_0_0_0, detail_0_0_1, detail_0_0_0_1
      // 其中 detail_0_0_0_0 是从 container_0_0_0 提取出来的
      expect(container0_0.details.length).toBe(2);
      
      // 验证元素顺序和类型
      expect(container0_0.details[0].id).toBe("detail_0_0_0_0");
      expect(container0_0.details[0].type).toBe(DetailType.Detail);
      expect(container0_0.details[1].type).toBe(DetailType.Container);
      expect((container0_0.details[1] as Container).details.length).toBe(2);
      expect((container0_0.details[1] as Container).details[0].id).toBe("detail_0_0_1");
      expect((container0_0.details[1] as Container).details[1].id).toBe("detail_0_0_0_1");
      
      // 验证所有元素状态都是 Normal
      expect((container0_0.details[1] as Container).details[0].status).toBe(Status.Normal);
      expect((container0_0.details[1] as Container).details[1].status).toBe(Status.Normal);
    });

  test('复杂场景：移动一个元素到两个容器之间，导致源容器被优化', () => {
    // 初始状态验证
    expect(rootContainer.details.length).toBe(1);
    expect(container0_0.details.length).toBe(2);
    expect(container0_0_0.details.length).toBe(2);
    
    // 使用 mergeDetailIntoDetail 方法将 detail_0_0_0_1 移动到 detail_0_0_1 的左侧
    // 这会导致 container_0_0_0 只剩下一个元素 detail_0_0_0_0
    container0_0.mergeDetailIntoDetail("detail_0_0_0_1", "detail_0_0_1", 1, InsertPositionV2.Left);
    
    // 提交更改
    rootContainer.commitChange();
    
    // 验证优化后的结构
    // container_0_0 现在应该有三个元素：detail_0_0_0_0 和一个新容器(包含detail_0_0_0_1和detail_0_0_1)
    expect(container0_0.details.length).toBe(2);
    
    // 第一个元素应该是 detail_0_0_0_0，从 container_0_0_0 提取出来的
    expect(container0_0.details[0].id).toBe("detail_0_0_0_0");
    expect(container0_0.details[0].type).toBe(DetailType.Detail);
    
    // 第二个元素应该是一个新的容器，包含 detail_0_0_0_1 和 detail_0_0_1
    expect(container0_0.details[1].type).toBe(DetailType.Container);
    
    const newContainer = container0_0.details[1] as Container;
    expect(newContainer.details.length).toBe(2);
    
    // 验证新容器中的元素
    const ids = newContainer.details.map(d => d.id);
    expect(ids).toContain("detail_0_0_0_1");
    expect(ids).toContain("detail_0_0_1");
  });
});
