import { ContainerContentType } from './container';

// Splitter 相关类型定义
export interface SplitterConfig {
  direction: 'horizontal' | 'vertical';  // layout 属性
  panels: PanelConfig[];                 // 子面板配置
  onResizeStart?: (sizes: number[]) => void;  // 开始拖拽前回调
  onResize?: (sizes: number[]) => void;       // 面板大小变化回调
  onResizeEnd?: (sizes: number[]) => void;    // 拖拽结束回调
  lazy?: boolean;                             // 延迟渲染模式
  style?: React.CSSProperties;                // 自定义样式
}

// Panel 相关类型定义
export interface PanelConfig {
  id: string;                      // 添加唯一标识
  
  // 尺寸相关
  defaultSize?: number | string;    // 初始面板大小
  size?: number | string;          // 受控面板大小
  min?: number | string;           // 最小值
  max?: number | string;           // 最大值
  
  // 功能相关
  collapsible?: boolean | {        // 快速折叠
    start?: boolean;
    end?: boolean;
  };
  resizable?: boolean;             // 是否开启拖拽伸缩
  
  // 内容相关
  content?: PanelContentConfig;      // 面板内容配置
  splitter?: SplitterConfig;         // 嵌套分割面板
  
  // 样式相关
  style?: React.CSSProperties;       // 自定义样式
}

// 面板内容配置
export interface PanelContentConfig {
  type: ContainerContentType;        // 内容类型
  props: Record<string, any>;        // 组件属性
} 