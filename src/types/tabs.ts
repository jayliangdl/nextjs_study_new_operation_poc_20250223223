import {PositionManager,PositionItem} from './positionManager';

class TabsContainer {
    private defaultActiveTabId: string = '';
    private positionManager: PositionManager<TabItem> = new PositionManager<TabItem>();

    constructor(initialTabs: TabItem[], defaultActiveTabId: string = '') {
        this.positionManager = new PositionManager<TabItem>();
        this.defaultActiveTabId = defaultActiveTabId;
        
        // 如果提供了初始标签页，则添加它们
        initialTabs.forEach(tab => {
            this.addTab(tab.id, tab.title, tab.content);
        });
    }

    addTab(id:string, title: string, content: {configId: string}): void {
        const tab = new TabItem(id, title, content);
        this.positionManager.addItem(tab);
    }

    removeTab(id: string): void {
        this.positionManager.removeItem(id);
    }

    getItems(): TabItem[] {
        return this.positionManager.getItems();
    }

    getItemById(id: string): TabItem | undefined {
        return this.positionManager.getItemById(id);
    }

    updateItem(id: string, updateData: Partial<TabItem>): void {
        this.positionManager.updateItem(id, updateData);
    }

    moveItem(id: string, newPosition: number): boolean {
        return this.positionManager.moveItem(id, newPosition);
    }

    getDefaultActiveTabId(): string {
        return this.defaultActiveTabId;
    }
}

class TabItem implements PositionItem{
    id: string;
    position: number|undefined;
    title: string;
    content: {
        configId: string;
    };
    constructor(id: string, title: string, content: {configId: string}) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.position = undefined;
    }
}

export {TabsContainer,TabItem};
