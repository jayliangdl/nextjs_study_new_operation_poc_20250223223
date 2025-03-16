import React from 'react';

// 组件注册表类型
type ComponentEntry<T = any> = {
  component: React.ComponentType<T>;
  props: T;
};

class ComponentRegistry {
  private static instance: ComponentRegistry;
  private registry: Map<string, ComponentEntry> = new Map();

  private constructor() {}

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  // 注册组件
  public register<T>(
    type: string,
    component: React.ComponentType<T>,
    propsType: T
  ): void {
    if (this.registry.has(type)) {
      console.warn(`组件类型 "${type}" 已经注册，将被覆盖`);
    }
    this.registry.set(type, {
      component,
      props: propsType,
    });
  }

  // 获取组件
  public getComponent(type: string): ComponentEntry | undefined {
    return this.registry.get(type);
  }

  // 获取所有已注册的组件类型
  public getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  // 检查组件类型是否已注册
  public hasComponent(type: string): boolean {
    return this.registry.has(type);
  }
}

export const componentRegistry = ComponentRegistry.getInstance();

// 导出一个高阶组件用于自动注册
export function withComponentRegister<P extends object>(componentType: string) {
  return function(WrappedComponent: React.ComponentType<P>) {
    componentRegistry.register(componentType, WrappedComponent, {} as P);
    return WrappedComponent;
  };
} 