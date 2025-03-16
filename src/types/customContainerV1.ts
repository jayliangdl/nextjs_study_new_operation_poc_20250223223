import { v4 as uuid } from 'uuid';
import lodash from 'lodash';

// 添加拖拽事件处理器接口
export interface DraggableContentProps {
  onDragStart?: (instanceId: string) => void;
  onDragEnd?: (info: { sourceId: string; targetId: string }) => void;
}

// 状态枚举
export enum Status {
  Normal = 'normal',
  WillRemove = 'will_remove',
  WillMerge = 'will_merge'
}

// 方向枚举
export enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

// 明细类型枚举
export enum DetailType {
  Container = 'container',
  Detail = 'detail'
}

// 插入位置枚举
export enum InsertPosition {
  Before = 'before',
  After = 'after'
}

// 插入位置枚举
export enum InsertPositionV2 {
    Left = 'left',
    Right = 'right',
    Above = 'above',
    Below = 'below'
  }

// 明细配置接口
export interface DetailConfig {
  id: string;
  type: DetailType;
  size: number;
  style?: React.CSSProperties;
  configId?: string;
  componentType?: string;
}

// 容器配置接口
export interface ContainerConfig extends DetailConfig {
  direction: Direction;
  details: (DetailConfig | ContainerConfig)[];
}

// 明细类
export class Detail {
  private _id: string;
  private _type: DetailType;
  private _size: number;
  private _parent?: Container;  // 改为 protected
  private _status: Status;
  private _style?: React.CSSProperties;
  private _configId?: string;
  private _componentType?: string;
  constructor(type: DetailType, parent?: Container,id?:string) {
    if(typeof id === 'string'){
      this._id = id;
    }else{
      this._id = uuid();
    }
    this._type = type;
    this._size = 100; // 默认值
    this._parent = parent;
    this._status = Status.Normal;
    this._style = {};
  }

  get id(): string {
    return this._id;
  }

  get type(): DetailType {
    return this._type;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  get parent(): Container | undefined {
    return this._parent;
  }

  get status(): Status {
    return this._status;
  }

  set status(value: Status) {
    this._status = value;
  }

  get style(): React.CSSProperties | undefined {
    return this._style;
  }

  get configId(): string | undefined {
    return this._configId;
  }

  get componentType(): string | undefined {
    return this._componentType;
  }

  toConfigJSON(): DetailConfig {
    return {
      id: this._id,
      type: this._type,
      size: this._size,
      configId: this._configId,
      style: this._style,
      componentType: this._componentType
    };
  }

  public get needFirstAndLastResizer(): boolean {
    if (this._parent && 
        this._parent.direction === Direction.Horizontal && 
        this._parent.details.length === 1) {
      return false;
    }
    return true;
  }

  // 设置父容器引用
  setParent(parent: Container) {
    this._parent = parent;
  }

  /**
   * 从配置初始化明细实例的静态工厂方法
   * @param config - 明细配置
   * @returns Detail实例
   */
  static init(config: DetailConfig, parent: Container): Detail {
    // 确保有传入componentType
    if(!config.componentType){
      throw new Error('初始化出错，componentType不能为空');
    }
    const detail = new Detail(config.type, parent);
    // 使用反射或其他方式设置私有属性
    Object.assign(detail, {
      _id: config.id || uuid(),
      _size: config.size,
      _style: config.style,
      _configId: config.configId,
      _componentType: config.componentType
    });
    return detail;
  }
}

// 容器类
export class Container extends Detail {
  private _direction: Direction;
  private _details: Detail[] = [];

  constructor(direction: Direction, parent?: Container,id?:string) {
    super(DetailType.Container, parent,id);
    this._direction = direction;
    this._details = [];
  }

  toConfigJSON(): ContainerConfig {
    return {
      id: this.id,
      type: this.type,
      size: this.size,
      direction: this._direction,
      details: this._details.map(detail => detail.toConfigJSON())
    };
  }

  get direction(): Direction {
    return this._direction;
  }

  get details(): Detail[] {
    return this._details;
  }

  public get needFirstAndLastResizer(): boolean {    
    if (this.parent && this.parent.direction === this._direction) {
      return false;
    }
    return true;
  }

  /**
   * 能否增加更多detail
   * @returns boolean
   */
  availableAddDetail():boolean{
    return this._direction===Direction.Vertical;
  }

