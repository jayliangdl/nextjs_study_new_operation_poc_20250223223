# 组件自动注册机制技术设计文档

## 1. 系统架构

### 1.1 整体架构

```
src/
├── components/          # 组件目录
├── utils/
│   ├── componentRegistry.ts    # 组件注册核心逻辑
│   └── configLoad.ts          # 配置加载工具
├── types/              # 类型定义
└── generated/          # 自动生成的文件
    └── componentMap.ts # 组件映射文件

scripts/
└── generateComponentRegistry.js  # 注册文件生成脚本
```

### 1.2 核心模块

1. **组件注册器（withComponentRegister HOC）**
   - 提供组件注册的统一接口
   - 处理组件的类型安全
   - 管理组件的生命周期

2. **配置加载器（configLoad）**
   - 处理组件配置的异步加载
   - 管理配置缓存
   - 提供配置验证

3. **注册文件生成器（generateComponentRegistry）**
   - 扫描组件目录
   - 生成组件映射
   - 监听文件变化

## 2. 详细设计

### 2.1 组件注册器

#### 2.1.1 类型定义

```typescript
// 基础组件属性接口
interface BaseComponentProps {
  configId?: string;
  config?: any;
  businessProps?: any;
}

// 高阶组件类型
type WithComponentRegister = <P extends BaseComponentProps>(
  componentName: string
) => (Component: React.ComponentType<P>) => React.FC<P>;
```

#### 2.1.2 注册流程

1. 组件包装：
   ```typescript
   const withComponentRegister: WithComponentRegister = (componentName) => (Component) => {
     const WrappedComponent: React.FC<P> = (props) => {
       // 组件渲染逻辑
       return <Component {...props} />;
     };
     
     // 注册到组件映射
     registerComponent(componentName, WrappedComponent);
     
     return WrappedComponent;
   };
   ```

2. 组件使用：
   ```typescript
   const MyComponent = withComponentRegister<MyComponentProps>('MyComponent')(
     // 组件实现
   );
   ```

### 2.2 配置加载器

#### 2.2.1 当前配置加载实现

```typescript
// src/utils/configLoad.ts
const loadConfig = async (configId: string, setComponentConfig: (config: any) => void) => {
    if(!configId){
        console.error('configId是必填参数');
        return;
    }
    
    try {
        const response = await fetch(`/api/config?configId=${configId}`);
        const data = await response.json();
        if (data.result === 1) {
            setComponentConfig(data.data);
        } else {
            console.error(data.message || '加载配置失败' || 'congfigId:'|| configId);
        }
    } catch (err) {
        console.error('加载配置出错: ' + (err as Error).message);
    }
}
```

**当前实现特点**：
1. 通过 HTTP 请求获取配置
2. 支持错误处理和日志
3. 使用回调函数处理配置数据
4. 简单的参数验证

**待优化项**：
1. 添加配置缓存机制
2. 增强配置验证
3. 支持配置类型安全
4. 添加重试机制

## 3. 未来优化计划

以下功能均未实现，作为后续优化方向：

### 3.1 配置验证增强
- 类型验证
- 必填字段验证
- 业务规则验证

### 3.2 性能优化
- 配置缓存机制
  ```typescript
  // 计划实现的缓存机制示例
  class Cache<T> {
    private cache = new Map<string, { value: T; timestamp: number }>();
    private ttl: number;

    constructor(ttl = 5 * 60 * 1000) { // 默认 5 分钟
      this.ttl = ttl;
    }
    // ... 缓存实现细节
  }
  ```

- 组件懒加载
  ```typescript
  // 计划实现的懒加载方案
  const DynamicComponent: React.FC<DynamicComponentProps> = ({ componentType, ...props }) => {
    const Component = React.lazy(() => import(`@/components/${componentType}`));
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };
  ```

- 运行时性能监控
  ```typescript
  // 计划实现的性能监控 HOC
  const withPerformanceMonitoring = <P extends object>(Component: React.ComponentType<P>) => {
    return function PerformanceWrapper(props: P) {
      useEffect(() => {
        const start = performance.now();
        return () => {
          const duration = performance.now() - start;
          console.log(`Component rendered in ${duration}ms`);
        };
      }, []);
      return <Component {...props} />;
    };
  };
  ```

### 3.3 错误处理机制
- 标准化错误类型
  ```typescript
  // 计划实现的错误类型
  class ComponentLoadError extends Error {
    constructor(componentName: string, cause?: Error) {
      super(`Failed to load component: ${componentName}`);
      this.name = 'ComponentLoadError';
      this.cause = cause;
    }
  }

  class ConfigValidationError extends Error {
    constructor(message: string, config: any) {
      super(message);
      this.name = 'ConfigValidationError';
      this.config = config;
    }
  }
  ```

- 错误边界处理
  ```typescript
  // 计划实现的错误边界
  const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>) => {
    return class ErrorBoundary extends React.Component<P> {
      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Component Error:', {
          component: Component.name,
          error,
          errorInfo,
        });
      }
      render() {
        return <Component {...this.props} />;
      }
    };
  };
  ```

### 3.4 测试覆盖
- 单元测试示例
  ```typescript
  // 计划实现的测试用例
  describe('withComponentRegister', () => {
    it('should register component correctly', () => {
      const TestComponent = withComponentRegister('Test')(() => null);
      expect(getRegisteredComponent('Test')).toBe(TestComponent);
    });
  });
  ```

- 集成测试示例
  ```typescript
  // 计划实现的集成测试
  describe('DynamicComponent', () => {
    it('should load and render component', async () => {
      render(
        <DynamicComponent
          componentType="CustomButton"
          config={{ label: 'Click me' }}
        />
      );
      await waitFor(() => {
        expect(screen.getByText('Click me')).toBeInTheDocument();
      });
    });
  });
  ```

### 3.5 构建和部署优化
- Webpack 优化配置
  ```javascript
  // 计划实现的构建优化
  module.exports = {
    webpack: (config, { isServer }) => {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 50000,
      };
      return config;
    },
  };
  ```

- 环境配置管理
  ```typescript
  // 计划实现的环境配置
  export const config = {
    development: {
      componentScanInterval: 1000,
      enableHotReload: true,
    },
    production: {
      componentScanInterval: 0,
      enableHotReload: false,
    },
  }[process.env.NODE_ENV];
  ``` 