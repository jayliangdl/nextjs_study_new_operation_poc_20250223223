/**
 * 事件总线 - 用于组件间通信的简单实现
 * 支持事件的发布和订阅，实现组件间的松耦合通信
 */

// 事件处理函数类型
type EventHandler = (data: any) => void;

// 事件类型枚举
export enum EventType {
  // 图标相关事件
  ICON_CLICK = 'ICON_CLICK',
  ICON_DRAG_START = 'ICON_DRAG_START',
  ICON_DRAG_END = 'ICON_DRAG_END',
  COMPONENT_POSITON_CHANGE = 'COMPONENT_POSITON_CHANGE', // 新增：图标拖放事件
  
  // 菜单相关事件
  MENU_ITEM_CLICK = 'MENU_ITEM_CLICK',
  
  // 标签页相关事件
  TAB_CHANGE = 'TAB_CHANGE',
}

// 事件总线类
class EventBus {
  private handlers: Map<EventType, EventHandler[]> = new Map();

  // 订阅事件
  subscribe(eventType: EventType, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.push(handler);
    }
  }

  // 取消订阅事件
  unsubscribe(eventType: EventType, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      return;
    }
    
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // 发布事件
  publish(eventType: EventType, data: any): void {
    if (!this.handlers.has(eventType)) {
      return;
    }
    
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }
}

// 导出单例实例
export const eventBus = new EventBus();
