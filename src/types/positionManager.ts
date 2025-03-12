class PositionManager<T extends PositionItem>{
    protected items: T[] = [];
    addItem(item:T):void{
        if(item.position == undefined){
            item.position = this.items.length;
        }
        this.items.push(item);
        this.sortItems();
    }
    private sortItems():void{
        this.items.sort((a, b) => a.position! - b.position!);
    }
    getItems():T[]{
        return [...this.items];//返回副本防止外部修改
    }

    removeItem(itemId:string):void{
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getItemById(itemId:string):T|undefined{
        return this.items.find(item => item.id === itemId);
    }

    updateItem(itemId:string,updateData:Partial<T>):void{
        const item = this.getItemById(itemId);
        if(item){
            Object.assign(item,updateData);
            this.sortItems();
        }
    }

    moveItem(itemId:string, newPosition:number):boolean{
        if(newPosition<0 || newPosition >= this.items.length){
            return false;
        }
        const item = this.getItemById(itemId);
        if(item==undefined){
            return false;
        }
        const oldPosition = item.position;
        if(oldPosition == newPosition){
            return true;
        }
    
        for(let i=0;i<this.items.length;i++){
            const item = this.items[i];
            if(oldPosition!<newPosition!){
                if(item.position!>oldPosition! && item.position!<=newPosition!){
                    item.position!--;
                }   
            }else if(oldPosition!>newPosition!){
                if(item.position!>=newPosition! && item.position!<oldPosition!){
                    item.position!++;
                }
            }
        }
        item.position = newPosition;
        this.sortItems();
        return true;
    }
}
export interface PositionItem{
    id: string;
    position:number|undefined;
    [key:string]: any;//允许其他属性
}

export {PositionManager};