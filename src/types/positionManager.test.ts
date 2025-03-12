import { PositionManager, PositionItem } from './positionManager';

// 创建测试用的项目接口
interface TestItem extends PositionItem {
  name: string;
}

describe('PositionManager', () => {
  let manager: PositionManager<TestItem>;

  beforeEach(() => {
    manager = new PositionManager<TestItem>();
  });

  describe('addItem', () => {
    test('添加项目时不指定位置，应自动追加到末尾', () => {
      const item1 = { id: '1', name: 'item1', position: 0 };
      const item2 = { id: '2', name: 'item2', position: 1 };
      
      manager.addItem(item1);
      manager.addItem(item2);
      
      const items = manager.getItems();
      expect(items).toHaveLength(2);
      expect(items[0].position).toBe(0);
      expect(items[1].position).toBe(1);
    });

    test('添加项目时指定位置，应按指定位置插入', () => {
      const item1 = { id: '1', name: 'item1', position: 2 };
      const item2 = { id: '2', name: 'item2', position: 1 };
      const item3 = { id: '3', name: 'item3', position: 0 };
      
      manager.addItem(item1);
      manager.addItem(item2);
      manager.addItem(item3);
      
      const items = manager.getItems();
      expect(items).toHaveLength(3);
      expect(items[0].id).toBe('3');
      expect(items[1].id).toBe('2');
      expect(items[2].id).toBe('1');
    });
  });

  describe('removeItem', () => {
    test('删除存在的项目', () => {
      const item1 = { id: '1', name: 'item1', position: 0 };
      const item2 = { id: '2', name: 'item2', position: 1 };
      
      manager.addItem(item1);
      manager.addItem(item2);
      manager.removeItem('1');
      
      const items = manager.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('2');
    });

    test('删除不存在的项目不应报错', () => {
      const item1 = { id: '1', name: 'item1', position: 0 };
      manager.addItem(item1);
      
      expect(() => manager.removeItem('nonexistent')).not.toThrow();
      expect(manager.getItems()).toHaveLength(1);
    });
  });

  describe('updateItem', () => {
    test('更新项目的名称', () => {
      const item = { id: '1', name: 'item1', position: 0 };
      manager.addItem(item);
      
      manager.updateItem('1', { name: 'updated' });
      
      const updatedItem = manager.getItemById('1');
      expect(updatedItem?.name).toBe('updated');
    });

    test('更新项目的位置应触发重新排序', () => {
      const item1 = { id: '1', name: 'item1', position: 0 };
      const item2 = { id: '2', name: 'item2', position: 1 };
      
      manager.addItem(item1);
      manager.addItem(item2);
      
      manager.updateItem('1', { position: 2 });
      
      const items = manager.getItems();
      expect(items[0].id).toBe('2');
      expect(items[1].id).toBe('1');
    });
  });

  describe('moveItem', () => {
    test('向后移动项目', () => {
      const items = [
        { id: '1', name: 'item1', position: 0 },
        { id: '2', name: 'item2', position: 1 },
        { id: '3', name: 'item3', position: 2 }
      ];
      
      items.forEach(item => manager.addItem(item));
      
      // 将位置0的项目移动到位置2
      manager.moveItem('1', 2);
      
      const result = manager.getItems();
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1');
      
      // 验证位置值是否正确
      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(1);
      expect(result[2].position).toBe(2);
    });

    test('向前移动项目', () => {
      const items = [
        { id: '1', name: 'item1', position: 0 },
        { id: '2', name: 'item2', position: 1 },
        { id: '3', name: 'item3', position: 2 }
      ];
      
      items.forEach(item => manager.addItem(item));
      
      // 将位置2的项目移动到位置0
      manager.moveItem('3', 0);
      
      const result = manager.getItems();
      expect(result[0].id).toBe('3');
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('2');
      
      // 验证位置值是否正确
      expect(result[0].position).toBe(0);
      expect(result[1].position).toBe(1);
      expect(result[2].position).toBe(2);
    });

    test('移动到相同位置不应改变顺序', () => {
      const items = [
        { id: '1', name: 'item1', position: 0 },
        { id: '2', name: 'item2', position: 1 }
      ];
      
      items.forEach(item => manager.addItem(item));
      
      const result = manager.moveItem('1', 0);
      
      expect(result).toBe(true);
      const resultItems = manager.getItems();
      expect(resultItems[0].id).toBe('1');
      expect(resultItems[1].id).toBe('2');
    });

    test('移动到无效位置应返回false', () => {
      const item = { id: '1', name: 'item1', position: 0 };
      manager.addItem(item);
      
      expect(manager.moveItem('1', -1)).toBe(false);
      expect(manager.moveItem('1', 1)).toBe(false);
    });

    test('移动不存在的项目应返回false', () => {
      const item = { id: '1', name: 'item1', position: 0 };
      manager.addItem(item);
      
      expect(manager.moveItem('nonexistent', 0)).toBe(false);
    });
  });

  describe('getItems', () => {
    test('返回的数组应该是副本，修改不影响原始数据', () => {
      const item1 = { id: '1', name: 'item1', position: 0 };
      const item2 = { id: '2', name: 'item2', position: 1 };
      
      manager.addItem(item1);
      manager.addItem(item2);
      
      const items = manager.getItems();
      items.push({ id: '3', name: 'item3', position: 2 });
      
      expect(manager.getItems()).toHaveLength(2);
    });
  });

  describe('getItemById', () => {
    test('获取存在的项目', () => {
      const item = { id: '1', name: 'item1', position: 0 };
      manager.addItem(item);
      
      const result = manager.getItemById('1');
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
    });

    test('获取不存在的项目应返回undefined', () => {
      expect(manager.getItemById('nonexistent')).toBeUndefined();
    });
  });
});