  // 修改 addDetail 方法，为所有明细设置父容器引用
  addDetail(detail: Detail, index?:number): void {
    detail.setParent(this);  // 为所有类型的明细设置父容器引用
    if(typeof index === 'number') {
        this._details.splice(index, 0, detail);
    } else {
        this._details.push(detail);
    }
    this.recalculateDetailSizesSpecificContainer(this.getRootContainer());
  }

  // 删除明细方法
  // removeDetail(detailId: string): boolean {
  //   // 先在当前容器中查找
  //   const index = this._details.findIndex(detail => detail.id === detailId);
  //   if (index !== -1) {
  //     this._details.splice(index, 1);
  //     this.recalculateDetailSizes();
  //     return true;
  //   }

  //   // 如果当前容器中没找到，递归查找子容器
  //   for (const detail of this._details) {
  //     if (detail.type === DetailType.Container) {
  //       const container = detail as Container;
  //       const removed = container.removeDetail(detailId);
  //       if (removed) {
  //         // 检查子容器是否只剩一个明细
  //         if (container.details.length === 1) {
  //           // 将子容器的明细提升到当前容器
  //           const remainingDetail = container.details[0];
  //           const containerIndex = this._details.indexOf(container);
  //           this._details.splice(containerIndex, 1, remainingDetail);
  //         }
  //         this.recalculateDetailSizes();
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // }

  // removeDetailByIndex(index: number): void {
  //   this._details.splice(index, 1);
  //   this.recalculateDetailSizes();
  // }
  // 重新计算明细尺寸
  protected recalculateDetailSizes(): void {
    if(this.direction === Direction.Vertical){
      return;
    }
    const detailCount = this._details.length;
    if (detailCount > 0) {
      const size = 100 / detailCount;
      this._details.forEach(detail => {
        detail.size = size;
      });
    }
  }

  private recalculateDetailSizesSpecificContainer(container:Container):void{
    if(container){
      for(const detail of container.details){
        if(detail.type === DetailType.Container){
           (detail as Container).recalculateDetailSizesSpecificContainer(detail as Container);
        }
      }
      container.recalculateDetailSizes();
    }
  }

  // 查找明细方法
  findDetail(detailId: string): [Container, number, Detail] {
    // 先在当前容器中查找
    const index = this._details.findIndex(detail => detail.id === detailId);
    if (index !== -1) {
      return [this, index, this._details[index]];
    }

    // 如果当前容器中没找到，递归查找子容器
    for (const detail of this._details) {
      if (detail.type === DetailType.Container) {
        try {
          return (detail as Container).findDetail(detailId);
        } catch (error) {
          // 如果在这个子容器中没找到，继续查找下一个子容器
          continue;
        }
      }
    }

    // 如果所有容器都找不到，抛出错误
    throw new Error(`CANNOT FIND THE DETAIL:${detailId}`);
  }

  /**
   * 在指定明细前后插入新明细
   * 1. 如果父容器的方向与指定方向相同，则直接在目标明细前/后插入新明细
   * 2. 如果父容器的方向与指定方向不同，则：
   *    - 创建一个新的子容器（方向为指定方向）
   *    - 将目标明细从原父容器中移除
   *    - 将目标明细和新明细添加到新子容器中（根据position决定顺序）
   *    - 将新子容器插入到原来目标明细的位置
   * 3. 最后重新计算受影响容器的明细尺寸
   * 
   * @param targetDetailId - 目标明细的ID
   * @param newDetail - 要插入的新明细对象
   * @param direction - 期望的排列方向
   * @param position - 插入位置（之前/之后）
   * @throws Error - 当找不到目标明细时抛出错误
   */
  insertDetail(targetDetailId: string, newDetail: Detail, direction: Direction, position: InsertPosition): void {
    try {
      // 使用 findDetail 方法找到目标明细及其父容器
      const [parentContainer, index, targetDetail] = this.findDetail(targetDetailId);

      // 判断父容器的方向是否与指定方向不同
      if (parentContainer.direction !== direction) {
        // 方向不同，需要创建新的子容器
        const newContainer = new Container(direction);
        
        // 将目标明细从原父容器中移除
        parentContainer.details.splice(index, 1);
        
        // 根据position决定添加顺序
        if (position === InsertPosition.Before) {
          newContainer.addDetail(newDetail);
          newContainer.addDetail(targetDetail);
        } else {
          newContainer.addDetail(targetDetail);
          newContainer.addDetail(newDetail);
        }
        
        // 将新容器插入到原来目标明细的位置
        parentContainer.details.splice(index, 0, newContainer);
      } else {
        // 方向相同，直接在目标明细前/后插入新明细
        const insertIndex = position === InsertPosition.Before ? index : index + 1;
        parentContainer.details.splice(insertIndex, 0, newDetail);
      }

      // 重新计算所有受影响容器的明细尺寸
      parentContainer.recalculateDetailSizes();

    } catch (error) {
      // 如果找不到目标明细，继续抛出错误
      throw error;
    }
  }

