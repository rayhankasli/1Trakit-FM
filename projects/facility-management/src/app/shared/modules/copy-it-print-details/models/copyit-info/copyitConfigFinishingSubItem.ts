/** This class is use to define client finishing sub item */
export class CopyItConfigFinishingSubItem {
    public finishingSubItemId?: number;
    public finishingSubItem?: string;

    constructor(
        finishingSubItemId: number, 
        finishingSubItem: string
        ) {
        this.finishingSubItemId = finishingSubItemId;
        this.finishingSubItem = finishingSubItem
    }
}