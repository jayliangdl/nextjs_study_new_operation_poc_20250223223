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
  // 标签页重命名事件
  TAB_RENAME = 'TAB_RENAME',
  // 表单填写事件（用户在输入所有表单中的字段时，会触发此事件）
  FORM_FILLING = 'FORM_FILLING',
  // 表单提交事件（用户在提交表单时，会触发此事件）
  FORM_SUBMIT = 'FORM_SUBMIT',
}

// 事件总线类
class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  // 订阅事件
  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.push(handler);
    }
  }

  // 取消订阅事件
  unsubscribe(eventType: string, handler: EventHandler): void {
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
  publish(eventType: string, data: any): void {
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

// 动态事件类型组装方法
export const getEventTypeWithBusinessId = (eventType: string, businessId: string) => {
  return `${businessId}-${eventType}`;
};

// 导出单例实例
export const eventBus = new EventBus();