  // 修改静态工厂方法以支持父容器引用
  static init(config: ContainerConfig, parent?: Container): Container {
    const container = new Container(config.direction, parent);
    
    Object.assign(container, {
      _id: config.id || uuid(),
      _size: config.size,
      _style: config.style
    });

    config.details.forEach(detailConfig => {
      if (detailConfig.type === DetailType.Container) {
        const childContainer = Container.init(detailConfig as ContainerConfig, container);
        container.addDetail(childContainer);
      } else {
        const detail = Detail.init(detailConfig, container);
        container.addDetail(detail);
      }
    });

    return container;
  }

  /**
   * 获取容器的根容器
   * @returns 根容器实例
   */
  getRootContainer(): Container {
    let current: Container = this;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  // 添加新方法
  findContainer(containerId: string): Container {
    if (this.id === containerId) {
      return this;
    }

    for (const detail of this._details) {
      if (detail.type === DetailType.Container) {
        try {
          return (detail as Container).findContainer(containerId);
        } catch {
          continue;
        }
      }
    }

    throw new Error(`Cannot find container: ${containerId}`);
  }


  /**新的部分 */
  /**
   * 将一个detail从容器中移除
   * @param detailId - 要移除的detail的ID
   */

  elimateDetail(detailId: string): void {
    const [container, index, detail] = this.findDetail(detailId);
    detail.status = Status.WillRemove;
  }

  /**
   * 将一个新的detail合并到原来某个detail中
   * @param movingDetailId - 被移动的detail的ID
   * @param referenceDetailId - 插入目标容器中的具体位置（参照原容器某个detail的前面或后面）- 参照detail的id
   * @param referenceDetailIndex - 插入目标容器中的具体位置（参照原容器某个detail的前面或后面）- 参照detail索引
   * @param insertPosition 插入目标容器中的具体位置（参照原容器某个detail的前面或后面）- 插入位置相对于目标位置的前面或后面（before 或 after）
   */
  mergeDetailIntoContainer(movingDetailId: string, referenceDetailId: string, referenceDetailIndex: number, insertPosition: InsertPosition): void {
    const [targetContainer, targetIndex, targetDetail] = this.findDetail(referenceDetailId);
    const [movingContainer, movingDetailIndex, movingDetail] = this.findDetail(movingDetailId);
    const movingDetailClone = lodash.cloneDeep(movingDetail);
    movingDetailClone.setParent(targetContainer);
    movingDetailClone.status = Status.WillMerge;
    /**
     * 先计算实际应该插入到目标容器的哪个位置，如果插入位置是before，则实际应该插入到referenceDetailIndex的前面，如果插入位置是after，则实际应该插入到referenceDetailIndex的后面
     * 然后根据实际应该插入的位置，将movingDetail插入到目标容器中
     * **/
    if(referenceDetailIndex<0 || referenceDetailIndex>=targetContainer.details.length){
      throw new Error('referenceDetailIndex有误，超出原目标容器的范围');
    }
    let actualMergeIndex = referenceDetailIndex;
    if(insertPosition === InsertPosition.Before){
      if(referenceDetailIndex===0){
        actualMergeIndex = 0;
      }else{
        actualMergeIndex = referenceDetailIndex;
      }
    }else if(insertPosition === InsertPosition.After){
      actualMergeIndex = referenceDetailIndex+1;
    }
    movingContainer.elimateDetail(movingDetailId);
    targetContainer.details.splice(actualMergeIndex, 0, movingDetailClone);
    this.getRootContainer().optimizeStructureFromRootContainer();
  }

  /***
   * 将一个新的detail合并到原来某个detail中
   * @param movingDetailId - 被移动的detail的ID
   * @param targetDetailId - 被合并的detail（向哪个detail合并）
   * @param referenceDetailIndex - 插入目标容器中的具体位置（参照原容器某个detail的前面或后面）- 参照detail索引
   * @param insertPositionV2 被移动detail插入到已有detail的方向(left: 在目标位置的左侧, right: 在目标位置的右侧, above: 在目标位置的上方, below: 在目标位置的下方)
   */
  mergeDetailIntoDetail(movingDetailId: string, targetDetailId: string, referenceDetailIndex: number, insertPositionV2: InsertPositionV2): void {
    //如果移动的detail和目标detail是同一个detail，则不进行合并
    if(movingDetailId===targetDetailId){
      return;
    }
    const [targetContainer, targetIndex, targetDetail] = this.findDetail(targetDetailId);
    const [movingContainer, movingDetailIndex, movingDetail] = this.findDetail(movingDetailId);
    const movingDetailClone = lodash.cloneDeep(movingDetail);
    const targetDetailClone = lodash.cloneDeep(targetDetail);

    const targetContainerDirection = insertPositionV2 === InsertPositionV2.Left || insertPositionV2 === InsertPositionV2.Right ? Direction.Horizontal : Direction.Vertical;
    const newContainer = new Container(targetContainerDirection, targetContainer, undefined);
    const newDetails = insertPositionV2 === InsertPositionV2.Left || insertPositionV2 === InsertPositionV2.Above ? 
      [movingDetailClone, targetDetailClone] : [targetDetailClone, movingDetailClone];

    newDetails.forEach(detail=>{
      detail.setParent(newContainer);
      detail.status = Status.WillMerge;
    });
    newContainer.addDetail(newDetails[0], 0);
    newContainer.addDetail(newDetails[1], 1);
    (movingContainer as Container).elimateDetail(movingDetailId);
    (targetContainer as Container).elimateDetail(targetDetailId);

    (targetContainer as Container).details.splice(targetIndex, 0, newContainer);
    this.getRootContainer().optimizeStructureFromRootContainer();
  }


  /**
   * 从根容器开始优化容器结构
   * 背景：
   * rootContainer一定保持着纵向，另外即使rootContainer只包含一个元素也不作优化处理，
   * 因此，从rootContainer的下一级开始优化容器结构
   */
  private optimizeStructureFromRootContainer() {
    const rootContainer = this.getRootContainer();
    
    // 先优化子容器结构
    for (const detail of rootContainer.details) {
      if (detail.type === DetailType.Container) {
        const container = detail as Container;
        container.optimizeStructure();
        
      }
    }
    // 优化空容器
    rootContainer.optimizeContainerWith0Detail();
  }

  /**
   * 优化空容器
   * 递归检查每一层的所有容器，若出现容器没有正常状态的子元素（正常状态包括：非待删除的状态），则标记容器为待删除状态
   * 注意：根容器(没有父容器的容器)即使没有子元素也不会被标记为删除
   * @returns 是否进行了优化
   */
  private optimizeContainerWith0Detail(): boolean {
    let hasOptimized = false;
    // 递归检查并标记需要优化的结构
    const markForOptimization = (container: Container): void => {
      // 先递归处理所有子容器
      for (let i = 0; i < container.details.length; i++) {
        const detail = container.details[i];
        if (detail.type === DetailType.Container) {
          const childContainer = detail as Container;
          markForOptimization(childContainer);
        }
      }
      
      // 过滤出状态为 Normal 的子元素
      const normalDetails = container.details.filter(detail => detail.status !== Status.WillRemove);
      
      // 检查容器是否为空（没有正常状态的子元素）
      // 且不是根容器（有父容器引用）
      if (normalDetails.length === 0 && container.parent) {
        // 标记为待删除
        container.status = Status.WillRemove;
        hasOptimized = true;
      }
    };
    
    // 从当前容器开始递归标记
    markForOptimization(this);
    
    // 如果进行了优化，提交更改
    if (hasOptimized) {
      this.commitChange();
    }
    
    return hasOptimized;
  }

  /**
   * 优化容器结构
   * 递归检查每层details中所有元素，如果detail元素的类型是Container，
   * 且该子Container的details元素只有一个且类型是Detail，
   * 则将该子元素提取到父Container.details插入到原位置
   * @returns 是否进行了优化
   */
  private optimizeStructure(): boolean {
    let hasOptimized = false;
    // 递归检查并标记需要优化的结构
    const markForOptimization = (container: Container): void => {
      // 遍历所有子元素
      for (let i = 0; i < container.details.length; i++) {
        const detail = container.details[i];
        
        // 如果是容器类型，递归处理
        if (detail.type === DetailType.Container) {
          const childContainer = detail as Container;
          
          // 递归处理子容器
          markForOptimization(childContainer);
          
          const normalDetails = childContainer.details.filter(detail=>detail.status===Status.Normal);
          
          // 规则1: 检查子容器是否只有一个子元素
          if (normalDetails.length === 1 && normalDetails[0].status === Status.Normal) {
            // 标记子元素为将要合并
            const childDetail = normalDetails[0];
            
            // 只处理状态为 Normal 的子元素
            if (childDetail.status === Status.Normal) {
              const clonedDetail = lodash.cloneDeep(childDetail);
              
              // 设置状态
              childDetail.status = Status.WillRemove;
              clonedDetail.status = Status.WillMerge;
              
              // 设置父容器引用
              clonedDetail.setParent(container);
              
              // 在父容器中插入克隆的子元素，替换原来的子容器
              container.details.splice(i, 1, clonedDetail);
              
              hasOptimized = true;
            }
          }
          // 规则2: 检查父容器和子容器的方向是否相同
          if (container.direction === childContainer.direction && normalDetails.length > 0) {
            // 标记子容器为将要移除
            childContainer.status = Status.WillRemove;
            
            // 克隆所有子元素并标记为将要合并
            const clonedDetails: Detail[] = [];
            for (const childDetail of normalDetails) {
              // 只处理状态为 Normal 的子元素
              if (childDetail.status === Status.Normal) {
                const clonedDetail = lodash.cloneDeep(childDetail);
                childDetail.status = Status.WillRemove;
                clonedDetail.status = Status.WillMerge;
                clonedDetail.setParent(container);
                clonedDetails.push(clonedDetail);
              }
            }
            
            // 只有当有元素需要合并时才进行替换
            if (clonedDetails.length > 0) {
              // 在父容器中插入克隆的子元素，替换原来的子容器
              container.details.splice(i, 1, ...clonedDetails);
              hasOptimized = true;
            }
          }
        }
      }
    };
    
    // 从根容器开始递归标记
    markForOptimization(this);
    
    // 如果进行了优化，提交更改
    if (hasOptimized) {
      this.commitChange();
    }
    
    return hasOptimized;
  }
  
  /**
   * 递归优化整个容器树结构
   * 持续优化直到没有更多可优化的结构
   */
  private deepOptimizeStructure(): void {
    // 持续优化直到没有更多可优化的结构
    while (this.optimizeStructure()) {
      // 继续优化
    }
  }

  /**
   * 根据状态执行删除、合并、移动等操作
   * 循环遍历所有detail，如果detail是容器，则递归调用commitChange方法，
   * 如果detail的状态是WillRemove，则删除detail，
   * 如果detail的状态是WillMerge，则将detail的状态设置为Normal
   */
  commitChange(): void {
    // 使用 filter 创建一个新数组，过滤掉需要删除的 details
    this._details = this._details.filter(detail => {
      // 如果是容器类型，先递归处理
      if (detail.type === DetailType.Container && detail.status === Status.Normal) {
        (detail as Container).commitChange();
      }

      // 根据状态处理
      switch (detail.status) {
        case Status.WillRemove:
          return false; // 返回 false 将从数组中移除该 detail
        case Status.WillMerge:
          detail.status = Status.Normal; // 重置状态为 Normal
          return true;
        default:
          return true;
      }
    });

    // 重新计算剩余 details 的尺寸
    this.recalculateDetailSizes();
  }

  /**
   * 打印容器结构
   * @param container 要打印的容器，默认为当前容器
   * @returns JSON 格式的容器结构字符串
   */
  printStructureFromRootContainer(container:Container = this.getRootContainer()):string{
    // 递归构建容器结构的辅助函数
    const buildStructure = (detail: Detail): any => {
      // 基本信息对象
      const info: any = {
        id: detail.id,
        type: detail.type,
        status: detail.status,
        size: detail.size
      };
      
      // 如果有样式，添加样式信息
      if (detail.style) {
        info.style = detail.style;
      }
      
      // 如果是容器，添加方向和子元素信息
      if (detail.type === DetailType.Container) {
        const container = detail as Container;
        info.direction = container.direction;
        info.details = container.details.map(childDetail => buildStructure(childDetail));
      }
      
      return info;
    };
    
    // 从指定的容器开始构建结构
    const structure = buildStructure(container);
    
    // 返回格式化的 JSON 字符串
    return JSON.stringify(structure, null, 2);
  }

  /**
   * 静态方法，打印任意容器的结构
   * @param container 要打印的容器
   * @returns 格式化的容器结构字符串
   */
  static printStructure(container: Container): string {
    return container.printStructureFromRootContainer(container);
  }
}
