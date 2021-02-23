/** Model Class for CopyIt Finishing */
export class CopyItFinishings {
    public copyItFinishingId?: number;
    public clientConfigureDefaultId?: number;
    public finishingSubItemId?: number;
    public quantity?: number;
    public instruction?: string;
}

/** Model Class for CopyIt Detail Finishings */
export class CopyItDetailFinishings extends CopyItFinishings {
    public finishing?: string;
    public finishingSubItemValue?: string;
    public defaultTenantRate?: number;
    public defaultClientRate?: number;
    public finishingSubItems?: FinishingSubItem[];
    public isOther?: boolean;
}

/** Model class for finishing reuqest */
export class Finishing extends CopyItDetailFinishings {
    public finishingId?: number;
    public isDefault?: number;
    public isUpdated?: boolean;
}

/** Finishing sub item */
export class FinishingSubItem {
    /** Finishing sub item id of finishing sub item */
    public finishingSubItemId?: number;
    /** Finishing sub item id of finishing sub item */
    public finishingSubItem?: string;

    constructor(
        finishingSubItemId?: number,
        finishingSubItem?: string
    ) {
        this.finishingSubItemId = finishingSubItemId;
        this.finishingSubItem = finishingSubItem;
    }
}
