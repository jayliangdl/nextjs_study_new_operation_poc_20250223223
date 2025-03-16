# 更新日志

## [2025-03-16] 组件自动注册机制实现

### 主要变更

1. 实现了组件自动注册机制，替代了原有的手动注册方式
2. 新增了组件注册文件自动生成脚本
3. 统一了所有动态组件的类型定义和注册方式
4. 优化了开发环境的构建流程

### 详细改动

#### 1. 组件注册机制

##### 1.1 高阶组件 `withComponentRegister`

- **位置**：`src/utils/componentRegistry.ts`
- **功能**：提供组件自动注册的高阶组件
- **使用方式**：
  ```typescript
  export default withComponentRegister<ComponentProps>('ComponentName')(Component);
  ```
- **实现原理**：
  - 使用 TypeScript 泛型确保类型安全
  - 自动将组件注册到全局组件映射中
  - 支持运行时的组件动态加载

##### 1.2 组件注册示例

```typescript
// 以 CustomField 为例
export interface CustomFieldProps {
  configId?: string;
  config?: any;
  titleAndControlLayout?: TypeOfTitleAndControlLayout;
  businessProps?: any;
}

const CustomField: React.FC<CustomFieldProps> = ({ ... }) => {
  // 组件实现
};

export default withComponentRegister<CustomFieldProps>('CustomField')(CustomField);
```

#### 2. 自动生成注册文件

##### 2.1 生成脚本

- **位置**：`scripts/generateComponentRegistry.js`
- **功能**：
  - 自动扫描 `src/components` 目录下的所有组件
  - 生成组件注册映射文件
  - 支持开发环境下的实时文件监听

##### 2.2 配置更新

- **package.json 新增脚本**：
  ```json
  {
    "scripts": {
      "dev": "concurrently \"node scripts/generateComponentRegistry.js --watch\" \"next dev\"",
      "predev": "node scripts/generateComponentRegistry.js",
      "prebuild": "node scripts/generateComponentRegistry.js"
    }
  }
  ```

#### 3. 组件类型统一

目前部分组件（CustomField、CustomButton）遵循统一的接口定义模式：

```typescript
// 当前实现的通用属性模式（仅在部分组件中使用）
interface CommonProps {
  configId?: string;        // 配置ID
  config?: any;            // 具体配置
  businessProps?: any;     // 业务属性
}
```

**待优化项**：
- 建议将此模式扩展到所有动态组件
- 需要修改 DynamicTable、ContentDesc 等组件以符合统一标准
- 建议将此接口抽象为基础接口并统一管理

当前已实现统一属性的组件：
- CustomField
- CustomButton

待统一属性的组件：
- DynamicTable
- ContentDesc

#### 4. 开发流程优化

##### 4.1 自动化流程

1. 开发新组件时：
   - 使用 `withComponentRegister` HOC 包装组件
   - 导出组件的 Props 类型定义
   - 组件会被自动发现并注册

2. 启动开发环境：
   - `npm run dev` 会自动执行：
     1. 生成最新的组件注册文件
     2. 启动文件监听
     3. 启动 Next.js 开发服务器

##### 4.2 跨平台支持

- 使用 `concurrently` 确保在 Windows 和 Linux 平台下都能正常运行
- 开发和生产环境配置保持一致

### 注意事项

1. 新组件开发规范：
   - 必须使用 `withComponentRegister` 高阶组件
   - 必须导出组件的 Props 接口
   - 建议将配置相关的类型定义放在组件文件中

2. 潜在问题处理：
   - 如果组件没有被自动发现，检查文件是否在 `src/components` 目录下
   - 如果类型报错，确保已正确导出并使用了 Props 接口

### 后续优化方向

1. 组件配置类型进一步细化
2. 添加组件注册的单元测试
3. 改进组件配置的验证机制
4. 优化组件的按需加载机制

### 相关依赖

- 新增开发依赖：
  ```json
  {
    "devDependencies": {
      "concurrently": "^8.2.2",
      "chokidar": "^3.6.0"
    }
  }
  ``` 